"use client";

import { useEffect, useMemo, useState } from "react";

type ScopeBucket = "inScope" | "outOfScope";
type OwnerId = "produto" | "atuarial" | "engenharia" | "qa";
type MatrixItemType = "risco" | "decisao";
type MatrixLevel = "alto" | "medio" | "baixo";

type OwnerCard = {
  label: string;
  owner: string;
  mission: string;
  deliverable: string;
};

type MatrixItem = {
  id: string;
  type: MatrixItemType;
  title: string;
  owner: string;
  level: MatrixLevel;
  nextStep: string;
};

export type Day5ArchitectureScopeCanvasState = {
  northStar: string;
  operatingRule: string;
  successMetric: string;
  boundaries: {
    inScope: string[];
    outOfScope: string[];
  };
  owners: Record<OwnerId, OwnerCard>;
  matrix: MatrixItem[];
};

const STORAGE_KEY = "aibootcamp-day5-architecture-scope-canvas-v1";

const OWNER_ORDER: OwnerId[] = ["produto", "atuarial", "engenharia", "qa"];

const OWNER_TITLES: Record<OwnerId, string> = {
  produto: "Dono de produto",
  atuarial: "Dono atuarial",
  engenharia: "Dono tecnico",
  qa: "Review e go-live",
};

function createInitialState(): Day5ArchitectureScopeCanvasState {
  return {
    northStar:
      "Prophet Lite deve transformar um ficheiro de assumptions validado num run reproducivel, legivel e pronto para analise sem trabalho manual escondido.",
    operatingRule:
      "Separar ingestao, validacao, execucao e reporting. Cada bloco precisa de input claro, output observavel e dono explicito.",
    successMetric:
      "Primeiro MVP aceite quando uma equipa pequena consegue correr um caso base em menos de 15 minutos com erros acionaveis e resumo final.",
    boundaries: {
      inScope: [
        "Upload local de assumptions com preview e validacao antes do run.",
        "Configuracao minima de run com versao, data de referencia e tags do caso.",
        "Execucao deterministica simples com logs, estados e resumo final do run.",
        "Export de outputs chave para analise e memo interno.",
      ],
      outOfScope: [
        "Motor Prophet completo com scripting legado e compatibilidade total.",
        "Colaboracao multiutilizador em tempo real.",
        "Orquestracao cloud, filas distribuidas ou autoscaling.",
        "OCR, parsing documental avancado ou copiloto generativo embutido no motor.",
      ],
    },
    owners: {
      produto: {
        label: OWNER_TITLES.produto,
        owner: "Founder / Product lead",
        mission: "Definir o problema de negocio, o corte de scope e o veredito de utilidade do MVP.",
        deliverable: "Lista de jobs-to-be-done, prioridade do MVP e criterio de pronto.",
      },
      atuarial: {
        label: OWNER_TITLES.atuarial,
        owner: "Actuary owner",
        mission: "Garantir que assumptions, validacoes e outputs fazem sentido tecnico para o run base.",
        deliverable: "Checklist de inputs, regras de validacao e leitura do output esperado.",
      },
      engenharia: {
        label: OWNER_TITLES.engenharia,
        owner: "Tech lead",
        mission: "Traduzir o canvas numa arquitetura pequena, testavel e observavel.",
        deliverable: "Blueprint tecnico com modulos, interfaces e plano de implementacao.",
      },
      qa: {
        label: OWNER_TITLES.qa,
        owner: "Ops / QA",
        mission: "Definir como validar erros, smoke tests e readiness antes de mostrar a clientes.",
        deliverable: "Plano de teste, cenarios de falha e checklist de release.",
      },
    },
    matrix: [
      {
        id: "matrix-1",
        type: "decisao",
        title: "Usar pipeline local-first antes de qualquer servico remoto.",
        owner: "Tech lead",
        level: "alto",
        nextStep: "Congelar os contratos entre upload, validacao e run engine.",
      },
      {
        id: "matrix-2",
        type: "risco",
        title: "Assumptions invalidas entram no motor e so falham demasiado tarde.",
        owner: "Actuary owner",
        level: "alto",
        nextStep: "Bloquear o run quando faltam colunas, ranges ou versoes obrigatorias.",
      },
      {
        id: "matrix-3",
        type: "decisao",
        title: "Mostrar estados claros de run em vez de esconder progresso tecnico.",
        owner: "Product lead",
        level: "medio",
        nextStep: "Definir 4-5 estados de sistema e respetivas mensagens.",
      },
      {
        id: "matrix-4",
        type: "risco",
        title: "Scope cresce para automacao enterprise antes do MVP provar valor.",
        owner: "Founder",
        level: "medio",
        nextStep: "Rever backlog e empurrar pedidos enterprise para fase posterior.",
      },
    ],
  };
}

export function buildDay5ArchitectureBlueprint(state: Day5ArchitectureScopeCanvasState) {
  const inScopeItems = state.boundaries.inScope.filter((item) => item.trim().length > 0);
  const outOfScopeItems = state.boundaries.outOfScope.filter((item) => item.trim().length > 0);
  const matrixItems = state.matrix.filter(
    (item) => item.title.trim().length > 0 || item.nextStep.trim().length > 0 || item.owner.trim().length > 0,
  );

  return [
    "# Prophet Lite - Canvas de Arquitetura e Scope",
    "",
    "## North Star",
    state.northStar,
    "",
    "## Regra Operacional",
    state.operatingRule,
    "",
    "## Metrica de Sucesso",
    state.successMetric,
    "",
    "## In Scope",
    ...inScopeItems.map((item) => `- ${item}`),
    "",
    "## Out of Scope",
    ...outOfScopeItems.map((item) => `- ${item}`),
    "",
    "## Roles e Owners",
    ...OWNER_ORDER.flatMap((ownerId) => {
      const card = state.owners[ownerId];
      return [
        `- ${card.label}: ${card.owner}`,
        `  Missao: ${card.mission}`,
        `  Entregavel: ${card.deliverable}`,
      ];
    }),
    "",
    "## Matriz de Riscos e Decisoes",
    ...matrixItems.flatMap((item) => [
      `- ${item.type.toUpperCase()} | ${item.level.toUpperCase()} | ${item.title}`,
      `  Dono: ${item.owner}`,
      `  Proximo passo: ${item.nextStep}`,
    ]),
    "",
    "## Prompt de Build",
    "Usa este canvas para propor a arquitetura do MVP, fronteiras entre modulos, contratos de dados, estados de erro, plano de build por milestones e testes minimos. Mantem Prophet Lite pequeno, auditavel e sem scope escondido.",
  ].join("\n");
}

export function Day5ArchitectureScopeCanvas() {
  const [state, setState] = useState<Day5ArchitectureScopeCanvasState>(() => {
    if (typeof window === "undefined") {
      return createInitialState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Day5ArchitectureScopeCanvasState) : createInitialState();
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

  const blueprint = useMemo(() => buildDay5ArchitectureBlueprint(state), [state]);

  const readiness = useMemo(() => {
    const signals = [
      state.northStar,
      state.operatingRule,
      state.successMetric,
      ...state.boundaries.inScope,
      ...state.boundaries.outOfScope,
      ...OWNER_ORDER.flatMap((ownerId) => {
        const owner = state.owners[ownerId];
        return [owner.owner, owner.mission, owner.deliverable];
      }),
      ...state.matrix.flatMap((item) => [item.title, item.owner, item.nextStep]),
    ];
    const filled = signals.filter((value) => value.trim().length > 12).length;
    return Math.round((filled / signals.length) * 100);
  }, [state]);

  function updateField(field: "northStar" | "operatingRule" | "successMetric", value: string) {
    setState((current) => ({ ...current, [field]: value }));
  }

  function updateScopeItem(bucket: ScopeBucket, index: number, value: string) {
    setState((current) => ({
      ...current,
      boundaries: {
        ...current.boundaries,
        [bucket]: current.boundaries[bucket].map((item, itemIndex) =>
          itemIndex === index ? value : item,
        ),
      },
    }));
  }

  function addScopeItem(bucket: ScopeBucket) {
    setState((current) => ({
      ...current,
      boundaries: {
        ...current.boundaries,
        [bucket]: [...current.boundaries[bucket], ""],
      },
    }));
  }

  function removeScopeItem(bucket: ScopeBucket, index: number) {
    setState((current) => ({
      ...current,
      boundaries: {
        ...current.boundaries,
        [bucket]: current.boundaries[bucket].filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function updateOwner(ownerId: OwnerId, field: keyof OwnerCard, value: string) {
    setState((current) => ({
      ...current,
      owners: {
        ...current.owners,
        [ownerId]: {
          ...current.owners[ownerId],
          [field]: value,
        },
      },
    }));
  }

  function updateMatrixItem(itemId: string, field: keyof MatrixItem, value: string) {
    setState((current) => ({
      ...current,
      matrix: current.matrix.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    }));
  }

  function addMatrixItem(type: MatrixItemType) {
    setState((current) => ({
      ...current,
      matrix: [
        ...current.matrix,
        {
          id: `${type}-${Date.now()}`,
          type,
          title: "",
          owner: "",
          level: "medio",
          nextStep: "",
        },
      ],
    }));
  }

  function removeMatrixItem(itemId: string) {
    setState((current) => ({
      ...current,
      matrix: current.matrix.filter((item) => item.id !== itemId),
    }));
  }

  async function copyBlueprint() {
    await navigator.clipboard.writeText(blueprint);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Lab Dia 5
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Fechar arquitetura e scope antes do build do Prophet Lite.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            Este canvas ajuda o estudante a decidir o que entra no MVP, quem responde por cada
            bloco e quais riscos ou decisoes precisam de dono antes de pedir um coding plan.
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.08),rgba(124,63,88,0.03))] px-4 py-3 text-sm text-[var(--foreground)]">
          Readiness do blueprint: {readiness}%
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <CanvasField
              label="North star do MVP"
              value={state.northStar}
              onChange={(value) => updateField("northStar", value)}
            />
            <CanvasField
              label="Regra operacional"
              value={state.operatingRule}
              onChange={(value) => updateField("operatingRule", value)}
            />
            <CanvasField
              label="Metrica de sucesso"
              value={state.successMetric}
              onChange={(value) => updateField("successMetric", value)}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <EditableListCard
              accent="rgba(46,113,88,0.14)"
              actionLabel="Adicionar item em scope"
              description="Tudo o que o MVP precisa para provar valor tecnico e operacional agora."
              items={state.boundaries.inScope}
              onAdd={() => addScopeItem("inScope")}
              onChange={(index, value) => updateScopeItem("inScope", index, value)}
              onRemove={(index) => removeScopeItem("inScope", index)}
              title="In scope"
            />
            <EditableListCard
              accent="rgba(201,125,59,0.14)"
              actionLabel="Adicionar item fora do scope"
              description="Tudo o que pode parecer sedutor, mas deve ficar fora para proteger foco e prazo."
              items={state.boundaries.outOfScope}
              onAdd={() => addScopeItem("outOfScope")}
              onChange={(index, value) => updateScopeItem("outOfScope", index, value)}
              onRemove={(index) => removeScopeItem("outOfScope", index)}
              title="Out of scope"
            />
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Perguntas de corte
            </p>
            <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>- Se esta parte falhar, o aluno ainda consegue correr um caso base e explicar o resultado?</p>
              <p>- O bloco precisa mesmo de AI agora ou o valor vem primeiro de pipeline, validacao e UX clara?</p>
              <p>- Existe um dono real para o modulo, para a regra e para o criterio de aceite?</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Roles e owner cards
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Cada papel precisa de dono, missao e entregavel antes de abrir o editor.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {OWNER_ORDER.map((ownerId) => {
                const card = state.owners[ownerId];

                return (
                  <OwnerFieldCard
                    key={ownerId}
                    card={card}
                    onChange={(field, value) => updateOwner(ownerId, field, value)}
                  />
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Matriz de riscos e decisoes
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Mantem a matriz simples: o que exige decisao, o que pode explodir e qual o proximo passo.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => addMatrixItem("decisao")}
                  className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
                >
                  Adicionar decisao
                </button>
                <button
                  type="button"
                  onClick={() => addMatrixItem("risco")}
                  className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
                >
                  Adicionar risco
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {state.matrix.map((item) => (
                <MatrixCard
                  key={item.id}
                  item={item}
                  onChange={(field, value) => updateMatrixItem(item.id, field, value)}
                  onRemove={() => removeMatrixItem(item.id)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.06),rgba(124,63,88,0.1))] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Blueprint exportavel
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Bloco pronto para OpenCode, Z.ai ou outra ferramenta local.
                </p>
              </div>
              <button
                type="button"
                onClick={copyBlueprint}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                {copied ? "Blueprint copiado" : "Copiar blueprint"}
              </button>
            </div>

            <pre className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--border)] bg-white p-4 text-xs leading-6 text-[var(--foreground)]">
              {blueprint}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function CanvasField({
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
        className="mt-3 min-h-32 w-full resize-y rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
      />
    </label>
  );
}

function EditableListCard({
  title,
  description,
  items,
  actionLabel,
  accent,
  onAdd,
  onChange,
  onRemove,
}: {
  title: string;
  description: string;
  items: string[];
  actionLabel: string;
  accent: string;
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <section className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {title}
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{description}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition"
          style={{ backgroundColor: accent }}
        >
          {actionLabel}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
            <textarea
              value={item}
              onChange={(event) => onChange(index, event.target.value)}
              className="min-h-24 w-full resize-y rounded-[0.9rem] border border-[var(--border)] bg-white px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition hover:border-[var(--accent-soft)]"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function OwnerFieldCard({
  card,
  onChange,
}: {
  card: OwnerCard;
  onChange: (field: keyof OwnerCard, value: string) => void;
}) {
  return (
    <article className="rounded-[1.15rem] border border-[var(--border)] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        {card.label}
      </p>

      <label className="mt-3 block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          Dono
        </span>
        <input
          value={card.owner}
          onChange={(event) => onChange("owner", event.target.value)}
          className="mt-2 w-full rounded-[0.9rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          Missao
        </span>
        <textarea
          value={card.mission}
          onChange={(event) => onChange("mission", event.target.value)}
          className="mt-2 min-h-24 w-full resize-y rounded-[0.9rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          Entregavel
        </span>
        <textarea
          value={card.deliverable}
          onChange={(event) => onChange("deliverable", event.target.value)}
          className="mt-2 min-h-24 w-full resize-y rounded-[0.9rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
        />
      </label>
    </article>
  );
}

function MatrixCard({
  item,
  onChange,
  onRemove,
}: {
  item: MatrixItem;
  onChange: (field: keyof MatrixItem, value: string) => void;
  onRemove: () => void;
}) {
  const badgeColor =
    item.type === "risco"
      ? "rgba(201,125,59,0.16)"
      : "rgba(47,107,114,0.14)";

  return (
    <article className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]"
          style={{ backgroundColor: badgeColor }}
        >
          {item.type}
        </span>
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
          Tema
        </span>
        <textarea
          value={item.title}
          onChange={(event) => onChange("title", event.target.value)}
          className="mt-2 min-h-24 w-full resize-y rounded-[0.9rem] border border-[var(--border)] bg-white px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
        />
      </label>

      <div className="mt-3 grid gap-3 md:grid-cols-[0.8fr_0.4fr]">
        <label>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            Dono
          </span>
          <input
            value={item.owner}
            onChange={(event) => onChange("owner", event.target.value)}
            className="mt-2 w-full rounded-[0.9rem] border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
          />
        </label>

        <label>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            Nivel
          </span>
          <select
            value={item.level}
            onChange={(event) => onChange("level", event.target.value)}
            className="mt-2 w-full rounded-[0.9rem] border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
          >
            <option value="alto">Alto</option>
            <option value="medio">Medio</option>
            <option value="baixo">Baixo</option>
          </select>
        </label>
      </div>

      <label className="mt-3 block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          Proximo passo
        </span>
        <textarea
          value={item.nextStep}
          onChange={(event) => onChange("nextStep", event.target.value)}
          className="mt-2 min-h-24 w-full resize-y rounded-[0.9rem] border border-[var(--border)] bg-white px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
        />
      </label>
    </article>
  );
}
