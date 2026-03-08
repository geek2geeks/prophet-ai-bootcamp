"use client";

import { useMemo } from "react";
import { useStudentState } from "@/lib/use-student-state";

type Exercise = {
  id: string;
  titulo: string;
  pontos: number;
};

type Challenge = {
  id: string;
  titulo: string;
  pontos: number;
};

type Props = {
  dayNumber: number;
  daySlug: string;
  dayTitle: string;
  exercises: Exercise[];
  challenge: Challenge;
  cliLabel: string;
  artifactList?: string[];
};

export function MissionWorkspaceTools({
  dayNumber,
  daySlug,
  dayTitle,
  exercises,
  challenge,
  cliLabel,
  artifactList,
}: Props) {
  const { progress, toggleProgress, loading } = useStudentState();

  const items = useMemo(() => [...exercises, challenge], [challenge, exercises]);
  const completedCount = items.filter((item) => progress[item.id]).length;
  const completedPoints = items
    .filter((item) => progress[item.id])
    .reduce((sum, item) => sum + item.pontos, 0);
  const totalPoints = items.reduce((sum, item) => sum + item.pontos, 0);
  const completionRatio = Math.round((completedCount / items.length) * 100) || 0;

  // daySlug and dayNumber are used in section labels — kept for reference
  void daySlug;

  return (
    <div className="space-y-4">
      <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Hoje em resumo
        </p>
        <h2 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
          Dia {dayNumber.toString().padStart(2, "0")} · {dayTitle}
        </h2>
        <div className="mt-4 rounded-2xl bg-[var(--surface-subtle)] p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[var(--foreground)]">Progresso da aula</span>
            <span className="text-[var(--muted-foreground)]">{completionRatio}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all"
              style={{ width: `${completionRatio}%` }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
            <span>{completedCount}/{items.length} etapas</span>
            <span>{completedPoints}/{totalPoints} pts</span>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Checklist de sucesso
        </p>
        <div className="mt-4 space-y-3">
          {exercises.map((exercise) => (
            <label
              key={exercise.id}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--accent)]"
                checked={Boolean(progress[exercise.id])}
                onChange={(e) => toggleProgress(exercise.id, e.target.checked)}
                disabled={loading}
              />
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  {exercise.id}
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                  {exercise.titulo}
                </p>
              </div>
            </label>
          ))}

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--accent-soft)] bg-[var(--surface-subtle)] px-4 py-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--accent)]"
              checked={Boolean(progress[challenge.id])}
              onChange={(e) => toggleProgress(challenge.id, e.target.checked)}
              disabled={loading}
            />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Desafio
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {challenge.titulo}
              </p>
            </div>
          </label>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Modo de trabalho
        </p>
        <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-4">
            <p className="font-semibold text-[var(--foreground)]">Na plataforma</p>
            <p className="mt-1">Ler a aula, acompanhar o progresso, guardar notas e capturar a prova do que foi feito.</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-4">
            <p className="font-semibold text-[var(--foreground)]">Nas ferramentas locais</p>
            <p className="mt-1">{cliLabel}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-4">
            <p className="font-semibold text-[var(--foreground)]">Pronto para avancar quando</p>
            <p className="mt-1">As notas da aula capturam o insight chave, o trabalho local produziu um artefacto util e o desafio ficou marcado como concluido.</p>
          </div>
        </div>
      </section>

      {artifactList?.length ? (
        <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Artefactos a guardar
          </p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
            {artifactList.map((artifact) => (
              <div
                key={artifact}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3"
              >
                {artifact}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Sticky notes tip */}
      <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Notas
        </p>
        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
          Usa o widget <span className="font-semibold text-[var(--foreground)]">Notas</span> no canto inferior esquerdo para criar sticky notes livres —
          arrasta, redimensiona e muda a cor. Ficam guardadas automaticamente no teu perfil.
        </p>
      </section>
    </div>
  );
}
