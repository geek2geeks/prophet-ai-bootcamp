"use client";

import { useEffect, useMemo, useState } from "react";

import { GlossaryText } from "@/components/glossary-text";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { DAY2_GLOSSARY } from "@/lib/day2-glossary";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TemplateId = "assumptions" | "document-drop" | "audit";

type Draft = {
  problem: string;
  user: string;
  scope: string;
  outOfScope: string;
  inputs: string;
  validations: string;
  outputs: string;
  edgeCases: string;
  acceptance: string;
};

type SupportPack = {
  constitution: string;
  clarifications: string;
  acceptanceChecklist: string;
};

type SpecStudioState = {
  activeTemplate: TemplateId;
  drafts: Record<TemplateId, Draft>;
  supportPack: SupportPack;
};

type CommandKind = "terminal" | "opencode";

type StepBlock = {
  title: string;
  body: string;
  commands?: string[];
  commandKind?: CommandKind;
};

const STORAGE_KEY = "aibootcamp-day2-spec-studio-v2";

// ---------------------------------------------------------------------------
// Template definitions
// ---------------------------------------------------------------------------

const BLANK_DRAFT: Draft = {
  problem: "",
  user: "",
  scope: "",
  outOfScope: "",
  inputs: "",
  validations: "",
  outputs: "",
  edgeCases: "",
  acceptance: "",
};

const SUPPORT_PACK_STARTER: SupportPack = {
  constitution: [
    "- Mensagens de erro devem dizer o que falhou e como corrigir.",
    "- O utilizador deve perceber o estado do ficheiro antes de guardar.",
    "- A primeira versao do MVP privilegia clareza e validacao, nao automacao total.",
  ].join("\n"),
  clarifications: [
    "- [ ] Que colunas sao obrigatorias na primeira versao?",
    "- [ ] O sistema bloqueia uploads invalidos ou permite guardar como rascunho?",
    "- [ ] Que mensagem aparece quando o ficheiro tem colunas trocadas?",
  ].join("\n"),
  acceptanceChecklist: [
    "- [ ] O utilizador consegue iniciar o fluxo sem ajuda tecnica.",
    "- [ ] O sistema valida os dados antes de aceitar o ficheiro.",
    "- [ ] Os erros aparecem em linguagem simples e acionavel.",
    "- [ ] Existe um sinal claro de sucesso no fim do processo.",
  ].join("\n"),
};

const QUICK_EXERCISE_STEPS: StepBlock[] = [
  {
    title: "Objetivo do exercicio",
    body:
      "Construir uma webapp pequena que le um CSV atuarial, mostra 3 a 5 metricas chave e gera um relatorio executivo em PDF para decisores. No fim, a app deve ficar publicada em Firebase Hosting e o URL deve ser enviado ao tutor.",
  },
  {
    title: "Que relatorio um atuario gera aqui",
    body:
      "Usa um relatorio executivo de seguros Vida: resumo da carteira, capital segurado, premio anual, mistura de produtos, estados da carteira e 3 conclusoes prudentes para negocio. O PDF deve ser legivel por um CEO, CFO, diretor tecnico ou responsavel de produto.",
  },
  {
    title: "Onde entra a AI",
    body:
      "Sim, e possivel usar DeepSeek para transformar metricas e tabelas num texto executivo, desde que prepares bem o contexto. A AI deve receber os numeros ja agregados, a audiencia do relatorio, o tom esperado e limites claros para nao inventar conclusoes que os dados nao suportam.",
  },
];

const DATASET_STEPS: StepBlock[] = [
  {
    title: "1. Escolher um dataset",
    body:
      "Comeca com `carteira_vida_sample_day2.csv`. Se quiseres variar, testa depois os cenarios jovem, senior ou alerta operacional.",
  },
  {
    title: "2. Descarregar os 3 ficheiros essenciais",
    body:
      "Para nao falhar nada, descarrega sempre: um CSV, o brief do relatorio e o prompt base do DeepSeek.",
  },
  {
    title: "3. Saber o que vais entregar",
    body:
      "No fim do dia tens de ter um site publicado, um PDF executivo gerado pela app e o URL enviado ao tutor.",
  },
];

const INSTALL_STEPS: StepBlock[] = [
  {
    title: "1. Instalar Node.js e Git",
    body:
      "Antes de tudo, confirma que tens Node.js e Git instalados. Sem isso, nao consegues usar npm, correr a app nem guardar versoes do projeto.",
    commands: ["node -v", "git --version"],
    commandKind: "terminal",
  },
  {
    title: "2. Instalar o GitHub Spec Kit",
    body:
      "A forma atual recomendada pelo projeto oficial usa uv. Se ainda nao tens uv, instala-o primeiro; depois instala o comando specify para poderes criar o workflow /speckit.* dentro do OpenCode.",
    commands: [
      "powershell -ExecutionPolicy ByPass -c \"irm https://astral.sh/uv/install.ps1 | iex\"",
      "uv tool install specify-cli --from git+https://github.com/github/spec-kit.git",
      "specify check",
    ],
    commandKind: "terminal",
  },
  {
    title: "3. Instalar o Firebase CLI",
    body:
      "O Firebase CLI serve para autenticar, criar a ligacao ao projeto e fazer deploy do site no fim.",
    commands: ["npm install -g firebase-tools", "firebase --version"],
    commandKind: "terminal",
  },
  {
    title: "4. Instalar o Google Cloud CLI",
    body:
      "Em Windows, descarrega o instalador oficial da Google Cloud e segue os passos do wizard. O comando final chama-se gcloud e serve para autenticar e gerir o projeto cloud ligado a Firebase.",
    commands: [
      "(New-Object Net.WebClient).DownloadFile(\"https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe\", \"$env:Temp\\GoogleCloudSDKInstaller.exe\")",
      "& $env:Temp\\GoogleCloudSDKInstaller.exe",
      "gcloud --version",
    ],
    commandKind: "terminal",
  },
  {
    title: "5. Autenticar os CLIs com a conta certa",
    body:
      "Para este exercicio, a conta usada no browser de login deve ser levelwelness@gmail.com. O aluno deve confirmar visualmente que entrou com essa conta antes de aceitar as permissoes.",
    commands: [
      "firebase login",
      "firebase login:list",
      "gcloud init",
      "gcloud auth list",
    ],
    commandKind: "terminal",
  },
];

const ENV_SETUP_STEPS: StepBlock[] = [
  {
    title: "6. Guardar a chave DeepSeek no projeto",
    body:
      "Cria um ficheiro `.env.local` na raiz do mini projeto e guarda la a tua chave. Reinicia a app depois disso.",
    commands: ['Set-Content -Path .env.local -Value "DEEPSEEK_API_KEY=cola_aqui_a_tua_chave"'],
    commandKind: "terminal",
  },
];

const SPEC_KIT_FLOW: StepBlock[] = [
  {
    title: "Criar a pasta do exercicio",
    commands: ["mkdir relatorio-executivo-pdf", "cd relatorio-executivo-pdf"],
    body: "Cria uma pasta limpa para o mini projeto e abre o OpenCode dentro dessa pasta.",
    commandKind: "terminal",
  },
  {
    title: "Inicializar o Spec Kit para OpenCode",
    commands: ["specify init . --ai opencode --script ps --force"],
    body: "Isto instala o esqueleto do Spec Kit e disponibiliza os comandos /speckit.* dentro do agente.",
    commandKind: "terminal",
  },
  {
    title: "Gerar a constitution no OpenCode",
    commands: [
      "/speckit.constitution Criar principios para uma webapp portuguesa-first que transforma um CSV atuarial num dashboard curto e num PDF executivo. Exigir clareza visual, linguagem nao tecnica, validacao do ficheiro antes de processamento, citacao explicita das metricas usadas no texto AI, e proibicao de conclusoes nao suportadas pelos dados.",
    ],
    body: "O aluno deve correr este comando dentro do chat do OpenCode, nao no terminal. O resultado esperado e o ficheiro constitution.md com regras permanentes.",
    commandKind: "opencode",
  },
  {
    title: "Escrever a spec com contexto rico",
    commands: [
      "/speckit.specify Quero uma webapp simples em portugues que leia o ficheiro carteira_vida_sample_day2.csv, calcule total de apolices, idade media, premio anual total, capital segurado total e mistura por tipo de produto e estado. A app deve mostrar estes numeros num dashboard legivel e permitir gerar um PDF executivo de seguros Vida para decisores nao tecnicos. O PDF deve incluir titulo, data do relatorio, 3 a 5 metricas, 3 insights em linguagem de negocio com foco atuarial Vida e uma nota metodologica curta. A AI DeepSeek pode escrever a narrativa apenas a partir de metricas agregadas e tabelas resumidas produzidas localmente. A narrativa nao pode inventar reservas, projecoes, sinistralidade futura, comportamento do cliente, motivacoes comerciais ou contexto nao presente nos dados. O utilizador deve ver claramente quando a narrativa foi gerada e poder voltar a gerar se mudar os dados."
    ],
    body: "Aqui entra a context engineering: o pedido define audiencia, dados, limites, formato do output e regras para a AI. Para este dia, o PDF deve soar claramente a um relatorio executivo de seguros Vida, nao a um texto generico de analytics.",
    commandKind: "opencode",
  },
  {
    title: "Clarificar antes de planear",
    commands: ["/speckit.clarify", "/speckit.plan Usar Next.js, TypeScript e Firebase Hosting para o frontend. O parser do CSV corre localmente no browser ou no projeto sem backend pesado. A narrativa pode usar DeepSeek por API, mas deve receber apenas metricas agregadas e texto de contexto. A geracao do PDF deve acontecer na app e o deploy final deve ser feito para Firebase Hosting com a conta levelwelness@gmail.com."],
    body: "Se o agente deixar duvidas por resolver, o aluno deve responder antes de seguir. Nao vale saltar para codigo com zonas cinzentas.",
    commandKind: "opencode",
  },
  {
    title: "Quebrar em tarefas e implementar",
    commands: ["/speckit.tasks", "/speckit.implement"],
    body: "No fim desta sequencia, o aluno deve ter uma app local a correr, um PDF exportavel e um plano claro de deploy.",
    commandKind: "opencode",
  },
];

const DEPLOY_STEPS: StepBlock[] = [
  {
    title: "Autenticar e ligar ao projeto",
    commands: ["firebase login --reauth", "gcloud auth list", "firebase projects:list"],
    body: "Confirma que a conta ativa e mesmo levelwelness@gmail.com antes de escolher o projeto final.",
    commandKind: "terminal",
  },
  {
    title: "Inicializar Firebase no projeto",
    commands: ["firebase init hosting"],
    body: "Escolhe o projeto certo, indica a pasta de output do frontend e aceita configuracao para SPA se a app usar routing client-side.",
    commandKind: "terminal",
  },
  {
    title: "Gerar build e publicar",
    commands: ["npm run build", "firebase deploy --only hosting"],
    body: "No fim, copia o URL publicado e envia-o ao tutor juntamente com uma screenshot do PDF executivo gerado pela app.",
    commandKind: "terminal",
  },
];

const FINAL_CHECKLIST = [
  "Escolhi um dataset e consegui ler os numeros base.",
  "Guardei a chave DeepSeek em `.env.local`.",
  "Corri o fluxo do Spec Kit pela ordem certa.",
  "A app gera um PDF com linguagem de seguros Vida.",
  "Publiquei o site e copiei o URL final.",
  "Enviei ao tutor o URL e uma prova do PDF.",
];

const ARCHITECTURE_DIAGRAM = `flowchart LR
    A[CSV atuarial\ncarteira_vida_sample_day2.csv] --> B[Parser local\nlimpeza e agregacao]
    B --> C[Dashboard web\nmetricas chave]
    B --> D[Pacote de contexto\npara DeepSeek]
    D --> E[DeepSeek\nnarrativa executiva]
    C --> F[Gerador PDF]
    E --> F
    F --> G[Relatorio executivo em PDF]
    C --> H[Deploy em Firebase Hosting]
    style B fill:#f0fdf4,stroke:#10b981
    style E fill:#eff6ff,stroke:#3b82f6
    style F fill:#fff7ed,stroke:#f97316
    style H fill:#fdf2f8,stroke:#be185d`;

const CONTEXT_DIAGRAM = `sequenceDiagram
    participant U as Aluno
    participant O as OpenCode
    participant S as Spec Kit
    participant A as App local
    participant D as DeepSeek
    participant F as Firebase Hosting
    U->>S: /speckit.constitution
    U->>S: /speckit.specify com contexto rico
    S-->>O: constitution + spec + plano
    O->>A: implementa dashboard e export PDF
    A->>D: envia metricas agregadas + audiencia + limites
    D-->>A: devolve narrativa executiva
    A->>F: deploy do site
    U-->>Tutor: envia URL final + prova do PDF`;

const BEGINNER_NOTES = [
  "Hoje o objetivo nao e aprender tudo sobre software; e fechar um mini projeto do inicio ao fim.",
  "Se bloqueares, volta a esta pergunta: o que deve aparecer no site e no PDF?",
  "Termos sublinhados a pontilhado explicam-se ao passar o rato.",
];

const PRIMARY_PATH = [
  "1. Instalar e autenticar as ferramentas.",
  "2. Criar constitution e spec no OpenCode.",
  "3. Correr clarify, plan, tasks e implement.",
  "4. Fazer deploy e enviar o URL ao tutor.",
];

const TEMPLATES: Record<
  TemplateId,
  { label: string; summary: string; starter: Draft; openCodePrompt: string }
> = {
  assumptions: {
    label: "Upload de Assumptions",
    summary:
      "Definir upload, validacao e mensagens de erro para tabuas e ficheiros base do motor deterministic.",
    starter: {
      problem:
        "Equipas pequenas perdem tempo a validar ficheiros de assumptions manualmente e so descobrem erros depois de o motor correr.",
      user:
        "Atuario ou product owner que precisa carregar tabuas de mortalidade, lapse e discount sem depender de limpeza manual repetitiva.",
      scope:
        "Permitir upload de CSV, validacao de colunas obrigatorias, preview inicial e bloqueio de ficheiros invalidos antes de guardar.",
      outOfScope:
        "Upload de ficheiros Excel complexos, merge automatico de versoes, integracao com fontes externas de dados.",
      inputs:
        "Ficheiro CSV de assumptions, tipo de assumption (mortalidade/lapse/discount), data de referencia, versao.",
      validations:
        "Validar extensao do ficheiro, colunas obrigatorias presentes, sem duplicados por idade/sexo, valores dentro de intervalo esperado.",
      outputs:
        "Preview das primeiras linhas, estado de validacao (valido/invalido), lista de erros acionaveis, ficheiro aceite para o motor.",
      edgeCases:
        "Ficheiro com separador errado, colunas trocadas, idades em falta, percentagens negativas, upload interrompido.",
      acceptance:
        "O utilizador percebe em menos de 30 segundos se o ficheiro pode entrar no sistema e recebe mensagens claras para corrigir cada erro.",
    },
    openCodePrompt:
      "Tenho uma spec para a feature de upload de assumptions do Prophet Lite. Revê a spec, identifica ambiguidades, sugere edge cases em falta e produz um spec.md final em formato GitHub Spec Kit com: objective, user stories, acceptance criteria, out of scope, e riscos de implementacao.",
  },
  "document-drop": {
    label: "Document Drop",
    summary:
      "Descrever a experiencia de upload documental local-first antes da etapa de AI.",
    starter: {
      problem:
        "Documentos tecnicos e comerciais ficam perdidos em pastas sem classificacao, metadata ou possibilidade de pesquisa inteligente.",
      user:
        "Utilizador de seguros que carrega PDFs, clausulados e memos e quer encontra-los por produto, data ou keyword.",
      scope:
        "Arrastar ficheiros para a app, extrair texto com parser local, classificar por tipo, guardar metadata e permitir pesquisa basica.",
      outOfScope:
        "OCR de imagens de baixa qualidade, integracao com document management systems externos, real-time collaboration.",
      inputs:
        "PDFs, imagens escaneadas, origem do documento, categoria esperada, notas opcionais.",
      validations:
        "Tipo de ficheiro suportado, tamanho maximo, texto extraivel presente, duplicados por hash.",
      outputs:
        "Documento classificado com metadata (tipo, data, produto, versao), excerto textual, confianca da classificacao.",
      edgeCases:
        "PDF sem texto (scan de imagem), documento misto com tabelas e texto, ficheiro corrompido, classificacao ambigua.",
      acceptance:
        "A pipeline local-first corre parser antes de chamar AI. O utilizador ve o estado de cada documento e pode corrigir classificacoes.",
    },
    openCodePrompt:
      "Tenho uma spec para a feature de document drop do Prophet Lite. A pipeline deve ser local-first: parser/OCR corre antes de AI. Revê a spec, verifica que a separacao local/AI esta clara, e produz um spec.md final com acceptance criteria testaveis.",
  },
  audit: {
    label: "Auditar Spec Existente",
    summary:
      "Verificar uma spec antes de pedir implementacao — apanhar falhas de scope, aceite e edge cases.",
    starter: {
      ...BLANK_DRAFT,
      problem: "A spec parece completa mas pode ter estados vazios, erros, naming inconsistente e definicao de pronto vaga.",
      user: "Fundador tecnico que quer validar a spec antes de pedir um coding plan ao LLM.",
      scope: "Criar checklist de auditoria, perguntas de follow-up e versao revista da spec.",
    },
    openCodePrompt:
      "Faz uma auditoria dura a esta spec. Identifica: (1) ambiguidades, (2) edge cases em falta, (3) requisitos contraditorios, (4) criterios de aceite pouco testaveis, (5) dependencias nao declaradas. Produz uma versao revista com todas as correcoes.",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createInitialState() {
  return {
    activeTemplate: "assumptions" as TemplateId,
    drafts: Object.fromEntries(
      Object.entries(TEMPLATES).map(([key, tmpl]) => [key, tmpl.starter]),
    ) as Record<TemplateId, Draft>,
    supportPack: SUPPORT_PACK_STARTER,
  };
}

function isTemplateId(value: string): value is TemplateId {
  return value === "assumptions" || value === "document-drop" || value === "audit";
}

function normaliseState(raw: unknown): SpecStudioState {
  const initial = createInitialState();

  if (!raw || typeof raw !== "object") {
    return initial;
  }

  const candidate = raw as Partial<SpecStudioState> & {
    drafts?: Partial<Record<TemplateId, Partial<Draft>>>;
    supportPack?: Partial<SupportPack>;
  };

  const drafts = (Object.keys(TEMPLATES) as TemplateId[]).reduce<Record<TemplateId, Draft>>((acc, key) => {
    acc[key] = {
      ...initial.drafts[key],
      ...(candidate.drafts?.[key] ?? {}),
    };
    return acc;
  }, {} as Record<TemplateId, Draft>);

  const activeTemplate = isTemplateId(candidate.activeTemplate ?? "")
    ? (candidate.activeTemplate ?? initial.activeTemplate)
    : initial.activeTemplate;

  return {
    activeTemplate,
    drafts,
    supportPack: {
      ...initial.supportPack,
      ...(candidate.supportPack ?? {}),
    },
  };
}

const SPEC_FIELDS: { key: keyof Draft; label: string; hint: string; question: string }[] = [
  {
    key: "problem",
    label: "Problema",
    hint: "Que dor resolve esta feature? Em linguagem de negocio, nao tecnica.",
    question: "Que atraso, erro ou frustracao queres eliminar para o utilizador?",
  },
  {
    key: "user",
    label: "Utilizador principal",
    hint: "Quem sofre com o problema e vai usar a feature.",
    question: "Quem usa isto primeiro e em que momento real do trabalho?",
  },
  {
    key: "scope",
    label: "Scope do MVP",
    hint: "O que esta feature faz nesta versao.",
    question: "O que deve acontecer do inicio ao fim na primeira versao?",
  },
  {
    key: "outOfScope",
    label: "Fora de scope",
    hint: "O que nao entra agora — explicitar protege o builder.",
    question: "Que extras parecem tentadores mas vao ser adiados?",
  },
  {
    key: "inputs",
    label: "Inputs",
    hint: "Que dados, ficheiros ou acoes do utilizador entram.",
    question: "Que informacao inicia o fluxo? Ficheiro, clique, campo ou escolha?",
  },
  {
    key: "validations",
    label: "Validacoes",
    hint: "Que regras devem ser verificadas antes de aceitar.",
    question: "O que tem de ser confirmado antes de o sistema aceitar o pedido?",
  },
  {
    key: "outputs",
    label: "Outputs esperados",
    hint: "O que o utilizador ve ou recebe quando corre bem.",
    question: "Qual e o resultado visivel quando tudo corre bem?",
  },
  {
    key: "edgeCases",
    label: "Edge cases",
    hint: "O que pode correr mal e como o sistema deve reagir.",
    question: "Que situacoes menos normais podem falhar e que resposta devem ter?",
  },
  {
    key: "acceptance",
    label: "Criterios de aceite",
    hint: "Como sabemos que esta pronto — observavel e testavel.",
    question: "Como confirmaria esta feature uma pessoa nao tecnica sem discutir codigo?",
  },
];

const SUPPORT_FIELDS: { key: keyof SupportPack; label: string; hint: string; question: string }[] = [
  {
    key: "constitution",
    label: "constitution.md",
    hint: "Regras permanentes que nao devem mudar de conversa para conversa.",
    question: "Que principios devem manter-se verdadeiros mesmo quando a feature evoluir?",
  },
  {
    key: "clarifications",
    label: "clarifications.md",
    hint: "Perguntas pendentes ou resolvidas antes de pedir implementacao.",
    question: "Que duvidas precisam de resposta para a AI nao adivinhar comportamento?",
  },
  {
    key: "acceptanceChecklist",
    label: "checklist_aceite.md",
    hint: "Checklist final para confirmar se a feature ficou pronta.",
    question: "Que verificacoes concretas vao provar que a entrega esta correta?",
  },
];

function buildSpecMarkdown(template: string, draft: Draft): string {
  return [
    `# Spec: ${template}`,
    "",
    "## Problema",
    draft.problem,
    "",
    "## Utilizador Principal",
    draft.user,
    "",
    "## Scope do MVP",
    draft.scope,
    "",
    "## Fora de Scope",
    draft.outOfScope,
    "",
    "## Inputs",
    draft.inputs,
    "",
    "## Validacoes",
    draft.validations,
    "",
    "## Outputs Esperados",
    draft.outputs,
    "",
    "## Edge Cases",
    draft.edgeCases,
    "",
    "## Criterios de Aceite",
    draft.acceptance,
    "",
  ].join("\n");
}

function buildConstitutionMarkdown(text: string) {
  return ["# Constitution", "", text, ""].join("\n");
}

function buildClarificationsMarkdown(text: string) {
  return ["# Clarifications", "", text, ""].join("\n");
}

function buildAcceptanceChecklistMarkdown(text: string) {
  return ["# Checklist de Aceite", "", text, ""].join("\n");
}

function buildPackageMarkdown(args: {
  templateLabel: string;
  specMarkdown: string;
  constitutionMarkdown: string;
  clarificationsMarkdown: string;
  acceptanceChecklistMarkdown: string;
}) {
  return [
    `# Pacote de Especificacao - ${args.templateLabel}`,
    "",
    "## spec.md",
    "",
    args.specMarkdown,
    "",
    "## constitution.md",
    "",
    args.constitutionMarkdown,
    "",
    "## clarifications.md",
    "",
    args.clarificationsMarkdown,
    "",
    "## checklist_aceite.md",
    "",
    args.acceptanceChecklistMarkdown,
    "",
  ].join("\n");
}

function blockLabel(kind: CommandKind) {
  return kind === "terminal" ? "Terminal / PowerShell" : "Chat do OpenCode";
}

// ---------------------------------------------------------------------------
// Assets section
// ---------------------------------------------------------------------------

const ASSETS = [
  {
    title: "carteira_vida_sample_day2.csv",
    description: "CSV sintetico pequeno para o exercicio principal do dia. Mais leve do que o ficheiro do Dia 0.",
    href: "/course-assets/day2/carteira_vida_sample_day2.csv",
  },
  {
    title: "carteira_vida_jovem_temporaria.csv",
    description: "Carteira mais jovem e mais centrada em Temporario. Boa para testar outra narrativa de Vida.",
    href: "/course-assets/day2/carteira_vida_jovem_temporaria.csv",
  },
  {
    title: "carteira_vida_senior_patrimonial.csv",
    description: "Carteira com capitais maiores e mais Vida Inteira. Boa para um relatorio mais patrimonial.",
    href: "/course-assets/day2/carteira_vida_senior_patrimonial.csv",
  },
  {
    title: "carteira_vida_alerta_operacional.csv",
    description: "Carteira com mais Resgatadas e Sinistradas. Boa para testar um resumo executivo prudente.",
    href: "/course-assets/day2/carteira_vida_alerta_operacional.csv",
  },
  {
    title: "day2_report_brief.md",
    description: "Diz ao aluno exatamente o que o dashboard e o PDF devem mostrar.",
    href: "/course-assets/day2/day2_report_brief.md",
  },
  {
    title: "day2_deepseek_prompt_template.md",
    description: "Prompt base para pedir ao DeepSeek um relatorio Vida sem inventar conceitos nao presentes nos dados.",
    href: "/course-assets/day2/day2_deepseek_prompt_template.md",
  },
  {
    title: "day2_dataset_scenarios.md",
    description: "Ajuda a escolher o dataset certo para o tipo de relatorio Vida que queres testar.",
    href: "/course-assets/day2/day2_dataset_scenarios.md",
  },
  {
    title: "day2_metrics_reference.md",
    description: "Valores de referencia para confirmar se o CSV foi lido corretamente.",
    href: "/course-assets/day2/day2_metrics_reference.md",
  },
  {
    title: "spec_kit_primer.md",
    description: "Explicacao do fluxo: constitution → specify → clarify → plan → tasks → implement.",
    href: "/course-assets/docs/spec_kit_primer.md",
  },
  {
    title: "template_spec.md",
    description: "Template para transformar uma ideia em spec funcional com criterios de aceite.",
    href: "/course-assets/docs/template_spec.md",
  },
  {
    title: "template_constitution.md",
    description: "Template de principios permanentes: UX, erros, convencoes, limites do MVP.",
    href: "/course-assets/docs/template_constitution.md",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Day2SpecStudio() {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return createInitialState();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? normaliseState(JSON.parse(raw)) : createInitialState();
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

  const config = TEMPLATES[state.activeTemplate];
  const draft = state.drafts[state.activeTemplate];
  const constitutionMarkdown = buildConstitutionMarkdown(state.supportPack.constitution);
  const clarificationsMarkdown = buildClarificationsMarkdown(state.supportPack.clarifications);
  const acceptanceChecklistMarkdown = buildAcceptanceChecklistMarkdown(state.supportPack.acceptanceChecklist);

  const completion = useMemo(() => {
    const fields = Object.values(draft);
    const filled = fields.filter((v) => v.trim().length > 15).length;
    return Math.round((filled / fields.length) * 100);
  }, [draft]);

  const packageCompletion = useMemo(() => {
    const fields = Object.values(state.supportPack);
    const filled = fields.filter((value) => value.trim().length > 30).length;
    return Math.round((filled / fields.length) * 100);
  }, [state.supportPack]);

  function updateField(field: keyof Draft, value: string) {
    setState((cur) => ({
      ...cur,
      drafts: { ...cur.drafts, [cur.activeTemplate]: { ...cur.drafts[cur.activeTemplate], [field]: value } },
    }));
  }

  function updateSupportField(field: keyof SupportPack, value: string) {
    setState((cur) => ({
      ...cur,
      supportPack: { ...cur.supportPack, [field]: value },
    }));
  }

  const specMarkdown = buildSpecMarkdown(config.label, draft);
  const packageMarkdown = buildPackageMarkdown({
    templateLabel: config.label,
    specMarkdown,
    constitutionMarkdown,
    clarificationsMarkdown,
    acceptanceChecklistMarkdown,
  });
  const reviewPrompt = `${config.openCodePrompt}\n\nReve tambem constitution.md, clarifications.md e checklist_aceite.md. Quero feedback para um estudante sem background tecnico: onde ha ambiguidades, termos vagos, dependencias escondidas e criterios de aceite pouco verificaveis?`;

  async function copyToClipboard(key: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  }

  function downloadSpec() {
    downloadText(`spec-${state.activeTemplate}.md`, specMarkdown);
  }

  function downloadText(filename: string, text: string) {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function renderCommandBlock(step: StepBlock, prefix: string) {
    if (!step.commands?.length || !step.commandKind) return null;

    const commandText = step.commands.join(step.commandKind === "terminal" ? "\n" : "\n\n");
    const key = `${prefix}-${step.title}`;
    const isTerminal = step.commandKind === "terminal";

    return (
      <div className="mt-3 overflow-hidden rounded-xl border border-[#263238] bg-[#0b1220] shadow-[0_18px_40px_rgba(11,18,32,0.24)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#111a2b] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/70">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2">{blockLabel(step.commandKind)}</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(key, commandText)}
            className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white transition hover:bg-white/14"
          >
            {copied === key ? "Copiado" : isTerminal ? "Copiar comandos" : "Copiar prompt"}
          </button>
        </div>
        <pre className="overflow-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-xs leading-6 text-[#d6e2ff]">
          {step.commands.map((command, index) => (
            <div key={`${key}-${index}`}>
              <span className="select-none text-[#7ee787]">{isTerminal ? "$ " : "> "}</span>
              {command}
            </div>
          ))}
        </pre>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* ── Header ── */}
      <div className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Lab Dia 2 — Spec Studio
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
              <GlossaryText text="Escrever uma spec que o LLM consegue implementar." glossary={DAY2_GLOSSARY} />
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
              <GlossaryText
                text="Monta a spec por blocos, valida o scope do MVP e fecha o pacote com constitution.md, clarificacoes e checklist de aceite. O objetivo do dia e dar instrucoes claras a uma AI sem assumir background tecnico."
                glossary={DAY2_GLOSSARY}
              />
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.08),rgba(124,63,88,0.03))] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]">
              {completion}% completo
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
            {PRIMARY_PATH.map((step, index) => (
              <div key={step} className="rounded-xl border border-[var(--border)] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Passo {index + 1}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  <GlossaryText text={step} glossary={DAY2_GLOSSARY} />
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
            {BEGINNER_NOTES.map((note) => (
              <div key={note} className="rounded-xl border border-[var(--border)] bg-white p-4 text-sm leading-7 text-[var(--muted-foreground)]">
                <GlossaryText text={note} glossary={DAY2_GLOSSARY} />
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-[var(--border-strong)] bg-white/70 p-4 text-sm leading-7 text-[var(--muted-foreground)]">
            Resultado final: <span className="font-semibold text-[var(--foreground)]">um site publicado + um PDF executivo + um pacote simples de especificacao</span>.
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          Exercicio principal do dia
        </p>
        <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
          <GlossaryText text="CSV atuarial -> dashboard -> PDF executivo -> deploy em Firebase Hosting" glossary={DAY2_GLOSSARY} />
        </h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {QUICK_EXERCISE_STEPS.map((step) => (
            <article key={step.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">{step.title}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                <GlossaryText text={step.body} glossary={DAY2_GLOSSARY} />
              </p>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[var(--muted-foreground)]">
          Para fechar o Dia 2 so precisas de 3 coisas: <span className="font-semibold text-[var(--foreground)]">um CSV</span>, <span className="font-semibold text-[var(--foreground)]">a tua chave DeepSeek</span> e <span className="font-semibold text-[var(--foreground)]">os comandos abaixo</span>. O resto e apoio.
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          0. Antes de tocares no terminal
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {DATASET_STEPS.map((step) => (
            <article key={step.title} className="rounded-xl border border-[var(--border)] bg-white p-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">{step.title}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                <GlossaryText text={step.body} glossary={DAY2_GLOSSARY} />
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            1. Instalar e autenticar
          </p>
          <div className="mt-4 space-y-4">
            {INSTALL_STEPS.map((step) => (
              <article key={step.title} className="rounded-xl border border-[var(--border)] bg-white p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">{step.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  <GlossaryText text={step.body} glossary={DAY2_GLOSSARY} />
                </p>
                {renderCommandBlock(step, "install")}
              </article>
            ))}
            <div className="rounded-xl border border-[var(--border)] bg-white p-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">6. Guardar a chave DeepSeek no projeto</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                Guarda a tua chave em <code>.env.local</code> antes de tentares gerar o texto do PDF. Se ja tens a chave, este e o ultimo passo de configuracao.
              </p>
              {ENV_SETUP_STEPS.map((step) => renderCommandBlock(step, "env"))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            2. Correr o fluxo do Spec Kit
          </p>
          <div className="mt-4 space-y-4">
            {SPEC_KIT_FLOW.map((step) => (
              <article key={step.title} className="rounded-xl border border-[var(--border)] bg-white p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">{step.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  <GlossaryText text={step.body} glossary={DAY2_GLOSSARY} />
                </p>
                {renderCommandBlock(step, "speckit")}
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          3. Publicar e enviar ao tutor
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {DEPLOY_STEPS.map((step) => (
              <article key={step.title} className="rounded-xl border border-[var(--border)] bg-white p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">{step.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  <GlossaryText text={step.body} glossary={DAY2_GLOSSARY} />
                </p>
                {renderCommandBlock(step, "deploy")}
              </article>
            ))}
          </div>
        </div>

      <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          4. Checklist final antes de enviar
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {FINAL_CHECKLIST.map((item) => (
            <div key={item} className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[var(--muted-foreground)]">
              <span className="mr-2 text-[var(--accent)]">-</span>
              <GlossaryText text={item} glossary={DAY2_GLOSSARY} />
            </div>
          ))}
        </div>
      </div>

      <details className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
        <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--foreground)]">
          Abrir recursos de apoio e contexto extra
        </summary>
        <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
          Abre isto apenas se precisares de apoio. Nao precisas desta secao para concluir o dia.
        </p>
        <div className="mt-4 rounded-xl border border-dashed border-[var(--accent-soft)] bg-white/80 p-4 text-sm leading-7 text-[var(--muted-foreground)]">
          Aqui tens o CSV sintetico, o brief do relatorio, o prompt base, a folha de validacao de metricas e os diagramas. Tudo isto e apoio ao caminho principal.
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {ASSETS.map((asset) => (
            <a
              key={asset.href}
              href={asset.href}
              download
              className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-white p-4 transition hover:border-[var(--accent-soft)] hover:shadow-sm"
            >
              <p className="text-sm font-semibold text-[var(--foreground)]">{asset.title}</p>
              <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                <GlossaryText text={asset.description} glossary={DAY2_GLOSSARY} />
              </p>
              <span className="mt-auto text-xs font-semibold text-[var(--accent)]">Descarregar</span>
            </a>
          ))}
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Arquitetura do exercicio</p>
            <MermaidDiagram chart={ARCHITECTURE_DIAGRAM} />
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Fluxo do aluno com Spec Kit</p>
            <MermaidDiagram chart={CONTEXT_DIAGRAM} />
          </div>
        </div>
      </details>

      {/* ── Template Selector + Form ── */}
      <details className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
        <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--foreground)]">
          Abrir studio de spec manual
        </summary>
        <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
          Usa esta parte apenas se quiseres escrever uma spec adicional ou praticar mais depois do exercicio principal.
        </p>

      <div className="mt-5 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {/* Left: templates + checklist */}
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Escolher o artefacto
            </p>
            <div className="mt-4 space-y-3">
              {(Object.entries(TEMPLATES) as [TemplateId, (typeof TEMPLATES)[TemplateId]][]).map(
                ([key, tmpl]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setState((cur) => ({ ...cur, activeTemplate: key }))}
                    className={`block w-full rounded-xl border px-4 py-4 text-left transition ${
                      key === state.activeTemplate
                        ? "border-[var(--accent-soft)] bg-[rgba(124,63,88,0.06)]"
                        : "border-[var(--border)] bg-white hover:border-[var(--accent-soft)]"
                    }`}
                  >
                    <p className="font-semibold text-[var(--foreground)]">{tmpl.label}</p>
                    <p className="mt-1.5 text-sm leading-6 text-[var(--muted-foreground)]">
                      <GlossaryText text={tmpl.summary} glossary={DAY2_GLOSSARY} />
                    </p>
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Checklist de auditoria
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
              <li><GlossaryText text="O problema esta escrito em linguagem de negocio." glossary={DAY2_GLOSSARY} /></li>
              <li><GlossaryText text="O scope separa o que entra e o que fica fora do MVP." glossary={DAY2_GLOSSARY} /></li>
              <li><GlossaryText text="As validacoes e mensagens de erro existem antes do fluxo feliz." glossary={DAY2_GLOSSARY} /></li>
              <li><GlossaryText text="Os criterios de aceite sao testaveis sem intuicao." glossary={DAY2_GLOSSARY} /></li>
              <li><GlossaryText text="Edge cases cobrem ficheiros invalidos, estados vazios e erros de rede." glossary={DAY2_GLOSSARY} /></li>
            </ul>
          </div>
        </div>

        {/* Right: spec fields */}
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {SPEC_FIELDS.map((field) => (
              <label key={field.key} className="rounded-xl border border-[var(--border)] bg-white p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  <GlossaryText text={field.label} glossary={DAY2_GLOSSARY} />
                </span>
                <p className="mt-1 text-[11px] leading-4 text-[var(--muted-foreground)]">
                  <GlossaryText text={field.hint} glossary={DAY2_GLOSSARY} />
                </p>
                <p className="mt-2 text-xs leading-5 text-[var(--foreground)]">Pergunta guia: {field.question}</p>
                <textarea
                  value={draft[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2.5 text-sm leading-6 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                />
              </label>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Fechar o pacote do Dia 2
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                  <GlossaryText text="Constitution, clarificacoes e checklist de aceite" glossary={DAY2_GLOSSARY} />
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  <GlossaryText
                    text="Sem estes tres blocos, a spec ainda deixa demasiada interpretacao para o LLM. Usa-os para fixar principios, perguntas em aberto e definicao de pronto."
                    glossary={DAY2_GLOSSARY}
                  />
                </p>
              </div>
              <div className="rounded-xl border border-[var(--accent-soft)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]">
                {packageCompletion}% pacote
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {SUPPORT_FIELDS.map((field) => (
                <label key={field.key} className="rounded-xl border border-[var(--border)] bg-white p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    <GlossaryText text={field.label} glossary={DAY2_GLOSSARY} />
                  </span>
                  <p className="mt-1 text-[11px] leading-4 text-[var(--muted-foreground)]">
                    <GlossaryText text={field.hint} glossary={DAY2_GLOSSARY} />
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[var(--foreground)]">Pergunta guia: {field.question}</p>
                  <textarea
                    value={state.supportPack[field.key]}
                    onChange={(event) => updateSupportField(field.key, event.target.value)}
                    rows={8}
                    className="mt-2 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2.5 text-sm leading-6 text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      </details>

      {/* ── Export / Artifact ── */}
      <details className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
        <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--foreground)]">
          Abrir exportacao manual do pacote
        </summary>
        <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
          Isto serve para descarregar o pacote de especificacao em separado. Para fechar o dia, o mais importante continua a ser o site publicado e o URL enviado ao tutor.
        </p>
        <div className="mt-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Artefacto final — pacote de especificacao do Dia 2
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
              Leva contigo a <code>spec.md</code>, o <code>constitution.md</code>, as clarificacoes e o checklist de aceite. Usa o prompt para pedir uma revisao critica antes de implementares.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => copyToClipboard("prompt", reviewPrompt)}
              className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)] sm:w-auto"
            >
              {copied === "prompt" ? "Copiado" : "Copiar prompt"}
            </button>
            <button
              type="button"
              onClick={() => copyToClipboard("package", packageMarkdown)}
              className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)] sm:w-auto"
            >
              {copied === "package" ? "Copiado" : "Copiar pacote"}
            </button>
            <button
              type="button"
              onClick={() => downloadText(`day2-spec-package-${state.activeTemplate}.md`, packageMarkdown)}
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] sm:w-auto"
            >
              Descarregar pacote
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadSpec}
            className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
          >
            Descarregar spec.md
          </button>
          <button
            type="button"
            onClick={() => downloadText("constitution.md", constitutionMarkdown)}
            className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
          >
            Descarregar constitution.md
          </button>
          <button
            type="button"
            onClick={() => downloadText("clarifications.md", clarificationsMarkdown)}
            className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
          >
            Descarregar clarifications.md
          </button>
          <button
            type="button"
            onClick={() => downloadText("checklist_aceite.md", acceptanceChecklistMarkdown)}
            className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]"
          >
            Descarregar checklist_aceite.md
          </button>
        </div>

        <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-xs leading-6 text-[var(--foreground)]">
          {packageMarkdown}
        </pre>

        <div className="mt-4 rounded-xl border border-dashed border-[var(--border-strong)] bg-white/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            Prompt para OpenCode / GLM-5
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
            {reviewPrompt}
          </p>
        </div>
        </div>
      </details>
    </section>
  );
}
