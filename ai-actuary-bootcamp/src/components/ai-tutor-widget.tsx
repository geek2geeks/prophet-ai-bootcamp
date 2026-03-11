"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { AppLink } from "@/components/app-link";
import { useAuth } from "@/lib/auth-context";
import { isAdminEmail } from "@/lib/admin";
import { db } from "@/lib/firebase";
import { useIsMobile } from "@/lib/use-is-mobile";
import {
  buildMessages,
  type TutorMessage,
} from "@/lib/ai-tutor-context";
import { streamTutorChat, recommendTutorActions, type TutorAction } from "@/lib/tutor-api";
import { toBooleanMap, migrateProgress } from "@/lib/student-state";
import courseData from "@/data/course.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = {
  dayNumber?: number;
  dayTitle?: string;
  completedDays?: number[];
  currentProgress?: Record<string, boolean>;
  mobileEmbedded?: boolean;
  /** When true, renders as an inline panel with no FAB — for use inside WorkspaceDrawer */
  embedded?: boolean;
};

const EMPTY_COMPLETED_DAYS: number[] = [];
const EMPTY_PROGRESS: Record<string, boolean> = {};

interface ExerciseMeta {
  id: string;
  titulo: string;
  pontos: number;
  dia: number;
  diaTitulo: string;
}

interface Session {
  id: string;
  title: string;
  createdAt: number;
  messages: TutorMessage[];
}

type SessionMessage = TutorMessage & {
  createdAt?: number;
};

type TutorMode = "guide" | "deep-review";

type SubmissionContext = {
  summary: string;
  artifactTitle: string;
  fileName: string | null;
  createdAtMs: number;
};

type CuriosityTag =
  | "manha_pequeno_almoco"
  | "almoco_pausa"
  | "tarde_hidratacao"
  | "noite_ruido"
  | "madrugada_sono"
  | "pausa_pomodoro";

const TUTOR_MODEL = "gemini-3-flash-preview" as const;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_SESSIONS = 20;
const SESSION_TITLE_MAX = 40;

// ---------------------------------------------------------------------------
// Exercise helpers
// ---------------------------------------------------------------------------

function buildExerciseMap(): Map<string, ExerciseMeta> {
  const map = new Map<string, ExerciseMeta>();
  for (const day of courseData.days) {
    for (const ex of day.exercicios) {
      map.set(ex.id, {
        id: ex.id,
        titulo: ex.titulo,
        pontos: ex.pontos,
        dia: day.dia,
        diaTitulo: day.titulo,
      });
    }
    if (day.desafio) {
      map.set(day.desafio.id, {
        id: day.desafio.id,
        titulo: day.desafio.titulo,
        pontos: day.desafio.pontos,
        dia: day.dia,
        diaTitulo: day.titulo,
      });
    }
  }
  return map;
}

const EXERCISE_MAP = buildExerciseMap();

function getBadge(points: number): string {
  let badge = "Builder Ready";
  for (const [threshold, name] of courseData.badges) {
    if (points >= (threshold as number)) badge = name as string;
  }
  return badge;
}

function getTimePeriod(hour: number): string {
  if (hour >= 5 && hour < 12) return "manha";
  if (hour >= 12 && hour < 14) return "hora de almoco";
  if (hour >= 14 && hour < 18) return "tarde";
  if (hour >= 18 && hour < 22) return "noite";
  return "madrugada";
}

function detectCuriosityTags(messages: TutorMessage[]): CuriosityTag[] {
  const joined = messages
    .filter((message) => message.role === "assistant")
    .map((message) => message.content.toLowerCase())
    .join("\n");

  const tags: CuriosityTag[] = [];

  if (joined.includes("glucose") || joined.includes("pequeno-almoco") || joined.includes("pequeno almoco")) {
    tags.push("manha_pequeno_almoco");
  }
  if (joined.includes("hora de almoco") || joined.includes("pausa real") || joined.includes("refeicao")) {
    tags.push("almoco_pausa");
  }
  if (joined.includes("hidrat") || joined.includes("agua por perto")) {
    tags.push("tarde_hidratacao");
  }
  if (joined.includes("65db") || joined.includes("ruido") || joined.includes("musica ambiente")) {
    tags.push("noite_ruido");
  }
  if (joined.includes("hipocampo") || joined.includes("alcoolemia") || joined.includes("continuar amanha")) {
    tags.push("madrugada_sono");
  }
  if (joined.includes("pomodoro") || joined.includes("fecha o portatil 5 minutos") || joined.includes("caminha")) {
    tags.push("pausa_pomodoro");
  }

  return tags;
}

function buildCuriosityMemory(messages: TutorMessage[]): string {
  const tags = detectCuriosityTags(messages);
  if (!tags.length) return "";

  const labels: Record<CuriosityTag, string> = {
    manha_pequeno_almoco: "facto sobre pequeno-almoco/glucose",
    almoco_pausa: "facto sobre pausa de almoco",
    tarde_hidratacao: "facto sobre hidratacao",
    noite_ruido: "facto sobre ruido e foco",
    madrugada_sono: "facto sobre sono/madrugada",
    pausa_pomodoro: "sugestao de pausa Pomodoro",
  };

  return `\n\nCURIOSIDADES JA USADAS NESTA CONVERSA:\n${tags.map((tag) => `- ${labels[tag]}`).join("\n")}`;
}

function buildPageContext(
  dayNumber: number | undefined,
  dayTitle: string | undefined,
  completedDays: number[],
  firestoreProgress: Record<string, boolean>,
  studentName: string | null,
): string {
  const parts: string[] = [];

  if (studentName) {
    parts.push(`Nome do aluno: ${studentName}`);
  }

  const now = new Date();
  const hour = now.getHours();
  const localTime = now.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
  const period = getTimePeriod(hour);
  parts.push(`Hora local do aluno: ${localTime} (${period})`);
  if (hour >= 22 || hour < 5) {
    parts.push("AVISO: O aluno esta a estudar de madrugada. Verifica o bem-estar.");
  } else if (hour >= 12 && hour < 14) {
    parts.push("NOTA: E hora de almoco — pode precisar de pausa para comer.");
  }

  if (dayNumber !== undefined) {
    parts.push(`Dia atual: ${dayNumber}${dayTitle ? ` — ${dayTitle}` : ""}`);
  }

  parts.push(
    "Estrutura atual do site: Home para retomar, Missao com 4 passos (Overview, Learn, Build, Submit), Recursos para ficheiros, Portfolio para progresso e entregas.",
  );

  if (dayNumber === 2) {
    parts.push(
      "PRIORIDADE DO DIA 2: fechar o exercicio principal do dia — webapp simples que le um CSV atuarial, mostra metricas, gera um PDF executivo, faz deploy em Firebase Hosting e envia o URL ao tutor.",
    );
    parts.push(
      "ORDEM DO DIA 2: instalar/autenticar ferramentas -> constitution -> spec -> clarify -> implementacao -> deploy -> enviar URL.",
    );
    parts.push(
      "REGRA DO DIA 2: nao empurrar o aluno para teoria extra ou exercicios secundarios se ele ainda nao fechou o exercicio principal.",
    );
  }

  let totalPoints = 0;
  const completedExercises: ExerciseMeta[] = [];
  for (const [id, done] of Object.entries(firestoreProgress)) {
    if (done) {
      const meta = EXERCISE_MAP.get(id);
      if (meta) {
        totalPoints += meta.pontos;
        completedExercises.push(meta);
      }
    }
  }

  parts.push(`Pontos totais acumulados: ${totalPoints} / ${courseData.totalPoints}`);
  parts.push(`Badge atual: ${getBadge(totalPoints)}`);

  const badges = courseData.badges as [number, string][];
  const nextBadge = badges.find(([threshold]) => threshold > totalPoints);
  if (nextBadge) {
    const [nextThreshold, nextName] = nextBadge;
    parts.push(`Proximo badge: ${nextName} (faltam ${nextThreshold - totalPoints} pts)`);
  }

  if (completedDays.length > 0) {
    parts.push(`Dias completados: ${completedDays.join(", ")}`);
  }

  if (completedExercises.length > 0) {
    const exList = completedExercises
      .sort((a, b) => {
        const aNum = parseFloat(a.id.replace(/[a-z]/g, ""));
        const bNum = parseFloat(b.id.replace(/[a-z]/g, ""));
        return aNum - bNum;
      })
      .map((e) => `${e.id} "${e.titulo}" (${e.pontos}pts, Dia ${e.dia})`)
      .join("; ");
    parts.push(`Exercicios concluidos: ${exList}`);
  } else {
    parts.push("Nenhum exercicio concluido ainda.");
  }

  const daysRepresented = new Set(completedExercises.map((e) => e.dia));
  if (daysRepresented.size > 0) {
    const daySummaries = Array.from(daysRepresented)
      .sort((a, b) => a - b)
      .map((d) => {
        const dayMeta = courseData.days.find((day) => day.dia === d);
        return dayMeta ? `Dia ${d} (${dayMeta.titulo})` : `Dia ${d}`;
      })
      .join(", ");
    parts.push(`Dias com progresso: ${daySummaries}`);
  }

  if (dayNumber !== undefined) {
    const currentDay = courseData.days.find((d) => d.dia === dayNumber);
    if (currentDay) {
      const remaining = currentDay.exercicios.filter(
        (ex) => !firestoreProgress[ex.id],
      );
      if (remaining.length > 0) {
        const nextEx = remaining[0];
        parts.push(
          `Proximo exercicio pendente no Dia ${dayNumber}: ${nextEx.id} "${nextEx.titulo}" (${nextEx.pontos}pts)`,
        );
      } else {
        const desafio = currentDay.desafio;
        if (desafio && !firestoreProgress[desafio.id]) {
          parts.push(
            `Todos os exercicios do Dia ${dayNumber} concluidos! Desafio pendente: "${desafio.titulo}" (${desafio.pontos}pts)`,
          );
        } else {
          parts.push(`Dia ${dayNumber} totalmente concluido — incluindo desafio!`);
        }
      }
    }
  }

  return parts.join("\n");
}

function getDynamicSuggestions(
  dayNumber: number | undefined,
  firestoreProgress: Record<string, boolean>,
): string[] {
  for (const day of courseData.days) {
    for (const ex of day.exercicios) {
      if (!firestoreProgress[ex.id]) {
        return [
          `Como avanço com o ${ex.id} — "${ex.titulo}"?`,
          "Como estruturo um spec.md?",
          "Qual a diferenca entre qx e tpx?",
        ];
      }
    }
    if (day.desafio && !firestoreProgress[day.desafio.id]) {
      return [
        `O que preciso para completar o desafio do Dia ${day.dia}?`,
        "Como estruturo um spec.md?",
        "O que e o Prophet Lite e para quem e?",
      ];
    }
  }
  return [
    "Como deployar o meu Prophet Lite no Streamlit Cloud?",
    "Como preparar a nota de lancamento para a minha equipa ou primeiros utilizadores?",
    "Que proximos passos recomendas apos o bootcamp?",
  ];
}

// ---------------------------------------------------------------------------
// Relative time helper
// ---------------------------------------------------------------------------

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "agora mesmo";
  if (mins < 60) return `há ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ontem";
  return `há ${days} dias`;
}

function messageTime(ts?: number): string {
  if (!ts) return "agora";
  return new Date(ts).toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Session storage helpers
// ---------------------------------------------------------------------------

function sessionsKey(uid: string) {
  return `peter_sessions_${uid}`;
}

function loadSessions(uid: string): Session[] {
  try {
    const raw = localStorage.getItem(sessionsKey(uid));
    if (!raw) return [];
    return JSON.parse(raw) as Session[];
  } catch {
    return [];
  }
}

function saveSessions(uid: string, sessions: Session[]) {
  try {
    // Prune to max
    const pruned = sessions.slice(-MAX_SESSIONS);
    localStorage.setItem(sessionsKey(uid), JSON.stringify(pruned));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function mergeSessions(local: Session[], remote: Session[]) {
  const merged = new Map<string, Session>();
  [...remote, ...local].forEach((session) => {
    const existing = merged.get(session.id);
    if (!existing || session.createdAt >= existing.createdAt) {
      merged.set(session.id, session);
    }
  });

  return Array.from(merged.values()).sort((a, b) => a.createdAt - b.createdAt).slice(-MAX_SESSIONS);
}

async function saveSessionsToCloud(
  uid: string,
  sessions: Session[],
  dayNumber: number | undefined,
) {
  const now = Date.now();
  const pruned = sessions.slice(-MAX_SESSIONS).map((session) => ({
    ...session,
    updatedAt: now,
    dayLabel: dayNumber !== undefined ? `Dia ${dayNumber.toString().padStart(2, "0")}` : undefined,
  }));

  await setDoc(
    doc(db, "students", uid),
    {
      tutorSessions: pruned,
    },
    { merge: true },
  );
}

function newSessionId() {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AiTutorWidget({
  dayNumber,
  dayTitle,
  completedDays = EMPTY_COMPLETED_DAYS,
  currentProgress = EMPTY_PROGRESS,
  mobileEmbedded = false,
  embedded = false,
}: Props) {
  const { user } = useAuth();

  // Panel open/close — always open when embedded
  const [open, setOpen] = useState(embedded);

  // "session-list" view vs "chat" view
  const [view, setView] = useState<"sessions" | "chat">("sessions");

  // Sessions state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SessionMessage[]>([]);

  // Delete-confirm state: session id waiting for confirm, or null
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Input & streaming
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [keyError, setKeyError] = useState("");
  const [mode, setMode] = useState<TutorMode>("guide");
  const [daySubmissionContext, setDaySubmissionContext] = useState<SubmissionContext[]>([]);
  const [actionSuggestions, setActionSuggestions] = useState<TutorAction[]>([]);
  const [expanded, setExpanded] = useState(false);

  // Firestore progress
  const [firestoreProgress, setFirestoreProgress] =
    useState<Record<string, boolean>>(currentProgress);
  const [progressLoaded, setProgressLoaded] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const streamAbortRef = useRef<AbortController | null>(null);

  const studentName = user?.displayName?.split(" ")[0] ?? null;
  const isAdmin = isAdminEmail(user?.email);
  const isMobile = useIsMobile();

  // -------------------------------------------------------------------------
  // Load Firestore progress when widget opens
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!open || !user || progressLoaded) return;
    getDoc(doc(db, "students", user.uid))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const rawProgress = data.progress ?? {};
          const p = toBooleanMap(migrateProgress(rawProgress));
          setFirestoreProgress({ ...p, ...currentProgress });
        }
        setProgressLoaded(true);
      })
      .catch(() => {
        setFirestoreProgress(currentProgress);
        setProgressLoaded(true);
      });
  }, [open, user, progressLoaded, currentProgress]);

  // Re-merge if currentProgress prop changes
  useEffect(() => {
    setFirestoreProgress((prev) => ({ ...prev, ...currentProgress }));
  }, [currentProgress]);

  // -------------------------------------------------------------------------
  // Load sessions from localStorage + Firebase when user is available
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!user) return;
    const local = loadSessions(user.uid);
    setSessions(local);

    getDoc(doc(db, "students", user.uid))
      .then((snap) => {
        if (!snap.exists()) {
          return;
        }

        const data = snap.data() as { tutorSessions?: Session[] };
        const remote = Array.isArray(data.tutorSessions) ? data.tutorSessions : [];
        const merged = mergeSessions(local, remote);
        setSessions(merged);
        saveSessions(user.uid, merged);
      })
      .catch(() => {
        setSessions(local);
      });
  }, [user]);

  useEffect(() => {
    if (!open || !user || dayNumber !== 1) {
      setDaySubmissionContext([]);
      return;
    }

    getDocs(
      query(
        collection(db, "submissions"),
        where("missionId", "==", "01"),
        where("userId", "==", user.uid),
      ),
    )
      .then((snapshot) => {
        const items = snapshot.docs
          .map((entry) => {
            const data = entry.data() as Record<string, unknown>;
            return {
              summary: typeof data.summary === "string" ? data.summary.trim() : "",
              artifactTitle: typeof data.artifactTitle === "string" ? data.artifactTitle.trim() : "",
              fileName: typeof data.fileName === "string" ? data.fileName : null,
              createdAtMs: typeof data.createdAtMs === "number" ? data.createdAtMs : 0,
            };
          })
          .filter((item) => item.summary || item.artifactTitle || item.fileName)
          .sort((left, right) => right.createdAtMs - left.createdAtMs)
          .slice(0, 3);

        setDaySubmissionContext(items);
      })
      .catch(() => {
        setDaySubmissionContext([]);
      });
  }, [dayNumber, open, user]);

  // -------------------------------------------------------------------------
  // When panel opens, show session list (skip for embedded — stays in chat)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (embedded) return;
    if (open) {
      setView("sessions");
      setConfirmDeleteId(null);
    }
  }, [open, embedded]);

  // -------------------------------------------------------------------------
  // Auto-scroll
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!open || view !== "chat") return;
    const container = messageListRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const shouldStickToBottom = distanceFromBottom < 120;
    if (shouldStickToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: streaming ? "auto" : "smooth" });
    }
  }, [messages, open, view, streaming]);

  // -------------------------------------------------------------------------
  // Derived
  // -------------------------------------------------------------------------
  const pageContext = buildPageContext(
    dayNumber,
    dayTitle,
    completedDays,
    firestoreProgress,
    studentName,
  );
  const submissionContextBlock =
    dayNumber === 1 && daySubmissionContext.length
      ? `\n\nEVIDENCIA SUBMETIDA NO DIA 1:\n${daySubmissionContext
          .map((item, index) => {
            const parts = [
              `Entrega ${index + 1}:`,
              item.artifactTitle ? `Titulo: ${item.artifactTitle}` : null,
              item.fileName ? `Ficheiro: ${item.fileName}` : null,
              item.summary ? `Resumo: ${item.summary}` : null,
            ].filter(Boolean);

            return parts.join(" | ");
          })
          .join("\n")}`
      : "";
  const curiosityMemoryBlock = buildCuriosityMemory(messages);
  const suggestions = getDynamicSuggestions(dayNumber, firestoreProgress);
  const hasActiveSession = activeSessionId !== null;

  // -------------------------------------------------------------------------
  // Session actions
  // -------------------------------------------------------------------------
  const startNewSession = useCallback(() => {
    const id = newSessionId();
    const session: Session = {
      id,
      title: "Nova conversa",
      createdAt: Date.now(),
      messages: [],
    };
    setSessions((prev) => {
      const next = [...prev, session].slice(-MAX_SESSIONS);
      if (user) {
        saveSessions(user.uid, next);
        void saveSessionsToCloud(user.uid, next, dayNumber);
      }
      return next;
    });
    setActiveSessionId(id);
    setMessages([]);
    setView("chat");
  }, [dayNumber, user]);

  const resumeSession = useCallback((session: Session) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setView("chat");
    setConfirmDeleteId(null);
  }, []);

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (user) {
          saveSessions(user.uid, next);
          void saveSessionsToCloud(user.uid, next, dayNumber);
        }
        return next;
      });
      if (activeSessionId === id) {
        setActiveSessionId(null);
        setMessages([]);
      }
      setConfirmDeleteId(null);
    },
    [dayNumber, user, activeSessionId],
  );

  // Persist messages to the active session after each assistant response
  const persistSession = useCallback(
    (msgs: TutorMessage[], sessionId: string) => {
      setSessions((prev) => {
        const next = prev.map((s) => {
          if (s.id !== sessionId) return s;
          // Auto-title from first user message
          const firstUser = msgs.find((m) => m.role === "user");
          const title = firstUser
            ? firstUser.content.slice(0, SESSION_TITLE_MAX) +
              (firstUser.content.length > SESSION_TITLE_MAX ? "…" : "")
            : s.title;
          return { ...s, title, messages: msgs };
        });
        if (user) {
          saveSessions(user.uid, next);
          void saveSessionsToCloud(user.uid, next, dayNumber);
        }
        return next;
      });
    },
    [dayNumber, user],
  );

  // -------------------------------------------------------------------------
  // Send message (client-side via shared Gemini key)
  // -------------------------------------------------------------------------
  async function sendMessage(overrideInput?: string) {
    const text = (overrideInput ?? input).trim();
    if (!text || streaming) return;
    if (!activeSessionId) return;

    const userMessage: SessionMessage = { role: "user", content: text, createdAt: Date.now() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);
    setKeyError("");
    setActionSuggestions([]);

    // Placeholder assistant message for streaming
    const placeholder: SessionMessage = { role: "assistant", content: "", createdAt: Date.now() };
    setMessages([...nextMessages, placeholder]);

    try {
      const contextWithEvidence = `${pageContext}${submissionContextBlock}${curiosityMemoryBlock}`;
      const abortController = new AbortController();
      streamAbortRef.current = abortController;

      const accumulated = await streamTutorChat(
        {
          messages: buildMessages(nextMessages, contextWithEvidence),
          model: TUTOR_MODEL,
          maxTokens: mode === "deep-review" ? 2800 : 2048,
          temperature: mode === "deep-review" ? 0.2 : 0.4,
        },
        (chunkText) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { ...last, content: last.content + chunkText },
              ];
            }
            return prev;
          });
        },
        abortController.signal
      );

      setMessages([...nextMessages, { role: "assistant", content: accumulated || "", createdAt: placeholder.createdAt }]);

      if (mode === "guide") {
        try {
          const suggestedActions = await recommendTutorActions({
            latestUserPrompt: text,
            latestAssistantReply: accumulated,
            pageContext: contextWithEvidence,
            includeAdmin: isAdmin,
          });
          setActionSuggestions(suggestedActions);
        } catch {
          setActionSuggestions([]);
        }
      }

      // Final settled messages
      const finalMessages: SessionMessage[] = [
        ...nextMessages,
        { role: "assistant", content: accumulated || "Sem resposta.", createdAt: placeholder.createdAt },
      ];
      setMessages(finalMessages);
      persistSession(finalMessages, activeSessionId);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error && err.name === "AbortError") {
        const cancelledMessages: SessionMessage[] = [
          ...nextMessages,
          {
            role: "assistant",
            content: "Resposta interrompida. Podes reformular a pergunta ou pedir ao Peter para continuar.",
            createdAt: Date.now(),
          },
        ];
        setMessages(cancelledMessages);
        persistSession(cancelledMessages, activeSessionId);
        return;
      }
      setKeyError(err instanceof Error ? err.message : "Erro ao contactar o tutor AI.");
      const errorMessages: SessionMessage[] = [
        ...nextMessages,
        {
          role: "assistant",
          content:
            err instanceof Error && err.message.includes("RESOURCE_EXHAUSTED")
              ? "O tutor Gemini esta configurado, mas o projeto Google ainda nao tem quota/billing disponivel para gerar respostas."
              : "Ocorreu um erro ao contactar o tutor AI. Verifica a tua ligacao e tenta novamente.",
          createdAt: Date.now(),
        },
      ];
      setMessages(errorMessages);
    } finally {
      streamAbortRef.current = null;
      setStreaming(false);
    }
  }

  function cancelStream() {
    streamAbortRef.current?.abort();
  }

  // -------------------------------------------------------------------------
  // Guard
  // -------------------------------------------------------------------------
  if (!user) return null;

  // -------------------------------------------------------------------------
  // Shared sub-renders
  // -------------------------------------------------------------------------
  const sessionListView = (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* New conversation button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={startNewSession}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nova conversa
        </button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {sessions.length === 0 ? (
          <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
            Ainda sem conversas. Começa uma nova acima.
          </p>
        ) : (
          [...sessions]
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 10)
            .map((session) => {
              const lastMessage = [...session.messages].reverse().find((msg) => msg.role === "assistant" || msg.role === "user");
              return (
              <div
                key={session.id}
                className="flex items-center gap-2 rounded-2xl border border-[#d7d1c7] bg-white px-3 py-3 shadow-sm"
              >
                <button
                  onClick={() => resumeSession(session)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#d9fdd3] text-xs font-semibold text-[#075e54]">
                    P
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-xs font-semibold text-[var(--foreground)]">{session.title}</span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">{relativeTime(session.createdAt)}</span>
                    </span>
                    <span className="mt-1 block truncate text-[11px] leading-5 text-[var(--muted-foreground)]">
                      {lastMessage?.content || "Sem mensagens ainda."}
                    </span>
                  </span>
                </button>
                {/* Resume arrow */}
                <button
                  onClick={() => resumeSession(session)}
                  className="flex-shrink-0 text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
                  title="Retomar"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {/* Delete */}
                {confirmDeleteId === session.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Apagar
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)] transition hover:bg-[var(--surface)]"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(session.id)}
                    className="flex-shrink-0 text-[var(--muted-foreground)] transition hover:text-red-500"
                    title="Apagar conversa"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            );})
        )}
      </div>
    </div>
  );

  const chatView = (
    <>
      {/* Messages */}
      <div ref={messageListRef} className="flex-1 overflow-y-auto bg-[#efeae2] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_38%),linear-gradient(180deg,#efeae2_0%,#e7ded4_100%)] px-3 py-4 space-y-3">
        {keyError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
            {keyError}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("guide")}
            className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
              mode === "guide"
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--muted-foreground)]"
            }`}
          >
            Guia rapido
          </button>
          <button
            type="button"
            onClick={() => setMode("deep-review")}
            className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
              mode === "deep-review"
                ? "bg-[linear-gradient(145deg,#132330,#274358)] text-white"
                : "border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--muted-foreground)]"
            }`}
          >
            Review profunda
          </button>
        </div>

        {messages.length === 0 && !keyError ? (
          <div className="mt-6 space-y-2 text-center">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {studentName ? `Olá, ${studentName}!` : "Olá!"} Sou o Peter, o teu tutor AI.
            </p>
            <p className="text-xs leading-6 text-[var(--muted-foreground)]">
              Pergunta sobre exercicios, specs, OpenCode, atuaria,
              arquitetura do MVP ou qualquer duvida do bootcamp.
              Estou aqui para desbloquear, nao para resolver.
            </p>
            <div className="mt-3 space-y-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => void sendMessage(suggestion)}
                  className="block w-full rounded-2xl border border-[#d7d1c7] bg-white px-3 py-2.5 text-left text-xs text-[#4d4d4d] transition hover:border-[#c6beb3] hover:text-[#1f1f1f]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((msg, i) => {
          const isLastAssistant =
            msg.role === "assistant" && i === messages.length - 1 && streaming;
          return (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] px-4 py-3 text-[13px] leading-6 shadow-sm ${
                  msg.role === "user"
                    ? "rounded-2xl rounded-br-md bg-[#d9fdd3] text-[#111b21]"
                    : "rounded-2xl rounded-bl-md border border-[#ddd6cb] bg-white text-[#111b21]"
                }`}
              >
                {msg.content}
                {isLastAssistant && (
                  <span className="ml-0.5 inline-block animate-pulse text-[var(--muted-foreground)]">
                    ▋
                  </span>
                )}
                <div className={`mt-1 text-right text-[10px] ${msg.role === "user" ? "text-[#667781]" : "text-[#8696a0]"}`}>
                  {messageTime(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}

        {streaming ? (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-[#ddd6cb] bg-white px-4 py-2 text-[11px] text-[#667781] shadow-sm">
              Peter está a escrever...
            </div>
          </div>
        ) : null}

        {actionSuggestions.length ? (
          <div className="space-y-2 rounded-2xl border border-[#d7d1c7] bg-white/86 p-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Proximo passo sugerido pelo tutor
            </p>
            {actionSuggestions.map((action) => (
              <AppLink
                key={`${action.href}-${action.label}`}
                href={action.href}
                className="block rounded-2xl border border-[#d7d1c7] bg-[#f8f5f0] px-3 py-3 transition hover:border-[#b9d9c8] hover:bg-white"
              >
                <p className="text-xs font-semibold text-[var(--foreground)]">{action.label}</p>
                <p className="mt-1 text-[11px] leading-5 text-[var(--muted-foreground)]">{action.why}</p>
              </AppLink>
            ))}
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#d7d1c7] bg-[#f0f2f5] p-3">
        <div className="mb-2 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
          >
            {expanded ? "Compactar" : "Expandir chat"}
          </button>
          <p className="text-[10px] text-[var(--muted-foreground)]">Enter envia · Shift+Enter quebra linha</p>
        </div>
        <div className="flex items-end gap-2 rounded-[1.7rem] border border-[#d7d1c7] bg-white px-3 py-2 shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage();
              }
            }}
            placeholder={
              streaming
                ? "A escrever..."
                : keyError
                  ? "Tutor indisponivel"
                  : "Pergunta ao tutor..."
            }
            disabled={streaming}
            rows={expanded ? 5 : 2}
            className="flex-1 resize-none bg-transparent text-[13px] leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] disabled:opacity-50"
          />
          {streaming ? (
            <button
              onClick={cancelStream}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#d7d1c7] bg-[#f7f7f7] text-[var(--muted-foreground)] transition hover:border-red-300 hover:text-red-500"
              title="Parar"
            >
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => void sendMessage()}
              disabled={!input.trim()}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white transition hover:bg-[#20bd5c] disabled:opacity-40"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-[10px] text-[var(--muted-foreground)]">
          Peter ajuda-te a desbloquear e a seguir em frente.
        </p>
      </div>
    </>
  );

  // -------------------------------------------------------------------------
  // Embedded render — inline panel, no FAB, no fixed positioning
  // -------------------------------------------------------------------------
  if (embedded) {
    return (
      <div className="flex h-full flex-col">
        {/* Compact header with back-to-sessions */}
        <div className="flex items-center justify-between border-b border-[#0b4f47] bg-[#075e54] px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            {view === "chat" && (
              <button
                onClick={() => setView("sessions")}
                className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
                title="Ver conversas"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Peter · AI Tutor
              </p>
              {view === "chat" && (
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/70">
                  {mode === "guide" ? "Modo guia" : "Modo review profunda"}
                </p>
              )}
            </div>
          </div>
        </div>

        {view === "sessions" ? sessionListView : chatView}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Standard render — floating FAB + popup panel
  // -------------------------------------------------------------------------
  return (
    <div className={`${mobileEmbedded ? "relative flex" : isMobile ? "hidden md:flex" : "fixed bottom-6 right-6 z-50 flex"} flex-col items-end gap-3`}>
      {/* ------------------------------------------------------------------ */}
      {/* Chat panel                                                          */}
      {/* ------------------------------------------------------------------ */}
      {open ? (
        <div className={`flex flex-col rounded-[1.75rem] border border-[#d7d1c7] bg-white shadow-[0_24px_60px_rgba(22,27,45,0.14)] ${expanded ? "h-[42rem] w-[24rem] sm:w-[32rem]" : "h-[32rem] w-[22rem] sm:w-[26rem]"}`}>
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-[1.75rem] border-b border-[#0b4f47] bg-[#075e54] px-5 py-4 text-white">
            <div className="flex items-center gap-2">
              {view === "chat" && (
                <button
                  onClick={() => setView("sessions")}
                  className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
                  title="Ver conversas"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Peter · AI Tutor
                </p>
                <p className="text-sm font-semibold text-white">
                  {view === "chat"
                    ? dayNumber !== undefined
                      ? `Dia ${dayNumber} — ${dayTitle ?? ""}`
                    : "Bootcamp Assistant"
                    : "Conversas"}
                </p>
                {view === "chat" ? (
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/70">
                    {mode === "guide" ? "Modo guia" : "Modo review profunda"}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                title="Expandir"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {expanded ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19H19V15M9 5H5V9M19 9V5H15M5 15V19H9" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 00-2 2v3m16 8v3a2 2 0 01-2 2h-3M8 21H5a2 2 0 01-2-2v-3m16-8V5a2 2 0 00-2-2h-3" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                title="Fechar"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {view === "sessions" ? sessionListView : chatView}
        </div>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* FAB — always-visible pill                                           */}
      {/* ------------------------------------------------------------------ */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2.5 text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition hover:bg-[#20bd5c] hover:shadow-[0_12px_36px_rgba(37,211,102,0.45)]"
        title="Peter · AI Tutor"
      >
        {/* Pulse dot — solid when no active session, pulsing when session is active */}
        <span className="relative flex h-2 w-2 items-center justify-center">
          {hasActiveSession && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white opacity-90" />
        </span>
        <span className="text-xs font-semibold tracking-wide">Peter</span>
        {open ? (
          <svg className="h-3.5 w-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        )}
      </button>
    </div>
  );
}
