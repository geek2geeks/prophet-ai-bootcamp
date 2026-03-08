"use client";

import Link from "next/link";
import { useMemo } from "react";

import type { DayWithMeta } from "@/lib/course";
import { useStudentState } from "@/lib/use-student-state";

type Props = {
  days: DayWithMeta[];
};

function getDayStatus(day: DayWithMeta, progress: Record<string, boolean>) {
  const items = [...day.exercicios.map((item) => item.id), day.desafio.id];
  const completed = items.filter((id) => progress[id]).length;

  if (completed === 0) {
    return "Nao iniciado";
  }

  if (completed === items.length) {
    return "Concluido";
  }

  return "Em curso";
}

export function RoadmapBoard({ days }: Props) {
  const { progress } = useStudentState();

  const weeks = useMemo(() => {
    const grouped = new Map<number, DayWithMeta[]>();

    for (const day of days) {
      const bucket = grouped.get(day.semana) ?? [];
      bucket.push(day);
      grouped.set(day.semana, bucket);
    }

    return Array.from(grouped.entries()).sort(([a], [b]) => a - b);
  }, [days]);

  return (
    <section
      id="roadmap"
      className="panel rounded-[2rem] p-6 sm:p-8"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="kicker">
            Roteiro do curso
          </p>
          <h2 className="mt-2 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
            Aprende por etapas, constroi localmente e regressa com prova.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
          Cada dia mostra o que o estudante vai aprender, onde entram as ferramentas locais
          e o que conta como concluido antes de avancar.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {weeks.map(([week, weekDays]) => (
          <div key={week} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Semana {week}
              </span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {weekDays.map((day) => {
                const status = getDayStatus(day, progress);

                return (
                  <Link
                    key={day.slug}
                    href={`/missions/${day.slug}`}
                    className="grid gap-4 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(255,255,255,0.74)] p-5 shadow-[0_14px_38px_rgba(47,41,34,0.05)] transition hover:border-[var(--accent-soft)] hover:bg-white hover:shadow-[0_20px_46px_rgba(47,41,34,0.08)] md:grid-cols-[auto_1fr_auto] md:items-start"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-ghost)] text-sm font-semibold text-[var(--accent)]">
                      {day.slug}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {day.titulo}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--muted-foreground)]">
                        {day.objetivo}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="glass-pill px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)] rounded-full">
                          {day.exercicios.length} exercicios
                        </span>
                        <span className="glass-pill px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)] rounded-full">
                          {day.topicCount} topicos
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:items-end">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                          status === "Concluido"
                            ? "bg-[#e8f6ef] text-[#28704d]"
                            : status === "Em curso"
                              ? "bg-[#fdf1df] text-[#9a6411]"
                              : "bg-[var(--surface-subtle)] text-[var(--muted-foreground)]"
                        }`}
                      >
                        {status}
                      </span>
                      <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                        {day.totalMissionPoints} pts
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
