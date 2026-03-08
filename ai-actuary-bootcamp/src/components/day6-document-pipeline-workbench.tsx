"use client";

import { useEffect, useMemo, useState } from "react";

type PipelineStageId = "ficheiro" | "ocr-local" | "texto-limpo" | "deepseek-review";
type ReviewMode = "resumo" | "qa" | "comparacao" | "memo";

type EvidenceItem = {
  id: string;
  pageRef: string;
  rawSnippet: string;
  cleanedSnippet: string;
  issue: string;
  resolution: string;
};

type QualityCheck = {
  done: boolean;
  note: string;
};

export type Day6DocumentPipelineWorkbenchState = {
  fileName: string;
  documentType: string;
  sourceContext: string;
  owner: string;
  localTool: string;
  parserProfile: string;
  rawTextNote: string;
  cleanedTextGoal: string;
  reviewGoal: string;
  reviewMode: ReviewMode;
  ocrConfidence: number;
  parseConfidence: number;
  reviewConfidence: number;
  qualityChecks: {
    sourceSaved: QualityCheck;
    ocrRanLocally: QualityCheck;
    fieldsMapped: QualityCheck;
    sensitiveDataReviewed: QualityCheck;
    humanSampleChecked: QualityCheck;
    readyForDeepSeek: QualityCheck;
  };
  evidence: EvidenceItem[];
  decision: string;
  nextStep: string;
};

const STORAGE_KEY = "aibootcamp-day6-document-pipeline-workbench-v1";

const PIPELINE_STAGES: Array<{
  id: PipelineStageId;
  label: string;
  eyebrow: string;
  helper: string;
}> = [
  {
    id: "ficheiro",
    label: "Ficheiro",
    eyebrow: "Entrada",
    helper: "Guarda o original, identifica o tipo de documento e nao saltes logo para o modelo.",
  },
  {
    id: "ocr-local",
    label: "OCR / parser local",
    eyebrow: "Local-first",
    helper: "Extrai texto e estrutura no teu computador para reduzir fuga de dados e ruido cedo.",
  },
  {
    id: "texto-limpo",
    label: "Texto limpo",
    eyebrow: "Normalizacao",
    helper: "Limpa colunas partidas, labels ambiguas e campos incompletos antes da revisao.",
  },
  {
    id: "deepseek-review",
    label: "DeepSeek / review",
    eyebrow: "Raciocinio",
    helper: "So entra depois de haver texto util, evidencia e checks minimos fechados.",
  },
];

const REVIEW_MODES: Array<{ id: ReviewMode; label: string; helper: string }> = [
  {
    id: "resumo",
    label: "Resumo tecnico",
    helper: "Boa opcao para condensar um documento ja limpo em bullets acionaveis.",
  },
  {
    id: "qa",
    label: "Q and A orientado",
    helper: "Usa quando queres responder a perguntas especificas com base no texto limpo.",
  },
  {
    id: "comparacao",
    label: "Comparacao",
    helper: "Ideal para comparar versoes, clausulas ou tabelas entre documentos.",
  },
  {
    id: "memo",
    label: "Memo de handoff",
    helper: "Bom para deixar contexto reutilizavel para outra pessoa ou para o teu eu de amanha.",
  },
];

const QUALITY_CHECKS: Array<{
  id: keyof Day6DocumentPipelineWorkbenchState["qualityChecks"];
  label: string;
  helper: string;
}> = [
  {
    id: "sourceSaved",
    label: "Original guardado",
    helper: "Existe ficheiro fonte, nome de versao e contexto minimo do documento.",
  },
  {
    id: "ocrRanLocally",
    label: "OCR correu localmente",
    helper: "A extracao inicial aconteceu antes de qualquer upload para um modelo remoto.",
  },
  {
    id: "fieldsMapped",
    label: "Campos mapeados",
    helper: "Titulos, datas, tabelas ou clausulas chave ja estao identificados no texto limpo.",
  },
  {
    id: "sensitiveDataReviewed",
    label: "Dados sensiveis revistos",
    helper: "Sabes o que pode ou nao pode sair do ambiente local.",
  },
  {
    id: "humanSampleChecked",
    label: "Amostra humana revista",
    helper: "Alguem confirmou algumas linhas contra o original para apanhar erros silenciosos.",
  },
  {
    id: "readyForDeepSeek",
    label: "Pronto para DeepSeek",
    helper: "Ha material suficiente para pedir revisao sem enviar lixo para o modelo.",
  },
];

function createEvidenceItem(): EvidenceItem {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    pageRef: "",
    rawSnippet: "",
    cleanedSnippet: "",
    issue: "",
    resolution: "",
  };
}

function createInitialState(): Day6DocumentPipelineWorkbenchState {
  return {
    fileName: "nota-tecnica-renovacao-2026.pdf",
    documentType: "Memo tecnico / PDF digitalizado",
    sourceContext: "Documento recebido por email interno. Antes de perguntar ao modelo, extraio texto local e confirmo se ha dados sensiveis.",
    owner: "",
    localTool: "OCR local no teu portatil + parser simples para headings e tabelas",
    parserProfile: "Extrair blocos, tabelas curtas, datas, percentagens e labels atuariais",
    rawTextNote: "Guardar saida bruta do OCR e marcar zonas com colunas partidas, hifenizacao estranha ou tabelas truncadas.",
    cleanedTextGoal: "Transformar a extracao em texto legivel, com secoes, numeracao coerente e campos chave prontos para pesquisa.",
    reviewGoal: "Pedir ao DeepSeek uma segunda leitura do texto limpo: riscos, premissas, open questions e pontos que exigem revisao humana.",
    reviewMode: "memo",
    ocrConfidence: 74,
    parseConfidence: 68,
    reviewConfidence: 61,
    qualityChecks: {
      sourceSaved: {
        done: true,
        note: "Original guardado e nomeado com versao local.",
      },
      ocrRanLocally: {
        done: true,
        note: "Extracao inicial feita sem subir o PDF inteiro para servico remoto.",
      },
      fieldsMapped: {
        done: false,
        note: "Faltam labels de 2 tabelas e uma data de corte.",
      },
      sensitiveDataReviewed: {
        done: false,
        note: "Confirmar se nomes de clientes devem ser removidos do texto final.",
      },
      humanSampleChecked: {
        done: false,
        note: "Comparar 5 linhas com o original antes do review.",
      },
      readyForDeepSeek: {
        done: false,
        note: "So fechar quando o texto limpo estiver coeso.",
      },
    },
    evidence: [
      {
        id: "evidence-1",
        pageRef: "Pag. 2, tabela de taxas",
        rawSnippet: "Txa d renovac 5.4% 2026 Q1",
        cleanedSnippet: "Taxa de renovacao: 5.4% no Q1 de 2026.",
        issue: "OCR trocou letras e cortou uma palavra.",
        resolution: "Corrigido apos leitura manual da tabela original.",
      },
      {
        id: "evidence-2",
        pageRef: "Pag. 4, nota de rodape",
        rawSnippet: "assumptons subject to mgmt review",
        cleanedSnippet: "Assumptions subject to management review.",
        issue: "Rodape saiu em ingles e com typo no OCR.",
        resolution: "Mantido o idioma original e anotado para o memo final.",
      },
    ],
    decision: "Local-first e obrigatorio quando o documento ainda esta sujo ou contem contexto sensivel. O modelo entra depois do texto ganhar forma.",
    nextStep: "Fechar checks pendentes, rever amostra humana e so depois pedir ao DeepSeek um memo com riscos e perguntas em aberto.",
  };
}

function clampScore(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

function scoreLabel(value: number) {
  if (value >= 85) {
    return "Forte";
  }

  if (value >= 65) {
    return "Aceitavel";
  }

  if (value >= 45) {
    return "Fragil";
  }

  return "Baixo";
}

function stageStatus(state: Day6DocumentPipelineWorkbenchState, stageId: PipelineStageId) {
  switch (stageId) {
    case "ficheiro":
      return state.fileName.trim() && state.documentType.trim() ? "Pronto" : "Por preencher";
    case "ocr-local":
      return state.qualityChecks.ocrRanLocally.done ? "Feito localmente" : "Em falta";
    case "texto-limpo":
      return state.cleanedTextGoal.trim() && state.evidence.length > 0 ? "Em consolidacao" : "Por limpar";
    case "deepseek-review":
      return state.qualityChecks.readyForDeepSeek.done ? "Pode seguir" : "Ainda nao";
    default:
      return "Por preencher";
  }
}

function buildWorkflowSummary(state: Day6DocumentPipelineWorkbenchState) {
  const evidenceLines = state.evidence
    .filter(
      (item) =>
        item.pageRef.trim() ||
        item.rawSnippet.trim() ||
        item.cleanedSnippet.trim() ||
        item.issue.trim() ||
        item.resolution.trim(),
    )
    .map((item, index) => {
      const pageRef = item.pageRef.trim() || `Trecho ${index + 1}`;
      const issue = item.issue.trim() || "sem issue registada";
      const resolution = item.resolution.trim() || "sem resolucao registada";
      return `- ${pageRef}: ${issue} -> ${resolution}`;
    });

  const checkLines = QUALITY_CHECKS.map((check) => {
    const value = state.qualityChecks[check.id];
    return `- ${check.label}: ${value.done ? "ok" : "pendente"} | ${value.note || "sem nota"}`;
  });

  return [
    "# Workflow local-first de OCR e revisao",
    "",
    `Ficheiro: ${state.fileName || "n/d"}`,
    `Tipo: ${state.documentType || "n/d"}`,
    `Owner: ${state.owner || "n/d"}`,
    `Contexto: ${state.sourceContext || "n/d"}`,
    "",
    "Pipeline visivel:",
    "1. Ficheiro -> guardar original e contexto do documento.",
    `2. OCR/parser local -> ${state.localTool || "n/d"}`,
    `3. Texto limpo -> ${state.cleanedTextGoal || "n/d"}`,
    `4. DeepSeek/review -> ${state.reviewGoal || "n/d"}`,
    "",
    "Porque local-first:",
    "- O OCR inicial corre localmente para reduzir fuga de dados e apanhar ruido cedo.",
    "- O modelo remoto so recebe texto mais limpo, curto e com melhor contexto.",
    "- A equipa guarda evidencia entre original, OCR bruto e versao limpa.",
    "",
    "Checks de qualidade:",
    ...checkLines,
    "",
    `Confianca OCR: ${clampScore(state.ocrConfidence)}% (${scoreLabel(clampScore(state.ocrConfidence))})`,
    `Confianca parser: ${clampScore(state.parseConfidence)}% (${scoreLabel(clampScore(state.parseConfidence))})`,
    `Confianca review: ${clampScore(state.reviewConfidence)}% (${scoreLabel(clampScore(state.reviewConfidence))})`,
    "",
    "Evidencia capturada:",
    ...(evidenceLines.length ? evidenceLines : ["- Sem evidencia registada."]),
    "",
    `Decisao: ${state.decision || "n/d"}`,
    `Proximo passo: ${state.nextStep || "n/d"}`,
  ].join("\n");
}

export function Day6DocumentPipelineWorkbench() {
  const [state, setState] = useState<Day6DocumentPipelineWorkbenchState>(() => {
    if (typeof window === "undefined") {
      return createInitialState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Day6DocumentPipelineWorkbenchState) : createInitialState();
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

  const completedChecks = useMemo(
    () => QUALITY_CHECKS.filter((check) => state.qualityChecks[check.id].done).length,
    [state.qualityChecks],
  );

  const qualityHealth = useMemo(() => {
    const confidenceAverage =
      (clampScore(state.ocrConfidence) + clampScore(state.parseConfidence) + clampScore(state.reviewConfidence)) / 3;
    const checkWeight = (completedChecks / QUALITY_CHECKS.length) * 100;
    return Math.round(confidenceAverage * 0.55 + checkWeight * 0.45);
  }, [completedChecks, state.ocrConfidence, state.parseConfidence, state.reviewConfidence]);

  const workflowSummary = useMemo(() => buildWorkflowSummary(state), [state]);

  function setField<Key extends keyof Day6DocumentPipelineWorkbenchState>(
    key: Key,
    value: Day6DocumentPipelineWorkbenchState[Key],
  ) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function updateQualityCheck(
    key: keyof Day6DocumentPipelineWorkbenchState["qualityChecks"],
    patch: Partial<QualityCheck>,
  ) {
    setState((current) => ({
      ...current,
      qualityChecks: {
        ...current.qualityChecks,
        [key]: {
          ...current.qualityChecks[key],
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

  async function copyWorkflowSummary() {
    await navigator.clipboard.writeText(workflowSummary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Lab Dia 6
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Montar um pipeline documental com OCR local antes da revisao por modelo.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            Este workbench ensina a ordem certa: guardar o ficheiro, correr OCR ou parsing local,
            limpar o texto, capturar evidencia e so depois pedir ao DeepSeek uma segunda leitura.
          </p>
        </div>

        <button
          type="button"
          onClick={copyWorkflowSummary}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
        >
          {copied ? "Workflow copiado" : "Copiar workflow local"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Pipeline visivel
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {PIPELINE_STAGES.map((stage, index) => (
              <div key={stage.id} className="rounded-[1.25rem] border border-[var(--border)] bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {stage.eyebrow}
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--foreground)]">{stage.label}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{stage.helper}</p>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[var(--muted-foreground)]">
                  <span>{stageStatus(state, stage.id)}</span>
                  {index < PIPELINE_STAGES.length - 1 ? <span aria-hidden="true">-&gt;</span> : <span>fim</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Saude do pipeline
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
              <p className="text-sm text-[var(--muted-foreground)]">Checks fechados</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
                {completedChecks}/{QUALITY_CHECKS.length}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
              <p className="text-sm text-[var(--muted-foreground)]">Saude geral</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">{qualityHealth}%</p>
            </div>
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
              <p className="text-sm text-[var(--muted-foreground)]">OCR</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {clampScore(state.ocrConfidence)}% - {scoreLabel(clampScore(state.ocrConfidence))}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
              <p className="text-sm text-[var(--muted-foreground)]">Parser + review</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {Math.round((clampScore(state.parseConfidence) + clampScore(state.reviewConfidence)) / 2)}% - {scoreLabel(
                  Math.round((clampScore(state.parseConfidence) + clampScore(state.reviewConfidence)) / 2),
                )}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
            Regra da aula: se o OCR bruto ainda estiver ruidoso, nao delegues o problema ao modelo.
            Primeiro limpa, mede e mostra evidencia local.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Contexto do documento
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-[var(--foreground)]">Nome do ficheiro</span>
                <input
                  value={state.fileName}
                  onChange={(event) => setField("fileName", event.target.value)}
                  className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                  placeholder="ex: pricing-note-q1.pdf"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-[var(--foreground)]">Tipo de documento</span>
                <input
                  value={state.documentType}
                  onChange={(event) => setField("documentType", event.target.value)}
                  className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                  placeholder="PDF digitalizado, scan, email, memo"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-sm font-medium text-[var(--foreground)]">Contexto da origem</span>
                <textarea
                  value={state.sourceContext}
                  onChange={(event) => setField("sourceContext", event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                  placeholder="De onde veio o ficheiro, porque importa e que riscos tem"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-[var(--foreground)]">Owner</span>
                <input
                  value={state.owner}
                  onChange={(event) => setField("owner", event.target.value)}
                  className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                  placeholder="Quem esta a conduzir a extracao"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-[var(--foreground)]">Ferramenta local</span>
                <input
                  value={state.localTool}
                  onChange={(event) => setField("localTool", event.target.value)}
                  className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                  placeholder="OCR local, parser, script, notebook"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Ensinar local-first
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
                <p className="font-semibold text-[var(--foreground)]">1. Extrair localmente</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  O objetivo nao e magia de prompt. E reduzir risco cedo, ver o texto bruto e perceber se
                  o documento merece limpeza antes de qualquer upload.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
                <p className="font-semibold text-[var(--foreground)]">2. Limpar com criterio</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  OCR bom nao basta. Tens de corrigir labels, datas, tabelas curtas e notas de rodape que o
                  parser local nao resolve sozinho.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4">
                <p className="font-semibold text-[var(--foreground)]">3. Pedir review ao modelo</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  DeepSeek entra como revisor e sintetizador, nao como substituto do OCR nem da validacao de base.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              OCR, parser e texto limpo
            </p>
            <div className="mt-4 grid gap-4">
              <label className="block">
                <span className="text-sm font-medium text-[var(--foreground)]">Perfil do parser local</span>
                <textarea
                  value={state.parserProfile}
                  onChange={(event) => setField("parserProfile", event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-[var(--foreground)]">Notas sobre texto bruto</span>
                <textarea
                  value={state.rawTextNote}
                  onChange={(event) => setField("rawTextNote", event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-[var(--foreground)]">Objetivo do texto limpo</span>
                <textarea
                  value={state.cleanedTextGoal}
                  onChange={(event) => setField("cleanedTextGoal", event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                />
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              DeepSeek como camada final
            </p>
            <div className="mt-4 grid gap-4">
              <label className="block">
                <span className="text-sm font-medium text-[var(--foreground)]">Modo de review</span>
                <select
                  value={state.reviewMode}
                  onChange={(event) => setField("reviewMode", event.target.value as ReviewMode)}
                  className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                >
                  {REVIEW_MODES.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </label>

              <p className="rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--muted-foreground)]">
                {REVIEW_MODES.find((mode) => mode.id === state.reviewMode)?.helper}
              </p>

              <label className="block">
                <span className="text-sm font-medium text-[var(--foreground)]">Objetivo do review</span>
                <textarea
                  value={state.reviewGoal}
                  onChange={(event) => setField("reviewGoal", event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Confidence e quality checks
            </p>
            <div className="mt-4 grid gap-4">
              {[
                { key: "ocrConfidence", label: "Confianca do OCR local" },
                { key: "parseConfidence", label: "Confianca do parser / limpeza" },
                { key: "reviewConfidence", label: "Confianca antes do review remoto" },
              ].map((item) => {
                const value = clampScore(state[item.key as keyof Pick<Day6DocumentPipelineWorkbenchState, "ocrConfidence" | "parseConfidence" | "reviewConfidence">] as number);

                return (
                  <label key={item.key} className="block">
                    <div className="flex items-center justify-between gap-3 text-sm font-medium text-[var(--foreground)]">
                      <span>{item.label}</span>
                      <span>
                        {value}% - {scoreLabel(value)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={value}
                      onChange={(event) =>
                        setField(
                          item.key as "ocrConfidence" | "parseConfidence" | "reviewConfidence",
                          Number(event.target.value),
                        )
                      }
                      className="mt-3 w-full accent-[var(--accent)]"
                    />
                  </label>
                );
              })}
            </div>

            <div className="mt-5 grid gap-3">
              {QUALITY_CHECKS.map((check) => {
                const value = state.qualityChecks[check.id];

                return (
                  <div key={check.id} className="rounded-[1rem] border border-[var(--border)] bg-white p-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={value.done}
                        onChange={(event) => updateQualityCheck(check.id, { done: event.target.checked })}
                        className="mt-1 h-4 w-4 rounded border-[var(--border)] accent-[var(--accent)]"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-[var(--foreground)]">{check.label}</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{check.helper}</p>
                      </div>
                    </label>
                    <textarea
                      value={value.note}
                      onChange={(event) => updateQualityCheck(check.id, { note: event.target.value })}
                      rows={2}
                      className="mt-3 w-full rounded-[0.95rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm leading-6 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                      placeholder="Nota curta sobre o estado deste check"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <section className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Captura de evidencia
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
              Cada linha liga o original ao texto limpo. Isto e o que torna o pipeline auditavel e
              evita discutir prompts quando o problema real esta na extracao.
            </p>
          </div>

          <button
            type="button"
            onClick={addEvidence}
            className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
          >
            Adicionar evidencia
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {state.evidence.map((item, index) => (
            <article key={item.id} className="rounded-[1.25rem] border border-[var(--border)] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--foreground)]">Evidencia {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeEvidence(item.id)}
                  className="text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
                >
                  Remover
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-[var(--foreground)]">Pagina ou zona</span>
                  <input
                    value={item.pageRef}
                    onChange={(event) => updateEvidence(item.id, "pageRef", event.target.value)}
                    className="mt-2 w-full rounded-[0.95rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                    placeholder="Pag. 3, tabela 2, rodape"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-[var(--foreground)]">Issue observada</span>
                  <input
                    value={item.issue}
                    onChange={(event) => updateEvidence(item.id, "issue", event.target.value)}
                    className="mt-2 w-full rounded-[0.95rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                    placeholder="Texto partido, data errada, tabela truncada"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">Trecho bruto do OCR</span>
                  <textarea
                    value={item.rawSnippet}
                    onChange={(event) => updateEvidence(item.id, "rawSnippet", event.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-[0.95rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm leading-6 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">Versao limpa</span>
                  <textarea
                    value={item.cleanedSnippet}
                    onChange={(event) => updateEvidence(item.id, "cleanedSnippet", event.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-[0.95rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm leading-6 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">Resolucao ou decisao</span>
                  <textarea
                    value={item.resolution}
                    onChange={(event) => updateEvidence(item.id, "resolution", event.target.value)}
                    rows={2}
                    className="mt-2 w-full rounded-[0.95rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2 text-sm leading-6 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
                    placeholder="Como foi corrigido ou porque ficou pendente"
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Veredito do operador
          </p>
          <div className="mt-4 grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-[var(--foreground)]">Decisao atual</span>
              <textarea
                value={state.decision}
                onChange={(event) => setField("decision", event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[var(--foreground)]">Proximo passo</span>
              <textarea
                value={state.nextStep}
                onChange={(event) => setField("nextStep", event.target.value)}
                rows={3}
                className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[var(--accent-soft)]"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Resumo copiavel do workflow local
          </p>
          <textarea
            readOnly
            value={workflowSummary}
            rows={18}
            className="mt-4 w-full rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 font-mono text-xs leading-6 text-[var(--foreground)] outline-none"
          />
        </section>
      </div>
    </section>
  );
}
