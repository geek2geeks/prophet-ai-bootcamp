type ReviewPreset = {
  extraContext?: string;
};

export function getReviewPreset(itemId: string): ReviewPreset {
  switch (itemId) {
    case "ex1.2":
    case "ex1.5":
      return {
        extraContext:
          "O exercicio pede ligacao explicita a alavanca observada no Dia 0 e a uma decisao de produto com foco.",
      };
    case "ex1.4":
      return {
        extraContext:
          "A resposta deve apontar dores concretas, recorrentes e vendaveis; respostas vagas ou demasiado amplas devem ser penalizadas.",
      };
    case "des1":
      return {
        extraContext:
          "O desafio des1 deve convencer um primeiro cliente potencial, nao um investidor, e incluir prova de conceito com numeros reais do Dia 0.",
      };
    case "ex2.3":
      return {
        extraContext:
          "O foco nao e reescrever tudo, mas encontrar ambiguidades, edge cases e criterios de aceite em falta antes de construir.",
      };
    case "des2":
      return {
        extraContext:
          "O pacote deve ser claro o suficiente para um LLM executar com autonomia sem perguntas basicas repetidas.",
      };
    case "ex5.3":
    case "des5":
      return {
        extraContext:
          "Penaliza scope creep e valoriza cortes de scope que tornem o MVP mais vendavel e mais rapido de construir.",
      };
    case "ex6.3":
    case "des6":
      return {
        extraContext:
          "Valoriza workflows com review humana, memoria util e queries de negocio concretas; nao premiar automacao total vaga.",
      };
    case "ex10.1":
    case "des10":
      return {
        extraContext:
          "Valoriza credibilidade de deploy, readiness para demo e clareza da narrativa publica do produto.",
      };
    default:
      return {};
  }
}

export const EXTENDED_REVIEW_DAYS = new Set([1, 2, 5, 6, 10]);
