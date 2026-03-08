"use client";

import Link from "next/link";
import { useMemo } from "react";

import type { DayWithMeta } from "@/lib/course";
import { useStudentState } from "@/lib/use-student-state";
import { type ProgressMap } from "@/lib/student-state";

type MissionItem = {
  id: string;
  points: number;
  day: number;
  slug: string;
};

type Props = {
  items: MissionItem[];
  days: DayWithMeta[];
};

function resolveNextMission(items: MissionItem[], progress: ProgressMap) {
  const dayOrder = Array.from(new Set(items.map((item) => item.slug)));
  const nextMission = dayOrder.find((slug) => {
    const missionItems = items.filter((item) => item.slug === slug);
    return missionItems.some((item) => !progress[item.id]);
  });

  return nextMission ?? dayOrder.at(-1) ?? "00";
}

export function ProgressHub({ items, days }: Props) {
  const { progress } = useStudentState();

  const summary = useMemo(() => {
    const completedItems = items.filter((item) => progress[item.id]);
    const completedPoints = completedItems.reduce(
      (sum, item) => sum + item.points,
      0,
    );
    const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
    const nextMission = resolveNextMission(items, progress);
    const currentDay = days.find((day) => day.slug === nextMission) ?? days[0];
    const completedDays = days.filter((day) => {
      const missionIds = [...day.exercicios.map((item) => item.id), day.desafio.id];
      return missionIds.every((id) => progress[id]);
    }).length;

    return {
      completedCount: completedItems.length,
      totalCount: items.length,
      completedPoints,
      totalPoints,
      nextMission,
      currentDay,
      completedDays,
    };
  }, [days, items, progress]);

  return (
    <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
          Continuar aprendizagem
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
              Dia {summary.currentDay.slug}: {summary.currentDay.titulo}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
              {summary.currentDay.objetivo}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                {summary.currentDay.exercicios.length} exercicios
              </span>
              <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                {summary.currentDay.topicCount} topicos
              </span>
              <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                Construir localmente
              </span>
            </div>
          </div>

          <Link
            href={`/missions/${summary.nextMission}`}
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            Retomar aula
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Dias concluidos
          </p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {summary.completedDays}
            <span className="ml-2 text-base font-normal text-[var(--muted-foreground)]">
              / {days.length}
            </span>
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Itens concluidos
          </p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {summary.completedCount}
            <span className="ml-2 text-base font-normal text-[var(--muted-foreground)]">
              / {summary.totalCount}
            </span>
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Pontos capturados
          </p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {summary.completedPoints}
            <span className="ml-2 text-base font-normal text-[var(--muted-foreground)]">
              / {summary.totalPoints}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
