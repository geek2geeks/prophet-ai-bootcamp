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

const STORAGE_KEY = "aibootcamp-day9-integration-workspace-v1";

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

  const handoffBlock = useMemo(() => {
    const checkpointLines = CHECKPOINTS.map((item) => {
      const checkpoint = state.checkpoints[item.id];
      return `- ${item.label}: ${checkpoint.done ? "ok" : "pendente"} | ${checkpoint.note || "sem nota"}`;
    });

    return [
      "# Handoff de integracao local-first",
      "",
      `Projeto: ${state.projectName || "n/d"}`,
      `Path local: ${state.localPath || "n/d"}`,
      `Branch: ${state.branchName || "n/d"}`,
      `Objetivo: ${state.integrationGoal || "n/d"}`,
      `Ficheiro de teste: ${state.uploadedFileName || "n/d"}`,
      `Comando de run: ${state.runCommand || "n/d"}`,
      `Guardar em: ${state.guardarLocation || "n/d"}`,
      "",
      "Estado por etapa:",
      `- Upload: ${state.uploadedNote || "n/d"}`,
      `- Run: ${state.runOutput || "n/d"}`,
      `- Explain: ${state.explainOutcome || "n/d"}`,
      `- Guardar: ${state.guardarChecklist || "n/d"}`,
      "",
      "Checkpoints de app:",
      ...checkpointLines,
      "",
      "Notas de handoff documento -> AI:",
      state.handoffNotes || "n/d",
    ].join("\n");
  }, [state]);

  const integrationPlan = useMemo(() => {
    const activeChecks = CHECKPOINTS.map((item) => {
      const checkpoint = state.checkpoints[item.id];
      return `- ${item.label}: ${checkpoint.done ? "feito" : "por fechar"}`;
    });

    return [
      "# Plano de integracao para a app local",
      "",
      `Projeto alvo: ${state.projectName || "Minha app local"}`,
      `Path: ${state.localPath || "C:/dev/minha-app"}`,
      `Branch sugerida: ${state.branchName || "feature/day9-integracao-local"}`,
      "",
      "## Fluxo minimo",
      "1. Criar uma zona de upload local com preview do ficheiro e validacao de tamanho/formato.",
      "2. Extrair um excerto pequeno do documento e mostrar o que vai para o prompt antes da chamada AI.",
      "3. Chamar um endpoint local da app com payload minimo: fileName, snippet, objetivo e contexto.",
      "4. Mostrar resposta em portugues com streaming e tres blocos: resumo, riscos, confirmacao humana necessaria.",
      "5. Guardar localmente o ultimo run, o prompt usado e a resposta em localStorage ou ficheiro de suporte no repo.",
      "",
      "## Contrato sugerido",
      "POST /api/integration/explain",
      "body: { fileName, snippet, integrationGoal, notes }",
      "response: { summary, extractedFacts, aiInference, humanChecks, nextStep }",
      "",
      "## Regras local-first",
      "- Nunca mandar o documento inteiro se um excerto controlado chega para a tarefa.",
      "- Se a AI falhar, manter preview local e permitir nota manual sem bloquear a app.",
      "- Guardar exemplos de request e response no repo para debugging e onboarding.",
      "- Logar input resumido, duracao, erro e decisao final da chamada.",
      "- Quando o output precisar de shape fiavel, pedir JSON mode; quando o UX importar, usar streaming para reduzir espera sentida.",
      "",
      "## Checkpoints atuais",
      ...activeChecks,
      "",
      "## Nota para o agente AI",
      state.explainPrompt || "Explica o output, separa facto de inferencia e aponta confirmacoes humanas.",
      "",
      "## Nota livre do estudante",
      state.appPlanNotes || "Comecar pequeno e so depois expandir o fluxo.",
    ].join("\n");
  }, [state]);

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
    <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Lab Dia 9
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Integrar documento, app local e AI sem perder controlo do fluxo.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            Este workspace ajuda o estudante a desenhar uma integracao pequena, testavel e local-first:
            receber ficheiro, correr a app, pedir explicacao ao modelo e guardar tudo com handoff claro.
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.08),rgba(124,63,88,0.03))] px-4 py-3 text-sm text-[var(--foreground)]">
          Pronto para integrar: {readiness}%
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
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

          <div className="rounded-[1.3rem] border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.06),rgba(124,63,88,0.1))] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Plano copiavel para a app local
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Copia este bloco para o teu repo, issue local ou para pedir implementacao assistida no CLI.
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyText("plan", integrationPlan)}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                {copiedKey === "plan" ? "Plano copiado" : "Copiar plano"}
              </button>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--border)] bg-white p-4 text-xs leading-6 text-[var(--foreground)]">
              {integrationPlan}
            </pre>
          </div>

          <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Handoff final
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Bloco curto para passar integracao, estado atual e limites da automacao a outra pessoa.
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyText("handoff", handoffBlock)}
                className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
              >
                {copiedKey === "handoff" ? "Handoff copiado" : "Copiar handoff"}
              </button>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--border)] bg-white p-4 text-xs leading-6 text-[var(--foreground)]">
              {handoffBlock}
            </pre>
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
