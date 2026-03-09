"use client";

import { useEffect, useMemo, useState } from "react";

import { GlossaryText } from "@/components/glossary-text";
import { DAY3_GLOSSARY } from "@/lib/day3-glossary";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ContractId = "json" | "csv" | "yaml" | "api";

type FieldItem = {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  note: string;
};

type ContractDraft = {
  title: string;
  objective: string;
  contractBlock: string;
  payloadBlock: string;
  method: string;
  path: string;
  headersBlock: string;
  responseStatus: string;
  responseBlock: string;
  checklist: FieldItem[];
};

type SandboxState = {
  activeContract: ContractId;
  drafts: Record<ContractId, ContractDraft>;
};

type Day3Step = {
  title: string;
  body: string;
};

const STORAGE_KEY = "aibootcamp-day3-schema-api-sandbox-v2";

const DAY3_STEPS: Day3Step[] = [
  {
    title: "1. Abrir os ficheiros",
    body: "Descarrega os quatro ficheiros do dia e olha para as colunas antes de mexer no sandbox.",
  },
  {
    title: "2. Escolher um formato",
    body: "Comeca por um contrato de cada vez: CSV, JSON, YAML ou API request.",
  },
  {
    title: "3. Explicar entradas e saidas",
    body: "O foco do dia e dizer com clareza o que entra, o que sai e o que deve falhar cedo.",
  },
  {
    title: "4. Passar ao agente",
    body: "Quando o contract.md estiver claro, copia o prompt para o OpenCode e pede revisao.",
  },
];

const DAY3_BEGINNER_NOTES = [
  "Nao precisas de saber programar APIs; precisas de saber ler um pedido e uma resposta.",
  "Quando vires JSON ou YAML, pensa apenas em campos, obrigatorios e exemplos.",
  "Se um termo tecnico te travar, passa o rato por cima quando estiver destacado.",
];

const DAY3_TERMINAL_STEPS = [
  {
    title: "1. Abrir a pasta e preparar o trabalho",
    body: "Cria uma pasta local para o Dia 3 e trabalha la com os ficheiros descarregados.",
    commands: ["mkdir dia3-dados-e-apis", "cd dia3-dados-e-apis"],
  },
  {
    title: "2. Pedir ao agente uma leitura simples dos ficheiros",
    body: "Nao abras tudo manualmente se nao quiseres. Podes pedir ao agente para resumir colunas e regras basicas.",
    commands: [
      "Abre os ficheiros carteira_apolices_vida.csv, tabua_mortalidade_CSO2017.csv, taxas_resgate.csv e yield_curve_ECB.csv. Para cada um, diz-me: que colunas tem, para que serve no produto e 3 erros basicos que devo validar cedo.",
    ],
  },
  {
    title: "3. Pedir ao agente um contract pack inicial",
    body: "Depois de perceberes os ficheiros, pede uma primeira versao dos contratos do dia.",
    commands: [
      "Cria um primeiro draft de model_points.json, assumptions_schema.json e run_result.json. Mantem linguagem simples, mostra campos obrigatorios, tipos e um exemplo minimo para cada ficheiro.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Contract definitions
// ---------------------------------------------------------------------------

const CONTRACT_META: Record<
  ContractId,
  { label: string; format: string; summary: string; focus: string }
> = {
  json: {
    label: "JSON contract",
    format: "JSON",
    summary: "Pensar em campos, tipos, obrigatoriedade e exemplo minimo antes da chamada.",
    focus: "Bom para payloads estruturados, validacao e respostas previsiveis.",
  },
  csv: {
    label: "CSV import",
    format: "CSV",
    summary: "Treinar colunas, ordem, separador e regras de limpeza antes do parse.",
    focus: "Bom para lotes, uploads e dados vindos de Excel ou parceiros.",
  },
  yaml: {
    label: "YAML config",
    format: "YAML",
    summary: "Organizar configuracao legivel para humanos sem perder contrato tecnico.",
    focus: "Bom para ficheiros de setup, pipelines e parametros de ambiente.",
  },
  api: {
    label: "API request",
    format: "HTTP",
    summary: "Juntar contrato, pedido, headers e resposta numa primeira experiencia de API.",
    focus: "Bom para ligar frontend, backend e ferramentas locais com menos adivinhacao.",
  },
};

function createInitialDrafts(): Record<ContractId, ContractDraft> {
  return {
    json: {
      title: "Criar proposta de simulacao",
      objective: "Definir um payload minimo para abrir uma simulacao sem mandar campos irrelevantes ou mal tipados.",
      contractBlock: `{
  "type": "object",
  "required": ["policy_id", "effective_date", "premium"],
  "properties": {
    "policy_id": { "type": "string", "example": "POL-2026-001" },
    "effective_date": { "type": "string", "format": "date" },
    "premium": { "type": "number", "minimum": 0 },
    "currency": { "type": "string", "enum": ["EUR", "USD"] },
    "channel": { "type": "string" }
  }
}`,
      payloadBlock: `{
  "policy_id": "POL-2026-001",
  "effective_date": "2026-04-01",
  "premium": 1240.5,
  "currency": "EUR",
  "channel": "broker"
}`,
      method: "POST",
      path: "/api/quotes",
      headersBlock: `Content-Type: application/json\nX-Client: bootcamp-day3`,
      responseStatus: "201 Created",
      responseBlock: `{
  "quote_id": "Q-88421",
  "status": "accepted",
  "next_step": "run_pricing"
}`,
      checklist: [
        { id: "policy_id", label: "policy_id", required: true, checked: true, note: "Identificador unico" },
        { id: "effective_date", label: "effective_date", required: true, checked: true, note: "Formato date" },
        { id: "premium", label: "premium", required: true, checked: true, note: "Numero positivo" },
        { id: "currency", label: "currency", required: false, checked: false, note: "Default EUR?" },
        { id: "channel", label: "channel", required: false, checked: false, note: "Opcional mas util para analytics" },
      ],
    },
    csv: {
      title: "Importar assumptions de mortalidade",
      objective: "Especificar um CSV claro antes de discutir parser, validacao e mensagens de erro.",
      contractBlock: `age,gender,qx,table_code
30,M,0.00071,PT_BASE_2026
31,M,0.00074,PT_BASE_2026
32,F,0.00039,PT_BASE_2026`,
      payloadBlock: `file_name: mortality_q2.csv
delimiter: comma
encoding: utf-8
has_header: true
expected_rows: 120`,
      method: "POST",
      path: "/api/assumptions/upload",
      headersBlock: `Content-Type: text/csv\nX-Assumption-Type: mortality`,
      responseStatus: "202 Accepted",
      responseBlock: `{
  "upload_id": "UP-203",
  "status": "queued",
  "validation_errors": []
}`,
      checklist: [
        { id: "age", label: "age", required: true, checked: true, note: "Inteiro entre 0 e 120" },
        { id: "gender", label: "gender", required: true, checked: true, note: "M ou F" },
        { id: "qx", label: "qx", required: true, checked: true, note: "Numero entre 0 e 1" },
        { id: "table_code", label: "table_code", required: true, checked: false, note: "Versao da tabela" },
        { id: "segment", label: "segment", required: false, checked: false, note: "Opcional para produto" },
      ],
    },
    yaml: {
      title: "Config local de pipeline",
      objective: "Desenhar um ficheiro de configuracao que a equipa consegue rever no repo sem depender de UI.",
      contractBlock: `pipeline:
  source: local-drop
  parser: pdfplumber
  chunk_size: 1200
  redact_pii: true
alerts:
  slack_channel: ops-review
  notify_on_failure: true`,
      payloadBlock: `pipeline:
  source: local-drop
  parser: pdfplumber
  chunk_size: 1200
  redact_pii: true`,
      method: "PUT",
      path: "/api/pipeline/config",
      headersBlock: `Content-Type: application/yaml\nX-Mode: draft`,
      responseStatus: "200 OK",
      responseBlock: `{
  "status": "saved",
  "reload_required": false,
  "config_version": "v3"
}`,
      checklist: [
        { id: "source", label: "pipeline.source", required: true, checked: true, note: "Origem local ou remota" },
        { id: "parser", label: "pipeline.parser", required: true, checked: true, note: "Motor esperado" },
        { id: "chunk_size", label: "pipeline.chunk_size", required: true, checked: false, note: "Numero > 0" },
        { id: "redact_pii", label: "pipeline.redact_pii", required: true, checked: true, note: "Boolean" },
        { id: "slack", label: "alerts.slack_channel", required: false, checked: false, note: "So se houver alertas" },
      ],
    },
    api: {
      title: "Primeira chamada para scoring",
      objective: "Ligar contrato e pedido HTTP com uma resposta esperada antes de abrir docs gigantes.",
      contractBlock: `Endpoint: /api/scoring/run
Body required: customer_id, product_code, insured_amount
Headers required: Authorization, Content-Type
Success: returns request_id, score_band, decision`,
      payloadBlock: `{
  "customer_id": "CUS-9921",
  "product_code": "TERM_20",
  "insured_amount": 250000,
  "smoker": false
}`,
      method: "POST",
      path: "/api/scoring/run",
      headersBlock: `Authorization: Bearer local-dev-token\nContent-Type: application/json`,
      responseStatus: "200 OK",
      responseBlock: `{
  "request_id": "SCR-5521",
  "score_band": "A2",
  "decision": "review"
}`,
      checklist: [
        { id: "customer_id", label: "customer_id", required: true, checked: true, note: "Quem vai ser avaliado" },
        { id: "product_code", label: "product_code", required: true, checked: true, note: "Produto alvo" },
        { id: "insured_amount", label: "insured_amount", required: true, checked: true, note: "Capital seguro" },
        { id: "smoker", label: "smoker", required: false, checked: false, note: "Boolean opcional" },
        { id: "Authorization", label: "Authorization header", required: true, checked: false, note: "Necessario fora do mock" },
      ],
    },
  };
}

function createInitialState(): SandboxState {
  return { activeContract: "json", drafts: createInitialDrafts() };
}

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------

const ASSETS = [
  {
    title: "carteira_apolices_vida.csv",
    description: "Carteira de apolices para inspecao de model points.",
    href: "/course-assets/day3/carteira_apolices_vida.csv",
  },
  {
    title: "tabua_mortalidade_CSO2017.csv",
    description: "Tabua de mortalidade padrao com taxas por idade e genero.",
    href: "/course-assets/day3/tabua_mortalidade_CSO2017.csv",
  },
  {
    title: "taxas_resgate.csv",
    description: "Taxas de resgate (lapse) por ano de apolice e produto.",
    href: "/course-assets/day3/taxas_resgate.csv",
  },
  {
    title: "yield_curve_ECB.csv",
    description: "Curva de rendimentos ECB com taxas spot e forward.",
    href: "/course-assets/day3/yield_curve_ECB.csv",
  },
  {
    title: "day3_api_call_example.md",
    description: "Exemplo minimo de request e response para perceber uma API call sem entrar em teoria a mais.",
    href: "/course-assets/day3/day3_api_call_example.md",
  },
  {
    title: "day3_contract_starter.md",
    description: "Starter curto para o contract pack do dia.",
    href: "/course-assets/day3/day3_contract_starter.md",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildContractMarkdown(draft: ContractDraft, meta: (typeof CONTRACT_META)[ContractId]): string {
  return [
    `# Contract: ${draft.title}`,
    "",
    "## Objective",
    draft.objective,
    "",
    "## Format",
    `Primary format: ${meta.format}`,
    "",
    "## Contract Definition",
    "```",
    draft.contractBlock,
    "```",
    "",
    "## Example Payload",
    "```",
    draft.payloadBlock,
    "```",
    "",
    "## HTTP Request",
    `${draft.method} ${draft.path}`,
    "",
    "### Headers",
    draft.headersBlock,
    "",
    "## Expected Response",
    `Status: ${draft.responseStatus}`,
    "```",
    draft.responseBlock,
    "```",
    "",
    "## Field Checklist",
    ...draft.checklist.map(
      (item) =>
        `- [${item.checked ? "x" : " "}] ${item.label} ${item.required ? "(required)" : "(optional)"} — ${item.note}`,
    ),
    "",
  ].join("\n");
}

function buildOpenCodePrompt(draft: ContractDraft, meta: (typeof CONTRACT_META)[ContractId]): string {
  const requiredMissing = draft.checklist
    .filter((item) => item.required && !item.checked)
    .map((item) => item.label);

  return [
    "Prompt local-first para CLI/OpenCode",
    "",
    `Objetivo: rever o contrato ${meta.label} para ${draft.title}.`,
    `Formato principal: ${meta.format}.`,
    `Endpoint inicial: ${draft.method} ${draft.path}.`,
    `Campos obrigatorios em falta: ${requiredMissing.length > 0 ? requiredMissing.join(", ") : "nenhum"}.`,
    "",
    "Pede ao agente para:",
    "1. validar campos obrigatorios, tipos e naming;",
    "2. apontar edge cases e erros de parse ou validacao;",
    "3. sugerir um request minimo e uma resposta de sucesso + erro;",
    "4. manter a proposta local-first e sem dependencias desnecessarias.",
  ].join("\n");
}

function renderTerminalBlock(args: {
  commands: string[];
  copied: boolean;
  onCopy: () => void;
  label: string;
  prefix: "$" | ">";
}) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#263238] bg-[#0b1220] shadow-[0_18px_40px_rgba(11,18,32,0.24)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#111a2b] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/70">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2">{args.label}</span>
        </div>
        <button
          type="button"
          onClick={args.onCopy}
          className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white transition hover:bg-white/14"
        >
          {args.copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="overflow-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-xs leading-6 text-[#d6e2ff]">
        {args.commands.map((command, index) => (
          <div key={`${args.label}-${index}`}>
            <span className="select-none text-[#7ee787]">{args.prefix} </span>
            {command}
          </div>
        ))}
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Day3SchemaApiSandbox() {
  const [state, setState] = useState<SandboxState>(() => {
    if (typeof window === "undefined") return createInitialState();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SandboxState) : createInitialState();
    } catch {
      return createInitialState();
    }
  });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* noop */
    }
  }, [state]);

  const draft = state.drafts[state.activeContract];
  const meta = CONTRACT_META[state.activeContract];

  const checklistStats = useMemo(() => {
    const total = draft.checklist.length;
    const checked = draft.checklist.filter((item) => item.checked).length;
    const requiredTotal = draft.checklist.filter((item) => item.required).length;
    const requiredChecked = draft.checklist.filter((item) => item.required && item.checked).length;
    return { total, checked, requiredTotal, requiredChecked, percent: total === 0 ? 0 : Math.round((checked / total) * 100) };
  }, [draft.checklist]);

  const requestPreview = useMemo(
    () => [
      `${draft.method} ${draft.path}`,
      "",
      draft.headersBlock.trim() || "Sem headers definidos.",
      "",
      "Body:",
      draft.payloadBlock.trim() || "Sem body definido.",
    ].join("\n"),
    [draft],
  );

  const responsePreview = useMemo(
    () => [`Status: ${draft.responseStatus}`, "", draft.responseBlock.trim()].join("\n"),
    [draft],
  );

  const contractMarkdown = useMemo(() => buildContractMarkdown(draft, meta), [draft, meta]);
  const openCodePrompt = useMemo(() => buildOpenCodePrompt(draft, meta), [draft, meta]);

  function updateDraft<K extends keyof ContractDraft>(field: K, value: ContractDraft[K]) {
    setState((cur) => ({
      ...cur,
      drafts: { ...cur.drafts, [cur.activeContract]: { ...cur.drafts[cur.activeContract], [field]: value } },
    }));
  }

  function updateChecklist(itemId: string, patch: Partial<FieldItem>) {
    setState((cur) => ({
      ...cur,
      drafts: {
        ...cur.drafts,
        [cur.activeContract]: {
          ...cur.drafts[cur.activeContract],
          checklist: cur.drafts[cur.activeContract].checklist.map((item) =>
            item.id === itemId ? { ...item, ...patch } : item,
          ),
        },
      },
    }));
  }

  async function copyToClipboard(key: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  }

  function downloadContract() {
    const blob = new Blob([contractMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contract-${state.activeContract}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-6">
      {/* ── Header ── */}
      <div className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Lab Dia 3 — Schema & API Sandbox
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
              <GlossaryText text="Practica contratos em JSON, CSV, YAML e HTTP sem te perder em codigo." glossary={DAY3_GLOSSARY} />
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
              <GlossaryText text="Define naming, campos obrigatorios, tipos e exemplos. Exporta um contract.md que podes passar ao OpenCode para revisao antes de implementar." glossary={DAY3_GLOSSARY} />
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.08),rgba(124,63,88,0.03))] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]">
              {checklistStats.percent}% checklist
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            O caminho deste dia
          </p>
          <div className="mt-4 space-y-3">
            {DAY3_STEPS.map((step) => (
              <div key={step.title} className="rounded-xl border border-[var(--border)] bg-white p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">{step.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  <GlossaryText text={step.body} glossary={DAY3_GLOSSARY} />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Se nao vens de software
          </p>
          <div className="mt-4 space-y-3">
            {DAY3_BEGINNER_NOTES.map((note) => (
              <div key={note} className="rounded-xl border border-[var(--border)] bg-white p-4 text-sm leading-7 text-[var(--muted-foreground)]">
                <GlossaryText text={note} glossary={DAY3_GLOSSARY} />
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-[var(--border-strong)] bg-white/70 p-4 text-sm leading-7 text-[var(--muted-foreground)]">
            Resultado final: <span className="font-semibold text-[var(--foreground)]">um contract pack simples</span> e uma explicacao clara dos dados para um agente no terminal.
          </div>
        </div>
      </div>

      {/* ── Inline Assets ── */}
      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Ficheiros de dados — descarrega para inspecionar colunas e formatos
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ASSETS.map((asset) => (
            <a
              key={asset.href}
              href={asset.href}
              download
              className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-white p-4 transition hover:border-[var(--accent-soft)] hover:shadow-sm"
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">{asset.title}</p>
              <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                <GlossaryText text={asset.description} glossary={DAY3_GLOSSARY} />
              </p>
              <span className="mt-auto text-xs font-semibold text-[var(--accent)]">Descarregar</span>
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Copiar e colar no terminal
          </p>
          <div className="mt-4 space-y-4">
            {DAY3_TERMINAL_STEPS.map((step, index) => {
              const key = `day3-terminal-${index}`;
              return (
                <article key={step.title} className="rounded-xl border border-[var(--border)] bg-white p-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{step.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                    <GlossaryText text={step.body} glossary={DAY3_GLOSSARY} />
                  </p>
                  {renderTerminalBlock({
                    commands: step.commands,
                    copied: copied === key,
                    onCopy: () => copyToClipboard(key, step.commands.join("\n\n")),
                    label: index === 0 ? "Terminal / PowerShell" : "Chat do OpenCode",
                    prefix: index === 0 ? "$" : ">",
                  })}
                </article>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            O que nao deves perder hoje
          </p>
          <div className="mt-4 space-y-3">
            {[
              "Primeiro percebes os ficheiros; so depois passas ao contract pack.",
              "Nao precisas de decorar JSON ou HTTP. Basta reconhecer campos, pedido e resposta.",
              "O melhor uso do agente hoje e resumir formatos e propor contratos claros.",
              "Se o agent te devolver detalhes excessivos, pede uma versao mais curta e operacional.",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-[var(--border)] bg-white p-4 text-sm leading-7 text-[var(--muted-foreground)]">
                <GlossaryText text={item} glossary={DAY3_GLOSSARY} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contract Selector + Workspace ── */}
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {/* Left: selector + checklist */}
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Escolher formato de contrato
            </p>
            <div className="mt-4 space-y-3">
              {(Object.keys(CONTRACT_META) as ContractId[]).map((contractId) => {
                const cMeta = CONTRACT_META[contractId];
                const active = state.activeContract === contractId;
                return (
                  <button
                    key={contractId}
                    type="button"
                    onClick={() => setState((cur) => ({ ...cur, activeContract: contractId }))}
                    className={`block w-full rounded-xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-[var(--accent-soft)] bg-[rgba(124,63,88,0.06)]"
                        : "border-[var(--border)] bg-white hover:border-[var(--accent-soft)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{cMeta.label}</p>
                        <p className="mt-1.5 text-sm leading-6 text-[var(--muted-foreground)]">
                          <GlossaryText text={cMeta.summary} glossary={DAY3_GLOSSARY} />
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                        {cMeta.format}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Checklist de schema
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  {checklistStats.requiredChecked}/{checklistStats.requiredTotal} obrigatorios confirmados
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--foreground)]">
                {checklistStats.checked}/{checklistStats.total}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {draft.checklist.map((item) => (
                <div key={item.id} className="rounded-xl border border-[var(--border)] bg-white p-3">
                  <div className="flex items-start gap-3">
                    <input
                      checked={item.checked}
                      onChange={(e) => updateChecklist(item.id, { checked: e.target.checked })}
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-[var(--border)]"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[var(--foreground)]">{item.label}</p>
                        <span
                          className="rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
                          style={{
                            backgroundColor: item.required ? "rgba(124,63,88,0.08)" : "var(--surface-subtle)",
                            color: item.required ? "var(--accent)" : "var(--muted-foreground)",
                          }}
                        >
                          {item.required ? "Obrigatorio" : "Opcional"}
                        </span>
                      </div>
                      <input
                        value={item.note}
                        onChange={(e) => updateChecklist(item.id, { note: e.target.value })}
                        className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: contract fields */}
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <FieldCard label="Titulo do caso" value={draft.title} onChange={(v) => updateDraft("title", v)} />
            <FieldCard label="Objetivo" value={draft.objective} onChange={(v) => updateDraft("objective", v)} />
          </div>

          <div className="grid gap-3 xl:grid-cols-2">
            <CodeCard
              label="Contrato ou spec base"
              value={draft.contractBlock}
              onChange={(v) => updateDraft("contractBlock", v)}
              onCopy={() => copyToClipboard("contract", draft.contractBlock)}
              copied={copied === "contract"}
            />
            <CodeCard
              label="Payload ou exemplo de input"
              value={draft.payloadBlock}
              onChange={(v) => updateDraft("payloadBlock", v)}
              onCopy={() => copyToClipboard("payload", draft.payloadBlock)}
              copied={copied === "payload"}
            />
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              HTTP Request
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Metodo
                </span>
                <input
                  value={draft.method}
                  onChange={(e) => updateDraft("method", e.target.value.toUpperCase())}
                  className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                />
              </label>
              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Path
                </span>
                <input
                  value={draft.path}
                  onChange={(e) => updateDraft("path", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              <CodeCard
                label="Headers"
                value={draft.headersBlock}
                onChange={(v) => updateDraft("headersBlock", v)}
                onCopy={() => copyToClipboard("headers", draft.headersBlock)}
                copied={copied === "headers"}
                compact
              />
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Status esperado
                  </span>
                  <input
                    value={draft.responseStatus}
                    onChange={(e) => updateDraft("responseStatus", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                  />
                </label>
                <label className="mt-3 block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Resposta exemplo
                  </span>
                  <textarea
                    value={draft.responseBlock}
                    onChange={(e) => updateDraft("responseBlock", e.target.value)}
                    className="mt-2 min-h-32 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 font-mono text-xs leading-6 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-2">
            <PreviewCard label="Preview do request" value={requestPreview} />
            <PreviewCard label="Preview da response" value={responsePreview} />
          </div>
        </div>
      </div>

      {/* ── Export / Artifact ── */}
      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Artefacto final — contract.md
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
              Descarrega o contrato completo ou copia o prompt para o OpenCode.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard("prompt", openCodePrompt)}
              className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
            >
              {copied === "prompt" ? "Copiado" : "Copiar prompt"}
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard("spec", contractMarkdown)}
              className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
            >
              {copied === "spec" ? "Copiado" : "Copiar contrato"}
            </button>
            <button
              type="button"
              onClick={downloadContract}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            >
              Descarregar contract.md
            </button>
          </div>
        </div>

        <pre className="mt-4 max-h-72 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-xs leading-6 text-[var(--foreground)]">
          {contractMarkdown}
        </pre>

        <div className="mt-4 rounded-xl border border-dashed border-[var(--border-strong)] bg-white/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            Prompt para OpenCode / GLM-5
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{openCodePrompt}</p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FieldCard({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="rounded-xl border border-[var(--border)] bg-white p-4">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-24 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm leading-6 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
      />
    </label>
  );
}

function CodeCard({
  label,
  value,
  onChange,
  onCopy,
  copied,
  compact,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onCopy: () => void;
  copied: boolean;
  compact?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{label}</p>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
        >
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 font-mono text-xs leading-6 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)] ${compact ? "min-h-32" : "min-h-48"}`}
      />
    </div>
  );
}

function PreviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{label}</p>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-[var(--border)] bg-white p-3 text-xs leading-6 text-[var(--foreground)]">
        {value}
      </pre>
    </div>
  );
}
