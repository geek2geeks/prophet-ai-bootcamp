import re

content = """export type ExperienceGuide = {
  headline: string;
  localFirst: string;
  cliMoments: Array<{
    label: string;
    detail: string;
  }>;
  toolRoles: Array<{
    tool: string;
    role: string;
  }>;
  artifactList?: string[];
  smoothers: string[];
};

export const DAY_EXPERIENCES: Record<number, ExperienceGuide> = {
  0: {
    headline: "Remover o medo cedo: setup, gestao de chaves, fluencia no terminal e habitos operacionais seguros.",
    localFirst: "Este dia acontece sobretudo na maquina do estudante. A plataforma deve orientar o setup, mas o trabalho real vive no terminal e nas pastas locais.",
    cliMoments: [
      { label: "Usar o terminal desde o primeiro exercicio", detail: "O estudante deve abrir o terminal antes de entrar em ferramentas mais pesadas no navegador, para que o CLI pareca normal e nao opcional." },
      { label: "Configurar o DeepSeek antes de abrir o OpenCode", detail: "A configuracao da chave pertence ao shell local. A plataforma mostra os passos, mas nao deve tornar-se o runtime." },
      { label: "Documentar o setup em ficheiros, nao na memoria", detail: "Guardar o output dos comandos e os logs de setup faz parte do fluxo. O CLI e ferramenta e trilho de auditoria ao mesmo tempo." },
    ],
    toolRoles: [
      { tool: "Terminal", role: "Superficie principal para setup e fluencia de ambiente." },
      { tool: "OpenCode", role: "Copiloto local para comandos, troubleshooting e analise de ficheiros." },
      { tool: "DeepSeek", role: "Motor de raciocinio usado dentro da cadeia local." },
      { tool: "Plataforma", role: "Guia, camada de confianca e lugar para registar progresso." },
    ],
    artifactList: [
      "mapa_stack.md com as ferramentas do fundador",
      "log_terminal.txt ou evidência de navegação CLI",
      "kit_fundador final preparado e validado"
    ],
    smoothers: [
      "Cartoes de comandos seguros para Windows e Mac.",
      "Separacao visivel entre passos de navegador e passos de terminal.",
      "Checklist curta de confianca antes da primeira chamada AI.",
    ],
  },
  1: {
    headline: "Transformar analise atuarial em criterio de produto sem quebrar a confianca do estudante.",
    localFirst: "O estudante deve explorar o caso de produto na plataforma, descarregar os recursos certos sem sair do novo site e depois usar o OpenCode localmente para analisar e rascunhar artefactos de fundador.",
    cliMoments: [
      { label: "Usar o OpenCode para glossario, memo e tese", detail: "O CLI torna-se o caderno de trabalho do estudante para pesquisa, reformulacao e apoio a escrita dos documentos centrais do Dia 1." },
      { label: "Usar analise local de dados para sustentar a tese", detail: "A tese de produto deve continuar a apoiar-se nos datasets do Dia 0 e no lab de reporting do Dia 1, em vez de ficar so em abstracao." },
    ],
    toolRoles: [
      { tool: "Plataforma", role: "Enquadramento narrativo, recursos e laboratorio de reporting." },
      { tool: "OpenCode", role: "Parceiro de pesquisa e apoio aos artefactos do founder." },
      { tool: "DeepSeek", role: "Ajuda a interpretar evidencia e a afinar posicionamento." },
      { tool: "Notas do estudante", role: "Onde a wedge e a tese ganham forma duravel." },
    ],
    artifactList: [
      "glossario_fundador.md com termos de produto aplicados a seguros",
      "memo do fundador com cliente ideal, wedge e scope inicial",
      "analise_variacao_trimestral.md com drivers, nota ao CFO e feature AI",
      "tese de produto final com dados reais do bootcamp"
    ],
    smoothers: [
      "Cartoes de evidencia ligados ao founder memo.",
      "Uma unica acao seguinte em vez de varios botoes a competir.",
      "Uma area dedicada a converter observacoes de dados em dor do cliente.",
    ],
  },
  2: {
    headline: "Passar de ideias para specs executaveis para que o estudante consiga dirigir a AI em vez de a perseguir.",
    localFirst: "A escrita da spec pode comecar na plataforma, mas o estudante deve continuar a usar fluxos locais de AI para planeamento e deteccao de ambiguidades.",
    cliMoments: [
      { label: "Usar ferramentas de CLI para rever a spec", detail: "OpenCode e prompts de planeamento em Z.ai funcionam melhor quando ja existe um draft de spec para iterar localmente." },
      { label: "Usar Git como memoria das escolhas de especificacao", detail: "Este e um bom momento para normalizar commits, specs versionadas e iteracoes guardadas." },
    ],
    toolRoles: [
      { tool: "Plataforma", role: "Workspace estruturado para spec e enquadramento de aceitacao." },
      { tool: "Z.ai", role: "Apoio a coding-plan e planeamento de implementacao." },
      { tool: "OpenCode", role: "Detetor de ambiguidades e revisor da spec." },
      { tool: "Git", role: "Memoria versionada das decisoes." },
    ],
    artifactList: [
      "spec.md para Upload de Assumptions e Document Drop",
      "constitution.md com regras globais e convenções",
      "checklist_aceite.md rigorosa para testar o LLM"
    ],
    smoothers: [
      "Secoes de spec preenchidas de raiz em vez de folhas em branco.",
      "Criterios de aceitacao ao lado de cada bloco funcional.",
      "Prompts explicitos de 'o que ainda nao construir'.",
    ],
  },
  3: {
    headline: "Tornar contratos de dados tangiveis para que o estudante compreenda a linguagem do produto, nao apenas os ecras.",
    localFirst: "Chamadas API, validacoes de schema e experiencias com contratos devem manter-se local-first para que o estudante sinta as interfaces reais que mais tarde vai deployar.",
    cliMoments: [
      { label: "Fazer a primeira API call localmente", detail: "Este e um momento autentico de CLI. O estudante deve ver payloads, respostas e erros num ambiente direto." },
      { label: "Inspecionar ficheiros no mesmo workspace local onde esta a construir", detail: "CSV, JSON e YAML devem parecer inputs de produto e nao conteudo abstrato de aula." },
    ],
    toolRoles: [
      { tool: "Plataforma", role: "Explica porque cada ficheiro e contrato interessa." },
      { tool: "CLI", role: "Corre requests, inspeciona payloads e valida pressupostos." },
      { tool: "OpenCode", role: "Explica docs e ajuda a desenhar schemas." },
      { tool: "Estudante", role: "Decide o que entra e o que fica fora do MVP." },
    ],
    artifactList: [
      "model_points.json definido e validado",
      "assumptions_schema.json como contrato de dados",
      "run_result.json pronto para o frontend"
    ],
    smoothers: [
      "Exemplos de schema ao lado de cada exercicio de contrato.",
      "Traducao inline de termos tecnicos para significado de produto.",
      "Separacao clara entre campos obrigatorios e opcionais.",
    ],
  },
  4: {
    headline: "Ensinar a escolha de modelos como uma capacidade operacional, e nao como uma preferencia unica.",
    localFirst: "O estudante deve comparar fornecedores a partir do mesmo fluxo local para que as diferencas sejam operacionais e nao teoricas.",
    cliMoments: [
      { label: "Correr o mesmo prompt em varios providers localmente", detail: "Aqui o CLI torna-se um laboratorio de avaliacao, nao apenas uma camada de conveniencia." },
      { label: "Guardar a scorecard como playbook reutilizavel", detail: "O estudante deve sair com um quadro de decisao local que possa reutilizar depois do curso." },
    ],
    toolRoles: [
      { tool: "DeepSeek", role: "Candidato para raciocinio e review." },
      { tool: "Z.ai", role: "Candidato para planeamento e coding-plan." },
      { tool: "OpenCode", role: "Cockpit comum para comparacao." },
      { tool: "Plataforma", role: "Rubrica, enquadramento da comparacao e sintese final." },
    ],
    artifactList: [
      "scorecard_llm.md comparando modelos",
      "playbook_model_selection.md para futuras decisões"
    ],
    smoothers: [
      "Uma grelha de avaliacao por fluxo, nao ratings genericos de modelos.",
      "Etiquetas claras de custo e funcao para cada provider.",
      "Um veredito guardado que acompanha as aulas seguintes.",
    ],
  },
  5: {
    headline: "Reduzir scope com confianca para que o estudante consiga de
