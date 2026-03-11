"use client";

import { AppLink } from "@/components/app-link";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { useAuth } from "@/lib/auth-context";
import { course, days, missionItems } from "@/lib/course";
import { db } from "@/lib/firebase";
import { useStudentState } from "@/lib/use-student-state";
import { isItemDone, type ProgressMap } from "@/lib/student-state";
import type { ReviewMap } from "@/lib/day1-review";

type SubmissionEntry = {
  id: string;
  title: string;
  detail: string;
  status: string;
  href: string | null;
  dateLabel: string | null;
  sortValue: number;
};

type ReviewEntry = {
  itemId: string;
  title: string;
  readiness: string;
  feedback: string;
  nextStep: string;
  updatedAtLabel: string | null;
  confidence: string;
};

type CandidateObject = Record<string, unknown>;

function isObject(value: unknown): value is CandidateObject {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function formatDayLabel(value: unknown) {
  const numericDay = readNumber(value);

  if (numericDay !== null) {
    return `Dia ${numericDay.toString().padStart(2, "0")}`;
  }

  const text = readString(value);

  if (!text) {
    return "";
  }

  if (text.startsWith("/missions/")) {
    const slug = text.split("/").at(-1) ?? "";
    return slug ? `Dia ${slug}` : "";
  }

  if (/^\d+$/.test(text)) {
    return `Dia ${text.padStart(2, "0")}`;
  }

  return text;
}

function resolveTimestamp(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (isObject(value)) {
    if (typeof value.toMillis === "function") {
      return value.toMillis();
    }

    const seconds = readNumber(value.seconds);
    const nanoseconds = readNumber(value.nanoseconds) ?? 0;

    if (seconds !== null) {
      return seconds * 1000 + nanoseconds / 1000000;
    }
  }

  return 0;
}

function formatDateLabel(timestamp: number) {
  if (!timestamp) {
    return null;
  }

  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(timestamp);
}

function createSubmissionEntry(value: unknown, fallbackId: string): SubmissionEntry | null {
  if (!isObject(value)) {
    return null;
  }

  const title =
    readString(value.title) ||
    readString(value.titulo) ||
    readString(value.name) ||
    readString(value.label) ||
    readString(value.exerciseTitle) ||
    readString(value.challengeTitle);

  const dayLabel =
    formatDayLabel(value.daySlug) ||
    formatDayLabel(value.day) ||
    formatDayLabel(value.dayNumber) ||
    formatDayLabel(value.mission) ||
    formatDayLabel(value.path);

  const note =
    readString(value.summary) ||
    readString(value.descricao) ||
    readString(value.description) ||
    readString(value.note) ||
    readString(value.output) ||
    readString(value.artifact);

  const status =
    readString(value.status) ||
    readString(value.kind) ||
    readString(value.type) ||
    "Submissao";

  const href =
    readString(value.href) ||
    readString(value.url) ||
    readString(value.link) ||
    readString(value.path) ||
    null;

  const timestamp =
    resolveTimestamp(value.submittedAt) ||
    resolveTimestamp(value.updatedAt) ||
    resolveTimestamp(value.createdAt) ||
    resolveTimestamp(value.timestamp) ||
    resolveTimestamp(value.date);

  if (!title && !note && !dayLabel) {
    return null;
  }

  return {
    id: readString(value.id) || fallbackId,
    title: title || dayLabel || "Entrega recente",
    detail: note || dayLabel || "Registo recuperado do espaco do estudante.",
    status,
    href,
    dateLabel: formatDateLabel(timestamp),
    sortValue: timestamp,
  };
}

function collectEntries(value: unknown, bucket: SubmissionEntry[], prefix: string) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const entry = createSubmissionEntry(item, `${prefix}-${index}`);
      if (entry) {
        bucket.push(entry);
      }
    });
    return;
  }

  if (!isObject(value)) {
    return;
  }

  const directEntry = createSubmissionEntry(value, prefix);
  if (directEntry) {
    bucket.push(directEntry);
    return;
  }

  Object.entries(value).forEach(([key, nested]) => {
    const entry = createSubmissionEntry(nested, `${prefix}-${key}`);
    if (entry) {
      bucket.push(entry);
    }
  });
}

function extractRecentSubmissions(data: unknown) {
  if (!isObject(data)) {
    return [] as SubmissionEntry[];
  }

  const bucket: SubmissionEntry[] = [];
  const candidateKeys = [
    "recentSubmissions",
    "submissions",
    "portfolio",
    "artifacts",
    "deliverables",
  ];

  candidateKeys.forEach((key) => {
    collectEntries(data[key], bucket, key);
  });

  const deduped = new Map<string, SubmissionEntry>();
  bucket.forEach((entry) => {
    const dedupeKey = `${entry.id}:${entry.title}:${entry.detail}`;
    if (!deduped.has(dedupeKey)) {
      deduped.set(dedupeKey, entry);
    }
  });

  return Array.from(deduped.values())
    .sort((a, b) => b.sortValue - a.sortValue || a.title.localeCompare(b.title))
    .slice(0, 6);
}

function getDayCompletion(dayProgressIds: string[], progress: ProgressMap) {
  const completed = dayProgressIds.filter((id) => isItemDone(progress, id)).length;
  const total = dayProgressIds.length;
  const percent = Math.round((completed / total) * 100) || 0;

  return { completed, total, percent };
}

export function PortfolioProgressPage() {
  const { user } = useAuth();
  const { progress, stickyNotes, loading, day1Reviews } = useStudentState();
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionEntry[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [showArchiveDays, setShowArchiveDays] = useState(false);
  const [showStickyNotes, setShowStickyNotes] = useState(false);
  const [showTutorReviews, setShowTutorReviews] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSubmissions() {
      if (!user) {
        if (active) {
          setRecentSubmissions([]);
          setSubmissionsLoading(false);
        }
        return;
      }

      try {
        const [studentSnapshot, submissionsSnapshot] = await Promise.all([
          getDoc(doc(db, "students", user.uid)),
          getDocs(query(collection(db, "submissions"), where("userId", "==", user.uid))),
        ]);

        const studentItems = studentSnapshot.exists()
          ? extractRecentSubmissions(studentSnapshot.data())
          : [];
        const submissionItems = submissionsSnapshot.docs
          .map((item) =>
            createSubmissionEntry(
              {
                id: item.id,
                title: item.data().artifactTitle || item.data().missionTitle,
                summary: item.data().summary,
                status: item.data().status || "Submissao",
                url: item.data().fileUrl,
                createdAt: item.data().createdAtMs,
                daySlug: item.data().missionId,
              },
              item.id,
            ),
          )
          .filter((item): item is SubmissionEntry => Boolean(item));

        const items = [...submissionItems, ...studentItems]
          .sort((left, right) => right.sortValue - left.sortValue)
          .slice(0, 6);

        if (active) {
          setRecentSubmissions(items);
        }
      } catch (error) {
        console.error("Failed to load portfolio submissions:", error);
        if (active) {
          setRecentSubmissions([]);
        }
      } finally {
        if (active) {
          setSubmissionsLoading(false);
        }
      }
    }

    setSubmissionsLoading(true);
    loadSubmissions();

    return () => {
      active = false;
    };
  }, [user]);

  const summary = useMemo(() => {
    const completedItems = missionItems.filter((item) => isItemDone(progress, item.id));
    const completedPoints = completedItems.reduce((sum, item) => sum + item.points, 0);
    const completedDays = days.filter((day) => {
      const ids = [...day.exercicios.map((item) => item.id), day.desafio.id];
      return ids.every((id) => isItemDone(progress, id));
    });
    const startedDays = days.filter((day) => {
      const ids = [...day.exercicios.map((item) => item.id), day.desafio.id];
      return ids.some((id) => isItemDone(progress, id));
    });
    const nextDay =
      days.find((day) => {
        const ids = [...day.exercicios.map((item) => item.id), day.desafio.id];
        return ids.some((id) => !isItemDone(progress, id));
      }) ?? days.at(-1);
    const highlightedDays = days
      .filter((day) => {
        const ids = [...day.exercicios.map((item) => item.id), day.desafio.id];
        return ids.some((id) => isItemDone(progress, id)) || day.slug === nextDay?.slug;
      })
      .slice(0, 5)
      .map((day) => {
      const ids = [...day.exercicios.map((item) => item.id), day.desafio.id];
      return {
        day,
        ...getDayCompletion(ids, progress),
      };
      });
    // Recent sticky notes for the portfolio summary (up to 3, newest first).
    const recentSticky = [...stickyNotes]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3);

    return {
      completedItems: completedItems.length,
      completedDays: completedDays.length,
      startedDays: startedDays.length,
      completedPoints,
      totalItems: missionItems.length,
      totalPoints: course.totalPoints,
      percent: Math.round((completedItems.length / missionItems.length) * 100) || 0,
      nextDay,
      highlightedDays,
      recentSticky,
    };
  }, [stickyNotes, progress]);

  const reviewSummary = useMemo(() => {
    const entries = Object.values(day1Reviews || {}) as Array<ReviewMap[string]>;
    const completed = entries.filter((entry) => !entry?.error && entry?.reviewedAnswer?.trim()).length;
    const fresh = entries.filter((entry) => !entry?.error && entry?.reviewedAnswer?.trim()).slice();
    const readyCount = fresh.filter((entry) => entry.readyToSubmit).length;
    const blockedCount = fresh.filter(
      (entry) => entry.readinessStatus === "blocked" || entry.blockingIssues.length > 0,
    ).length;
    const reviseCount = Math.max(0, completed - readyCount - blockedCount);

    const recent = fresh
      .sort((left, right) => right.reviewedAtMs - left.reviewedAtMs)
      .slice(0, 6)
      .map((entry) => ({
        itemId: entry.itemId,
        title: entry.itemId,
        readiness:
          entry.readinessStatus === "ready"
            ? "Pronto para submeter"
            : entry.readinessStatus === "blocked"
              ? "Precisa de mudancas chave"
              : "Pede mais um draft",
        feedback: entry.coachSummary || entry.encouragement || "Sem comentario curto.",
        nextStep: entry.nextStep || entry.priorityActions[0] || "Sem proximo passo registado.",
        updatedAtLabel: formatDateLabel(entry.reviewedAtMs),
        confidence: entry.confidence,
      })) as ReviewEntry[];

    return {
      completed,
      readyCount,
      reviseCount,
      blockedCount,
      recent,
    };
  }, [day1Reviews]);

  const nextSteps = useMemo(() => {
    const actions: Array<{ label: string; href: string }> = [];

    if (summary.nextDay) {
      actions.push({
        label: `Retomar o Dia ${summary.nextDay.slug} e fechar a proxima entrega.`,
        href: `/missions/${summary.nextDay.slug}`,
      });
    }

    if (!recentSubmissions.length && summary.nextDay) {
      actions.push({
        label: "Guardar uma entrega ou artefacto no Firestore para o portfolio ganhar historico.",
        href: `/missions/${summary.nextDay.slug}`,
      });
    }

    if (!stickyNotes.length) {
      actions.push({
        label: "Criar uma nota adesiva com o foco do bootcamp e as decisoes que queres manter.",
        href: "/",
      });
    }

    actions.push({
      label: "Rever o roteiro completo antes da proxima semana de trabalho.",
      href: "/#roadmap",
    });

    return actions.slice(0, 4);
  }, [stickyNotes.length, recentSubmissions.length, summary.nextDay]);

  return (
    <main className="page-shell px-4 pb-28 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="panel-tech shell-frame soft-grid rounded-[2rem] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Portfolio do estudante
            </p>
            <span className="ink-rule mt-3" aria-hidden="true" />
            <h1 className="mt-4 max-w-4xl font-serif text-[2.6rem] leading-[0.96] tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
              O teu progresso, as tuas entregas e o proximo passo num so lugar.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
              Consulta o que ja fechaste, o que ainda esta em curso e as entregas recentes que ja
              servem como prova do teu trabalho.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {summary.nextDay ? (
                <AppLink
                  href={`/missions/${summary.nextDay.slug}`}
                  className="button-primary w-full px-5 py-3 text-center text-sm sm:w-auto"
                >
                  Continuar no Dia {summary.nextDay.slug}
                </AppLink>
              ) : null}
              <AppLink
                href="/"
                className="button-secondary w-full px-5 py-3 text-center text-sm font-semibold sm:w-auto"
              >
                Voltar ao inicio
              </AppLink>
            </div>
          </div>

          <div className="panel shell-frame rounded-[2rem] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Estado da conta
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Sessao atual
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                  {user?.email ?? "Estudante autenticado"}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Ritmo atual
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                  {summary.startedDays} dias tocados, {summary.completedDays} fechados
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:col-span-2 xl:col-span-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--foreground)]">Progresso total</span>
                  <span className="text-[var(--muted-foreground)]">{loading ? "..." : `${summary.percent}%`}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all"
                    style={{ width: `${summary.percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <article className="metric-card rounded-[1.6rem] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Dias concluidos</p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {summary.completedDays}
              <span className="ml-2 text-base font-normal text-[var(--muted-foreground)]">/ {days.length}</span>
            </p>
          </article>
          <article className="metric-card rounded-[1.6rem] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Itens concluidos</p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {summary.completedItems}
              <span className="ml-2 text-base font-normal text-[var(--muted-foreground)]">/ {summary.totalItems}</span>
            </p>
          </article>
          <article className="metric-card rounded-[1.6rem] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Pontos ganhos</p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {summary.completedPoints}
              <span className="ml-2 text-base font-normal text-[var(--muted-foreground)]">/ {summary.totalPoints}</span>
            </p>
          </article>
          <article className="metric-card rounded-[1.6rem] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Entregas recentes</p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{recentSubmissions.length}</p>
          </article>
          <article className="metric-card rounded-[1.6rem] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Reviews AI</p>
            <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{reviewSummary.completed}</p>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="panel shell-frame rounded-[2rem] p-6 sm:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                    Dias em destaque
                  </p>
                  <h2 className="mt-2 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
                    Dias com progresso recente.
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
                  Revê as aulas que ja tocaste e identifica rapidamente qual merece a tua atencao a
                  seguir.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowArchiveDays((prev) => !prev)}
                  className="button-secondary px-4 py-2 text-sm font-semibold"
                >
                  {showArchiveDays ? "Esconder dias" : "Ver dias em curso"}
                </button>
              </div>

              {showArchiveDays ? (
              <div className="mt-8 grid gap-3">
                {summary.highlightedDays.map(({ day, completed, total, percent }) => (
                  <AppLink
                    key={day.slug}
                    href={`/missions/${day.slug}`}
                    className="grid gap-4 rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 transition hover:border-[var(--accent-soft)] hover:bg-white md:grid-cols-[auto_1fr_auto] md:items-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-[var(--accent)]">
                      {day.slug}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{day.titulo}</p>
                      <p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">{day.objetivo}</p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-sm font-semibold text-[var(--foreground)]">{completed}/{total} etapas</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{percent}% concluido</p>
                    </div>
                  </AppLink>
                ))}
              </div>
              ) : (
                <div className="mt-6 rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[var(--muted-foreground)]">
                  Abre esta secao para rever aulas iniciadas, comparar progresso e decidir onde
                  retomar.
                </div>
              )}
            </section>

            <section className="panel shell-frame rounded-[2rem] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                Notas adesivas
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowStickyNotes((prev) => !prev)}
                  className="button-secondary px-4 py-2 text-sm font-semibold"
                >
                  {showStickyNotes ? "Esconder notas" : "Ver notas recentes"}
                </button>
              </div>

              {showStickyNotes ? (
              <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Resumo</p>
                  {stickyNotes.length ? (
                    <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                      {stickyNotes.length} nota{stickyNotes.length !== 1 ? "s" : ""} guardada{stickyNotes.length !== 1 ? "s" : ""}.
                      Usa o botao <strong>Notas</strong> no canto inferior esquerdo para consultar ou editar.
                    </p>
                  ) : (
                    <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                      Ainda nao ha notas adesivas criadas. Clica em <strong>Notas</strong> no canto inferior esquerdo para comecar.
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  {summary.recentSticky.length ? (
                    summary.recentSticky.map((note) => (
                      <article
                        key={note.id}
                        className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{note.color}</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-7 text-[var(--muted-foreground)]">
                          {note.content.trim() || "(nota sem texto)"}
                        </p>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
                      <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                        As notas adesivas aparecem aqui assim que forem criadas. Usa-as para registar comandos, prompts ou decisoes durante as aulas.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              ) : (
                <div className="mt-6 rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[var(--muted-foreground)]">
                  Abre esta secao quando quiseres rever prompts, comandos e decisoes guardadas nas
                  tuas notas.
                </div>
              )}
            </section>

            <section className="panel shell-frame rounded-[2rem] p-6 sm:p-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                    Reviews do tutor
                  </p>
                  <h2 className="mt-2 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
                    Feedback AI sobre as tuas respostas.
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
                  Cada review destaca pontos fortes, lacunas e o proximo passo antes de submeteres a
                  versao final.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTutorReviews((prev) => !prev)}
                  className="button-secondary px-4 py-2 text-sm font-semibold"
                >
                  {showTutorReviews ? "Esconder reviews" : "Ver reviews do tutor"}
                </button>
              </div>

              {showTutorReviews ? (
              <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Reviews concluidas</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{reviewSummary.completed}</p>
                </article>
                <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Prontas a submeter</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{reviewSummary.readyCount}</p>
                </article>
                <article className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Pedem revisao</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">{reviewSummary.reviseCount + reviewSummary.blockedCount}</p>
                </article>
              </div>

              <div className="mt-6 space-y-3">
                {reviewSummary.recent.length ? (
                  reviewSummary.recent.map((entry) => (
                    <article
                      key={`${entry.itemId}-${entry.updatedAtLabel}`}
                      className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                            {entry.itemId}
                          </p>
                          <h3 className="mt-1 text-base font-semibold text-[var(--foreground)]">
                            {entry.title}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[var(--foreground)]">{entry.readiness}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                            {entry.confidence} · {entry.updatedAtLabel ?? "sem data"}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{entry.feedback}</p>
                      <p className="mt-3 text-xs leading-6 text-[var(--muted-foreground)]">
                        Proximo passo: {entry.nextStep}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[1.4rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)] p-4 text-sm text-[var(--muted-foreground)]">
                    Ainda nao ha reviews AI guardadas no teu perfil.
                  </div>
                )}
              </div>
              </>
              ) : (
                <div className="mt-6 rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[var(--muted-foreground)]">
                  Abre esta secao para rever comentarios do tutor e decidir que respostas merecem uma
                  nova iteracao.
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <section className="panel shell-frame rounded-[2rem] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                Entregas recentes
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                O que ja ficou registado para mostrar progresso real.
              </h2>
              <div className="mt-5 space-y-3">
                {submissionsLoading ? (
                  <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[var(--muted-foreground)]">
                    A carregar entregas recentes...
                  </div>
                ) : recentSubmissions.length ? (
                  recentSubmissions.map((item) => {
                    const content = (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                            {item.status}
                          </span>
                          {item.dateLabel ? (
                            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                              {item.dateLabel}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{item.detail}</p>
                      </>
                    );

                    if (item.href) {
                      return (
                        <AppLink
                          key={item.id}
                          href={item.href}
                          className="block rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 transition hover:border-[var(--accent-soft)] hover:bg-white"
                        >
                          {content}
                        </AppLink>
                      );
                    }

                    return (
                      <article
                        key={item.id}
                        className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4"
                      >
                        {content}
                      </article>
                    );
                  })
                ) : (
                  <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[var(--muted-foreground)]">
                    Ainda nao ha entregas recentes disponiveis no Firestore. Assim que um artefacto, submissao ou portfolio entry for guardado no documento do estudante, ele aparece aqui.
                  </div>
                )}
              </div>
            </section>

            <section className="panel-tech shell-frame rounded-[2rem] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Proximos passos
              </p>
              <div className="mt-5 space-y-3">
                {nextSteps.map((step) => (
                  <AppLink
                    key={step.label}
                    href={step.href}
                    className="block rounded-[1.4rem] border border-[rgba(17,32,46,0.08)] bg-white/74 px-4 py-3 text-sm leading-7 text-[var(--foreground)] transition hover:border-[var(--cool-accent)] hover:bg-white"
                  >
                    {step.label}
                  </AppLink>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
