"use client";

import { useMemo } from "react";

import { AppLink } from "@/components/app-link";
import type { DayWithMeta } from "@/lib/course";
import { useStudentState } from "@/lib/use-student-state";
import { isItemDone, type ProgressMap } from "@/lib/student-state";

type Props = {
  days: DayWithMeta[];
};

function getDayStatus(day: DayWithMeta, progress: ProgressMap) {
  const items = [...day.exercicios.map((item) => item.id), day.desafio.id];
  const completed = items.filter((id) => isItemDone(progress, id)).length;

  if (completed === 0) {
    return "Nao iniciado";
  }

  if (completed === items.length) {
    return "Fechado";
  }

  return "Em curso";
}

function resolveNextDay(days: DayWithMeta[], progress: ProgressMap) {
  return days.find((day) => {
    const items = [...day.exercicios.map((item) => item.id), day.desafio.id];
    return items.some((id) => !isItemDone(progress, id));
  })?.slug;
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

  const nextDaySlug = resolveNextDay(days, progress);

  return (
    <section id="roadmap" className="panel shell-frame rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="kicker">Arquitetura do curso</p>
          <h2 className="mt-2 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
            Cada aula termina numa entrega concreta.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
          Usa este mapa para perceber a sequencia das aulas, o estado de cada dia e a proxima aula a
          retomar.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {weeks.map(([week, weekDays]) => (
          <div key={week} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="route-chip rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Semana {week}
              </span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {weekDays.map((day) => {
                const status = getDayStatus(day, progress);
                const isNext = day.slug === nextDaySlug;

                return (
                  <AppLink
                    key={day.slug}
                    href={`/missions/${day.slug}`}
                    className={`group grid gap-4 rounded-[1.7rem] border p-5 shadow-[0_18px_36px_rgba(12,38,46,0.05)] transition duration-300 md:grid-cols-[auto_1fr_auto] md:items-start ${
                      isNext
                        ? "border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(15,118,110,0.08),rgba(255,255,255,0.86))]"
                        : "border-[var(--border)] bg-white/82 hover:border-[var(--accent-soft)] hover:bg-white"
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-subtle)] text-sm font-semibold text-[var(--accent)]">
                      {day.slug}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-[var(--foreground)]">{day.titulo}</p>
                        {isNext ? (
                          <span className="route-chip rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                            Proxima aula
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                        {day.objetivo}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="glass-pill rounded-full px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                          {day.exercicios.length} exercicios
                        </span>
                        <span className="glass-pill rounded-full px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                          {day.topicCount} topicos
                        </span>
                        <span className="glass-pill rounded-full px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                          {day.totalMissionPoints} pts
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 md:text-right">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                          status === "Fechado"
                            ? "bg-[#e3f5ef] text-[#1b6b56]"
                            : status === "Em curso"
                              ? "bg-[#fff1e6] text-[#9a5f24]"
                              : "bg-[var(--surface-subtle)] text-[var(--muted-foreground)]"
                        }`}
                      >
                        {status}
                      </span>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                        Entender · Build · Prova
                      </p>
                    </div>
                  </AppLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
