export type ExperienceGuide = {
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
    headline: "Reduzir scope com confianca para que o estudante consiga definir um Prophet Lite credivel em vez de um roadmap fantasioso.",
    localFirst: "O blueprint pode ser moldado na plataforma, mas as notas de arquitetura e o raciocinio de produto continuam a pertencer ao workspace local do estudante.",
    cliMoments: [
      { label: "Usar notas e specs locais ao fazer cortes de scope", detail: "Este dia funciona melhor quando os memos, specs e contratos anteriores estao abertos ao lado da plataforma." },
    ],
    toolRoles: [
      { tool: "Plataforma", role: "Board de arquitetura e disciplina de scope." },
      { tool: "Specs", role: "Evidencia do que o MVP ja prometeu." },
      { tool: "OpenCode", role: "Ajuda a testar a solidez das escolhas de arquitetura." },
      { tool: "Estudante", role: "Toma a decisao final sobre foco." },
    ],
    artifactList: [
      "blueprint_prophet_lite.md com scope rigoroso",
      "lista_out_of_scope.md provando coragem para cortar"
    ],
    smoothers: [
      "Raios claros entre in-scope e out-of-scope.",
      "Matriz de papeis que parece concreta, nao abstrata.",
      "Um resumo final do blueprint que o estudante pode reutilizar depois.",
    ],
  },
  6: {
    headline: "Tornar fluxos documentais locais, realistas e explicitos quanto ao que a AI faz de facto.",
    localFirst: "O estudante deve correr OCR ou parsers localmente primeiro. O DeepSeek deve ser apresentado como a camada que estrutura, classifica, resume e raciocina sobre o texto extraido.",
    cliMoments: [
      { label: "Usar primeiro OCR ou parser local", detail: "A plataforma nunca deve insinuar que o OCR acontece magicamente no navegador. O fluxo real comeca na maquina do estudante." },
      { label: "Enviar o texto extraido ao DeepSeek depois da limpeza", detail: "O DeepSeek serve para estrutura e review depois da extracao, nao como substituto para todas as etapas de processamento documental." },
    ],
    toolRoles: [
      { tool: "OCR/parser local", role: "Retira texto e metadata de PDFs, imagens e documentos." },
      { tool: "DeepSeek", role: "Normaliza a extracao, classifica documentos e ajuda no raciocinio sobre qualidade." },
      { tool: "Plataforma", role: "Ensina a pipeline e recolhe evidencia e conclusoes." },
      { tool: "Estudante", role: "Mantem um loop de revisao humana sobre outputs sensiveis." },
    ],
    artifactList: [
      "schema_extracao.json para metadados de documentos",
      "desenho_knowledge_workspace.md com pipeline de RAG"
    ],
    smoothers: [
      "Uma pipeline visivel do ficheiro para o texto extraido e para a estrutura revista.",
      "Exemplos que separam OCR de raciocinio com AI.",
      "Checklist de review para confianca, falhas e qualidade de handoff.",
    ],
  },
  7: {
    headline: "Converter a visao tecnica numa experiencia de cliente intencional antes de se escrever mais codigo.",
    localFirst: "Wireframes, landing copy e logica de pricing podem ser afinados localmente com apoio de AI, enquanto a plataforma mantem o estudante alinhado com a narrativa.",
    cliMoments: [
      { label: "Usar AI localmente para afinar copy e opcoes de fluxo", detail: "A plataforma enquadra as decisoes, mas o estudante pode iterar rapidamente com ferramentas de planeamento locais." },
    ],
    toolRoles: [
      { tool: "Plataforma", role: "Enquadramento da jornada, prompts de wireflow e empacotamento de lancamento." },
      { tool: "Z.ai", role: "Apoio ao planeamento de UX, copy e estrutura." },
      { tool: "OpenCode", role: "Ajuda a prototipar e rever decisoes de fluxo." },
      { tool: "Estudante", role: "Define como o produto deve ser sentido por um comprador real." },
    ],
    artifactList: [
      "mapa_ecras_mobile.md ou wireframes core",
      "landing_copy.md com Proposta de Valor e Pricing",
      "founder_launch_pack que une spec, UX e negócio"
    ],
    smoothers: [
      "Pontos de controlo editaveis da jornada do cliente.",
      "Prompts de pricing ligados a wedge real.",
      "Founder pack pronto para lancamento, nao uma pilha solta de notas.",
    ],
  },
  8: {
    headline: "Fazer o motor deterministico parecer confiavel, testavel e explicavel.",
    localFirst: "O trabalho do motor central pertence ao projeto local e aos fluxos de terminal do estudante. A plataforma deve reforcar habitos de validacao e definicao de pronto.",
    cliMoments: [
      { label: "Correr validacoes e checks do motor localmente", detail: "Este e um dia de construir e verificar. O progresso real acontece no repo local e nos scripts do estudante." },
    ],
    toolRoles: [
      { tool: "Codebase local", role: "Onde a logica de projecao e os testes correm de facto." },
      { tool: "Plataforma", role: "Enquadramento de validacao, expectativas de teste e captura de marcos." },
      { tool: "OpenCode", role: "Ajuda a interpretar falhas e sugerir correcoes." },
      { tool: "Estudante", role: "Mantem a verificacao final da logica atuarial." },
    ],
    artifactList: [
      "motor_local_v0.1 (scripts do motor de cálculo)",
      "comparacao_excel_vs_motor.md (validação de output)"
    ],
    smoothers: [
      "Marcos de teste visiveis em vez de um estado binario de sucesso.",
      "Um sitio para guardar assumptions, divergencias e correcoes.",
      "Checklist de validacao ligada a evidencia real de output.",
    ],
  },
  9: {
    headline: "Juntar o shell do produto sem tirar o centro de gravidade da app local do estudante.",
    localFirst: "A app local do estudante continua a ser o runtime principal. A plataforma deve orientar escolhas de integracao e ajudar a empacotar o resultado, nao tornar-se o shell do produto.",
    cliMoments: [
      { label: "Integrar documentos e comportamento do copiloto na app local", detail: "Aqui o estudante cose uploads, resultados e explicacoes AI dentro da sua propria codebase." },
      { label: "Usar o DeepSeek depois da extracao local ou de eventos da app", detail: "O DeepSeek deve ajudar na interpretacao e estrutura, mas o estudante precisa continuar a compreender a pipeline a volta." },
    ],
    toolRoles: [
      { tool: "App local", role: "Shell principal do MVP do estudante." },
      { tool: "DeepSeek", role: "Copiloto e camada de raciocinio documental quando faz sentido." },
      { tool: "Plataforma", role: "Guia de integracao, prompts de review e recolha de evidencia." },
      { tool: "Estudante", role: "Decide como as pecas encaixam e o que vai mesmo ser enviado." },
    ],
    artifactList: [
      "app_local_shell (código do frontend/backend local)",
      "copiloto_integrado na navegação dos resultados"
    ],
    smoothers: [
      "Separacao limpa entre tarefas de build local e tarefas de review na plataforma.",
      "Checklist para upload -> run -> explicar -> guardar.",
      "Uma narrativa simples para preparar a demo.",
    ],
  },
  10: {
    headline: "Transformar o momento local em produto enviado e ativo visivel de lancamento.",
    localFirst: "O deploy deve ser o momento em que o estudante move algo real do local para o live. A plataforma deve orientar, celebrar e empacotar o lancamento.",
    cliMoments: [
      { label: "Fazer deploy a partir do fluxo real do projeto do estudante", detail: "Este dia deve normalizar passos de deploy por CLI e gestao de ambiente com intencao." },
      { label: "Capturar evidencia de lancamento depois de o build estar live", detail: "Screenshots, copy de lancamento e guiao final de demo devem vir depois de um deploy real, nao antes." },
    ],
    toolRoles: [
      { tool: "Repo local e CLI de deploy", role: "Caminho do build para um URL real." },
      { tool: "Plataforma", role: "Checklist de lancamento, packaging e momentum." },
      { tool: "Ativos de Comunicação", role: "Prova documentada de que algo foi enviado." },
      { tool: "Estudante", role: "Torna o lancamento legivel para mercado, clientes ou equipa." },
    ],
    artifactList: [
      "README.md limpo, profissional e voltado ao utilizador",
      "URL da App em Produção (Live Deploy)",
      "nota_lancamento.md pronta para partilhar com equipa/colegas"
    ],
    smoothers: [
      "Sequencia deploy primeiro, documentar depois.",
      "Checklist de lancamento que separa bloqueadores de nice-to-have.",
      "Export final do trabalho e da historia do produto do estudante.",
    ],
  },
};

export function getExperienceGuide(dayNumber: number): ExperienceGuide {
  return DAY_EXPERIENCES[dayNumber] || DAY_EXPERIENCES[0];
}
