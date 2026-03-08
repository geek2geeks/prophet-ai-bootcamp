"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import {
  buildMessages,
  type TutorMessage,
} from "@/lib/ai-tutor-context";
import courseData from "@/data/course.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = {
  dayNumber?: number;
  dayTitle?: string;
  completedDays?: number[];
  currentProgress?: Record<string, boolean>;
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

type SharedKeys = {
  deepseek?: string;
  zai?: string;
};

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
}: Props) {
  const { user } = useAuth();

  // Panel open/close
  const [open, setOpen] = useState(false);

  // "session-list" view vs "chat" view
  const [view, setView] = useState<"sessions" | "chat">("sessions");

  // Sessions state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TutorMessage[]>([]);

  // Delete-confirm state: session id waiting for confirm, or null
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Input & streaming
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [keyError, setKeyError] = useState("");
  const [deepseekKey, setDeepseekKey] = useState("");

  // Firestore progress
  const [firestoreProgress, setFirestoreProgress] =
    useState<Record<string, boolean>>(currentProgress);
  const [progressLoaded, setProgressLoaded] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const studentName = user?.displayName?.split(" ")[0] ?? null;

  // -------------------------------------------------------------------------
  // Load Firestore progress when widget opens
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!open || !user || progressLoaded) return;
    getDoc(doc(db, "students", user.uid))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const p = (data.progress ?? {}) as Record<string, boolean>;
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
    if (!user) {
      setDeepseekKey("");
      return;
    }

    getDoc(doc(db, "config", "keys"))
      .then((snap) => {
        if (!snap.exists()) {
          setDeepseekKey("");
          return;
        }

        const data = snap.data() as SharedKeys;
        setDeepseekKey(data.deepseek?.trim() ?? "");
      })
      .catch(() => {
        setDeepseekKey("");
      });
  }, [user]);

  // -------------------------------------------------------------------------
  // When panel opens, show session list
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (open) {
      setView("sessions");
      setConfirmDeleteId(null);
    }
  }, [open]);

  // -------------------------------------------------------------------------
  // Auto-scroll
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (open && view === "chat") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, view]);

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
  // Send message (client-side via shared DeepSeek key)
  // -------------------------------------------------------------------------
  async function sendMessage(overrideInput?: string) {
    const text = (overrideInput ?? input).trim();
    if (!text || streaming) return;
    if (!activeSessionId) return;

    const userMessage: TutorMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setStreaming(true);
    setKeyError("");

    if (!deepseekKey) {
      setStreaming(false);
      setKeyError("Tutor indisponivel: chave DeepSeek ausente em config/keys.");
      const missingKeyMessages: TutorMessage[] = [
        ...nextMessages,
        {
          role: "assistant",
          content:
            "O tutor nao esta disponivel agora porque a chave partilhada do DeepSeek nao foi carregada.",
        },
      ];
      setMessages(missingKeyMessages);
      persistSession(missingKeyMessages, activeSessionId);
      return;
    }

    // Placeholder assistant message for streaming
    const placeholder: TutorMessage = { role: "assistant", content: "" };
    setMessages([...nextMessages, placeholder]);

    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deepseekKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: buildMessages(nextMessages, pageContext),
          max_tokens: 2048,
          temperature: 0.4,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
          | { error?: { message?: string }; message?: string }
          | null;
        throw new Error(
          errorPayload?.error?.message ||
            errorPayload?.message ||
            `DeepSeek API error: ${response.status}`,
        );
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string | null } }>;
      };
      const accumulated = payload.choices?.[0]?.message?.content?.trim() || "Sem resposta.";

      // Final settled messages
      const finalMessages: TutorMessage[] = [
        ...nextMessages,
        { role: "assistant", content: accumulated || "Sem resposta." },
      ];
      setMessages(finalMessages);
      persistSession(finalMessages, activeSessionId);
    } catch (err: unknown) {
      console.error(err);
      setKeyError(err instanceof Error ? err.message : "Erro ao contactar o tutor AI.");
      const errorMessages: TutorMessage[] = [
        ...nextMessages,
        {
          role: "assistant",
          content:
            "Ocorreu um erro ao contactar o tutor AI. Verifica a tua ligacao e tenta novamente.",
        },
      ];
      setMessages(errorMessages);
    } finally {
      setStreaming(false);
    }
  }

  function cancelStream() {
    setStreaming(false);
  }

  // -------------------------------------------------------------------------
  // Guard
  // -------------------------------------------------------------------------
  if (!user) return null;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* ------------------------------------------------------------------ */}
      {/* Chat panel                                                          */}
      {/* ------------------------------------------------------------------ */}
      {open ? (
        <div className="flex h-[32rem] w-[22rem] flex-col rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_60px_rgba(22,27,45,0.14)] sm:w-[26rem]">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-[1.75rem] border-b border-[var(--border)] bg-[var(--surface-subtle)] px-5 py-4">
            <div className="flex items-center gap-2">
              {view === "chat" && (
                <button
                  onClick={() => setView("sessions")}
                  className="rounded-full p-1 text-[var(--muted-foreground)] transition hover:bg-white hover:text-[var(--foreground)]"
                  title="Ver conversas"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Peter · AI Tutor
                </p>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {view === "chat"
                    ? dayNumber !== undefined
                      ? `Dia ${dayNumber} — ${dayTitle ?? ""}`
                      : "Bootcamp Assistant"
                    : "Conversas"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-[var(--muted-foreground)] transition hover:bg-white hover:text-[var(--foreground)]"
              title="Fechar"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ---- SESSION LIST VIEW ---- */}
          {view === "sessions" ? (
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
                    .map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2.5"
                      >
                        <button
                          onClick={() => resumeSession(session)}
                          className="flex min-w-0 flex-1 flex-col text-left"
                        >
                          <span className="truncate text-xs font-medium text-[var(--foreground)]">
                            {session.title}
                          </span>
                          <span className="text-[10px] text-[var(--muted-foreground)]">
                            {relativeTime(session.createdAt)}
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
                    ))
                )}
              </div>
            </div>
          ) : (
            /* ---- CHAT VIEW ---- */
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {keyError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                    {keyError}
                  </div>
                ) : null}

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
                          className="block w-full rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-left text-xs text-[var(--muted-foreground)] transition hover:border-[var(--accent-soft)] hover:text-[var(--foreground)]"
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
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-6 ${
                          msg.role === "user"
                            ? "bg-[var(--accent)] text-white"
                            : "border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--foreground)]"
                        }`}
                      >
                        {msg.content}
                        {isLastAssistant && (
                          <span className="ml-0.5 inline-block animate-pulse text-[var(--muted-foreground)]">
                            ▋
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-[var(--border)] p-3">
                <div className="flex items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2">
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
                    rows={1}
                    className="flex-1 resize-none bg-transparent text-xs leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] disabled:opacity-50"
                  />
                  {streaming ? (
                    <button
                      onClick={cancelStream}
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] transition hover:border-red-300 hover:text-red-500"
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
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-40"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="mt-2 text-center text-[10px] text-[var(--muted-foreground)]">
                  Tutor guia, nao resolve. Usa o teu raciocinio.
                </p>
              </div>
            </>
          )}
        </div>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* FAB — always-visible pill                                           */}
      {/* ------------------------------------------------------------------ */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-white shadow-[0_8px_30px_rgba(124,63,88,0.4)] transition hover:bg-[var(--accent-strong)] hover:shadow-[0_12px_36px_rgba(124,63,88,0.5)]"
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
