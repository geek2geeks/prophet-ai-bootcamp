export type ReviewItemType = "exercise" | "challenge";

export type ReviewResult = {
  itemId: string;
  itemType: ReviewItemType;
  reviewedAnswer: string;
  reviewedAtMs: number;
  model: string;
  readinessStatus: "ready" | "revise" | "blocked";
  readyToSubmit: boolean;
  encouragement: string;
  coachSummary: string;
  strengths: string[];
  coverageGaps: string[];
  priorityActions: string[];
  blockingIssues: string[];
  nextStep: string;
  evidenceUsed: string[];
  confidence: "low" | "medium" | "high";
  error?: string;
};

export type ReviewMap = Record<string, ReviewResult>;
export type AnswerMap = Record<string, string>;

type ReviewSpec = {
  maxScore: number;
  deliverable: string;
  mustInclude: string[];
};

const REVIEW_SYSTEM_PROMPT = `Es o Peter, o tutor AI do bootcamp para respostas dos exercicios e desafios.

OBJETIVO:
 - Ler com cuidado o que o aluno tentou explicar.
 - Dar feedback encorajador, especifico e acionavel.
 - Funcionar como coach: ajudar a melhorar o proximo draft, nao dar nota final.

REGRAS:
- Responde em portugues de Portugal.
- Comeca por reconhecer o que ja esta a funcionar bem.
- Comenta os pontos que o aluno tentou explicar antes de sugerires mudancas.
- Se faltar algo importante da rubrica, explica isso com cuidado e diz como melhorar.
- Se houver algo extra que o aluno deva saber para fortalecer a resposta, acrescenta-o com clareza.
- Valoriza especificidade, clareza, ligacao ao contexto do bootcamp e uso de evidencia.
- Se houver contexto factual extra, usa-o para verificar a resposta.
- Nao inventes factos nem assumes trabalho que o aluno nao mostrou.
- Limita-te as 1 a 3 prioridades mais importantes para o proximo draft.
- Devolve APENAS JSON valido, sem markdown, sem texto extra.

JSON OBRIGATORIO:
{
  "readiness_status": "ready|revise|blocked",
  "ready_to_submit": false,
  "encouragement": "1-2 frases curtas e honestas.",
  "coach_summary": "2-4 frases objetivas e encorajadoras.",
  "strengths": ["..."],
  "coverage_gaps": ["..."],
  "priority_actions": ["..."],
  "blocking_issues": ["..."],
  "next_step": "Sugestao clara para o proximo draft.",
  "evidence_used": ["..."],
  "confidence": "low|medium|high"
}`;

export const REVIEW_SPECS: Record<string, ReviewSpec> = {
  "ex1.1": {
    maxScore: 10,
    deliverable: "Glossario pessoal do fundador em formato de tabela ou lista estruturada.",
    mustInclude: [
      "Os 10 termos pedidos: SaaS, MVP, Wedge, Workflow, UX, Feature, Deploy, Incumbent, Posicionamento, Stack.",
      "Definicao curta em palavras do aluno, nao apenas texto copiado.",
      "Um exemplo concreto do mundo dos seguros para cada termo.",
      "Perspetiva de produto, especialmente para Deploy e Stack.",
    ],
  },
  "ex1.2": {
    maxScore: 10,
    deliverable: "Comparacao curta entre vender horas e vender produto, com conclusoes pessoais.",
    mustInclude: [
      "Comparacao em margem, escala e dependencia do tempo.",
      "Tabela ou estrutura equivalente que contraste os dois modelos.",
      "Tres conclusoes pessoais.",
      "Ligacao explicita a alavanca observada no Dia 0.",
    ],
  },
  "ex1.3": {
    maxScore: 10,
    deliverable: "Tabela sobre o Prophet e as oportunidades para um MVP simples.",
    mustInclude: [
      "Pelo menos 5 areas: model points, assumptions, motor de projecao, relatorios e governance.",
      "Ponto forte do Prophet em cada area.",
      "Oportunidade clara para uma versao simples e moderna.",
      "Raciocinio de foco, nao tentativa de copiar tudo.",
    ],
  },
  "ex1.4": {
    maxScore: 10,
    deliverable: "Tres frustracoes reais e vendaveis no mercado de seguros Vida.",
    mustInclude: [
      "Tres problemas distintos e especificos.",
      "Quem sofre, frequencia, impacto no negocio e porque as solucoes atuais falham.",
      "Problemas concretos, nao abstratos nem demasiado amplos.",
      "Ligacao plausivel a dados, workflows ou experiencia profissional real.",
    ],
  },
  "ex1.5": {
    maxScore: 10,
    deliverable: "Memo do fundador numa pagina com foco e wedge clara.",
    mustInclude: [
      "Cliente ideal.",
      "Problema principal.",
      "Ponto de entrada no mercado (wedge).",
      "3 a 5 capacidades iniciais do produto.",
      "Pelo menos 5 coisas que ficam de fora de proposito.",
      "Argumento de foco explicando porque fazer menos e melhor.",
    ],
  },
  "ex1.6": {
    maxScore: 10,
    deliverable: "Resposta ao quiz do Dia 1 em 12 itens numerados.",
    mustInclude: [
      "Cobertura das 12 perguntas.",
      "Explicacoes curtas mas corretas, em linguagem propria.",
      "Distincao clara entre prompts precisos e exploradores.",
      "Entendimento de wedge, MVP, UX, workflow, posicionamento e incumbent.",
    ],
  },
  "ex1.7": {
    maxScore: 10,
    deliverable: "Analise curta da variacao trimestral com recomendacao de automacao.",
    mustInclude: [
      "Identificacao dos segmentos com maior deterioracao do lucro.",
      "Justificacao do principal driver da subida de reserva com numeros.",
      "Nota curta e executiva para o CFO.",
      "Trabalho manual repetitivo identificado com sugestao de feature AI para automatizar.",
    ],
  },
  des1: {
    maxScore: 25,
    deliverable: "Tese de produto para convencer o primeiro cliente, com foco comercial e prova de conceito.",
    mustInclude: [
      "Para quem e: tipo de equipa, empresa e estimativa de mercado.",
      "Problema hoje: workflow atual, lentidao, custo ou risco.",
      "O que o Prophet Lite faz primeiro e como.",
      "Vantagem face ao Prophet: UX moderna, IA embutida e explicacao clara.",
      "Prova de conceito com dados reais do Dia 0, incluindo numeros concretos.",
      "Plano de 3 passos para chegar ao primeiro cliente.",
      "Tres riscos e respostas claras.",
    ],
  },
  "ex2.1": {
    maxScore: 10,
    deliverable: "Spec clara para upload e validacao de assumptions.",
    mustInclude: [
      "Fluxo completo de upload e validacao.",
      "Inputs aceites, regras e erros esperados.",
      "Output final e comportamento apos upload valido.",
      "Criterios de aceite concretos.",
    ],
  },
  "ex2.2": {
    maxScore: 10,
    deliverable: "Spec do document drop com classificacao, extracao e indexacao.",
    mustInclude: [
      "Upload de ficheiros e etapas do pipeline.",
      "Classificacao e metadados minimos.",
      "Output utilizavel na app.",
      "Falhas, edge cases e review humana quando fizer sentido.",
    ],
  },
  "ex2.3": {
    maxScore: 10,
    deliverable: "Auditoria critica a uma spec antes de escrever codigo.",
    mustInclude: [
      "Ambiguidades encontradas.",
      "Edge cases ou criterios de aceite em falta.",
      "Correcao proposta para cada fragilidade relevante.",
      "Leitura de risco antes de construir.",
    ],
  },
  des2: {
    maxScore: 25,
    deliverable: "Pacote de especificacao MVP pronto para execucao por LLM.",
    mustInclude: [
      "spec.md com objetivo, fluxos e validacoes.",
      "constitution.md com regras globais claras.",
      "Checklist de aceite concreta.",
      "Consistencia suficiente para um LLM implementar com poucas perguntas basicas.",
    ],
  },
  "ex5.1": {
    maxScore: 10,
    deliverable: "Mapa claro dos modulos Prophet para um MVP pequeno.",
    mustInclude: [
      "Mapeamento dos modulos core.",
      "Reducao de scope realista.",
      "Ligacao a uma versao simplificada credível.",
      "Justificacao do que entra primeiro.",
    ],
  },
  "ex5.2": {
    maxScore: 10,
    deliverable: "Definicao de user roles e audit trail minimo do MVP.",
    mustInclude: [
      "Roles principais e respetivas responsabilidades.",
      "Eventos que ficam auditados.",
      "Porque esse rasto interessa num produto atuarial.",
      "Foco em governance minima, nao excesso de complexidade.",
    ],
  },
  "ex5.3": {
    maxScore: 10,
    deliverable: "Lista explicita do que fica fora de scope do MVP.",
    mustInclude: [
      "Cortes claros de scope.",
      "Tentacoes evitadas com racional.",
      "Ligacao entre foco e velocidade de execucao.",
      "Leitura de risco contra scope creep.",
    ],
  },
  des5: {
    maxScore: 25,
    deliverable: "Blueprint do Prophet Lite com modulos, roles, fluxos e governance minima.",
    mustInclude: [
      "Modulos MVP bem definidos.",
      "User roles e fluxos principais.",
      "Itens fora de scope.",
      "Argumento credivel de porque esta versao pequena pode ser vendida ou demonstrada.",
    ],
  },
  "ex6.1": {
    maxScore: 10,
    deliverable: "Classificacao de documentos com leitura de risco e campos chave.",
    mustInclude: [
      "Tipo documental.",
      "Entidade de negocio.",
      "Campos chave para extracao.",
      "Risco de erro ou necessidade de review humana.",
    ],
  },
  "ex6.2": {
    maxScore: 10,
    deliverable: "Schema JSON minimo para document drop.",
    mustInclude: [
      "Campos minimos pedidos.",
      "Tipos ou estrutura coerente.",
      "Leitura de como esse schema suporta o workflow.",
      "Clareza suficiente para implementacao.",
    ],
  },
  "ex6.3": {
    maxScore: 10,
    deliverable: "Mini fluxo de RAG ou memoria pesquisavel com perguntas de negocio.",
    mustInclude: [
      "Texto guardado ou indexado.",
      "Perguntas que o utilizador consegue fazer.",
      "Ligacao ao workflow documental.",
      "Limites ou necessidade de review humana.",
    ],
  },
  des6: {
    maxScore: 25,
    deliverable: "Knowledge workspace com pipeline, schema, regras de review e queries de negocio.",
    mustInclude: [
      "Pipeline do document drop.",
      "Schema de metadata e extracao.",
      "Review humana e governanca.",
      "Queries de negocio que mostrem utilidade real do modulo.",
    ],
  },
  "ex10.1": {
    maxScore: 10,
    deliverable: "Deploy seguro do MVP com hygiene minima.",
    mustInclude: [
      "Dependencias, secrets e README prontos.",
      "Fluxo principal funcional fora da maquina local.",
      "Riscos de deploy identificados.",
      "Clareza sobre o que foi verificado.",
    ],
  },
  "ex10.2": {
    maxScore: 10,
    deliverable: "Narrativa polida do produto para mostrar ao mercado.",
    mustInclude: [
      "Problema.",
      "Wedge.",
      "Valor do produto.",
      "Clareza suficiente para screenshots, gifs ou demo notes.",
    ],
  },
  "ex10.3": {
    maxScore: 10,
    deliverable: "Resumo de lancamento com stack, aprendizagem e partilha.",
    mustInclude: [
      "URL ou destino do produto.",
      "Problema resolvido.",
      "Stack usada.",
      "Aprendizagem e uso publico ou interno.",
    ],
  },
  des10: {
    maxScore: 25,
    deliverable: "Lancamento publico do produto com app, README, demo e nota final.",
    mustInclude: [
      "App deployada ou demonstravel.",
      "README final.",
      "Demo curta e clara.",
      "Nota de lancamento que transforme o projeto em ativo publico de carreira ou mercado.",
    ],
  },
};

export function getReviewSpec(itemId: string) {
  return REVIEW_SPECS[itemId];
}

export function extractReviewJson(content: string) {
  const trimmed = content.trim();
  if (!trimmed) {
    return null;
  }

  const withoutFences = trimmed.startsWith("```")
    ? trimmed.split("\n").slice(1, -1).join("\n").trim()
    : trimmed;

  try {
    return JSON.parse(withoutFences) as Record<string, unknown>;
  } catch {
    const start = withoutFences.indexOf("{");
    const end = withoutFences.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      return null;
    }

    try {
      return JSON.parse(withoutFences.slice(start, end + 1)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

function normalizeList(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry).trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [] as string[];
}

export function normalizeReviewResult(
  itemId: string,
  itemType: ReviewItemType,
  reviewedAnswer: string,
  payload: Record<string, unknown> | null,
  fallbackError?: string,
  model = "deepseek-chat",
): ReviewResult {
  const confidenceRaw = String(payload?.confidence ?? "medium").toLowerCase();
  const confidence =
    confidenceRaw === "low" || confidenceRaw === "high" || confidenceRaw === "medium"
      ? confidenceRaw
      : "medium";
  const legacyRequiredFixes = normalizeList(payload?.required_fixes);
  const coverageGaps = normalizeList(payload?.coverage_gaps ?? payload?.gaps);
  const priorityActions = normalizeList(payload?.priority_actions ?? payload?.required_fixes);
  const blockingIssues = normalizeList(payload?.blocking_issues ?? payload?.required_fixes);
  const readinessRaw = String(payload?.readiness_status ?? "").toLowerCase();
  const legacyPassRecommended =
    typeof payload?.pass_recommended === "boolean" ? payload.pass_recommended : undefined;
  const readinessStatus =
    readinessRaw === "ready" || readinessRaw === "revise" || readinessRaw === "blocked"
      ? readinessRaw
      : blockingIssues.length > 0 || legacyRequiredFixes.length > 0
        ? "blocked"
        : legacyPassRecommended === true
          ? "ready"
          : "revise";
  const readyToSubmit =
    typeof payload?.ready_to_submit === "boolean"
      ? payload.ready_to_submit
      : readinessStatus === "ready";

  const error = typeof fallbackError === "string" ? fallbackError.trim() : "";

  return {
    itemId,
    itemType,
    reviewedAnswer,
    reviewedAtMs: Date.now(),
    model,
    readinessStatus,
    readyToSubmit,
    encouragement:
      typeof payload?.encouragement === "string" ? payload.encouragement.trim() : "",
    coachSummary:
      typeof payload?.coach_summary === "string"
        ? payload.coach_summary.trim()
        : typeof payload?.short_feedback === "string"
          ? payload.short_feedback.trim()
          : "",
    strengths: normalizeList(payload?.strengths),
    coverageGaps,
    priorityActions,
    blockingIssues,
    nextStep:
      typeof payload?.next_step === "string" ? payload.next_step.trim() : "",
    evidenceUsed: normalizeList(payload?.evidence_used),
    confidence,
    ...(error ? { error } : {}),
  };
}

export function buildDay1ReviewMessages(input: {
  itemId: string;
  itemTitle: string;
  itemDescription: string;
  studentAnswer: string;
  extraContext?: string;
}) {
  const spec = getReviewSpec(input.itemId);

  const userPrompt = `ITEM: ${input.itemId} — ${input.itemTitle}

DESCRICAO OFICIAL:
${input.itemDescription}

RUBRICA DE REVIEW:
${JSON.stringify(spec, null, 2)}

CONTEXTO EXTRA:
${input.extraContext?.trim() || "Sem contexto extra."}

RESPOSTA DO ALUNO:
${input.studentAnswer.trim()}

Primeiro reconhece o que ja esta a funcionar, depois comenta os pontos que o aluno tentou explicar, depois identifica apenas as melhorias mais importantes para o proximo draft. Devolve apenas o JSON pedido.`;

  return [
    { role: "system", content: REVIEW_SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];
}

export function hasFreshReview(
  review: ReviewResult | undefined,
  currentAnswer: string,
) {
  const trimmed = currentAnswer.trim();
  if (!trimmed || !review || review.error) {
    return false;
  }

  return review.reviewedAnswer.trim() === trimmed;
}

export function getDay1ChallengeSubmissionGateMessage(
  review: ReviewResult | undefined,
  currentAnswer: string,
) {
  const trimmed = currentAnswer.trim();

  if (!trimmed || !review || review.error) {
    return "Para o Dia 1, cola a tua tese na revisao do tutor AI acima antes de enviar a evidencia final.";
  }

  if (review.reviewedAnswer.trim() !== trimmed) {
    return "Alteraste a tese depois da revisao. Atualiza a revisao do tutor AI antes de enviar a evidencia final do Dia 1.";
  }

  return null;
}

export function getDay1ReviewGateMessage(
  review: ReviewResult | undefined,
  currentAnswer: string,
  itemType: ReviewItemType,
) {
  const trimmed = currentAnswer.trim();

  if (!trimmed || !review || review.error) {
    return itemType === "challenge"
      ? "Pede uma revisao do tutor AI sobre a tua tese antes de submeter ou marcar o desafio como concluido."
      : "Escreve a tua resposta e pede uma revisao do tutor AI antes de marcar este exercicio como concluido.";
  }

  if (review.reviewedAnswer.trim() !== trimmed) {
    return itemType === "challenge"
      ? "Alteraste a tese depois da revisao. Atualiza a revisao do tutor AI antes de submeter ou fechar o desafio."
      : "Alteraste a resposta depois da review. Atualiza a revisao do tutor AI antes de fechar este exercicio.";
  }

  return null;
}

export type Day1ReviewItemType = ReviewItemType;
export type Day1ReviewResult = ReviewResult;
export type Day1ReviewMap = ReviewMap;
export type Day1AnswerMap = AnswerMap;
export const DAY1_REVIEW_SPECS = REVIEW_SPECS;
export const getDay1ReviewSpec = getReviewSpec;
export const hasFreshDay1Review = hasFreshReview;
