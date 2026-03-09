"use client";

import { useMemo } from "react";
import { useStudentState } from "@/lib/use-student-state";
import { getDay1ReviewGateMessage } from "@/lib/day1-review";
import { EXTENDED_REVIEW_DAYS } from "@/lib/review-presets";

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
  dayTitle: string;
  exercises: Exercise[];
  challenge: Challenge;
  artifactList?: string[];
};

export function MissionWorkspaceTools({
  dayNumber,
  dayTitle,
  exercises,
  challenge,
  artifactList,
}: Props) {
  const { progress, toggleProgress, loading, day1Answers, day1Reviews } = useStudentState();

  const items = useMemo(() => [...exercises, challenge], [challenge, exercises]);
  const completedCount = items.filter((item) => progress[item.id]).length;
  const completedPoints = items
    .filter((item) => progress[item.id])
    .reduce((sum, item) => sum + item.pontos, 0);
  const totalPoints = items.reduce((sum, item) => sum + item.pontos, 0);
  const completionRatio = Math.round((completedCount / items.length) * 100) || 0;

  return (
    <div className="space-y-4">
      <section className="panel-tech shell-frame rounded-[1.9rem] p-5">
        <p className="kicker">
          Progresso do fluxo
        </p>
        <h2 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
          Dia {dayNumber.toString().padStart(2, "0")} · {dayTitle}
        </h2>
        <div className="panel-soft mt-4 rounded-2xl p-4">
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
        <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
          Este bloco acompanha o teu progresso, mas o trabalho deve acontecer de cima para baixo na pagina.
        </p>
      </section>

      <section className="panel shell-frame rounded-[1.75rem] p-5">
        <p className="kicker">
          O que falta fechar
        </p>
        <div className="mt-4 space-y-3">
          {exercises.map((exercise) => {
            const reviewGate =
              EXTENDED_REVIEW_DAYS.has(dayNumber)
                ? getDay1ReviewGateMessage(
                    day1Reviews[exercise.id],
                    day1Answers[exercise.id] ?? "",
                    "exercise",
                  )
                : null;
            const isChecked = Boolean(progress[exercise.id]);

            return (
              <label
                key={exercise.id}
                className="panel-soft flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--accent)]"
                  checked={isChecked}
                  onChange={(e) => toggleProgress(exercise.id, e.target.checked)}
                  disabled={loading || (!isChecked && Boolean(reviewGate))}
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    {exercise.id}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                    {exercise.titulo}
                  </p>
                  {reviewGate && !isChecked ? (
                    <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
                      {reviewGate}
                    </p>
                  ) : null}
                </div>
              </label>
            );
          })}

          {(() => {
            const reviewGate =
              EXTENDED_REVIEW_DAYS.has(dayNumber)
                ? getDay1ReviewGateMessage(
                    day1Reviews[challenge.id],
                    day1Answers[challenge.id] ?? "",
                    "challenge",
                  )
                : null;
            const isChecked = Boolean(progress[challenge.id]);

            return (
              <label className="panel-accent flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--accent)]"
                  checked={isChecked}
                  onChange={(e) => toggleProgress(challenge.id, e.target.checked)}
                  disabled={loading || (!isChecked && Boolean(reviewGate))}
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Desafio
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                    {challenge.titulo}
                  </p>
                  {reviewGate && !isChecked ? (
                    <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
                      {reviewGate}
                    </p>
                  ) : null}
                </div>
              </label>
            );
          })()}
        </div>
      </section>

      {artifactList?.length ? (
        <section className="panel shell-frame rounded-[1.75rem] p-5">
          <p className="kicker">
            Guardar no fim
          </p>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
            {artifactList.map((artifact) => (
              <div
                key={artifact}
                className="panel-soft rounded-2xl px-4 py-3"
              >
                {artifact}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
