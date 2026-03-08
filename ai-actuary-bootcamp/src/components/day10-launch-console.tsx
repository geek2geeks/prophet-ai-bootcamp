"use client";

import { useEffect, useMemo, useState } from "react";

type LaunchStatus = "a-preparar" | "pronto" | "lancado" | "bloqueado";
type ChecklistGroupId = "deploy" | "assets" | "demo" | "proof";

type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
  note: string;
};

type LaunchState = {
  productName: string;
  owner: string;
  channel: string;
  targetDate: string;
  primaryUrl: string;
  status: LaunchStatus;
  shippingRule: string;
  audienceNote: string;
  successSignal: string;
  riskNote: string;
  rollbackPlan: string;
  postLaunchNextStep: string;
  summaryHeadline: string;
  summaryBody: string;
  proofLinks: string;
  proofNotes: string;
  checklists: Record<ChecklistGroupId, ChecklistItem[]>;
};

const STORAGE_KEY = "aibootcamp-day10-launch-console-v1";

const STATUS_META: Record<
  LaunchStatus,
  { label: string; tone: string; panel: string; helper: string }
> = {
  "a-preparar": {
    label: "A preparar",
    tone: "#8c4a2f",
    panel: "rgba(140,74,47,0.08)",
    helper: "O plano existe, mas ainda faltam sinais minimos para lancar com confianca.",
  },
  pronto: {
    label: "Pronto para ship",
    tone: "#2f6b72",
    panel: "rgba(47,107,114,0.08)",
    helper: "Checklist quase fechado, mensagem alinhada e demo pronta para mostrar sem improviso.",
  },
  lancado: {
    label: "Lancado",
    tone: "#4d6b3c",
    panel: "rgba(77,107,60,0.09)",
    helper: "A release saiu, a prova foi guardada e o proximo loop de feedback ja esta definido.",
  },
  bloqueado: {
    label: "Bloqueado",
    tone: "#a54b42",
    panel: "rgba(165,75,66,0.08)",
    helper: "Existe um risco material. A decisao certa pode ser esperar e corrigir antes de publicar.",
  },
};

const CHECKLIST_META: Array<{
  id: ChecklistGroupId;
  title: string;
  description: string;
  accent: string;
}> = [
  {
    id: "deploy",
    title: "Deploy checklist",
    description: "Tudo o que precisa estar pronto para apertar publish sem surpresa operacional.",
    accent: "rgba(47,107,114,0.14)",
  },
  {
    id: "assets",
    title: "Launch assets",
    description: "As pecas de comunicacao que tornam o lancamento legivel para a audiencia certa.",
    accent: "rgba(124,63,88,0.14)",
  },
  {
    id: "demo",
    title: "Demo e script",
    description: "Prepara a narrativa do produto para explicar o valor sem depender de memoria ou sorte.",
    accent: "rgba(201,125,59,0.14)",
  },
  {
    id: "proof",
    title: "Proof of launch",
    description: "Guarda as provas da release para review, retro e distribuicao interna.",
    accent: "rgba(77,107,60,0.14)",
  },
];

function makeItem(id: string, label: string, done = false, note = ""): ChecklistItem {
  return { id, label, done, note };
}

function createInitialState(): LaunchState {
  return {
    productName: "Launch Console do MVP",
    owner: "",
    channel: "Demo interna + post curto + link direto",
    targetDate: "",
    primaryUrl: "",
    status: "a-preparar",
    shippingRule:
      "Lancar quando a proposta de valor estiver clara, o caminho principal funcionar ponta a ponta e existir rollback simples se algo falhar.",
    audienceNote:
      "Falar primeiro com quem sente a dor agora. Nao tentar agradar toda a gente no mesmo lancamento.",
    successSignal:
      "As pessoas certas entendem o produto em menos de 60 segundos e conseguem abrir, testar ou responder ao CTA sem ajuda.",
    riskNote:
      "Evitar ship por ansiedade. Se a falha quebra onboarding, demo ou credibilidade, parar e corrigir.",
    rollbackPlan:
      "Se a release falhar, remover o CTA publico, voltar ao build anterior e publicar nota curta com novo ETA.",
    postLaunchNextStep: "Recolher feedback nas primeiras 24h e transformar sinais em proxima iteracao objetiva.",
    summaryHeadline: "Lancamento pequeno, claro e intencional.",
    summaryBody:
      "O foco desta release e provar utilidade real com um fluxo principal estavel, mensagem clara e evidencia suficiente para aprender rapido.",
    proofLinks: "",
    proofNotes:
      "Guardar screenshot, URL publicada, horario, post, respostas iniciais e qualquer bug observado nos primeiros minutos.",
    checklists: {
      deploy: [
        makeItem("deploy-1", "Fluxo principal validado no ambiente certo", true, "Rever o caminho mais importante do utilizador."),
        makeItem("deploy-2", "URL final e CTA confirmados", false, "Nada de links temporarios esquecidos."),
        makeItem("deploy-3", "Observabilidade minima ativa", false, "Logs, analytics ou outro sinal minimo para ver o que acontece."),
        makeItem("deploy-4", "Plano de rollback escrito", false, "Decidir como recuar antes de precisar de recuar."),
      ],
      assets: [
        makeItem("assets-1", "Titulo e mensagem principal aprovados", true, "A promessa precisa ser especifica e curta."),
        makeItem("assets-2", "Screenshot, GIF ou imagem hero prontos", false, "Mostrar o produto real, nao slides vazios."),
        makeItem("assets-3", "Post de lancamento preparado", false, "Versao curta para publicar sem reescrever em cima da hora."),
        makeItem("assets-4", "FAQ ou objecoes basicas respondidas", false, "Antecipar as duas perguntas mais provaveis."),
      ],
      demo: [
        makeItem("demo-1", "Script com opening, valor e CTA", true, "A primeira frase deve explicar para quem isto serve."),
        makeItem("demo-2", "Conta, seed ou dados de demo prontos", false, "Evitar setup manual durante a apresentacao."),
        makeItem("demo-3", "Plano B para internet, auth ou bug visual", false, "Ter screenshot ou video curto de reserva."),
        makeItem("demo-4", "Pergunta final para recolher feedback", false, "Fechar com um pedido de resposta concreto."),
      ],
      proof: [
        makeItem("proof-1", "Screenshot da app publicada guardado", false, "Idealmente com data, hora e URL visiveis."),
        makeItem("proof-2", "Link do post ou anuncio guardado", false, "Guardar o URL exato da publicacao."),
        makeItem("proof-3", "Primeiras respostas ou metricas registadas", false, "Mesmo que sejam poucas, anotar logo."),
        makeItem("proof-4", "Resumo de aprendizagem pos-launch escrito", false, "O que funcionou, o que falhou e o que muda agora."),
      ],
    },
  };
}

function createEmptyChecklistItem(groupId: ChecklistGroupId): ChecklistItem {
  return {
    id: `${groupId}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    label: "",
    done: false,
    note: "",
  };
}

function buildLaunchSummary(state: LaunchState) {
  const completedByGroup = CHECKLIST_META.map((group) => {
    const items = state.checklists[group.id];
    const done = items.filter((item) => item.done).length;
    return `- ${group.title}: ${done}/${items.length} fechado(s)`;
  });

  const openItems = CHECKLIST_META.flatMap((group) =>
    state.checklists[group.id]
      .filter((item) => !item.done && item.label.trim().length > 0)
      .map((item) => `- [${group.title}] ${item.label}: ${item.note.trim() || "pendente"}`),
  );

  const proofItems = state.checklists.proof
    .filter((item) => item.done && item.label.trim().length > 0)
    .map((item) => `- ${item.label}: ${item.note.trim() || "ok"}`);

  return [
    "# Launch summary",
    "",
    `Produto: ${state.productName || "n/d"}`,
    `Owner: ${state.owner || "n/d"}`,
    `Estado: ${STATUS_META[state.status].label}`,
    `Canal: ${state.channel || "n/d"}`,
    `Data alvo: ${state.targetDate || "n/d"}`,
    `URL principal: ${state.primaryUrl || "n/d"}`,
    "",
    `Headline: ${state.summaryHeadline || "n/d"}`,
    `Mensagem: ${state.summaryBody || "n/d"}`,
    `Regra de shipping: ${state.shippingRule || "n/d"}`,
    `Audiencia: ${state.audienceNote || "n/d"}`,
    `Sinal de sucesso: ${state.successSignal || "n/d"}`,
    `Risco principal: ${state.riskNote || "n/d"}`,
    `Rollback: ${state.rollbackPlan || "n/d"}`,
    `Proximo passo pos-launch: ${state.postLaunchNextStep || "n/d"}`,
    "",
    "Progresso por checklist:",
    ...completedByGroup,
    "",
    "Pendencias ativas:",
    ...(openItems.length ? openItems : ["- Sem pendencias ativas."]),
    "",
    "Provas registadas:",
    ...(proofItems.length ? proofItems : ["- Ainda sem provas fechadas."]),
    `- Links de prova: ${state.proofLinks || "n/d"}`,
    `- Notas de prova: ${state.proofNotes || "n/d"}`,
  ].join("\n");
}

export function Day10LaunchConsole() {
  const [state, setState] = useState<LaunchState>(() => {
    if (typeof window === "undefined") {
      return createInitialState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as LaunchState) : createInitialState();
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

  const statusMeta = STATUS_META[state.status];

  const totals = useMemo(() => {
    const items = CHECKLIST_META.flatMap((group) => state.checklists[group.id]);
    const done = items.filter((item) => item.done).length;
    return {
      total: items.length,
      done,
      percent: items.length ? Math.round((done / items.length) * 100) : 0,
    };
  }, [state.checklists]);

  const summary = useMemo(() => buildLaunchSummary(state), [state]);

  function setField<Key extends keyof LaunchState>(key: Key, value: LaunchState[Key]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function setStatus(status: LaunchStatus) {
    setState((current) => ({ ...current, status }));
  }

  function updateChecklistItem(
    groupId: ChecklistGroupId,
    itemId: string,
    patch: Partial<ChecklistItem>,
  ) {
    setState((current) => ({
      ...current,
      checklists: {
        ...current.checklists,
        [groupId]: current.checklists[groupId].map((item) =>
          item.id === itemId ? { ...item, ...patch } : item,
        ),
      },
    }));
  }

  function addChecklistItem(groupId: ChecklistGroupId) {
    setState((current) => ({
      ...current,
      checklists: {
        ...current.checklists,
        [groupId]: [...current.checklists[groupId], createEmptyChecklistItem(groupId)],
      },
    }));
  }

  function removeChecklistItem(groupId: ChecklistGroupId, itemId: string) {
    setState((current) => ({
      ...current,
      checklists: {
        ...current.checklists,
        [groupId]: current.checklists[groupId].filter((item) => item.id !== itemId),
      },
    }));
  }

  async function copySummary() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Lab Dia 10
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Preparar, lancar e provar o ship com menos ruido e mais intencao.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            Esta console junta readiness de deploy, ativos de lancamento, guiao de demo, prova da
            publicacao e um resumo copiavel para partilhar o que saiu e o que vem a seguir.
          </p>
        </div>

        <button
          type="button"
          onClick={copySummary}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
        >
          {copied ? "Resumo copiado" : "Copiar launch summary"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="Readiness" value={`${totals.percent}%`} />
            <MetricCard label="Itens fechados" value={`${totals.done}/${totals.total}`} />
            <MetricCard label="Estado atual" value={statusMeta.label} />
          </div>

          <div
            className="rounded-[1.3rem] border p-4"
            style={{ borderColor: statusMeta.tone, backgroundColor: statusMeta.panel }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: statusMeta.tone }}>
                  Shipping intencional
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{statusMeta.label}</p>
              </div>
              <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: statusMeta.tone }} />
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{statusMeta.helper}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(STATUS_META) as LaunchStatus[]).map((statusId) => {
                const active = state.status === statusId;
                return (
                  <button
                    key={statusId}
                    type="button"
                    onClick={() => setStatus(statusId)}
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
              Contexto do lancamento
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field
                label="Produto"
                value={state.productName}
                onChange={(value) => setField("productName", value)}
                placeholder="Nome do produto ou release"
              />
              <Field
                label="Owner"
                value={state.owner}
                onChange={(value) => setField("owner", value)}
                placeholder="Quem carrega o ship"
              />
              <Field
                label="Canal principal"
                value={state.channel}
                onChange={(value) => setField("channel", value)}
                placeholder="Product Hunt, demo, email, post..."
              />
              <Field
                label="Data alvo"
                value={state.targetDate}
                onChange={(value) => setField("targetDate", value)}
                placeholder="2026-03-10 09:00"
              />
              <div className="sm:col-span-2">
                <Field
                  label="URL principal"
                  value={state.primaryUrl}
                  onChange={(value) => setField("primaryUrl", value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextPanel
              title="Regra de shipping"
              helper="Qual e o criterio minimo para lancar sem autoenganar a equipa."
              value={state.shippingRule}
              onChange={(value) => setField("shippingRule", value)}
              placeholder="O que precisa ser verdade para shippar hoje"
            />
            <TextPanel
              title="Audiencia certa"
              helper="Quem deve ver esta release primeiro e por que razao."
              value={state.audienceNote}
              onChange={(value) => setField("audienceNote", value)}
              placeholder="Quem sente a dor agora"
            />
            <TextPanel
              title="Sinal de sucesso"
              helper="O que conta como resposta boa nas primeiras horas."
              value={state.successSignal}
              onChange={(value) => setField("successSignal", value)}
              placeholder="Click, reply, signup, pedido de demo..."
            />
            <TextPanel
              title="Risco e rollback"
              helper="Escrever isto antes do ship reduz drama depois do ship."
              value={`${state.riskNote}\n\nRollback: ${state.rollbackPlan}`}
              onChange={(value) => {
                const [riskLine, ...rest] = value.split("\n\nRollback: ");
                setState((current) => ({
                  ...current,
                  riskNote: riskLine,
                  rollbackPlan: rest.join("\n\nRollback: "),
                }));
              }}
              placeholder="Risco principal...\n\nRollback: plano de recuo..."
            />
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Launch summary copiavel
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Pronto para partilhar no chat da equipa, no repo ou na nota de release.
                </p>
              </div>
              <button
                type="button"
                onClick={copySummary}
                className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
              >
                {copied ? "Texto copiado" : "Copiar resumo"}
              </button>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-xs leading-6 text-[var(--foreground)]">
              {summary}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          {CHECKLIST_META.map((group) => {
            const items = state.checklists[group.id];
            const done = items.filter((item) => item.done).length;

            return (
              <section key={group.id} className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                      {group.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{group.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]"
                      style={{ backgroundColor: group.accent }}
                    >
                      {done}/{items.length} fechado(s)
                    </span>
                    <button
                      type="button"
                      onClick={() => addChecklistItem(group.id)}
                      className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
                    >
                      Adicionar item
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <ChecklistCard
                      key={item.id}
                      item={item}
                      accent={group.accent}
                      onToggle={() => updateChecklistItem(group.id, item.id, { done: !item.done })}
                      onLabelChange={(value) => updateChecklistItem(group.id, item.id, { label: value })}
                      onNoteChange={(value) => updateChecklistItem(group.id, item.id, { note: value })}
                      onRemove={() => removeChecklistItem(group.id, item.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <div className="grid gap-4 md:grid-cols-2">
            <TextPanel
              title="Mensagem do lancamento"
              helper="Headline e paragrafo curto para o pitch publico ou interno."
              value={`${state.summaryHeadline}\n\n${state.summaryBody}`}
              onChange={(value) => {
                const [headline, ...body] = value.split("\n\n");
                setState((current) => ({
                  ...current,
                  summaryHeadline: headline,
                  summaryBody: body.join("\n\n"),
                }));
              }}
              placeholder="Headline curta...\n\nMensagem principal..."
            />
            <TextPanel
              title="Prova do lancamento"
              helper="Guardar links, notas e sinais imediatos apos a publicacao."
              value={`Links: ${state.proofLinks}\n\nNotas: ${state.proofNotes}`}
              onChange={(value) => {
                const [linksLine, ...rest] = value.split("\n\nNotas: ");
                const links = linksLine.replace(/^Links:\s*/, "");
                setState((current) => ({
                  ...current,
                  proofLinks: links,
                  proofNotes: rest.join("\n\nNotas: "),
                }));
              }}
              placeholder="Links: URL do post, screenshot, analytics...\n\nNotas: o que ficou provado"
            />
          </div>

          <TextPanel
            title="Proximo passo pos-launch"
            helper="Fecha o loop: que acao concreta sai desta release nas proximas 24 horas."
            value={state.postLaunchNextStep}
            onChange={(value) => setField("postLaunchNextStep", value)}
            placeholder="Quem responde, o que medir e o que ajustar depois do ship"
          />
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

function ChecklistCard({
  item,
  accent,
  onToggle,
  onLabelChange,
  onNoteChange,
  onRemove,
}: {
  item: ChecklistItem;
  accent: string;
  onToggle: () => void;
  onLabelChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onRemove: () => void;
}) {
  return (
    <article className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition"
            style={{
              borderColor: item.done ? "var(--accent)" : "var(--border)",
              backgroundColor: item.done ? "var(--accent)" : "white",
              color: item.done ? "white" : "var(--foreground)",
            }}
          >
            {item.done ? "OK" : "-"}
          </button>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]"
            style={{ backgroundColor: accent }}
          >
            {item.done ? "Fechado" : "Pendente"}
          </span>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition hover:border-[var(--accent-soft)]"
        >
          Remover
        </button>
      </div>

      <label className="mt-3 block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          Item
        </span>
        <input
          value={item.label}
          onChange={(event) => onLabelChange(event.target.value)}
          placeholder="Escrever criterio, ativo ou prova"
          className="mt-2 w-full rounded-[0.9rem] border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          Nota
        </span>
        <textarea
          value={item.note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Contexto, link, owner ou detalhe importante"
          className="mt-2 min-h-24 w-full rounded-[0.9rem] border border-[var(--border)] bg-white px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
        />
      </label>
    </article>
  );
}
