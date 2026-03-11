import path from "node:path";

export type ResourceFile = {
  id: string;
  title: string;
  description: string;
  relativePath: string[];
  mimeType: string;
  kind: "csv" | "markdown";
};

export type ResourceGroup = {
  id: string;
  title: string;
  description: string;
  files: ResourceFile[];
};

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: "day-0",
    title: "Dia 0",
    description: "Ficheiros de dados reais de seguros (carteira e mortalidade) para explorar com a IA localmente.",
    files: [
      {
        id: "day0/carteira_vida_sample.csv",
        title: "carteira_vida_sample.csv",
        description: "Carteira de apólices de vida com dados de idade, capital e estado.",
        relativePath: ["public", "course-assets", "day0", "carteira_vida_sample.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day0/tabua_mortalidade_CSO2017.csv",
        title: "tabua_mortalidade_CSO2017.csv",
        description: "Tábua de mortalidade padrão com taxas por idade e género.",
        relativePath: ["public", "course-assets", "day0", "tabua_mortalidade_CSO2017.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      }
    ],
  },
  {
    id: "day-1",
    title: "Dia 1",
    description: "Dados do lab de reporting e o documento de referencia do Prophet usados nesta aula.",
    files: [
      {
        id: "day1/reporting_vida_q4_2025.csv",
        title: "reporting_vida_q4_2025.csv",
        description: "Mock reporting trimestral base para comparar contra o trimestre seguinte.",
        relativePath: ["public", "course-assets", "day1", "reporting_vida_q4_2025.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day1/reporting_vida_q1_2026.csv",
        title: "reporting_vida_q1_2026.csv",
        description: "Reporting trimestral seguinte para explicar a deterioracao do lucro e o aumento da reserva.",
        relativePath: ["public", "course-assets", "day1", "reporting_vida_q1_2026.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day1/manual_reporting_tasks.csv",
        title: "manual_reporting_tasks.csv",
        description: "Mapa do trabalho manual repetitivo que o Prophet Lite pode reduzir.",
        relativePath: ["public", "course-assets", "day1", "manual_reporting_tasks.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "docs/prophet_reference_vida.md",
        title: "prophet_reference_vida.md",
        description: "Referencia funcional do FIS Prophet com pontos fortes, modulos core e espaco para um MVP mais leve.",
        relativePath: ["public", "course-assets", "docs", "prophet_reference_vida.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
    ],
  },
  {
    id: "day-2",
    title: "Dia 2",
    description: "Recursos introdutorios para GitHub Spec Kit e Specification-Driven Development, pensados para estudantes sem background tecnico.",
    files: [
      {
        id: "docs/spec_kit_primer.md",
        title: "spec_kit_primer.md",
        description: "Explicacao simples do GitHub Spec Kit, da ordem constitution -> specify -> clarify -> plan -> tasks -> implement e comparacao com outras metodologias.",
        relativePath: ["public", "course-assets", "docs", "spec_kit_primer.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
      {
        id: "day2/carteira_vida_sample_day2.csv",
        title: "carteira_vida_sample_day2.csv",
        description: "CSV sintetico pequeno, pensado para o exercicio principal do Dia 2 sem sobrecarregar o aluno.",
        relativePath: ["public", "course-assets", "day2", "carteira_vida_sample_day2.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day2/carteira_vida_jovem_temporaria.csv",
        title: "carteira_vida_jovem_temporaria.csv",
        description: "Carteira sintetica mais jovem e mais concentrada em Temporario para testar outro tipo de narrativa Vida.",
        relativePath: ["public", "course-assets", "day2", "carteira_vida_jovem_temporaria.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day2/carteira_vida_senior_patrimonial.csv",
        title: "carteira_vida_senior_patrimonial.csv",
        description: "Carteira sintetica com capitais maiores e idades mais elevadas para um relatorio mais patrimonial.",
        relativePath: ["public", "course-assets", "day2", "carteira_vida_senior_patrimonial.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day2/carteira_vida_alerta_operacional.csv",
        title: "carteira_vida_alerta_operacional.csv",
        description: "Carteira sintetica com mais estados Resgatada e Sinistrada para testar leitura executiva prudente.",
        relativePath: ["public", "course-assets", "day2", "carteira_vida_alerta_operacional.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day2/day2_report_brief.md",
        title: "day2_report_brief.md",
        description: "Brief simples do que deve aparecer no dashboard e no PDF executivo do Dia 2.",
        relativePath: ["public", "course-assets", "day2", "day2_report_brief.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
      {
        id: "day2/day2_dataset_scenarios.md",
        title: "day2_dataset_scenarios.md",
        description: "Guia rapido para escolher entre varios datasets sinteticos e testar diferentes narrativas executivas Vida.",
        relativePath: ["public", "course-assets", "day2", "day2_dataset_scenarios.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
      {
        id: "day2/day2_deepseek_prompt_template.md",
        title: "day2_deepseek_prompt_template.md",
        description: "Prompt base para gerar uma narrativa executiva Vida mais controlada e menos propensa a inventar conceitos atuariais.",
        relativePath: ["public", "course-assets", "day2", "day2_deepseek_prompt_template.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
      {
        id: "day2/day2_metrics_reference.md",
        title: "day2_metrics_reference.md",
        description: "Valores de referencia para confirmar rapidamente se a leitura do CSV esta correta.",
        relativePath: ["public", "course-assets", "day2", "day2_metrics_reference.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
      {
        id: "docs/template_spec.md",
        title: "template_spec.md",
        description: "Template simples para transformar uma ideia de produto em spec funcional com objetivo, fluxos, fora de ambito, clarificacoes e criterios de aceite.",
        relativePath: ["public", "course-assets", "docs", "template_spec.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
      {
        id: "docs/template_constitution.md",
        title: "template_constitution.md",
        description: "Template de principios permanentes do projeto: UX, linguagem de erro, convencoes de dados, limites do MVP e regras matematicas.",
        relativePath: ["public", "course-assets", "docs", "template_constitution.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      }
    ]
  },
  {
    id: "day-3",
    title: "Dia 3",
    description: "Ficheiros de dados para explorar formatos estruturados, schemas e contratos de integracao do MVP.",
    files: [
      {
        id: "day3/carteira_apolices_vida.csv",
        title: "carteira_apolices_vida.csv",
        description: "Carteira completa de apolices de vida para inspeccao de model points e validacao de inputs.",
        relativePath: ["public", "course-assets", "day3", "carteira_apolices_vida.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day3/tabua_mortalidade_CSO2017.csv",
        title: "tabua_mortalidade_CSO2017.csv",
        description: "Tabua de mortalidade padrao com taxas por idade e genero.",
        relativePath: ["public", "course-assets", "day3", "tabua_mortalidade_CSO2017.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day3/taxas_resgate.csv",
        title: "taxas_resgate.csv",
        description: "Taxas de resgate (lapse) por ano de apolice e tipo de produto.",
        relativePath: ["public", "course-assets", "day3", "taxas_resgate.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day3/yield_curve_ECB.csv",
        title: "yield_curve_ECB.csv",
        description: "Curva de rendimentos ECB com taxas spot e forward por prazo.",
        relativePath: ["public", "course-assets", "day3", "yield_curve_ECB.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day3/day3_api_call_example.md",
        title: "day3_api_call_example.md",
        description: "Exemplo minimo de request e response para o aluno perceber o que e uma API call sem entrar em teoria a mais.",
        relativePath: ["public", "course-assets", "day3", "day3_api_call_example.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
      {
        id: "day3/day3_contract_starter.md",
        title: "day3_contract_starter.md",
        description: "Guia curto para montar o contract pack do Dia 3 sem se perder em detalhes tecnicos.",
        relativePath: ["public", "course-assets", "day3", "day3_contract_starter.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
      {
        id: "day3/day3_premade_constitution.md",
        title: "day3_premade_constitution.md",
        description: "Constitution pronta para a webapp educativa do Dia 3 com feedback atuarial via DeepSeek 3.2.",
        relativePath: ["public", "course-assets", "day3", "day3_premade_constitution.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
    ],
  },
  {
    id: "day-8",
    title: "Dia 8",
    description: "Inputs e benchmark de validacao para construir e testar o motor deterministic do Prophet Lite.",
    files: [
      {
        id: "day8/tabua_mortalidade_CSO2017.csv",
        title: "tabua_mortalidade_CSO2017.csv",
        description: "Tabua de mortalidade para o motor de projecao.",
        relativePath: ["public", "course-assets", "day8", "tabua_mortalidade_CSO2017.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day8/taxas_resgate.csv",
        title: "taxas_resgate.csv",
        description: "Taxas de resgate por ano de apolice e produto para o motor.",
        relativePath: ["public", "course-assets", "day8", "taxas_resgate.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day8/yield_curve_ECB.csv",
        title: "yield_curve_ECB.csv",
        description: "Curva de rendimentos ECB para desconto dos cash flows.",
        relativePath: ["public", "course-assets", "day8", "yield_curve_ECB.csv"],
        mimeType: "text/csv; charset=utf-8",
        kind: "csv",
      },
      {
        id: "day8/excel_validacao_cashflow.md",
        title: "excel_validacao_cashflow.md",
        description: "Caso de referencia com cash flows esperados para validar o motor deterministic.",
        relativePath: ["public", "course-assets", "day8", "excel_validacao_cashflow.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
    ],
  },
];

export function listResourceGroups() {
  return RESOURCE_GROUPS;
}

export function getResourceGroup(groupId: string) {
  return RESOURCE_GROUPS.find((group) => group.id === groupId);
}

export function getResourceById(resourceId: string) {
  return RESOURCE_GROUPS.flatMap((group) => group.files).find((file) => file.id === resourceId);
}

export function buildResourceDownloadHref(resourceId: string) {
  return `/course-assets/${resourceId}`;
}

export function getResourceAbsolutePath(resource: ResourceFile) {
  return path.join(process.cwd(), ...resource.relativePath);
}
