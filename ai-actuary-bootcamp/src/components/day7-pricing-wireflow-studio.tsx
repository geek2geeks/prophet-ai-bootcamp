"use client";

import { useEffect, useMemo, useState } from "react";

type JourneyStage = {
  id: string;
  stage: string;
  userMoment: string;
  productMove: string;
  friction: string;
  metric: string;
};

type PricingPlan = {
  id: string;
  name: string;
  price: string;
  audience: string;
  promise: string;
  includes: string;
  rationale: string;
};

type CopyHook = {
  id: string;
  angle: string;
  headline: string;
  proof: string;
  cta: string;
};

type PricingWireflowStudioState = {
  productName: string;
  positioning: string;
  targetCustomer: string;
  launchGoal: string;
  offerGuardrail: string;
  stages: JourneyStage[];
  plans: PricingPlan[];
  hooks: CopyHook[];
};

const STORAGE_KEY = "aibootcamp-day7-pricing-wireflow-studio-v1";

function createJourneyStage(stage: Partial<JourneyStage> = {}): JourneyStage {
  return {
    id: stage.id ?? `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    stage: stage.stage ?? "",
    userMoment: stage.userMoment ?? "",
    productMove: stage.productMove ?? "",
    friction: stage.friction ?? "",
    metric: stage.metric ?? "",
  };
}

function createPricingPlan(plan: Partial<PricingPlan> = {}): PricingPlan {
  return {
    id: plan.id ?? `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: plan.name ?? "",
    price: plan.price ?? "",
    audience: plan.audience ?? "",
    promise: plan.promise ?? "",
    includes: plan.includes ?? "",
    rationale: plan.rationale ?? "",
  };
}

function createCopyHook(hook: Partial<CopyHook> = {}): CopyHook {
  return {
    id: hook.id ?? `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    angle: hook.angle ?? "",
    headline: hook.headline ?? "",
    proof: hook.proof ?? "",
    cta: hook.cta ?? "",
  };
}

function createInitialState(): PricingWireflowStudioState {
  return {
    productName: "Pricing Wireflow Studio",
    positioning:
      "Ferramenta de planeamento para founders e equipas pequenas que precisam desenhar jornada, embalagem comercial e copy de lancamento antes de construir o MVP.",
    targetCustomer:
      "Founder B2B com produto AI vertical que precisa sair de demo bonita para oferta clara, pagina vendavel e backlog executavel.",
    launchGoal:
      "Fechar uma primeira oferta paga com jornada simples, tres opcoes de pricing e mensagem que explique valor sem depender de call longa.",
    offerGuardrail:
      "Vender transformacao concreta e tempo poupado, nao promessas vagas de AI magica ou automacao total.",
    stages: [
      createJourneyStage({
        id: "discover",
        stage: "Descoberta",
        userMoment: "O lead percebe que a equipa perde horas a montar propostas e pricing manualmente.",
        productMove: "Mostrar dor operacional, exemplo de output e promessa de decisao mais rapida.",
        friction: "Ceticismo: parece mais uma ferramenta de notas ou consultoria disfarcada.",
        metric: "CTR da pagina ou replies positivas a outreach inicial.",
      }),
      createJourneyStage({
        id: "evaluate",
        stage: "Avaliacao",
        userMoment: "O lead quer perceber se o produto encaixa no seu processo comercial atual.",
        productMove: "Explicar onboarding, input minimo e comparacao entre antes e depois.",
        friction: "Duvida sobre setup, dados necessarios e rapidez para ver valor.",
        metric: "Pedidos de demo, qualificacao ou tempo ate primeira sessao.",
      }),
      createJourneyStage({
        id: "activate",
        stage: "Ativacao",
        userMoment: "O cliente carrega contexto, escolhe plano e tenta produzir o primeiro deliverable.",
        productMove: "Guiar setup com defaults, checklist curta e primeira vitoria em menos de 20 minutos.",
        friction: "Se o primeiro artefacto sair fraco, a percecao de valor cai imediatamente.",
        metric: "Tempo ate primeiro output aproveitavel.",
      }),
      createJourneyStage({
        id: "expand",
        stage: "Expansao",
        userMoment: "A conta tenta repetir o fluxo com mais colegas, mais casos e pacotes maiores.",
        productMove: "Mostrar upgrade claro, templates reutilizaveis e governance minima.",
        friction: "Sem razao economica forte, o cliente fica preso no plano de entrada.",
        metric: "Upgrade rate ou uso recorrente por equipa.",
      }),
    ],
    plans: [
      createPricingPlan({
        id: "starter",
        name: "Starter",
        price: "EUR149/mes",
        audience: "Founder solo ou equipa muito pequena a validar o primeiro workflow.",
        promise: "Transformar um processo comercial caotico numa rotina repetivel sem contratar mais pessoas no inicio.",
        includes: "1 workspace, templates base, historico curto, export manual e onboarding assinado em produto.",
        rationale: "Entrada baixa para reduzir friccao e provar valor antes de pedir compromisso maior.",
      }),
      createPricingPlan({
        id: "growth",
        name: "Growth",
        price: "EUR499/mes",
        audience: "Equipa de vendas ou ops com uso semanal e necessidade de consistencia entre varios casos.",
        promise: "Ganhar velocidade operacional e padronizar output sem perder controlo do pricing.",
        includes: "5 seats, biblioteca partilhada, export premium, revisao de runs e suporte prioritario.",
        rationale: "Plano ancora com melhor margem e narrativa clara de ROI por equipa.",
      }),
      createPricingPlan({
        id: "pilot",
        name: "Pilot Assistido",
        price: "EUR2900 setup + EUR790/mes",
        audience: "Conta com processo sensivel que quer ajuda no desenho inicial e rollout guiado.",
        promise: "Ir do caos para uma oferta operavel em poucas semanas com apoio proximo.",
        includes: "Workshop inicial, configuracao assistida, artefactos de lancamento e checkpoint executivo.",
        rationale: "Captura clientes que compram velocidade, confianca e traducao para contexto real.",
      }),
    ],
    hooks: [
      createCopyHook({
        id: "hook-1",
        angle: "Dor operacional",
        headline: "Pare de discutir pricing em folhas soltas e calls interminaveis.",
        proof: "Mostra como a equipa sai de inputs dispersos para uma oferta comparavel e explicavel.",
        cta: "Ver o wireflow comercial",
      }),
      createCopyHook({
        id: "hook-2",
        angle: "Tempo para valor",
        headline: "Do briefing ao primeiro pacote vendavel em menos de uma tarde.",
        proof: "Enfatiza setup guiado, templates iniciais e output pronto para rever com a equipa.",
        cta: "Testar o primeiro fluxo",
      }),
      createCopyHook({
        id: "hook-3",
        angle: "Confianca comercial",
        headline: "Venda clareza antes de vender mais automacao.",
        proof: "Posiciona a ferramenta como mecanismo de decisao, nao como AI opaca que inventa numeros.",
        cta: "Montar a oferta",
      }),
    ],
  };
}

export function buildDay7PricingWireflowBrief(state: PricingWireflowStudioState) {
  const filledStages = state.stages.filter((stage) => {
    return [stage.stage, stage.userMoment, stage.productMove, stage.friction, stage.metric].some(
      (value) => value.trim().length > 0,
    );
  });

  const filledPlans = state.plans.filter((plan) => {
    return [plan.name, plan.price, plan.audience, plan.promise, plan.includes, plan.rationale].some(
      (value) => value.trim().length > 0,
    );
  });

  const filledHooks = state.hooks.filter((hook) => {
    return [hook.angle, hook.headline, hook.proof, hook.cta].some((value) => value.trim().length > 0);
  });

  return [
    "# Day 7 - Pricing Wireflow Studio",
    "",
    "## Contexto do produto",
    `Produto: ${state.productName}`,
    `Posicionamento: ${state.positioning}`,
    `Cliente-alvo: ${state.targetCustomer}`,
    `Objetivo de lancamento: ${state.launchGoal}`,
    `Guardrail da oferta: ${state.offerGuardrail}`,
    "",
    "## Jornada do cliente e wireflow",
    ...filledStages.flatMap((stage, index) => [
      `${index + 1}. ${stage.stage || `Etapa ${index + 1}`}`,
      `   Momento do utilizador: ${stage.userMoment || "n/d"}`,
      `   Movimento do produto: ${stage.productMove || "n/d"}`,
      `   Friccao principal: ${stage.friction || "n/d"}`,
      `   Metrica de leitura: ${stage.metric || "n/d"}`,
    ]),
    "",
    "## Opcoes de pricing",
    ...filledPlans.flatMap((plan, index) => [
      `${index + 1}. ${plan.name || `Plano ${index + 1}`} - ${plan.price || "preco por definir"}`,
      `   Publico: ${plan.audience || "n/d"}`,
      `   Promessa: ${plan.promise || "n/d"}`,
      `   Inclui: ${plan.includes || "n/d"}`,
      `   Racional: ${plan.rationale || "n/d"}`,
    ]),
    "",
    "## Hooks de lancamento",
    ...filledHooks.flatMap((hook, index) => [
      `${index + 1}. ${hook.angle || `Hook ${index + 1}`}`,
      `   Headline: ${hook.headline || "n/d"}`,
      `   Prova: ${hook.proof || "n/d"}`,
      `   CTA: ${hook.cta || "n/d"}`,
    ]),
    "",
    "## Pedido para ferramenta local de planeamento",
    "Usa este brief para propor uma landing page inicial, a estrutura do onboarding, estados do wireflow entre descoberta e ativacao, comparacao entre planos, mensagens de objecao e um backlog MVP em milestones. Mantem o produto portugues-first, sem dependencias externas e com foco em clareza comercial antes de features avancadas.",
  ].join("\n");
}

export function Day7PricingWireflowStudio() {
  const [state, setState] = useState<PricingWireflowStudioState>(() => {
    if (typeof window === "undefined") {
      return createInitialState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PricingWireflowStudioState) : createInitialState();
    } catch {
      return createInitialState();
    }
  });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      return;
    }
  }, [state]);

  const brief = useMemo(() => buildDay7PricingWireflowBrief(state), [state]);

  const readiness = useMemo(() => {
    const signals = [
      state.productName,
      state.positioning,
      state.targetCustomer,
      state.launchGoal,
      state.offerGuardrail,
      ...state.stages.flatMap((stage) => [
        stage.stage,
        stage.userMoment,
        stage.productMove,
        stage.friction,
        stage.metric,
      ]),
      ...state.plans.flatMap((plan) => [
        plan.name,
        plan.price,
        plan.audience,
        plan.promise,
        plan.includes,
        plan.rationale,
      ]),
      ...state.hooks.flatMap((hook) => [hook.angle, hook.headline, hook.proof, hook.cta]),
    ];

    const filled = signals.filter((value) => value.trim().length > 12).length;
    return Math.round((filled / signals.length) * 100);
  }, [state]);

  function updateField(
    field: "productName" | "positioning" | "targetCustomer" | "launchGoal" | "offerGuardrail",
    value: string,
  ) {
    setState((current) => ({ ...current, [field]: value }));
  }

  function updateStage(id: string, field: keyof JourneyStage, value: string) {
    setState((current) => ({
      ...current,
      stages: current.stages.map((stage) => (stage.id === id ? { ...stage, [field]: value } : stage)),
    }));
  }

  function addStage() {
    setState((current) => ({
      ...current,
      stages: [...current.stages, createJourneyStage()],
    }));
  }

  function removeStage(id: string) {
    setState((current) => ({
      ...current,
      stages: current.stages.filter((stage) => stage.id !== id),
    }));
  }

  function updatePlan(id: string, field: keyof PricingPlan, value: string) {
    setState((current) => ({
      ...current,
      plans: current.plans.map((plan) => (plan.id === id ? { ...plan, [field]: value } : plan)),
    }));
  }

  function addPlan() {
    setState((current) => ({
      ...current,
      plans: [...current.plans, createPricingPlan()],
    }));
  }

  function removePlan(id: string) {
    setState((current) => ({
      ...current,
      plans: current.plans.filter((plan) => plan.id !== id),
    }));
  }

  function updateHook(id: string, field: keyof CopyHook, value: string) {
    setState((current) => ({
      ...current,
      hooks: current.hooks.map((hook) => (hook.id === id ? { ...hook, [field]: value } : hook)),
    }));
  }

  function addHook() {
    setState((current) => ({
      ...current,
      hooks: [...current.hooks, createCopyHook()],
    }));
  }

  function removeHook(id: string) {
    setState((current) => ({
      ...current,
      hooks: current.hooks.filter((hook) => hook.id !== id),
    }));
  }

  async function copyText(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Lab Dia 7
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Fechar jornada, pricing e copy antes do lancamento do MVP.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            Este studio ajuda o estudante a ligar descoberta, ativacao e expansao a uma oferta
            vendavel. Em vez de inventar mais features, organiza o wireflow comercial, compara
            planos e sai com um brief copiavel para ferramentas locais de planeamento.
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.08),rgba(124,63,88,0.03))] px-4 py-3 text-sm text-[var(--foreground)]">
          Readiness do lancamento: {readiness}%
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldPanel
              label="Nome da oferta"
              value={state.productName}
              onChange={(value) => updateField("productName", value)}
            />
            <FieldPanel
              label="Cliente-alvo"
              value={state.targetCustomer}
              onChange={(value) => updateField("targetCustomer", value)}
            />
            <FieldPanel
              label="Posicionamento"
              value={state.positioning}
              onChange={(value) => updateField("positioning", value)}
            />
            <FieldPanel
              label="Objetivo de lancamento"
              value={state.launchGoal}
              onChange={(value) => updateField("launchGoal", value)}
            />
          </div>

          <FieldPanel
            label="Guardrail comercial"
            value={state.offerGuardrail}
            onChange={(value) => updateField("offerGuardrail", value)}
          />

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Journey e wireflow
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Mapeia o que o cliente sente, o que o produto precisa mostrar e onde a friccao
                  comercial aparece em cada etapa.
                </p>
              </div>
              <button
                type="button"
                onClick={addStage}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                Adicionar etapa
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {state.stages.map((stage, index) => (
                <JourneyStageCard
                  key={stage.id}
                  index={index}
                  stage={stage}
                  onChange={(field, value) => updateStage(stage.id, field, value)}
                  onRemove={() => removeStage(stage.id)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Perguntas de pressao
            </p>
            <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>- Onde o lead percebe valor antes de pedir uma demo longa?</p>
              <p>- O plano mais caro compra apenas mais features ou compra menos risco e mais velocidade?</p>
              <p>- A copy promete um resultado observavel ou apenas modernidade e AI?</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Opcoes de pricing
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Define planos com publico, promessa e racional. O preco sozinho nao explica a
                  embalagem.
                </p>
              </div>
              <button
                type="button"
                onClick={addPlan}
                className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
              >
                Adicionar plano
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {state.plans.map((plan, index) => (
                <PricingPlanCard
                  key={plan.id}
                  index={index}
                  plan={plan}
                  onChange={(field, value) => updatePlan(plan.id, field, value)}
                  onRemove={() => removePlan(plan.id)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Hooks de lancamento
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Prepara angulos de pagina, outreach ou demo curta com headline, prova e CTA.
                </p>
              </div>
              <button
                type="button"
                onClick={addHook}
                className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
              >
                Adicionar hook
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {state.hooks.map((hook, index) => (
                <HookCard
                  key={hook.id}
                  index={index}
                  hook={hook}
                  onChange={(field, value) => updateHook(hook.id, field, value)}
                  onRemove={() => removeHook(hook.id)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.06),rgba(124,63,88,0.1))] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Brief de build copiavel
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Bloco pronto para OpenCode, Z.ai, GitHub Spec Kit ou outra ferramenta local.
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyText("brief", brief)}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                {copied === "brief" ? "Brief copiado" : "Copiar brief"}
              </button>
            </div>

            <pre className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--border)] bg-white p-4 text-xs leading-6 text-[var(--foreground)]">
              {brief}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldPanel({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-28 w-full resize-y rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
      />
    </label>
  );
}

function JourneyStageCard({
  stage,
  index,
  onChange,
  onRemove,
}: {
  stage: JourneyStage;
  index: number;
  onChange: (field: keyof JourneyStage, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <article className="rounded-[1.1rem] border border-[var(--border)] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-[rgba(47,107,114,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
          Etapa {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition hover:border-[var(--accent-soft)]"
        >
          Remover
        </button>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <SmallField
          label="Fase"
          value={stage.stage}
          onChange={(value) => onChange("stage", value)}
          placeholder="Descoberta, avaliacao, ativacao..."
        />
        <SmallField
          label="Metrica"
          value={stage.metric}
          onChange={(value) => onChange("metric", value)}
          placeholder="CTR, demo booked, activation..."
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <LargeField
          label="Momento do utilizador"
          value={stage.userMoment}
          onChange={(value) => onChange("userMoment", value)}
          placeholder="O que o lead esta a tentar resolver nesta fase"
        />
        <LargeField
          label="Movimento do produto"
          value={stage.productMove}
          onChange={(value) => onChange("productMove", value)}
          placeholder="O que a experiencia precisa mostrar ou desbloquear"
        />
        <LargeField
          label="Friccao principal"
          value={stage.friction}
          onChange={(value) => onChange("friction", value)}
          placeholder="Duvida, medo, dependencia ou objeccao"
        />
      </div>
    </article>
  );
}

function PricingPlanCard({
  plan,
  index,
  onChange,
  onRemove,
}: {
  plan: PricingPlan;
  index: number;
  onChange: (field: keyof PricingPlan, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <article className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Plano {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition hover:border-[var(--accent-soft)]"
        >
          Remover
        </button>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <SmallField
          label="Nome do plano"
          value={plan.name}
          onChange={(value) => onChange("name", value)}
          placeholder="Starter, Growth, Assistido..."
        />
        <SmallField
          label="Preco"
          value={plan.price}
          onChange={(value) => onChange("price", value)}
          placeholder="EUR149/mes"
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <LargeField
          label="Publico"
          value={plan.audience}
          onChange={(value) => onChange("audience", value)}
          placeholder="Quem compra este plano e em que contexto"
        />
        <LargeField
          label="Promessa"
          value={plan.promise}
          onChange={(value) => onChange("promise", value)}
          placeholder="Resultado principal comprado pelo cliente"
        />
        <LargeField
          label="Inclui"
          value={plan.includes}
          onChange={(value) => onChange("includes", value)}
          placeholder="Seats, suporte, limites, outputs, onboarding..."
        />
        <LargeField
          label="Racional de pricing"
          value={plan.rationale}
          onChange={(value) => onChange("rationale", value)}
          placeholder="Porque este preco faz sentido na escada de valor"
        />
      </div>
    </article>
  );
}

function HookCard({
  hook,
  index,
  onChange,
  onRemove,
}: {
  hook: CopyHook;
  index: number;
  onChange: (field: keyof CopyHook, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <article className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-[rgba(201,125,59,0.16)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
          Hook {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition hover:border-[var(--accent-soft)]"
        >
          Remover
        </button>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <SmallField
          label="Angulo"
          value={hook.angle}
          onChange={(value) => onChange("angle", value)}
          placeholder="Dor, velocidade, confianca, ROI..."
        />
        <SmallField
          label="CTA"
          value={hook.cta}
          onChange={(value) => onChange("cta", value)}
          placeholder="Ver demo, montar oferta, pedir piloto..."
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <LargeField
          label="Headline"
          value={hook.headline}
          onChange={(value) => onChange("headline", value)}
          placeholder="Frase principal da pagina ou do outreach"
        />
        <LargeField
          label="Prova"
          value={hook.proof}
          onChange={(value) => onChange("proof", value)}
          placeholder="Razao para acreditar na promessa"
        />
      </div>
    </article>
  );
}

function SmallField({
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
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-[0.9rem] border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
      />
    </label>
  );
}

function LargeField({
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
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-24 w-full resize-y rounded-[0.9rem] border border-[var(--border)] bg-white px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
      />
    </label>
  );
}
