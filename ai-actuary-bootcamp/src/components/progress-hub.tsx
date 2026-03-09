"use client";

import { useMemo } from "react";

import { AppLink } from "@/components/app-link";
import type { DayWithMeta } from "@/lib/course";
import { useStudentState } from "@/lib/use-student-state";
import { type ProgressMap, isItemDone } from "@/lib/student-state";

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
    return missionItems.some((item) => !isItemDone(progress, item.id));
  });

  return nextMission ?? dayOrder.at(-1) ?? "00";
}

export function ProgressHub({ items, days }: Props) {
  const { progress } = useStudentState();

  const summary = useMemo(() => {
    const completedItems = items.filter((item) => isItemDone(progress, item.id));
    const completedPoints = completedItems.reduce((sum, item) => sum + item.points, 0);
    const totalPoints = items.reduce((sum, item) => sum + item.points, 0);
    const nextMission = resolveNextMission(items, progress);
    const currentDay = days.find((day) => day.slug === nextMission) ?? days[0];
    const completedDays = days.filter((day) => {
      const missionIds = [...day.exercicios.map((item) => item.id), day.desafio.id];
      return missionIds.every((id) => isItemDone(progress, id));
    }).length;

    return {
      completedCount: completedItems.length,
      totalCount: items.length,
      completedPoints,
      totalPoints,
      nextMission,
      currentDay,
      completedDays,
      percent: Math.round((completedItems.length / items.length) * 100) || 0,
    };
  }, [days, items, progress]);

  return (
    <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="panel shell-frame rounded-[2rem] p-6 sm:p-8">
        <p className="kicker">Percurso ativo</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="font-serif text-3xl tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
              Dia {summary.currentDay.slug}: {summary.currentDay.titulo}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
              {summary.currentDay.objetivo}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                {summary.currentDay.exercicios.length} exercicios
              </span>
              <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                {summary.currentDay.topicCount} topicos
              </span>
              <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                {summary.currentDay.totalMissionPoints} pts nesta aula
              </span>
            </div>
          </div>

          <div className="space-y-3 lg:text-right">
            <AppLink href={`/missions/${summary.nextMission}`} className="button-primary px-5 py-3 text-sm">
              Continuar aula
            </AppLink>
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
              Abre a aula atual e continua a partir da proxima etapa ainda em aberto.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
        <div className="metric-card rounded-[1.5rem] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Dias fechados
          </p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {summary.completedDays}
            <span className="ml-2 text-base font-normal text-[var(--muted-foreground)]">
              / {days.length}
            </span>
          </p>
        </div>

        <div className="metric-card rounded-[1.5rem] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Etapas concluidas
          </p>
          <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            {summary.completedCount}
            <span className="ml-2 text-base font-normal text-[var(--muted-foreground)]">
              / {summary.totalCount}
            </span>
          </p>
        </div>

        <div className="metric-card rounded-[1.5rem] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Ritmo total
            </p>
            <span className="text-sm font-semibold text-[var(--foreground)]">{summary.percent}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${summary.percent}%` }} />
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            {summary.completedPoints} de {summary.totalPoints} pontos convertidos em progresso.
          </p>
        </div>
      </div>
    </section>
  );
}
