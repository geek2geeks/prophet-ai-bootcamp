"use client";

import { useEffect, useMemo, useState } from "react";

type StatusId = "nao-iniciado" | "em-curso" | "bloqueado" | "validado";
type MilestoneId =
  | "setup"
  | "baseline"
  | "fixtures"
  | "variance"
  | "handoff";

type Milestone = {
  done: boolean;
  note: string;
};

type EvidenceItem = {
  id: string;
  title: string;
  command: string;
  outcome: string;
};

type TrackerState = {
  engineName: string;
  branchName: string;
  dataset: string;
  owner: string;
  overallStatus: StatusId;
  confidence: number;
  lastRunAt: string;
  expectedRuntime: string;
  milestones: Record<MilestoneId, Milestone>;
  assumptionsNote: string;
  varianceNote: string;
  blockerNote: string;
  nextStep: string;
  evidence: EvidenceItem[];
};

const STORAGE_KEY = "aibootcamp-day8-validation-run-tracker-v1";

const STATUS_META: Record<
  StatusId,
  { label: string; tone: string; panel: string; helper: string }
> = {
  "nao-iniciado": {
    label: "Nao iniciado",
    tone: "#8c4a2f",
    panel: "rgba(140,74,47,0.08)",
    helper: "Ainda falta correr a rotina base e guardar evidencia minima.",
  },
  "em-curso": {
    label: "Em curso",
    tone: "#2f6b72",
    panel: "rgba(47,107,114,0.08)",
    helper: "Ha execucoes e notas, mas a validacao ainda nao fechou.",
  },
  bloqueado: {
    label: "Bloqueado",
    tone: "#a54b42",
    panel: "rgba(165,75,66,0.08)",
    helper: "Existe um desvio ou falha que impede concluir o handoff local.",
  },
  validado: {
    label: "Validado",
    tone: "#4d6b3c",
    panel: "rgba(77,107,60,0.09)",
    helper: "O motor deterministico correu, as premissas foram revistas e o handoff esta pronto.",
  },
};

const MILESTONES: Array<{ id: MilestoneId; label: string; helper: string }> = [
  {
    id: "setup",
    label: "Setup local pronto",
    helper: "Repo, branch, env e comando principal estao definidos.",
  },
  {
    id: "baseline",
    label: "Baseline reproduzida",
    helper: "Existe uma run base com resultado repetivel.",
  },
  {
    id: "fixtures",
    label: "Fixtures revistas",
    helper: "Inputs, tabelas e seed local batem com o cenario esperado.",
  },
  {
    id: "variance",
    label: "Variancia explicada",
    helper: "Desvios conhecidos estao anotados com impacto e causa provavel.",
  },
  {
    id: "handoff",
    label: "Handoff pronto",
    helper: "Outra pessoa consegue retomar o trabalho no repo e no CLI.",
  },
];

const STARTER_EVIDENCE: EvidenceItem[] = [
  {
    id: "baseline-run",
    title: "Run baseline",
    command: "pnpm test:engine --scenario baseline",
    outcome: "Sem output ainda. Atualiza com hash, runtime e diferencas observadas.",
  },
  {
    id: "variance-check",
    title: "Comparacao de variancia",
    command: "pnpm engine:compare --expected fixtures/baseline.json --actual tmp/latest.json",
    outcome: "Regista delta, coluna afetada e se o desvio e aceite ou bloqueante.",
  },
];

function createInitialState(): TrackerState {
  return {
    engineName: "Motor deterministico local",
    branchName: "feature/day8-validation",
    dataset: "fixtures/baseline.csv",
    owner: "",
    overallStatus: "em-curso",
    confidence: 62,
    lastRunAt: "",
    expectedRuntime: "",
    milestones: {
      setup: { done: true, note: "Repo aberto e comandos definidos." },
      baseline: { done: false, note: "" },
      fixtures: { done: false, note: "" },
      variance: { done: false, note: "" },
      handoff: { done: false, note: "" },
    },
    assumptionsNote:
      "Assumir input fixo, seed controlada e mesmas tabelas de referencia para comparar runs locais.",
    varianceNote:
      "Aceitar desvios pequenos apenas se a causa estiver explicada e o impacto for irrelevante no output final.",
    blockerNote: "",
    nextStep: "Correr baseline, guardar output e comparar com o fixture esperado.",
    evidence: STARTER_EVIDENCE,
  };
}

function createEvidenceItem(): EvidenceItem {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    title: "",
    command: "",
    outcome: "",
  };
}

export function Day8ValidationRunTracker() {
  const [state, setState] = useState<TrackerState>(() => {
    if (typeof window === "undefined") {
      return createInitialState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TrackerState) : createInitialState();
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

  const completedCount = useMemo(
    () => MILESTONES.filter((milestone) => state.milestones[milestone.id].done).length,
    [state.milestones],
  );

  const statusMeta = STATUS_META[state.overallStatus];

  const handoffSummary = useMemo(() => {
    const completedMilestones = MILESTONES.filter((item) => state.milestones[item.id].done).map(
      (item) => `- ${item.label}: ${state.milestones[item.id].note || "ok"}`,
    );
    const pendingMilestones = MILESTONES.filter((item) => !state.milestones[item.id].done).map(
      (item) => `- ${item.label}: ${state.milestones[item.id].note || "por fechar"}`,
    );
    const evidenceLines = state.evidence
      .filter((item) => item.title.trim() || item.command.trim() || item.outcome.trim())
      .map((item, index) => {
        const title = item.title.trim() || `Evidencia ${index + 1}`;
        const command = item.command.trim() || "sem comando";
        const outcome = item.outcome.trim() || "sem resultado registado";
        return `- ${title}: ${command} -> ${outcome}`;
      });

    return [
      "# Handoff de validacao local",
      "",
      `Estado: ${statusMeta.label}`,
      `Motor: ${state.engineName || "n/d"}`,
      `Branch: ${state.branchName || "n/d"}`,
      `Dataset: ${state.dataset || "n/d"}`,
      `Owner: ${state.owner || "n/d"}`,
      `Ultima run: ${state.lastRunAt || "n/d"}`,
      `Runtime esperado: ${state.expectedRuntime || "n/d"}`,
      `Confianca atual: ${state.confidence}%`,
      "",
      "Milestones fechados:",
      ...(completedMilestones.length ? completedMilestones : ["- Nenhum milestone fechado."]),
      "",
      "Milestones pendentes:",
      ...(pendingMilestones.length ? pendingMilestones : ["- Nenhum milestone pendente."]),
      "",
      `Premissas: ${state.assumptionsNote || "n/d"}`,
      `Variancia: ${state.varianceNote || "n/d"}`,
      `Bloqueios: ${state.blockerNote || "Sem bloqueios ativos."}`,
      `Proximo passo: ${state.nextStep || "n/d"}`,
      "",
      "Evidencia da run:",
      ...(evidenceLines.length ? evidenceLines : ["- Sem evidencia registada."]),
      "",
      "CLI sugerido:",
      `git switch ${state.branchName || "<branch>"}`,
      `pnpm install && pnpm test:engine --scenario baseline`,
      "pnpm engine:compare --expected fixtures/baseline.json --actual tmp/latest.json",
    ].join("\n");
  }, [state, statusMeta.label]);

  function setField<Key extends keyof TrackerState>(key: Key, value: TrackerState[Key]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function updateMilestone(id: MilestoneId, patch: Partial<Milestone>) {
    setState((current) => ({
      ...current,
      milestones: {
        ...current.milestones,
        [id]: {
          ...current.milestones[id],
          ...patch,
        },
      },
    }));
  }

  function updateEvidence(id: string, field: keyof EvidenceItem, value: string) {
    setState((current) => ({
      ...current,
      evidence: current.evidence.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  }

  function addEvidence() {
    setState((current) => ({
      ...current,
      evidence: [...current.evidence, createEvidenceItem()],
    }));
  }

  function removeEvidence(id: string) {
    setState((current) => ({
      ...current,
      evidence: current.evidence.filter((item) => item.id !== id),
    }));
  }

  async function copySummary() {
    await navigator.clipboard.writeText(handoffSummary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Lab Dia 8
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Fechar a validacao do motor local com evidencia e handoff.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            Este tracker ajuda o estudante a provar que a run deterministica e repetivel, explicar a
            variancia observada e passar o trabalho no repo sem notas soltas no terminal.
          </p>
        </div>

        <button
          type="button"
          onClick={copySummary}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
        >
          {copied ? "Handoff copiado" : "Copiar handoff"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label="Checkpoints fechados" value={`${completedCount}/${MILESTONES.length}`} />
            <MetricCard label="Confianca na run" value={`${state.confidence}%`} />
          </div>

          <div
            className="rounded-[1.3rem] border p-4"
            style={{ borderColor: statusMeta.tone, backgroundColor: statusMeta.panel }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: statusMeta.tone }}>
                  Estado da validacao
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{statusMeta.label}</p>
              </div>
              <span
                className="inline-flex h-3 w-3 rounded-full"
                style={{ backgroundColor: statusMeta.tone }}
              />
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{statusMeta.helper}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(STATUS_META) as StatusId[]).map((statusId) => {
                const active = state.overallStatus === statusId;
                return (
                  <button
                    key={statusId}
                    type="button"
                    onClick={() => setField("overallStatus", statusId)}
                    className="rounded-full border px-3 py-2 text-sm font-medium transition"
                    style={{
                      borderColor: active ? STATUS_META[statusId].tone : "var(--border)",
                      backgroundColor: active ? STATUS_META[statusId].tone : "white",
                      color: active ? "white" : "var(--foreground)",
                    }}
                  >
                    {STATUS_META[statusId].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Contexto da run
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field
                label="Motor"
                value={state.engineName}
                onChange={(value) => setField("engineName", value)}
                placeholder="Nome do motor ou script"
              />
              <Field
                label="Branch"
                value={state.branchName}
                onChange={(value) => setField("branchName", value)}
                placeholder="feature/..."
              />
              <Field
                label="Dataset"
                value={state.dataset}
                onChange={(value) => setField("dataset", value)}
                placeholder="fixtures/baseline.csv"
              />
              <Field
                label="Owner"
                value={state.owner}
                onChange={(value) => setField("owner", value)}
                placeholder="Quem esta a validar"
              />
              <Field
                label="Ultima run"
                value={state.lastRunAt}
                onChange={(value) => setField("lastRunAt", value)}
                placeholder="2026-03-08 14:30"
              />
              <Field
                label="Runtime esperado"
                value={state.expectedRuntime}
                onChange={(value) => setField("expectedRuntime", value)}
                placeholder="ex: 12s"
              />
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Handoff para repo e CLI
              </p>
              <button
                type="button"
                onClick={copySummary}
                className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
              >
                {copied ? "Texto copiado" : "Copiar resumo"}
              </button>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--border)] bg-white p-4 text-xs leading-6 text-[var(--foreground)]">
              {handoffSummary}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Milestones e checkpoints
            </p>
            <div className="mt-4 space-y-3">
              {MILESTONES.map((milestone) => {
                const milestoneState = state.milestones[milestone.id];
                return (
                  <div
                    key={milestone.id}
                    className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateMilestone(milestone.id, { done: !milestoneState.done })}
                            className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition"
                            style={{
                              borderColor: milestoneState.done ? "var(--accent)" : "var(--border)",
                              backgroundColor: milestoneState.done ? "var(--accent)" : "white",
                              color: milestoneState.done ? "white" : "var(--foreground)",
                            }}
                          >
                            {milestoneState.done ? "OK" : "-"}
                          </button>
                          <div>
                            <p className="font-semibold text-[var(--foreground)]">{milestone.label}</p>
                            <p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">
                              {milestone.helper}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                        {milestoneState.done ? "Fechado" : "Pendente"}
                      </span>
                    </div>

                    <textarea
                      value={milestoneState.note}
                      onChange={(event) => updateMilestone(milestone.id, { note: event.target.value })}
                      placeholder="O que foi comprovado, que ficheiro foi usado ou porque ainda falta fechar."
                      className="mt-4 min-h-24 w-full rounded-[1rem] border border-[var(--border)] bg-white px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextPanel
              title="Premissas da validacao"
              helper="Documenta o que precisa ficar constante entre runs locais."
              value={state.assumptionsNote}
              onChange={(value) => setField("assumptionsNote", value)}
              placeholder="Seed, tabela, data de corte, inputs obrigatorios..."
            />
            <TextPanel
              title="Notas de variancia"
              helper="Regista desvios aceites, tolerancias e diferencas suspeitas."
              value={state.varianceNote}
              onChange={(value) => setField("varianceNote", value)}
              placeholder="Delta esperado, range aceite, output afetado..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextPanel
              title="Bloqueios atuais"
              helper="Se algo impede a validacao, deixa explicito para a proxima pessoa."
              value={state.blockerNote}
              onChange={(value) => setField("blockerNote", value)}
              placeholder="Erro, dependencia externa, fixture invalido..."
            />
            <TextPanel
              title="Proximo passo objetivo"
              helper="Define a proxima acao no repo sem ambiguidade."
              value={state.nextStep}
              onChange={(value) => setField("nextStep", value)}
              placeholder="Comando, ficheiro e criterio de fecho..."
            />
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Log de evidencia
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Guarda comandos, outputs e comparacoes que sustentam o estado da validacao.
                </p>
              </div>
              <button
                type="button"
                onClick={addEvidence}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                Adicionar evidencia
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {state.evidence.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--foreground)]">Evidencia {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeEvidence(item.id)}
                      className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition hover:border-[var(--accent-soft)]"
                    >
                      Remover
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <Field
                      label="Titulo"
                      value={item.title}
                      onChange={(value) => updateEvidence(item.id, "title", value)}
                      placeholder="Run baseline, regressao, fixture B..."
                    />
                    <Field
                      label="Comando"
                      value={item.command}
                      onChange={(value) => updateEvidence(item.id, "command", value)}
                      placeholder="pnpm ..."
                    />
                  </div>
                  <label className="mt-3 block">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      Resultado observado
                    </span>
                    <textarea
                      value={item.outcome}
                      onChange={(event) => updateEvidence(item.id, "outcome", event.target.value)}
                      placeholder="O que saiu, que delta apareceu e porque conta como evidencia."
                      className="mt-3 min-h-24 w-full rounded-[1rem] border border-[var(--border)] bg-white px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 w-full rounded-[1rem] border border-[var(--border)] bg-white px-3 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
      />
    </label>
  );
}

function TextPanel({
  title,
  helper,
  value,
  onChange,
  placeholder,
}: {
  title: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {title}
      </span>
      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{helper}</p>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-4 min-h-28 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
      />
    </label>
  );
}
