"use client";

import { useEffect, useMemo, useState } from "react";

type TemplateId = "assumptions" | "document-drop" | "audit";

type Draft = {
  problem: string;
  user: string;
  scope: string;
  inputs: string;
  validations: string;
  outputs: string;
  edgeCases: string;
  acceptance: string;
};

const STORAGE_KEY = "aibootcamp-day2-spec-studio-v1";

const TEMPLATES: Record<
  TemplateId,
  {
    label: string;
    summary: string;
    draft: Draft;
    prompt: string;
  }
> = {
  assumptions: {
    label: "Upload de assumptions",
    summary: "Definir upload, validacao e mensagens de erro para tabuas e ficheiros base do motor.",
    draft: {
      problem:
        "Equipas pequenas perdem tempo a validar ficheiros de assumptions manualmente e so descobrem erros depois de o motor correr.",
      user:
        "Atuario ou product owner que precisa carregar tabuas de mortalidade, lapse e discount sem depender de limpeza manual repetitiva.",
      scope:
        "Permitir upload de CSV/XLSX, validacao de colunas obrigatorias, preview inicial e bloqueio de ficheiros invalidos antes de guardar.",
      inputs:
        "Ficheiro de assumptions, tipo de assumption, data de referencia, versao e opcionalmente comentario do utilizador.",
      validations:
        "Validar extensao, colunas obrigatorias, duplicados por idade/sexo, valores fora de intervalo e presenca de cabecalhos corretos.",
      outputs:
        "Preview das primeiras linhas, estado de validacao, resumo de erros e ficheiro pronto para entrar no motor deterministico.",
      edgeCases:
        "Ficheiro com separador errado, colunas trocadas, idades em falta, percentagens negativas ou upload interrompido a meio.",
      acceptance:
        "O utilizador percebe em menos de 30 segundos se o ficheiro pode entrar no sistema e recebe mensagens acionaveis para corrigir o problema.",
    },
    prompt:
      "Usa esta spec para gerar um spec.md final em formato GitHub Spec Kit. Confirma ambiguidades, edge cases e criterios de aceite antes de sugerir implementacao.",
  },
  "document-drop": {
    label: "Document Drop",
    summary: "Descrever a experiencia de upload documental local-first antes da etapa de AI.",
    draft: {
      problem:
        "O estudante e mais tarde o utilizador final precisam transformar PDFs e imagens em memoria operacional sem confundir OCR com raciocinio AI.",
      user:
        "Utilizador de seguros que carrega documentos tecnicos ou comerciais e quer recuperar metadados, classificacao e resumo confiavel.",
      scope:
        "Permitir arrastar ficheiros, mostrar estado da pipeline, guardar metadata extraida e so depois chamar AI para estrutura, resumo e review.",
      inputs:
        "PDFs, imagens, origem do documento, categoria esperada e notas opcionais do utilizador.",
      validations:
        "Validar tipo de ficheiro, tamanho maximo, paginas ilegiveis, duplicados e ausencia de texto apos OCR local.",
      outputs:
        "Documento classificado, metadata chave, excerto textual extraido, sinal de confianca e sugestao de proximos passos.",
      edgeCases:
        "PDF digital sem problema, imagem de baixa qualidade, documento misto, OCR sem texto suficiente, classificacao incerta.",
      acceptance:
        "A spec deixa claro que OCR/parser corre primeiro localmente e que a AI entra depois para organizar, classificar e rever.",
    },
    prompt:
      "Transforma esta spec numa feature clara para equipa de produto e engenharia. Mantem a pipeline local-first explicita e nao inventes OCR no browser.",
  },
  audit: {
    label: "Auditar a spec",
    summary: "Preparar o pacote que vai para GLM-5, Z.ai ou OpenCode para apanhar falhas antes de construir.",
    draft: {
      problem:
        "Specs parecem completas mas falham em estados vazios, erros, naming e definicao de pronto.",
      user:
        "Fundador tecnico que quer pedir um coding plan e ao mesmo tempo descobrir o que ainda esta vago na spec.",
      scope:
        "Criar checklist de auditoria, perguntas de follow-up e pacote de prompt para GLM-5 e OpenCode reverem a mesma spec.",
      inputs:
        "Spec base, contexto do dia, decisoes fora de scope, constraints tecnicas e stack escolhida.",
      validations:
        "Testar criterios de aceite, naming consistente, fronteiras do MVP, erros, permissao de ficheiros e dependencia de dados externos.",
      outputs:
        "Lista de ambiguidades, coding plan inicial, riscos de implementacao e versao revista da spec.",
      edgeCases:
        "Requisitos contraditorios, prompts vagos, campos sem dono, fluxo feliz sem erros e ausencia de observabilidade.",
      acceptance:
        "A equipa consegue sair da aula com uma spec revisada e um plano de build que nao dependa de adivinhacao.",
    },
    prompt:
      "Faz uma auditoria dura a esta spec. Identifica ambiguidade, edge cases em falta, requisitos contraditorios e criterios de aceite pouco testaveis.",
  },
};

function createInitialState() {
  return {
    activeTemplate: "assumptions" as TemplateId,
    drafts: Object.fromEntries(
      Object.entries(TEMPLATES).map(([key, value]) => [key, value.draft]),
    ) as Record<TemplateId, Draft>,
  };
}

export function Day2SpecStudio() {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") {
      return createInitialState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ReturnType<typeof createInitialState>) : createInitialState();
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

  const activeConfig = TEMPLATES[state.activeTemplate];
  const activeDraft = state.drafts[state.activeTemplate];

  const completion = useMemo(() => {
    const fields = Object.values(activeDraft);
    const filled = fields.filter((value) => value.trim().length > 20).length;
    return Math.round((filled / fields.length) * 100);
  }, [activeDraft]);

  function updateDraft(field: keyof Draft, value: string) {
    setState((current) => ({
      ...current,
      drafts: {
        ...current.drafts,
        [current.activeTemplate]: {
          ...current.drafts[current.activeTemplate],
          [field]: value,
        },
      },
    }));
  }

  async function copyText(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  }

  const exportBlock = [
    `# ${activeConfig.label}`,
    "",
    `Problema: ${activeDraft.problem}`,
    `Utilizador: ${activeDraft.user}`,
    `Scope: ${activeDraft.scope}`,
    `Inputs: ${activeDraft.inputs}`,
    `Validacoes: ${activeDraft.validations}`,
    `Outputs: ${activeDraft.outputs}`,
    `Edge cases: ${activeDraft.edgeCases}`,
    `Criterios de aceite: ${activeDraft.acceptance}`,
    "",
    `Prompt de auditoria: ${activeConfig.prompt}`,
  ].join("\n");

  return (
    <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Lab Dia 2
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Escrever uma spec que o LLM consegue implementar.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
             Em vez de uma folha em branco, o estudante monta a spec por blocos, valida o
             scope do MVP e sai com um pacote pronto para GitHub Spec Kit, Z.ai ou OpenCode rever.
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.08),rgba(124,63,88,0.03))] px-4 py-3 text-sm text-[var(--foreground)]">
          Progresso da spec: {completion}%
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Escolher o artefacto
            </p>
            <div className="mt-4 space-y-3">
              {(Object.entries(TEMPLATES) as Array<[TemplateId, (typeof TEMPLATES)[TemplateId]]>).map(
                ([key, template]) => {
                  const active = key === state.activeTemplate;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setState((current) => ({ ...current, activeTemplate: key }))}
                      className="block w-full rounded-[1.1rem] border px-4 py-4 text-left transition"
                      style={{
                        borderColor: active ? "var(--accent-soft)" : "var(--border)",
                        backgroundColor: active ? "rgba(124,63,88,0.06)" : "white",
                      }}
                    >
                      <p className="font-semibold text-[var(--foreground)]">{template.label}</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                        {template.summary}
                      </p>
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Checklist de auditoria
            </p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>- O problema esta escrito em linguagem de negocio e nao apenas em linguagem tecnica.</p>
              <p>- O scope deixa claro o que entra agora e o que fica fora do MVP.</p>
              <p>- As validacoes e mensagens de erro existem antes do fluxo feliz.</p>
              <p>- Os criterios de aceite sao testaveis sem depender de intuicao.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldCard
              label="Problema"
              value={activeDraft.problem}
              onChange={(value) => updateDraft("problem", value)}
            />
            <FieldCard
              label="Utilizador principal"
              value={activeDraft.user}
              onChange={(value) => updateDraft("user", value)}
            />
            <FieldCard
              label="Scope do MVP"
              value={activeDraft.scope}
              onChange={(value) => updateDraft("scope", value)}
            />
            <FieldCard
              label="Inputs"
              value={activeDraft.inputs}
              onChange={(value) => updateDraft("inputs", value)}
            />
            <FieldCard
              label="Validacoes"
              value={activeDraft.validations}
              onChange={(value) => updateDraft("validations", value)}
            />
            <FieldCard
              label="Outputs esperados"
              value={activeDraft.outputs}
              onChange={(value) => updateDraft("outputs", value)}
            />
            <FieldCard
              label="Edge cases"
              value={activeDraft.edgeCases}
              onChange={(value) => updateDraft("edgeCases", value)}
            />
            <FieldCard
              label="Criterios de aceite"
              value={activeDraft.acceptance}
              onChange={(value) => updateDraft("acceptance", value)}
            />
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Prompt para ferramentas locais
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Usa este bloco como base para GitHub Spec Kit, GLM-5, Z.ai ou OpenCode.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyText("prompt", activeConfig.prompt)}
                  className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
                >
                  {copied === "prompt" ? "Prompt copiado" : "Copiar prompt"}
                </button>
                <button
                  type="button"
                  onClick={() => copyText("export", exportBlock)}
                  className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
                >
                  {copied === "export" ? "Spec copiada" : "Copiar spec"}
                </button>
              </div>
            </div>

            <pre className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--border)] bg-white p-4 text-xs leading-6 text-[var(--foreground)]">
              {exportBlock}
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
