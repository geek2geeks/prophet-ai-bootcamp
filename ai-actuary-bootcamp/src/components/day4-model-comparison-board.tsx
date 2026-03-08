"use client";

import { useEffect, useMemo, useState } from "react";

type TaskId = "planning" | "memo" | "api";
type ProviderId = "deepseek" | "zai" | "opencode";
type AxisId = "acao" | "clareza" | "fiabilidade" | "custo";

type ScoreMap = Record<AxisId, number>;
type ProviderState = {
  scores: ScoreMap;
  note: string;
};

type BoardState = {
  activeTask: TaskId;
  tasks: Record<TaskId, Record<ProviderId, ProviderState>>;
};

const STORAGE_KEY = "aibootcamp-day4-model-board-v1";

const AXES: Array<{ id: AxisId; label: string; hint: string }> = [
  { id: "acao", label: "Acao", hint: "Sai com proximo passo executavel?" },
  { id: "clareza", label: "Clareza", hint: "Explica-se bem e sem ruido?" },
  { id: "fiabilidade", label: "Fiabilidade", hint: "Inventa pouco e mantem coerencia?" },
  { id: "custo", label: "Custo", hint: "Entrega valor sem desperdiçar credito?" },
];

const TASKS: Record<
  TaskId,
  {
    label: string;
    prompt: string;
    success: string;
  }
> = {
  planning: {
    label: "Planear uma feature",
    prompt:
      "Revê a spec de assumptions upload e propõe um coding plan com milestones, validações e riscos de implementação.",
    success: "Queres estrutura, ordem de execução e cortes de scope credíveis.",
  },
  memo: {
    label: "Resumir um memo atuarial",
    prompt:
      "Resume um memo técnico para um fundador não técnico, mantendo riscos, premissas e impacto no negócio.",
    success: "Queres uma explicação legível para produto, cliente ou direção.",
  },
  api: {
    label: "Sugerir uma API call",
    prompt:
      "Lê a doc de uma API e sugere um request inicial com payload, campos obrigatórios, resposta esperada e edge cases.",
    success: "Queres precisão técnica e poucos passos desperdiçados no terminal.",
  },
};

const PROVIDERS: Record<
  ProviderId,
  {
    label: string;
    role: string;
    accent: string;
    summary: string;
  }
> = {
  deepseek: {
    label: "DeepSeek",
    role: "Raciocínio e revisão",
    accent: "#7c3f58",
    summary: "Forte candidato quando precisas de segunda opinião, estrutura e leitura crítica.",
  },
  zai: {
    label: "Z.ai",
    role: "Planning e coding-plan",
    accent: "#2f6b72",
    summary: "Útil quando o objetivo é organizar o build e pedir planos mais explícitos.",
  },
  opencode: {
    label: "OpenCode",
    role: "Cockpit local",
    accent: "#8c4a2f",
    summary: "Melhor visto como workflow local comum para comparar providers e agir no repo.",
  },
};

function createInitialProviderState(): ProviderState {
  return {
    scores: {
      acao: 3,
      clareza: 3,
      fiabilidade: 3,
      custo: 3,
    },
    note: "",
  };
}

function createInitialState(): BoardState {
  return {
    activeTask: "planning",
    tasks: {
      planning: {
        deepseek: createInitialProviderState(),
        zai: createInitialProviderState(),
        opencode: createInitialProviderState(),
      },
      memo: {
        deepseek: createInitialProviderState(),
        zai: createInitialProviderState(),
        opencode: createInitialProviderState(),
      },
      api: {
        deepseek: createInitialProviderState(),
        zai: createInitialProviderState(),
        opencode: createInitialProviderState(),
      },
    },
  };
}

export function Day4ModelComparisonBoard() {
  const [state, setState] = useState<BoardState>(() => {
    if (typeof window === "undefined") {
      return createInitialState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as BoardState) : createInitialState();
    } catch {
      return createInitialState();
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      return;
    }
  }, [state]);

  const activeTask = TASKS[state.activeTask];
  const activeProviders = state.tasks[state.activeTask];

  const totals = useMemo(() => {
    return (Object.keys(activeProviders) as ProviderId[]).reduce(
      (acc, providerId) => {
        const scores = activeProviders[providerId].scores;
        const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
        acc[providerId] = total;
        return acc;
      },
      {} as Record<ProviderId, number>,
    );
  }, [activeProviders]);

  const taskWinners = useMemo(() => {
    return (Object.keys(state.tasks) as TaskId[]).reduce(
      (acc, taskId) => {
        const providers = state.tasks[taskId];
        const best = (Object.keys(providers) as ProviderId[])
          .map((providerId) => ({
            providerId,
            total: Object.values(providers[providerId].scores).reduce((sum, score) => sum + score, 0),
          }))
          .sort((a, b) => b.total - a.total)[0];
        acc[taskId] = best;
        return acc;
      },
      {} as Record<TaskId, { providerId: ProviderId; total: number }>,
    );
  }, [state.tasks]);

  const playbook = [
    "# Playbook de Model Selection",
    "",
    ...(Object.keys(TASKS) as TaskId[]).map((taskId) => {
      const winner = taskWinners[taskId];
      const provider = PROVIDERS[winner.providerId];
      const note = state.tasks[taskId][winner.providerId].note;

      return [
        `${TASKS[taskId].label}: ${provider.label} (${winner.total}/20)`,
        `- Papel: ${provider.role}`,
        `- Porque ganha: ${note || provider.summary}`,
      ].join("\n");
    }),
    "",
    "Recomendacao final:",
    `- Planear: ${PROVIDERS[taskWinners.planning.providerId].label}`,
    `- Explicar memo: ${PROVIDERS[taskWinners.memo.providerId].label}`,
    `- Sugerir API call: ${PROVIDERS[taskWinners.api.providerId].label}`,
  ].join("\n");

  function setScore(providerId: ProviderId, axisId: AxisId, value: number) {
    setState((current) => ({
      ...current,
      tasks: {
        ...current.tasks,
        [current.activeTask]: {
          ...current.tasks[current.activeTask],
          [providerId]: {
            ...current.tasks[current.activeTask][providerId],
            scores: {
              ...current.tasks[current.activeTask][providerId].scores,
              [axisId]: value,
            },
          },
        },
      },
    }));
  }

  function setNote(providerId: ProviderId, value: string) {
    setState((current) => ({
      ...current,
      tasks: {
        ...current.tasks,
        [current.activeTask]: {
          ...current.tasks[current.activeTask],
          [providerId]: {
            ...current.tasks[current.activeTask][providerId],
            note: value,
          },
        },
      },
    }));
  }

  async function copyPlaybook() {
    await navigator.clipboard.writeText(playbook);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Lab Dia 4
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Comparar modelos pela tarefa, nao por hype.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            O estudante usa a mesma rubrica em varios providers e sai com um veredito reutilizavel:
            quem planeia melhor, quem explica melhor e quem ajuda mais no fluxo tecnico.
          </p>
        </div>

        <button
          type="button"
          onClick={copyPlaybook}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
        >
          {copied ? "Playbook copiado" : "Copiar playbook"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-4">
          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Escolher a tarefa
            </p>
            <div className="mt-4 space-y-3">
              {(Object.keys(TASKS) as TaskId[]).map((taskId) => {
                const task = TASKS[taskId];
                const active = state.activeTask === taskId;
                const winner = taskWinners[taskId];

                return (
                  <button
                    key={taskId}
                    type="button"
                    onClick={() => setState((current) => ({ ...current, activeTask: taskId }))}
                    className="block w-full rounded-[1.1rem] border px-4 py-4 text-left transition"
                    style={{
                      borderColor: active ? "var(--accent-soft)" : "var(--border)",
                      backgroundColor: active ? "rgba(124,63,88,0.06)" : "white",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{task.label}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                          {task.success}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                        {PROVIDERS[winner.providerId].label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Prompt comum
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{activeTask.prompt}</p>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Leitura rapida
            </p>
            <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>- Compara sempre a mesma tarefa e o mesmo prompt antes de mudar de modelo.</p>
              <p>- Guarda o provider vencedor e a razao. O objetivo e criar um playbook, nao uma opiniao vaga.</p>
              <p>- OpenCode pode ganhar como cockpit local mesmo quando o raciocinio vem de outro provider.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {(Object.keys(PROVIDERS) as ProviderId[]).map((providerId) => {
            const provider = PROVIDERS[providerId];
            const providerState = activeProviders[providerId];

            return (
              <article
                key={providerId}
                className="rounded-[1.35rem] border border-[var(--border)] bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: provider.accent }}
                      />
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        {provider.label}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {provider.role} · {provider.summary}
                    </p>
                  </div>
                  <div className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-sm font-semibold text-[var(--foreground)]">
                    {totals[providerId]}/20
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {AXES.map((axis) => (
                    <div
                      key={axis.id}
                      className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-3"
                    >
                      <p className="font-medium text-[var(--foreground)]">{axis.label}</p>
                      <p className="mt-1 text-xs leading-6 text-[var(--muted-foreground)]">
                        {axis.hint}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((value) => {
                          const active = providerState.scores[axis.id] === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setScore(providerId, axis.id, value)}
                              className="flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition"
                              style={{
                                borderColor: active ? provider.accent : "var(--border)",
                                backgroundColor: active ? provider.accent : "white",
                                color: active ? "white" : "var(--foreground)",
                              }}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <label className="mt-4 block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Nota da avaliacao
                  </span>
                  <textarea
                    value={providerState.note}
                    onChange={(event) => setNote(providerId, event.target.value)}
                    placeholder="Regista porque este provider ganhou ou falhou nesta tarefa."
                    className="mt-3 min-h-24 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                  />
                </label>
              </article>
            );
          })}

          <div className="rounded-[1.3rem] border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.06),rgba(124,63,88,0.1))] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Veredito da tarefa atual
            </p>
            <p className="mt-3 text-base font-semibold text-[var(--foreground)]">
              Melhor escolha agora: {PROVIDERS[taskWinners[state.activeTask].providerId].label}
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
              O objetivo deste dia nao e declarar um vencedor universal. E saber qual modelo usar para
              cada tipo de trabalho dentro do bootcamp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
