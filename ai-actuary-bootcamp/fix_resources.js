const fs = require('fs');

const content = `import path from "node:path";

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
    description: "Templates base para Specification-Driven Development. Como orientar a IA com specs rigorosas.",
    files: [
      {
        id: "docs/template_spec.md",
        title: "template_spec.md",
        description: "Estrutura para definir fluxos, edge cases e critérios de aceite.",
        relativePath: ["public", "course-assets", "docs", "template_spec.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      },
      {
        id: "docs/template_constitution.md",
        title: "template_constitution.md",
        description: "Arquivo de regras e convenções (Design, Tech e Matemática) para garantir consistência no código gerado.",
        relativePath: ["public", "course-assets", "docs", "template_constitution.md"],
        mimeType: "text/markdown; charset=utf-8",
        kind: "markdown",
      }
    ]
  }
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
  return \`/course-assets/\${resourceId}\`;
}
`;

fs.writeFileSync('src/lib/resource-files.ts', content, 'utf8');
console.log('resource-files.ts updated with Day 0, 1, and 2 files.');
