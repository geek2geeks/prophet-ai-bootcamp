"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import {
  DEEPSEEK_READABLE_FILE_EXTENSIONS,
  DEEPSEEK_READABLE_FILE_SUMMARY,
  getDeepSeekReadableFileError,
  isDeepSeekReadableTextFile,
} from "@/lib/deepseek-readable-files";

type StageId = "upload" | "run" | "explain" | "guardar";
type CheckpointId =
  | "repo"
  | "env"
  | "endpoint"
  | "fallback"
  | "observability"
  | "handoff";

type Checkpoint = {
  done: boolean;
  note: string;
};

type IntegrationState = {
  projectName: string;
  localPath: string;
  branchName: string;
  integrationGoal: string;
  uploadedFileName: string;
  uploadedFileSize: string;
  uploadedSnippet: string;
  uploadedNote: string;
  activeStage: StageId;
  runCommand: string;
  runOutput: string;
  runRisk: string;
  explainPrompt: string;
  explainOutcome: string;
  guardarLocation: string;
  guardarChecklist: string;
  handoffNotes: string;
  appPlanNotes: string;
  checkpoints: Record<CheckpointId, Checkpoint>;
};

const STORAGE_KEY = "aibootcamp-day9-integration-workspace-v2";

const STAGES: Array<{
  id: StageId;
  label: string;
  helper: string;
  accent: string;
  panel: string;
}> = [
  {
    id: "upload",
    label: "Upload",
    helper: "Recebe o artefacto local, confirma formato e extrai contexto antes de ligar AI.",
    accent: "#2f6b72",
    panel: "rgba(47,107,114,0.08)",
  },
  {
    id: "run",
    label: "Run",
    helper: "Executa localmente, observa logs e prova que a integracao nao depende de magia remota.",
    accent: "#8c4a2f",
    panel: "rgba(140,74,47,0.08)",
  },
  {
    id: "explain",
    label: "Explain",
    helper: "Passa ao modelo so o contexto minimo necessario e pede explicacao orientada a decisao.",
    accent: "#7c3f58",
    panel: "rgba(124,63,88,0.08)",
  },
  {
    id: "guardar",
    label: "Guardar",
    helper: "Guarda output, notas e criterio de retoma para o teu repo e para a proxima pessoa.",
    accent: "#4d6b3c",
    panel: "rgba(77,107,60,0.09)",
  },
];

const CHECKPOINTS: Array<{ id: CheckpointId; label: string; helper: string }> = [
  {
    id: "repo",
    label: "Integracao encaixa no repo local",
    helper: "Existe pasta, modulo e ponto de entrada claro no projeto do estudante.",
  },
  {
    id: "env",
    label: "Config local e fallback definidos",
    helper: "As variaveis sao conhecidas e existe modo degradado quando AI falha.",
  },
  {
    id: "endpoint",
    label: "Contrato entre app e AI fechado",
    helper: "Input, output, limite de ficheiro e shape de resposta estao escritos.",
  },
  {
    id: "fallback",
    label: "Run manual continua possivel",
    helper: "O fluxo ainda funciona com ficheiro, parser ou resumo manual local-first.",
  },
  {
    id: "observability",
    label: "Logs e checkpoints de debugging prontos",
    helper: "Ha logs, estados e mensagens que explicam o que aconteceu em cada etapa.",
  },
  {
    id: "handoff",
    label: "Notas de handoff copiaveis",
    helper: "Outra pessoa consegue retomar a integracao so com repo, prompt e checklist.",
  },
];

const ASSETS = [
  {
    title: "integration_checklist.md",
    description: "Checklist completo para validar cada etapa da integracao local-first.",
    href: "/course-assets/day9/integration_checklist.md",
  },
  {
    title: "motor_api_contract.md",
    description: "Contrato da API do motor deterministic com inputs, outputs e erros.",
    href: "/course-assets/day9/motor_api_contract.md",
  },
  {
    title: "copilot_prompt_template.md",
    description: "Template de prompt para o copilot explicar resultados em linguagem simples.",
    href: "/course-assets/day9/copilot_prompt_template.md",
  },
  {
    title: "sample_policy_document.md",
    description: "Documento de exemplo para testar o fluxo completo de document drop.",
    href: "/course-assets/day9/sample_policy_document.md",
  },
];

function createInitialState(): IntegrationState {
  return {
    projectName: "Minha app local",
    localPath: "C:/dev/minha-app",
    branchName: "feature/day9-integracao-local",
    integrationGoal:
      "Ligar upload de documento a uma chamada AI simples, explicar o resultado e guardar evidencia no repo sem depender de uma plataforma externa.",
    uploadedFileName: "",
    uploadedFileSize: "",
    uploadedSnippet:
      "Cola aqui um excerto do documento ou usa o upload para guardar um preview local do conteudo mais relevante.",
    uploadedNote:
      "Extrair so o necessario: titulo, versao, secao alvo e dados que vao entrar no prompt.",
    activeStage: "upload",
    runCommand: "pnpm dev",
    runOutput:
      "Esperado: upload local aceite, chamada AI controlada, resposta mostrada na UI e fallback legivel quando a inferencia falha.",
    runRisk: "Maior risco atual: a app esconder erro de parse ou timeout e o aluno nao saber onde falhou.",
    explainPrompt:
      "Explica o output desta integracao em portugues simples. Diz o que veio do documento, o que foi inferido pelo modelo e o que precisa de confirmacao humana.",
    explainOutcome:
      "O modelo deve devolver uma explicacao curta, com limites claros e sem fingir certeza onde ha duvida no documento.",
    guardarLocation: "docs/integracao-ai.md + logs locais + sample fixture no repo",
    guardarChecklist:
      "Guardar prompt, resposta exemplo, ficheiro de teste, comando de run e erro conhecido mais provavel.",
    handoffNotes:
      "Documento entra localmente, a app extrai um excerto pequeno, chama AI so com contexto minimo e guarda um resumo reproduzivel no repo.",
    appPlanNotes:
      "Comecar pequeno: upload -> parse -> preview -> chamar endpoint local -> mostrar explicacao -> guardar nota de run.",
    checkpoints: {
      repo: { done: true, note: "Componentes e pasta de integracao ja pensados no repo local." },
      env: { done: false, note: "Definir NEXT_PUBLIC ou server env so se for mesmo necessario." },
      endpoint: { done: false, note: "Escrever payload minimo e resposta esperada antes do coding final." },
      fallback: { done: true, note: "Se AI falhar, manter preview do documento e nota manual." },
      observability: { done: false, note: "Adicionar logs de upload, request, response e erro." },
      handoff: { done: false, note: "Copiar plano final para docs ou issue local." },
    },
  };
}

function buildIntegrationSpec(state: IntegrationState): string {
  const activeChecks = CHECKPOINTS.map((item) => {
    const checkpoint = state.checkpoints[item.id];
    return `- [${checkpoint.done ? "x" : " "}] ${item.label} — ${checkpoint.note || "sem nota"}`;
  });

  return [
    "# Spec de Integracao: Motor + UI + Copilot + Document Drop",
    "",
    "## Projeto",
    `- Nome: ${state.projectName || "n/d"}`,
    `- Path local: ${state.localPath || "n/d"}`,
    `- Branch: ${state.branchName || "n/d"}`,
    "",
    "## Objetivo da Integracao",
    state.integrationGoal || "Nao definido.",
    "",
    "## Componentes",
    "",
    "### 1. Document Drop (Upload)",
    `- Ficheiro de teste: ${state.uploadedFileName || "n/d"}`,
    `- Tamanho: ${state.uploadedFileSize || "n/d"}`,
    `- Nota de extracao: ${state.uploadedNote || "n/d"}`,
    "",
    "### 2. Motor Deterministic",
    `- Comando de run: ${state.runCommand || "n/d"}`,
    `- Output esperado: ${state.runOutput || "n/d"}`,
    `- Risco principal: ${state.runRisk || "n/d"}`,
    "",
    "### 3. Copilot (Explain)",
    `- Prompt: ${state.explainPrompt || "n/d"}`,
    `- Resposta desejada: ${state.explainOutcome || "n/d"}`,
    "",
    "### 4. Persistencia (Guardar)",
    `- Localizacao: ${state.guardarLocation || "n/d"}`,
    `- Checklist: ${state.guardarChecklist || "n/d"}`,
    "",
    "## Checkpoints de Integracao",
    ...activeChecks,
    "",
    "## Notas de Handoff",
    state.handoffNotes || "n/d",
    "",
    "## Plano de Implementacao",
    state.appPlanNotes || "n/d",
    "",
    "## Regras Local-First",
    "- Upload e preview funcionam offline.",
    "- Motor corre localmente sem cloud.",
    "- Copilot tem fallback manual se AI falhar.",
    "- Logs guardam evidencia de cada run.",
    "",
  ].join("\n");
}

function buildOpenCodePrompt(state: IntegrationState): string {
  const completedChecks = CHECKPOINTS.filter((item) => state.checkpoints[item.id].done).length;
  const totalChecks = CHECKPOINTS.length;

  return [
    "Prompt para construir a app integrada Dia 9",
    "",
    `Projeto: ${state.projectName}`,
    `Path: ${state.localPath}`,
    `Branch: ${state.branchName}`,
    "",
    "Objetivo:",
    state.integrationGoal,
    "",
    `Estado atual: ${completedChecks}/${totalChecks} checkpoints fechados.`,
    "",
    "Componentes a implementar:",
    "",
    "1. Document Drop",
    `   - Upload local com preview: ${state.uploadedNote}`,
    "",
    "2. Motor Deterministic",
    `   - Comando: ${state.runCommand}`,
    `   - Output: ${state.runOutput}`,
    "",
    "3. Copilot",
    `   - Prompt: ${state.explainPrompt}`,
    "",
    "4. Guardar",
    `   - Local: ${state.guardarLocation}`,
    "",
    "Pede ao agente para:",
    "1. criar a estrutura de pastas e componentes;",
    "2. implementar upload local com validacao de formato;",
    "3. ligar o motor com logs observaveis;",
    "4. adicionar o copilot com fallback manual;",
    "5. guardar evidencia de cada run;",
    "6. manter tudo local-first e testavel.",
    "",
    "Notas livres:",
    state.appPlanNotes,
  ].join("\n");
}

export function Day9IntegrationWorkspace() {
  const [state, setState] = useState<IntegrationState>(() => {
    if (typeof window === "undefined") {
      return createInitialState();
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as IntegrationState) : createInitialState();
    } catch {
      return createInitialState();
    }
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      return;
    }
  }, [state]);

  const completedCheckpoints = useMemo(
    () => CHECKPOINTS.filter((item) => state.checkpoints[item.id].done).length,
    [state.checkpoints],
  );

  const readiness = useMemo(() => {
    const signals = [
      state.projectName,
      state.localPath,
      state.branchName,
      state.integrationGoal,
      state.uploadedFileName,
      state.uploadedSnippet,
      state.runCommand,
      state.runOutput,
      state.explainPrompt,
      state.explainOutcome,
      state.guardarLocation,
      state.guardarChecklist,
      state.handoffNotes,
      state.appPlanNotes,
      ...CHECKPOINTS.flatMap((item) => [state.checkpoints[item.id].note]),
    ];

    const filled = signals.filter((value) => value.trim().length > 10).length;
    return Math.round((filled / signals.length) * 100);
  }, [state]);

  const currentStage = STAGES.find((item) => item.id === state.activeStage) ?? STAGES[0];

  const integrationSpec = useMemo(() => buildIntegrationSpec(state), [state]);
  const openCodePrompt = useMemo(() => buildOpenCodePrompt(state), [state]);

  function setField<Key extends keyof IntegrationState>(key: Key, value: IntegrationState[Key]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function updateCheckpoint(id: CheckpointId, patch: Partial<Checkpoint>) {
    setState((current) => ({
      ...current,
      checkpoints: {
        ...current.checkpoints,
        [id]: {
          ...current.checkpoints[id],
          ...patch,
        },
      },
    }));
  }

  async function copyText(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1800);
  }

  function downloadSpec() {
    const blob = new Blob([integrationSpec], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "integration-spec-day9.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!isDeepSeekReadableTextFile(file)) {
      setUploadMessage(getDeepSeekReadableFileError("Este lab"));
      event.target.value = "";
      return;
    }

    setUploadMessage(null);

    const sizeKb = Math.max(1, Math.round(file.size / 1024));
    setState((current) => ({
      ...current,
      uploadedFileName: file.name,
      uploadedFileSize: `${sizeKb} KB`,
      activeStage: "upload",
    }));

    try {
      const text = await file.text();
      const snippet = text.replace(/\s+/g, " ").trim().slice(0, 1800);
      setState((current) => ({
        ...current,
        uploadedFileName: file.name,
        uploadedFileSize: `${sizeKb} KB`,
        uploadedSnippet: snippet || "Ficheiro carregado, mas sem texto legivel no preview.",
      }));
    } catch {
      setState((current) => ({
        ...current,
        uploadedFileName: file.name,
        uploadedFileSize: `${sizeKb} KB`,
        uploadedSnippet:
          "Nao foi possivel ler texto do ficheiro no browser. Guarda ao menos nome, tamanho e nota manual para o handoff.",
      }));
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Lab Dia 9 — Integracao Completa
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
              Integrar documento, app local e AI sem perder controlo do fluxo.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
              Define uma integracao pequena, testavel e local-first: receber ficheiro, correr a app,
              pedir explicacao ao modelo e guardar tudo com handoff claro.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.08),rgba(124,63,88,0.03))] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]">
              {readiness}% pronto
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Ficheiros de apoio — descarrega antes de comecar
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ASSETS.map((asset) => (
            <a
              key={asset.href}
              href={asset.href}
              download
              className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-white p-4 transition hover:border-[var(--accent-soft)] hover:shadow-sm"
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">{asset.title}</p>
              <p className="text-xs leading-5 text-[var(--muted-foreground)]">{asset.description}</p>
              <span className="mt-auto text-xs font-semibold text-[var(--accent)]">Descarregar</span>
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label="Etapa ativa" value={currentStage.label} />
            <MetricCard label="Checkpoints fechados" value={`${completedCheckpoints}/${CHECKPOINTS.length}`} />
          </div>

          <div
            className="rounded-[1.3rem] border p-4"
            style={{ borderColor: currentStage.accent, backgroundColor: currentStage.panel }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: currentStage.accent }}>
              Etapas do fluxo
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{currentStage.helper}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {STAGES.map((stage) => {
                const active = stage.id === state.activeStage;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setField("activeStage", stage.id)}
                    className="rounded-full border px-3 py-2 text-sm font-medium transition"
                    style={{
                      borderColor: active ? stage.accent : "var(--border)",
                      backgroundColor: active ? stage.accent : "white",
                      color: active ? "white" : "var(--foreground)",
                    }}
                  >
                    {stage.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Contexto da app
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field
                label="Projeto"
                value={state.projectName}
                onChange={(value) => setField("projectName", value)}
                placeholder="Nome da app local"
              />
              <Field
                label="Branch"
                value={state.branchName}
                onChange={(value) => setField("branchName", value)}
                placeholder="feature/..."
              />
              <Field
                label="Path local"
                value={state.localPath}
                onChange={(value) => setField("localPath", value)}
                placeholder="C:/dev/..."
              />
              <Field
                label="Ficheiro teste"
                value={state.uploadedFileName}
                onChange={(value) => setField("uploadedFileName", value)}
                placeholder="sample.txt ou policy.md"
              />
            </div>

            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Objetivo da integracao
              </span>
              <textarea
                value={state.integrationGoal}
                onChange={(event) => setField("integrationGoal", event.target.value)}
                className="mt-3 min-h-28 w-full rounded-[1rem] border border-[var(--border)] bg-white px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
              />
            </label>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Upload local
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Faz upload de um ficheiro textual que o DeepSeek 3.2 consiga ler diretamente, guarda um preview curto e mantem a app capaz de continuar sem cloud.
                </p>
              </div>
              <label className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
                Escolher ficheiro
                <input
                  type="file"
                  accept={DEEPSEEK_READABLE_FILE_EXTENSIONS}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <p className="mt-4 text-xs leading-6 text-[var(--muted-foreground)]">
              Formatos aceites: {DEEPSEEK_READABLE_FILE_SUMMARY}.
            </p>

            {uploadMessage ? (
              <div className="mt-4 rounded-[1rem] border border-[#d8a1a1] bg-[#fff5f5] px-4 py-3 text-sm text-[#8b3f3f]">
                {uploadMessage}
              </div>
            ) : null}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field
                label="Nome do ficheiro"
                value={state.uploadedFileName}
                onChange={(value) => setField("uploadedFileName", value)}
                placeholder="sample.txt"
              />
              <Field
                label="Tamanho"
                value={state.uploadedFileSize}
                onChange={(value) => setField("uploadedFileSize", value)}
                placeholder="12 KB"
              />
            </div>

            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Nota de upload
              </span>
              <textarea
                value={state.uploadedNote}
                onChange={(event) => setField("uploadedNote", event.target.value)}
                className="mt-3 min-h-24 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Preview extraido para a AI
              </span>
              <textarea
                value={state.uploadedSnippet}
                onChange={(event) => setField("uploadedSnippet", event.target.value)}
                className="mt-3 min-h-40 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 font-mono text-xs leading-6 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <TextPanel
              title="Run local"
              helper="Comando e output esperado para provar que a integracao corre no teu ambiente."
              value={state.runCommand}
              secondaryValue={state.runOutput}
              onChange={(value) => setField("runCommand", value)}
              onSecondaryChange={(value) => setField("runOutput", value)}
              primaryLabel="Comando"
              secondaryLabel="Output esperado"
            />
            <TextPanel
              title="Explain"
              helper="Prompt de explicacao curto, orientado a decisao e sem pedir fantasia ao modelo."
              value={state.explainPrompt}
              secondaryValue={state.explainOutcome}
              onChange={(value) => setField("explainPrompt", value)}
              onSecondaryChange={(value) => setField("explainOutcome", value)}
              primaryLabel="Prompt"
              secondaryLabel="Resposta desejada"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TextPanel
              title="Guardar"
              helper="Define onde a evidencia vive no repo ou no browser para a proxima iteracao."
              value={state.guardarLocation}
              secondaryValue={state.guardarChecklist}
              onChange={(value) => setField("guardarLocation", value)}
              onSecondaryChange={(value) => setField("guardarChecklist", value)}
              primaryLabel="Onde guardar"
              secondaryLabel="Checklist minima"
            />
            <TextPanel
              title="Handoff documento -> AI"
              helper="Escreve o que sai do documento, o que entra no prompt e o que continua humano."
              value={state.handoffNotes}
              secondaryValue={state.runRisk}
              onChange={(value) => setField("handoffNotes", value)}
              onSecondaryChange={(value) => setField("runRisk", value)}
              primaryLabel="Notas de handoff"
              secondaryLabel="Risco principal"
            />
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Checkpoints de integracao da app
            </p>
            <div className="mt-4 space-y-3">
              {CHECKPOINTS.map((item) => {
                const checkpoint = state.checkpoints[item.id];
                return (
                  <div
                    key={item.id}
                    className="rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => updateCheckpoint(item.id, { done: !checkpoint.done })}
                          className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition"
                          style={{
                            borderColor: checkpoint.done ? "var(--accent)" : "var(--border)",
                            backgroundColor: checkpoint.done ? "var(--accent)" : "white",
                            color: checkpoint.done ? "white" : "var(--foreground)",
                          }}
                        >
                          {checkpoint.done ? "OK" : "-"}
                        </button>
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{item.label}</p>
                          <p className="mt-1 text-sm leading-7 text-[var(--muted-foreground)]">{item.helper}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                        {checkpoint.done ? "Fechado" : "Pendente"}
                      </span>
                    </div>

                    <textarea
                      value={checkpoint.note}
                      onChange={(event) => updateCheckpoint(item.id, { note: event.target.value })}
                      className="mt-4 min-h-24 w-full rounded-[1rem] border border-[var(--border)] bg-white px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <label className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4 block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Nota livre para o plano da app
            </span>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
              Usa este campo para adaptar o plano a Next.js, React, API routes, parser local ou outra stack do aluno.
            </p>
            <textarea
              value={state.appPlanNotes}
              onChange={(event) => setField("appPlanNotes", event.target.value)}
              className="mt-4 min-h-28 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
            />
          </label>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Artefacto final — integration-spec-day9.md
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
              Descarrega a spec completa ou copia o prompt para pedir ao OpenCode para construir a app integrada.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => copyText("prompt", openCodePrompt)}
              className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
            >
              {copiedKey === "prompt" ? "Copiado" : "Copiar prompt"}
            </button>
            <button
              type="button"
              onClick={() => copyText("spec", integrationSpec)}
              className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
            >
              {copiedKey === "spec" ? "Copiado" : "Copiar spec"}
            </button>
            <button
              type="button"
              onClick={downloadSpec}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            >
              Descarregar spec.md
            </button>
          </div>
        </div>

        <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-xs leading-6 text-[var(--foreground)]">
          {integrationSpec}
        </pre>

        <div className="mt-4 rounded-xl border border-dashed border-[var(--border-strong)] bg-white/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            Prompt para OpenCode / GLM-5 — construir a app integrada
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{openCodePrompt}</p>
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
  secondaryValue,
  onChange,
  onSecondaryChange,
  primaryLabel,
  secondaryLabel,
}: {
  title: string;
  helper: string;
  value: string;
  secondaryValue: string;
  onChange: (value: string) => void;
  onSecondaryChange: (value: string) => void;
  primaryLabel: string;
  secondaryLabel: string;
}) {
  return (
    <section className="rounded-[1.3rem] border border-[var(--border)] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{helper}</p>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          {primaryLabel}
        </span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-3 min-h-24 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          {secondaryLabel}
        </span>
        <textarea
          value={secondaryValue}
          onChange={(event) => onSecondaryChange(event.target.value)}
          className="mt-3 min-h-28 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-3 text-sm leading-7 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
        />
      </label>
    </section>
  );
}
