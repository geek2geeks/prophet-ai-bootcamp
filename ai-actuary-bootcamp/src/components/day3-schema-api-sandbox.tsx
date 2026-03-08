"use client";

import { useEffect, useMemo, useState } from "react";

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

const STORAGE_KEY = "aibootcamp-day3-schema-api-sandbox-v1";

const CONTRACT_META: Record<
  ContractId,
  {
    label: string;
    format: string;
    summary: string;
    focus: string;
  }
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
      objective:
        "Definir um payload minimo para abrir uma simulacao sem mandar campos irrelevantes ou mal tipados.",
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
      headersBlock: `Content-Type: application/json
X-Client: bootcamp-day3`,
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
      objective:
        "Especificar um CSV claro antes de discutir parser, validacao e mensagens de erro.",
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
      headersBlock: `Content-Type: text/csv
X-Assumption-Type: mortality`,
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
      objective:
        "Desenhar um ficheiro de configuracao que a equipa consegue rever no repo sem depender de UI.",
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
      headersBlock: `Content-Type: application/yaml
X-Mode: draft`,
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
      objective:
        "Ligar contrato e pedido HTTP com uma resposta esperada antes de abrir docs gigantes.",
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
      headersBlock: `Authorization: Bearer local-dev-token
Content-Type: application/json`,
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
  return {
    activeContract: "json",
    drafts: createInitialDrafts(),
  };
}

export function Day3SchemaApiSandbox() {
  const [state, setState] = useState<SandboxState>(() => {
    if (typeof window === "undefined") {
      return createInitialState();
    }

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
      return;
    }
  }, [state]);

  const activeDraft = state.drafts[state.activeContract];
  const activeMeta = CONTRACT_META[state.activeContract];

  const checklistStats = useMemo(() => {
    const total = activeDraft.checklist.length;
    const checked = activeDraft.checklist.filter((item) => item.checked).length;
    const requiredTotal = activeDraft.checklist.filter((item) => item.required).length;
    const requiredChecked = activeDraft.checklist.filter((item) => item.required && item.checked).length;

    return {
      total,
      checked,
      requiredTotal,
      requiredChecked,
      percent: total === 0 ? 0 : Math.round((checked / total) * 100),
    };
  }, [activeDraft.checklist]);

  const requestPreview = useMemo(() => {
    return [
      `${activeDraft.method} ${activeDraft.path}`,
      "",
      activeDraft.headersBlock.trim() || "Sem headers definidos.",
      "",
      "Body:",
      activeDraft.payloadBlock.trim() || "Sem body definido.",
    ].join("\n");
  }, [activeDraft.headersBlock, activeDraft.method, activeDraft.path, activeDraft.payloadBlock]);

  const responsePreview = useMemo(() => {
    return [`Status: ${activeDraft.responseStatus}`, "", activeDraft.responseBlock.trim()].join("\n");
  }, [activeDraft.responseBlock, activeDraft.responseStatus]);

  const localPrompt = useMemo(() => {
    const requiredMissing = activeDraft.checklist
      .filter((item) => item.required && !item.checked)
      .map((item) => item.label);

    return [
      "Prompt local-first para CLI/OpenCode",
      "",
      `Objetivo: rever o contrato ${activeMeta.label} para ${activeDraft.title}.`,
      `Formato principal: ${activeMeta.format}.`,
      `Endpoint inicial: ${activeDraft.method} ${activeDraft.path}.`,
      `Campos obrigatorios em falta: ${requiredMissing.length > 0 ? requiredMissing.join(", ") : "nenhum"}.`,
      "",
      "Pede ao agente para:",
      "1. validar campos obrigatorios, tipos e naming;",
      "2. apontar edge cases e erros de parse ou validacao;",
      "3. sugerir um request minimo e uma resposta de sucesso + erro;",
      "4. manter a proposta local-first e sem dependencias desnecessarias.",
    ].join("\n");
  }, [activeDraft, activeMeta]);

  function updateDraft<K extends keyof ContractDraft>(field: K, value: ContractDraft[K]) {
    setState((current) => ({
      ...current,
      drafts: {
        ...current.drafts,
        [current.activeContract]: {
          ...current.drafts[current.activeContract],
          [field]: value,
        },
      },
    }));
  }

  function updateChecklist(itemId: string, patch: Partial<FieldItem>) {
    setState((current) => ({
      ...current,
      drafts: {
        ...current.drafts,
        [current.activeContract]: {
          ...current.drafts[current.activeContract],
          checklist: current.drafts[current.activeContract].checklist.map((item) =>
            item.id === itemId ? { ...item, ...patch } : item,
          ),
        },
      },
    }));
  }

  async function copyBlock(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Lab Dia 3
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Sandbox de schema e primeira API call.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            O estudante pratica contratos em JSON, CSV, YAML e HTTP antes de programar. A ideia
            e sair com naming mais limpo, campos obrigatorios claros e um request inicial que faz
            sentido no terminal.
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.08),rgba(124,63,88,0.03))] px-4 py-3 text-sm text-[var(--foreground)]">
          Checklist pronta: {checklistStats.percent}%
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.84fr_1.16fr]">
        <div className="space-y-4">
          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Escolher contrato
            </p>
            <div className="mt-4 space-y-3">
              {(Object.keys(CONTRACT_META) as ContractId[]).map((contractId) => {
                const meta = CONTRACT_META[contractId];
                const active = state.activeContract === contractId;

                return (
                  <button
                    key={contractId}
                    type="button"
                    onClick={() => setState((current) => ({ ...current, activeContract: contractId }))}
                    className="block w-full rounded-[1.1rem] border px-4 py-4 text-left transition"
                    style={{
                      borderColor: active ? "var(--accent-soft)" : "var(--border)",
                      backgroundColor: active ? "rgba(124,63,88,0.06)" : "white",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{meta.label}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                          {meta.summary}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                        {meta.format}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Leitura rapida
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{activeMeta.focus}</p>
            <div className="mt-4 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>- Primeiro define o contrato, depois o request, e so depois perguntas pela implementacao.</p>
              <p>- Se um campo nao tiver significado de negocio, ainda nao esta pronto para API.</p>
              <p>- Usa exemplos pequenos. O objetivo e perceber a forma do dado, nao simular producao inteira.</p>
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
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
              {activeDraft.checklist.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1rem] border border-[var(--border)] bg-white p-3"
                >
                  <div className="flex items-start gap-3">
                    <input
                      checked={item.checked}
                      onChange={(event) => updateChecklist(item.id, { checked: event.target.checked })}
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
                        onChange={(event) => updateChecklist(item.id, { note: event.target.value })}
                        className="mt-3 w-full rounded-[0.9rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldCard
              label="Titulo do caso"
              value={activeDraft.title}
              onChange={(value) => updateDraft("title", value)}
            />
            <FieldCard
              label="Objetivo"
              value={activeDraft.objective}
              onChange={(value) => updateDraft("objective", value)}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
            <CodeCard
              label="Contrato ou spec base"
              value={activeDraft.contractBlock}
              onChange={(value) => updateDraft("contractBlock", value)}
              onCopy={() => copyBlock("contract", activeDraft.contractBlock)}
              copied={copied === "contract"}
            />
            <CodeCard
              label="Payload ou exemplo de input"
              value={activeDraft.payloadBlock}
              onChange={(value) => updateDraft("payloadBlock", value)}
              onCopy={() => copyBlock("payload", activeDraft.payloadBlock)}
              copied={copied === "payload"}
            />
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Pensar a chamada
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-[0.65fr_1.35fr]">
              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Metodo
                </span>
                <input
                  value={activeDraft.method}
                  onChange={(event) => updateDraft("method", event.target.value.toUpperCase())}
                  className="mt-3 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                />
              </label>

              <label>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Path
                </span>
                <input
                  value={activeDraft.path}
                  onChange={(event) => updateDraft("path", event.target.value)}
                  className="mt-3 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              <CodeCard
                label="Headers"
                value={activeDraft.headersBlock}
                onChange={(value) => updateDraft("headersBlock", value)}
                onCopy={() => copyBlock("headers", activeDraft.headersBlock)}
                copied={copied === "headers"}
                compact
              />
              <div className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Status esperado
                  </span>
                  <input
                    value={activeDraft.responseStatus}
                    onChange={(event) => updateDraft("responseStatus", event.target.value)}
                    className="mt-3 w-full rounded-[1rem] border border-[var(--border)] bg-white px-3 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Resposta exemplo
                  </span>
                  <textarea
                    value={activeDraft.responseBlock}
                    onChange={(event) => updateDraft("responseBlock", event.target.value)}
                    className="mt-3 min-h-40 w-full rounded-[1rem] border border-[var(--border)] bg-white px-3 py-3 font-mono text-xs leading-6 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <PreviewCard label="Preview do request" value={requestPreview} />
            <PreviewCard label="Preview da response" value={responsePreview} />
          </div>

          <div className="rounded-[1.3rem] border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.06),rgba(124,63,88,0.1))] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Proximo passo no CLI
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Copia este bloco para OpenCode e pede revisao do contrato antes de implementar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyBlock("prompt", localPrompt)}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                {copied === "prompt" ? "Prompt copiado" : "Copiar prompt"}
              </button>
            </div>

            <pre className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--border)] bg-white p-4 text-xs leading-6 text-[var(--foreground)]">
              {localPrompt}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldCard({
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
  onChange: (value: string) => void;
  onCopy: () => void;
  copied: boolean;
  compact?: boolean;
}) {
  return (
    <div className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          {label}
        </p>
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
        onChange={(event) => onChange(event.target.value)}
        className={`mt-3 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 font-mono text-xs leading-6 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)] ${compact ? "min-h-40" : "min-h-64"}`}
      />
    </div>
  );
}

function PreviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <pre className="mt-3 overflow-x-auto rounded-[1rem] border border-[var(--border)] bg-white p-4 text-xs leading-6 text-[var(--foreground)]">
        {value}
      </pre>
    </div>
  );
}
