COURSE_TITLE = "AI & Data Science Bootcamp para Atuarios"
COURSE_SUBTITLE = "De Especialista de Risco a Fundador de SaaS Atuarial"
TOTAL_POINTS = 1000

BADGES = [
    (0, "Data Rookie"),
    (200, "Data Explorer"),
    (400, "Data Analyst"),
    (600, "Data Scientist"),
    (800, "ML Engineer"),
    (900, "AI Founder"),
]


def get_badge(points: int) -> str:
    badge = BADGES[0][1]
    for threshold, name in BADGES:
        if points >= threshold:
            badge = name
    return badge


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DAYS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAYS = [
    # ──────────────────────────────────────────
    # DAY 0 - Pre-Bootcamp
    # ──────────────────────────────────────────
    {
        "dia": 0,
        "titulo": "OpenCode, MCPs & Excel -- O Teu Assistente de Escritorio",
        "semana": 0,
        "objetivo": "Instalar e dominar o OpenCode CLI para tarefas de escritorio. Manipular ficheiros Excel via MCP. Entender conceitos praticos de LLMs: tokens, contexto, parametros.",
        "modulos": [
            "OpenCode CLI: Ferramentas & MCPs para o Escritorio",
            "Conceitos Praticos de LLMs & APIs"
        ],
        "exercicios": [
            {"id": "ex0.1", "titulo": "Instalar OpenCode & Primeiros Passos", "pontos": 10,
             "descricao": "Abrir o terminal, instalar OpenCode CLI (npm i -g opencode), configurar API key DeepSeek no opencode.jsonc, executar 'opencode run \"Ola, explica o que es\"'. Navegar pela TUI, listar ferramentas built-in com /tools."},
            {"id": "ex0.2", "titulo": "Tarefas de Escritorio com OpenCode", "pontos": 10,
             "descricao": "Usar OpenCode para: (1) resumir um documento PDF de regulamentacao, (2) redigir um email profissional ao regulador, (3) converter o ficheiro sample_data.csv para JSON usando 'opencode run --file sample_data.csv \"converte para JSON\"'."},
            {"id": "ex0.3", "titulo": "Tarefas Atuariais com OpenCode", "pontos": 10,
             "descricao": "Usar OpenCode para: (1) interpretar um artigo de Solvencia II, (2) analisar a tabua CSO 2017 (abrir com --file), (3) redigir um parecer tecnico simplificado sobre mortalidade. Comparar respostas com temperature=0 vs temperature=1."},
            {"id": "ex0.4", "titulo": "Configurar o Excel MCP", "pontos": 10,
             "descricao": "Instalar o Excel MCP server (@negokaz/excel-mcp-server). Adicionar ao opencode.jsonc na seccao 'mcp'. Testar: pedir ao OpenCode para ler a tabua de mortalidade de um ficheiro .xlsx, listar as sheets, e mostrar qx para idades 30-40."},
            {"id": "ex0.5", "titulo": "Manipular Excel com LLM via MCP", "pontos": 10,
             "descricao": "Usando o Excel MCP: (1) criar uma nova sheet 'Resumo' no ficheiro de mortalidade, (2) escrever uma tabela comparativa M vs F para idades 20-60, (3) adicionar formulas de media e desvio padrao. Tudo via comandos ao OpenCode, sem abrir o Excel."},
            {"id": "ex0.6", "titulo": "Explorar Conceitos de LLM", "pontos": 10,
             "descricao": "Experimentar com OpenCode: (1) comparar respostas com temperature=0 vs 1 para o mesmo prompt atuarial (preencher tabela comparativa), (2) testar JSON mode para extrair dados estruturados de uma proposta de seguro em texto livre, (3) estimar o custo em tokens de resumir um documento de 20 paginas."},
        ],
        "desafio": {"id": "des0", "titulo": "Automatizar o Teu Dia de Trabalho", "pontos": 25,
                    "descricao": "Criar 3 prompts reutilizaveis para tarefas reais do teu dia-a-dia atuarial (pelo menos 1 usando o Excel MCP). Documentar para cada: prompt completo, output esperado, parametros usados (temperature, max_tokens), MCPs configurados. Guardar num ficheiro prompts_atuariais.md."},
        "conteudo": {
            "modulo_1": {
                "titulo": "OpenCode CLI: Ferramentas & MCPs para o Escritorio",
                "topicos": [
                    {
                        "titulo": "O Que e o OpenCode",
                        "conteudo": "OpenCode e um agente de AI coding open-source para o terminal. Escrito em Go, oferece uma TUI (Terminal User Interface) interativa com suporte para 75+ providers (DeepSeek, OpenAI, Anthropic, Gemini, modelos locais). Funciona como um assistente que le, edita e cria ficheiros, executa comandos, e pesquisa na web -- tudo sem sair do terminal."
                    },
                    {
                        "titulo": "Basicos do Terminal",
                        "conteudo": "O terminal e uma interface de texto para interagir com o computador. Comandos essenciais: 'cd pasta' (mudar diretorio), 'ls' ou 'dir' (listar ficheiros), 'pwd' (ver diretorio atual), 'mkdir nome' (criar pasta). No Windows: usar Windows Terminal ou PowerShell. PATH e a variavel que diz ao sistema onde encontrar programas instalados. npm (Node Package Manager) e pip (Python) sao gestores de pacotes para instalar ferramentas."
                    },
                    {
                        "titulo": "Instalacao e Configuracao do OpenCode",
                        "conteudo": "Instalar: 'npm i -g opencode'. Configurar em ~/.config/opencode/opencode.jsonc (global) ou opencode.jsonc na raiz do projeto. Definir provider e API key: recomendamos DeepSeek para custo-beneficio (api_key no campo provider). Testar: 'opencode' abre a TUI, 'opencode run \"Ola\"' executa um prompt sem TUI. Custo estimado do Dia 0 inteiro: < 0.50 USD com DeepSeek."
                    },
                    {
                        "titulo": "Ferramentas Built-in do OpenCode",
                        "conteudo": "OpenCode tem 14 ferramentas integradas que o LLM pode usar: read (ler ficheiros), write (criar ficheiros), edit (editar com substituicao de strings), bash (executar comandos shell), grep (pesquisar conteudo com regex), glob (encontrar ficheiros por padrao), list (listar diretorios), webfetch (ler paginas web), websearch (pesquisar na web), lsp (code intelligence), patch (aplicar patches), skill (carregar instrucoes), question (perguntar ao utilizador), todowrite/todoread (gerir tarefas). Todas sao ativadas automaticamente."
                    },
                    {
                        "titulo": "CLI: Modo Nao-Interativo e Automacao",
                        "conteudo": "Para automacao: 'opencode run \"prompt\"' executa sem TUI. Flags uteis: --file/-f (anexar ficheiros ao prompt), --model/-m provider/modelo, --format json (output estruturado), --continue (continuar ultima sessao), --session ID (retomar sessao especifica). Exemplo: 'opencode run --file mortalidade.csv \"calcula a esperanca de vida aos 65 anos\"'."
                    },
                    {
                        "titulo": "Tarefas de Escritorio com LLM",
                        "conteudo": "O OpenCode transforma tarefas repetitivas em segundos: resumir documentos longos, redigir emails profissionais, traduzir textos, converter formatos (CSV->JSON, XML->tabela), gerar relatorios a partir de dados brutos, pesquisar informacao na web. O LLM le ficheiros locais diretamente e pode editar/criar novos."
                    },
                    {
                        "titulo": "Tarefas Atuariais Especificas",
                        "conteudo": "Aplicacoes imediatas para atuarios: interpretar regulamentacao (ASF, EIOPA, Solvencia II), analisar tabelas de mortalidade, redigir pareceres tecnicos, validar calculos de reservas, gerar especificacoes para modelos, explicar clausulas contratuais complexas. Dica: usar temperature=0 para tarefas que exigem precisao (calculos, regulamentacao)."
                    },
                    {
                        "titulo": "O Que Sao MCPs (Model Context Protocol)",
                        "conteudo": "MCPs sao servidores que estendem as capacidades do LLM com ferramentas externas. Protocolo aberto criado pela Anthropic. Funciona como 'plugins universais': qualquer ferramenta expoe funcionalidades via MCP e qualquer LLM compativel as usa. Em vez de copiar dados para o prompt, o LLM liga-se diretamente a fonte. Configuracao no opencode.jsonc: seccao 'mcp' com nome do servidor, tipo (local ou remote), e comando/url."
                    },
                    {
                        "titulo": "Excel MCP -- O LLM Manipula Spreadsheets",
                        "conteudo": "O Excel MCP (@negokaz/excel-mcp-server) permite ao LLM ler, escrever e formatar ficheiros Excel (.xlsx) sem abrir o Excel. Ferramentas: excel_describe_sheets (listar sheets), excel_read_sheet (ler celulas com paginacao), excel_write_to_sheet (escrever valores e formulas), excel_create_table (converter range em tabela formatada), excel_copy_sheet (duplicar sheets), excel_format_range (aplicar estilos). Config: {\"mcp\": {\"excel\": {\"type\": \"local\", \"command\": [\"npx\", \"--yes\", \"@negokaz/excel-mcp-server\"]}}}."
                    },
                    {
                        "titulo": "Outros MCPs Uteis para Atuarios",
                        "conteudo": "Filesystem MCP: ler/escrever ficheiros com controlo de acesso. Supabase MCP (remote: https://mcp.supabase.com/mcp): queries SQL a bases de dados, gestao de schemas, deploy de funcoes. Google Sheets MCP: ler/escrever spreadsheets partilhadas via Google Drive. PDF Reader MCP: extrair texto e metadados de PDFs (regulamentacao, clausulados). Context7 MCP: pesquisar documentacao tecnica atualizada. Todos configuraveis no opencode.jsonc."
                    },
                ]
            },
            "modulo_2": {
                "titulo": "Conceitos Praticos de LLMs & APIs",
                "topicos": [
                    {
                        "titulo": "Tokens: A Moeda dos LLMs",
                        "conteudo": "Tokens sao pedacos de texto (~4 caracteres em ingles, ~3 em portugues). Custo = tokens de input + tokens de output. Modelos tem limite de contexto (8K a 200K tokens). Saber estimar tokens ajuda a controlar custos e evitar truncamento. Regra pratica: 1 pagina A4 ~ 500-700 tokens. DeepSeek: ~0.14 USD por milhao de tokens de input."
                    },
                    {
                        "titulo": "Parametros Importantes",
                        "conteudo": "Temperature: 0 = deterministico/preciso, 1 = criativo/variado. Para tarefas atuariais (calculos, regulamentacao) usar 0-0.3. Max_tokens: limita o tamanho da resposta. Top_p: alternativa a temperature. Stop sequences: onde o modelo para de gerar. No OpenCode, configurar no provider ou passar via prompt."
                    },
                    {
                        "titulo": "Contexto e Memoria",
                        "conteudo": "Context window: quanto texto o modelo 've' de uma vez. Mais contexto = respostas mais informadas mas mais caras. System prompt: instrucoes persistentes (no OpenCode: RULES.md ou campo 'instructions' no config). Chat history: memoria da conversa atual. Sessions no OpenCode permitem guardar e retomar conversas."
                    },
                    {
                        "titulo": "JSON Mode e Structured Output",
                        "conteudo": "Pedir ao modelo para responder em JSON permite integrar com codigo. Exemplo: extrair nome, idade, produto e capital de uma proposta de seguro em texto livre. No OpenCode: 'opencode run --format json \"extrai os campos desta proposta\"'. Essencial para pipelines de automacao."
                    },
                    {
                        "titulo": "Streaming vs Batch",
                        "conteudo": "Streaming: tokens aparecem um a um (experiencia interativa, TUI do OpenCode). Batch: resposta completa de uma vez (melhor para automacao com 'opencode run'). APIs suportam ambos."
                    },
                    {
                        "titulo": "APIs e Providers",
                        "conteudo": "Cada provider tem a sua API. O padrao OpenAI-compatible e o mais comum (DeepSeek, Groq, OpenRouter usam-no). OpenCode suporta 75+ providers via Models.dev. Conceitos: endpoint (URL), API key (autenticacao), request body (modelo, mensagens, parametros), response (texto gerado). Recomendacao para o bootcamp: DeepSeek (barato, rapido, OpenAI-compatible)."
                    },
                    {
                        "titulo": "Escolher Provider e Controlar Custos",
                        "conteudo": "DeepSeek: melhor custo-beneficio ($0.14/M input, $0.28/M output). Anthropic Claude: mais capaz mas mais caro. OpenAI GPT: boa alternativa. Modelos locais (Ollama): gratis mas requer GPU. Para o bootcamp: DeepSeek como default, Claude/GPT para tarefas criticas. Monitorizar custos: 'opencode stats' mostra consumo de tokens."
                    },
                ]
            }
        }
    },

    # ──────────────────────────────────────────
    # DAY 1 - Pensar em Escala
    # ──────────────────────────────────────────
    {
        "dia": 1,
        "titulo": "Pensar em Escala -- O Porque Antes do Como",
        "semana": 1,
        "objetivo": "Entender porque a tecnologia e a escalabilidade mudam tudo para um atuario. Dominar o Spec-Driven Development (SDD). Configurar Python, Git e Z.ai.",
        "modulos": ["O Atuario como Empreendedor Tecnologico", "Spec-Driven Development & Primeira Spec"],
        "exercicios": [
            {"id": "ex1.1", "titulo": "Setup do Ecossistema de Desenvolvimento", "pontos": 10,
             "descricao": "Instalar Python 3.11+, Git, e Z.ai. Inicializar repositorio com 'git init'. Clonar o Spec Kit do bootcamp. Verificar que OpenCode (instalado no Dia 0) esta funcional com 'opencode run \"versao do Python instalada?\"'."},
            {"id": "ex1.2", "titulo": "Spec Guiada: Calculadora de Premio Simples", "pontos": 10,
             "descricao": "Seguir o template_spec.md fornecido para escrever uma spec para uma calculadora de premio puro temporario (inputs: idade, sexo, prazo, capital; output: premio anual). Gerar codigo com OpenCode a partir da spec. Executar e verificar o resultado."},
            {"id": "ex1.3", "titulo": "Auditar Codigo Gerado por IA", "pontos": 10,
             "descricao": "Usar a checklist_auditoria_codigo.md (5 perguntas) para auditar o codigo gerado no ex1.2. Identificar pelo menos 1 problema (arredondamento, convencao de taxas, ou tratamento de edge cases). Corrigir via nova instrucao ao OpenCode."},
        ],
        "desafio": {"id": "des1", "titulo": "A Tua Primeira Spec Independente", "pontos": 25,
                    "descricao": "Escrever spec.md para um problema atuarial a tua escolha (VPA, anuidade, tabela de mortalidade ajustada). Gerar codigo com OpenCode, auditar com checklist, documentar decisoes."},
        "conteudo": {
            "modulo_1": {
                "titulo": "O Atuario como Empreendedor Tecnologico",
                "topicos": [
                    {
                        "titulo": "Porque Software > Spreadsheets",
                        "conteudo": "Um atuario com Excel serve 5-10 clientes. Um atuario com software serve 500. A diferenca nao e linear -- e exponencial. Software permite automacao, reproducibilidade, auditoria, e escala. O custo marginal de servir mais um cliente tende para zero."
                    },
                    {
                        "titulo": "O Mercado de Software Atuarial",
                        "conteudo": "FIS Prophet, Moody's AXIS, RNA Analytics dominam o mercado. Licencas custam 50-200K EUR/ano. Um SaaS atuarial cloud-native com AI pode democratizar o acesso. O mercado portugues (ASF) tem ~50 seguradoras, a maioria dependente de ferramentas legacy."
                    },
                    {
                        "titulo": "De Consultor a Fundador",
                        "conteudo": "O bootcamp transforma o atuario de 'quem faz calculos' para 'quem constroi ferramentas'. O Prophet AI que vamos construir e um portfolio real: deployado, com utilizadores, RBAC, e modelo de negocio."
                    },
                ]
            },
            "modulo_2": {
                "titulo": "Spec-Driven Development & Primeira Spec",
                "topicos": [
                    {
                        "titulo": "O Que e Spec-Driven Development (SDD)",
                        "conteudo": "SDD e a metodologia do bootcamp: primeiro escreves a especificacao (spec.md), depois o LLM gera codigo a partir dela. O atuario e o especificador e auditor -- a IA e o codificador. Vantagens: documentacao automatica, reproducibilidade, qualidade controlavel."
                    },
                    {
                        "titulo": "Anatomia de uma spec.md",
                        "conteudo": "Uma spec tem: Objetivo (o que resolver), Inputs (dados de entrada com tipos e validacoes), Outputs (resultados esperados com formato), Regras de Negocio (formulas, convencoes, limites), Casos de Teste (pelo menos 2 cenarios com valores esperados). O template_spec.md do bootcamp fornece a estrutura."
                    },
                    {
                        "titulo": "Constitution.md: As Regras do Jogo",
                        "conteudo": "O constitution.md define regras matematicas globais que qualquer spec deve seguir: convencao de taxas (anuais, ACT/365), arredondamento (monetarios 2 casas, taxas 8 casas), tabua de referencia (CSO 2017), desconto mid-year. O LLM le o constitution antes de gerar codigo."
                    },
                    {
                        "titulo": "O Ciclo SDD: Spec -> Gerar -> Auditar -> Iterar",
                        "conteudo": "1) Escrever spec.md. 2) Dar ao OpenCode: 'implementa esta spec'. 3) Auditar com checklist (5 perguntas: formulas corretas? edge cases? arredondamento? tipos de dados? testes passam?). 4) Se falhar, corrigir a spec ou dar instrucao de correcao. Iterar ate satisfeito."
                    },
                    {
                        "titulo": "Git Basico para o Bootcamp",
                        "conteudo": "Git guarda versoes do teu codigo. Comandos essenciais: 'git init' (iniciar repo), 'git add .' (preparar ficheiros), 'git commit -m \"mensagem\"' (guardar versao), 'git push' (enviar para GitHub). O OpenCode pode fazer commits por ti."
                    },
                    {
                        "titulo": "Z.ai e o Coding Plan",
                        "conteudo": "Z.ai e uma ferramenta complementar que gera planos de implementacao (coding plans) a partir de specs. Usa o modelo GLM-5. Util para decompor problemas complexos em passos. No bootcamp, usamos Z.ai para planear e OpenCode para executar."
                    },
                ]
            }
        }
    },

    # ──────────────────────────────────────────
    # DAY 2 - Data Wrangling
    # ──────────────────────────────────────────
    {
        "dia": 2,
        "titulo": "Data Wrangling -- Delegando o Trabalho Pesado a IA",
        "semana": 1,
        "objetivo": "Aprender Python e pandas o suficiente para auditar codigo gerado por IA. Limpar a carteira de apolices vida e sinistralidade. Primeiro dashboard Streamlit.",
        "modulos": ["Python & Pandas para Atuarios", "Spec-Driven Data Wrangling & Primeiro Dashboard"],
        "exercicios": [
            {"id": "ex2.1", "titulo": "Data Wrangling da Carteira Vida", "pontos": 10,
             "descricao": "Escrever spec para limpeza de carteira_apolices_vida.csv e sinistralidade_vida.csv. Gerar com OpenCode. Tratar as 8 anomalias intencionais (2 idades negativas, 3 idades impossiveis, 3 capitais negativos). Validar com .describe() e .info()."},
            {"id": "ex2.2", "titulo": "Analise Exploratoria da Carteira", "pontos": 10,
             "descricao": "Gerar EDA com OpenCode: distribuicao por produto (pie chart), piramide etaria (bar chart), capital medio por produto (bar chart), taxa de sinistralidade por ano. Exportar graficos como PNG."},
            {"id": "ex2.3", "titulo": "Primeiro Dashboard Streamlit", "pontos": 10,
             "descricao": "Criar app Streamlit basica com os graficos do ex2.2. Usar o template fornecido (dashboard_template.py) como base. Adicionar pelo menos 1 filtro interativo (st.selectbox para produto). Lanca com 'streamlit run app.py'."},
        ],
        "desafio": {"id": "des2", "titulo": "Micro-Dashboard Atuarial (Vida)", "pontos": 25,
                    "descricao": "Dashboard Streamlit completo com: carteira limpa, 4 visualizacoes interativas (distribuicao, piramide etaria, sinistralidade temporal, capital por produto), filtros por produto e faixa etaria. Upload de CSV alternativo."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Python & Pandas para Atuarios",
                "topicos": [
                    {
                        "titulo": "Porque Python (e Nao R ou VBA)",
                        "conteudo": "Python e a linguagem #1 em data science, ML, e desenvolvimento web. Pandas para dados, scikit-learn para ML, Streamlit para apps web -- tudo no mesmo ecossistema. R e bom para estatistica mas fraco em producao. VBA e limitado ao Excel."
                    },
                    {
                        "titulo": "Pandas em 15 Minutos",
                        "conteudo": "DataFrame = tabela em memoria. Operacoes essenciais: pd.read_csv() (carregar), df.head() (primeiras linhas), df.describe() (estatisticas), df.info() (tipos e nulos), df['col'].value_counts() (contagens), df.groupby('col').mean() (agregacao), df.plot() (graficos rapidos). O LLM gera pandas por ti -- tu so precisas de auditar."
                    },
                    {
                        "titulo": "Auditar Codigo Pandas Gerado por IA",
                        "conteudo": "O LLM pode gerar pandas errado. Verificar: dtypes corretos (datas como datetime, nao string)? NaN tratados (dropna vs fillna)? Groupby com funcao correta (mean vs sum)? Filtros logicos corretos (& nao 'and')? Indices resetados apos operacoes?"
                    },
                    {
                        "titulo": "Plotly e Visualizacao",
                        "conteudo": "Plotly gera graficos interativos (zoom, hover, export). Plotly Express para graficos rapidos: px.bar(), px.pie(), px.line(), px.histogram(). Integra nativamente com Streamlit via st.plotly_chart(). Matplotlib/seaborn para graficos estaticos."
                    },
                ]
            },
            "modulo_2": {
                "titulo": "Spec-Driven Data Wrangling & Primeiro Dashboard",
                "topicos": [
                    {
                        "titulo": "Spec para Data Wrangling",
                        "conteudo": "Uma spec de limpeza define: ficheiro de input, problemas conhecidos (anomalias, nulos, formatos), regras de limpeza (remover vs corrigir vs imputar), output esperado (ficheiro limpo + relatorio de qualidade). O LLM gera o script de limpeza a partir da spec."
                    },
                    {
                        "titulo": "Anomalias Intencionais no Dataset",
                        "conteudo": "Os datasets do bootcamp tem anomalias plantadas para treinar deteocao: idades negativas, idades impossiveis (150, 200, 999), capitais negativos, datas futuras, tipos inconsistentes. Um bom pipeline de limpeza deve detetar e tratar cada tipo."
                    },
                    {
                        "titulo": "Streamlit em 10 Minutos",
                        "conteudo": "Streamlit transforma scripts Python em apps web. Conceitos essenciais: st.title() (titulo), st.dataframe(df) (mostrar tabela), st.plotly_chart(fig) (mostrar grafico), st.selectbox() (dropdown), st.sidebar (painel lateral), st.columns() (layout em colunas). Lanca com 'streamlit run app.py'. O LLM gera Streamlit apps a partir de specs."
                    },
                    {
                        "titulo": "Code Review Atuarial",
                        "conteudo": "Revisar codigo gerado por IA: (1) Formulas matematicas estao corretas? (2) Edge cases tratados (idade 0, capital 0, divisao por zero)? (3) Arredondamento segue convencao? (4) Tipos de dados consistentes? (5) Output validavel contra calculo manual?"
                    },
                ]
            }
        }
    },

    # ──────────────────────────────────────────
    # DAY 3 - Recolha de Dados & Saude
    # ──────────────────────────────────────────
    {
        "dia": 3,
        "titulo": "Recolha de Dados Programatica -- OCR, PDFs & Vertical Saude",
        "semana": 1,
        "objetivo": "Extrair dados de documentos nao-estruturados (PDFs, imagens) via OCR e vision models. Aplicar a pipeline completa no dominio Saude. Construir modulo TPA que sera add-on do Prophet AI.",
        "modulos": ["OCR, Vision Models & Recolha de Dados", "Pipeline Saude: Regras de Negocio & Dashboard TPA"],
        "exercicios": [
            {"id": "ex3.1", "titulo": "Motor de OCR e Extracao de PDFs", "pontos": 10,
             "descricao": "Processar 5 faturas hospitalares (PDF) e 3 recibos de farmacia (JPG) com OCR. Comparar abordagens: Tesseract (tradicional) vs Vision LLM (multimodal). Extrair: data, valor, CIDs, prestador. Output: JSON estruturado."},
            {"id": "ex3.2", "titulo": "Validacao de Regras de Negocio", "pontos": 10,
             "descricao": "Cruzar CIDs extraidos com exclusoes_apolice.json. Fatura 03 tem CID Z41 (exclusao absoluta -- procedimento cosmetico). Implementar motor de regras: exclusoes absolutas vs condicionais vs periodos de espera."},
            {"id": "ex3.3", "titulo": "Pricing Saude: Frequencia x Severidade", "pontos": 10,
             "descricao": "Usar tabua_morbilidade_saude.csv (frequencia + severidade por faixa etaria) para calcular premio puro = frequencia x severidade media. Comparar com medical_costs_sample.csv. Nota: ML para pricing sera aprofundado no Dia 4."},
        ],
        "desafio": {"id": "des3", "titulo": "Modulo TPA Saude (Add-on Prophet AI)", "pontos": 25,
                    "descricao": "Streamlit app: upload fatura -> OCR -> extracao de dados -> cruzamento com exclusoes -> alerta (coberto/excluido/pendente). Este modulo sera integrado como add-on Saude no Prophet AI final (Dia 9)."},
        "conteudo": {
            "modulo_1": {
                "titulo": "OCR, Vision Models & Recolha de Dados",
                "topicos": [
                    {
                        "titulo": "Porque Recolha de Dados Programatica",
                        "conteudo": "Muitos dados atuariais estao presos em PDFs, imagens, emails e spreadsheets nao-estruturados. Saber extrair dados programaticamente e uma competencia critica: evita entrada manual, reduz erros, e permite escala. Exemplos: faturas hospitalares, clausulados, relatorios de sinistro."
                    },
                    {
                        "titulo": "OCR Tradicional vs Vision LLMs",
                        "conteudo": "OCR tradicional (Tesseract, AWS Textract): converte imagem em texto. Bom para documentos limpos e tipados. Vision LLMs (GPT-4V, Claude Vision): entendem o contexto visual, extraem dados estruturados diretamente. Melhor para documentos complexos, tabelas, e formularios. Para o bootcamp: usar Vision LLM via API."
                    },
                    {
                        "titulo": "Pipeline de Extracao: PDF -> JSON",
                        "conteudo": "Pipeline tipica: (1) carregar documento (PDF/JPG), (2) OCR ou Vision LLM para texto, (3) LLM para extrair campos estruturados (JSON), (4) validar contra schema esperado, (5) gravar em base de dados. O OpenCode pode orquestrar todo o pipeline com um prompt bem escrito."
                    },
                    {
                        "titulo": "O MCP de PDF Reader",
                        "conteudo": "O PDF Reader MCP permite ao LLM ler PDFs diretamente sem conversao manual. Instalar via npm e configurar no opencode.jsonc. Util para: regulamentacao (Solvencia II), clausulados, relatorios de sinistro, notas de alta hospitalar."
                    },
                    {
                        "titulo": "Saude vs Vida: Contexto para o Atuario",
                        "conteudo": "Muitos atuarios de vida tambem lidam com saude (produtos combinados, grupo). A vertical Saude no bootcamp expoe o aluno a: frequencia-severidade (em vez de mortalidade), CIDs e exclusoes, TPA (Third-Party Administrator), e regulamentacao LGPD/RGPD para dados medicos."
                    },
                ]
            },
            "modulo_2": {
                "titulo": "Pipeline Saude: Regras de Negocio & Dashboard TPA",
                "topicos": [
                    {
                        "titulo": "Motor de Regras de Negocio",
                        "conteudo": "Validar sinistros contra clausulado: exclusoes absolutas (nunca coberto), exclusoes condicionais (carencia, pre-existencia), periodos de espera, limites de cobertura. Implementar como funcao Python que recebe CIDs e retorna decisao (coberto/excluido/pendente)."
                    },
                    {
                        "titulo": "CIDs (Classificacao Internacional de Doencas)",
                        "conteudo": "CID-10/11 classifica doencas com codigos alfanumericos. Z41 = procedimento cosmetico (exclusao tipica). R99 = causa mal definida (red flag fraude). O motor de regras cruza CIDs extraidos por OCR com a lista de exclusoes da apolice."
                    },
                    {
                        "titulo": "Pricing Saude: Frequencia x Severidade",
                        "conteudo": "Premio puro saude = E[frequencia] x E[severidade media]. Frequencia = numero de sinistros por exposto por ano. Severidade = custo medio por sinistro. Ambos variam por faixa etaria, sexo, e tipo de cobertura. Tabua de morbilidade fornece estes parametros base."
                    },
                    {
                        "titulo": "Integracao com Prophet AI",
                        "conteudo": "O modulo TPA construido hoje sera um add-on Saude no Prophet AI final. No Dia 9, vamos integra-lo como uma feature premium do SaaS: upload de faturas, validacao automatica, e pricing em tempo real. Isto demonstra que o Prophet AI nao e so Vida."
                    },
                ]
            }
        }
    },

    # ──────────────────────────────────────────
    # DAY 4 - Machine Learning
    # ──────────────────────────────────────────
    {
        "dia": 4,
        "titulo": "Machine Learning para Vida -- Mortalidade, Lapse & Subscricao",
        "semana": 1,
        "objetivo": "Construir modelos preditivos de mortalidade e lapse. Detetar declaracoes falsas na subscricao. Interpretabilidade com SHAP. Avaliacao rigorosa com train/test split.",
        "modulos": ["Fundamentos de ML para Atuarios", "Pipelines Preditivos, SHAP & Fairness"],
        "exercicios": [
            {"id": "ex4.1", "titulo": "Modelo de Mortalidade", "pontos": 10,
             "descricao": "Juntar carteira_apolices_vida.csv com sinistralidade_vida.csv para criar target binario (obito sim/nao). Treinar Logistic Regression e XGBoost com split 80/20. Reportar AUC-ROC e confusion matrix. Comparar qx previsto vs tabua CSO 2017 por idade/sexo. Gerar SHAP summary plot."},
            {"id": "ex4.2", "titulo": "Modelo de Lapse/Resgate", "pontos": 10,
             "descricao": "Usar carteira_apolices_vida.csv com coluna status para criar target binario (resgatado sim/nao). Features: ano_apolice, produto, idade, fumador. Split 80/20. Comparar taxas previstas com taxas_resgate.csv (agregadas por produto/ano). SHAP force plot para 3 apolices."},
            {"id": "ex4.3", "titulo": "Subscricao: Detetar Declaracoes Falsas", "pontos": 10,
             "descricao": "Em questionario_subscricao_vida.csv, usar coluna verificacao_posterior como ground truth (~35 falsas). Treinar classificador APENAS com features declaradas (colunas 3-12), sem usar a coluna de verificacao como feature. Split 80/20. Reportar precision, recall, F1. Que features mais contribuem para a deteocao? (SHAP)"},
        ],
        "desafio": {"id": "des4", "titulo": "Motor de Pricing Vida Inteligente", "pontos": 25,
                    "descricao": "Backend Python: perfil (idade, sexo, fumador, produto, prazo, capital) -> premio puro baseado em mortalidade + lapse preditos. Incluir SHAP explanation por perfil. Comparar com premio baseado na tabua CSO 2017 (sem ML). Guardar modelos como pickle para o Dia 7."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Fundamentos de ML para Atuarios",
                "topicos": [
                    {
                        "titulo": "ML vs Atuaria Tradicional",
                        "conteudo": "Atuaria tradicional: modelos parametricos (tabuas, GLMs). ML: modelos que aprendem padroes dos dados sem formula explicita. Nao substitui -- complementa. ML captura interacoes nao-lineares que tabuas planas nao captam (ex: fumador x regiao x produto)."
                    },
                    {
                        "titulo": "Classificacao Binaria",
                        "conteudo": "Prever sim/nao: vai morrer? vai resgatar? e fraude? Input: features (idade, sexo, produto...). Output: probabilidade [0,1]. Logistic Regression: simples, interpretavel, baseline. XGBoost: ensemble de arvores, mais preciso, menos interpretavel."
                    },
                    {
                        "titulo": "Train/Test Split e Overfitting",
                        "conteudo": "Dividir dados em treino (80%) e teste (20%). Treinar no treino, avaliar no teste. Se performance no treino >> teste = overfitting (o modelo memorizou em vez de aprender). Cross-validation (5-fold) para estimativa mais robusta."
                    },
                    {
                        "titulo": "Metricas de Avaliacao",
                        "conteudo": "AUC-ROC: area sob a curva ROC (0.5 = aleatorio, 1.0 = perfeito). Confusion matrix: TP, FP, TN, FN. Precision: dos que disse positivo, quantos eram? Recall: dos positivos reais, quantos encontrou? F1: media harmonica de precision e recall. Para mortalidade, recall importa mais (nao queremos miss deaths)."
                    },
                ]
            },
            "modulo_2": {
                "titulo": "Pipelines Preditivos, SHAP & Fairness",
                "topicos": [
                    {
                        "titulo": "Pipeline scikit-learn",
                        "conteudo": "Pipeline encadeia preprocessing e modelo: (1) ColumnTransformer para features numericas (StandardScaler) e categoricas (OneHotEncoder), (2) modelo (LogisticRegression ou XGBClassifier), (3) fit no treino, predict_proba no teste. O OpenCode gera pipelines a partir de specs."
                    },
                    {
                        "titulo": "SHAP: Explicar Cada Previsao",
                        "conteudo": "SHAP (SHapley Additive exPlanations) decompoe a previsao em contribuicoes de cada feature. Summary plot: quais features mais importam globalmente. Force plot: porque ESTE perfil tem ESTA probabilidade. Essencial para regulamentacao (EIOPA guidelines on AI in insurance) e para auditoria interna."
                    },
                    {
                        "titulo": "Fairness: Justica Algoritmica",
                        "conteudo": "O modelo discrimina injustamente por sexo, regiao, ou etnia? Metrica: demographic parity (taxa de positivos igual entre grupos). No ex4.1: comparar AUC por sexo (M vs F). Se AUC difere > 5pp, ha bias. Regulamentacao EU proibe discriminacao algoritmica em seguros -- exceto quando atuarialmente justificada (ex: sexo em mortalidade)."
                    },
                    {
                        "titulo": "De ML para o Motor Atuarial",
                        "conteudo": "Os modelos treinados hoje (mortalidade, lapse) serao inputs do motor deterministico do Dia 7. Guardar como pickle (joblib.dump). No motor: carregar modelo, prever qx/lapse por perfil, alimentar projecao de cash flows. ML + atuaria deterministica = melhor que qualquer um sozinho."
                    },
                ]
            }
        }
    },

    # ──────────────────────────────────────────
    # DAY 5 - Agentes & RAG
    # ──────────────────────────────────────────
    {
        "dia": 5,
        "titulo": "Agentes Autonomos & RAG -- O Co-Piloto Atuarial",
        "semana": 1,
        "objetivo": "Construir agentes autonomos para auditoria de sinistros vida. RAG para clausulados. Consolidar Semana 1 com exercicio de integracao.",
        "modulos": ["RAG e Frameworks de Agentes", "Agentes Atuariais & Consolidacao Semana 1"],
        "exercicios": [
            {"id": "ex5.1", "titulo": "RAG sobre Clausulados", "pontos": 10,
             "descricao": "Criar servico RAG com ChromaDB sobre condicoes_gerais_saude.pdf e exclusoes_apolice_vida.json. Perguntar: 'O suicidio e coberto apos 24 meses?', 'Quais exclusoes se aplicam a desportos radicais?'. Validar respostas contra os documentos originais."},
            {"id": "ex5.2", "titulo": "Agente Auditor de Sinistros Vida", "pontos": 10,
             "descricao": "Construir agente com tool calling (funcoes Python que o LLM invoca) que audita 3 processos de sinistro em nota_sinistro_vida.txt. O agente deve: verificar exclusoes, aplicar regra de incontestabilidade (24 meses), e emitir parecer (coberto/recusado/pendente)."},
            {"id": "ex5.3", "titulo": "Agente de Analytics e Fraude Vida", "pontos": 10,
             "descricao": "Agente com acesso a sinistralidade_vida.csv e red_flags_fraude_vida.csv. Deve: (1) gerar analytics conversacional (perguntas em linguagem natural -> graficos), (2) atribuir score de risco de fraude a cada sinistro baseado em red flags. Encontrar pelo menos 30 dos ~40 flags escondidos."},
        ],
        "desafio": {"id": "des5", "titulo": "Equipa de Agentes Auditores Vida", "pontos": 25,
                    "descricao": "Sistema multi-agente com tool calling: Agente Recetor (intake), Compliance (exclusoes + RAG), Anti-Fraude (red flags + score), Atuarial (reservas), Coordenador (decisao final). Testar nos 3 processos de sinistro. Acertar os 3 pareceres."},
        "conteudo": {
            "modulo_1": {
                "titulo": "RAG e Frameworks de Agentes",
                "topicos": [
                    {
                        "titulo": "O Que e RAG (Retrieval-Augmented Generation)",
                        "conteudo": "RAG combina pesquisa com geracao: (1) documentos sao convertidos em embeddings (vetores numericos) e guardados numa vector DB, (2) quando o utilizador pergunta algo, a pergunta e convertida em embedding e os documentos mais similares sao recuperados, (3) o LLM gera a resposta com esses documentos como contexto. Resultado: respostas fundamentadas em documentos reais, nao alucinacoes."
                    },
                    {
                        "titulo": "Embeddings e ChromaDB",
                        "conteudo": "Embeddings capturam o significado semantico do texto como vetores. Textos similares tem vetores proximos. ChromaDB e uma vector DB local e simples: chroma.Client(), collection.add(documents, embeddings), collection.query(query_text). Gratuita, sem servidor, ideal para o bootcamp."
                    },
                    {
                        "titulo": "O Paradigma de Agentes",
                        "conteudo": "Um agente e um LLM que pode executar acoes: chamar funcoes, ler ficheiros, consultar APIs, executar codigo. O loop ReAct: Raciocinar -> Agir -> Observar -> Raciocinar. Tool calling: o LLM decide qual funcao invocar e com que parametros. O resultado e passado de volta ao LLM para continuar."
                    },
                    {
                        "titulo": "Tool Calling vs CrewAI vs LangGraph",
                        "conteudo": "Tool calling nativo (OpenAI/Anthropic API): simples, 30 linhas de codigo, sem dependencias. CrewAI: framework para multi-agentes com roles e tasks (mais opinativo). LangGraph: grafos de agentes composiveis. Para o bootcamp: comecar com tool calling puro, escalar para multi-agente se necessario."
                    },
                ]
            },
            "modulo_2": {
                "titulo": "Agentes Atuariais & Consolidacao Semana 1",
                "topicos": [
                    {
                        "titulo": "Agente Auditor de Sinistros",
                        "conteudo": "O agente auditor tem tools: check_exclusions(cid_code), check_incontestability(policy_date, event_date), check_fraud_flags(claim_id), get_policy_details(policy_id). O LLM orquestra: le o sinistro, chama as tools relevantes, e emite parecer fundamentado. Os 3 processos de teste tem outcomes distintos: coberto, recusado por suicidio em carencia, pendente por declaracao falsa."
                    },
                    {
                        "titulo": "Seguranca em Agentes",
                        "conteudo": "Agentes que executam codigo (PythonREPLTool) sao perigosos: podem eliminar ficheiros, enviar dados, ou executar codigo malicioso. Regras: executar em ambiente isolado (sandbox/Docker), nunca dar acesso a ficheiros sensiveis, rever sempre o codigo antes de aprovar execucao. No OpenCode: permissions 'ask' para bash tool."
                    },
                    {
                        "titulo": "Consolidacao: Mapa da Semana 1",
                        "conteudo": "Dia 1: SDD + Setup. Dia 2: Data Wrangling + Dashboard. Dia 3: OCR + Saude. Dia 4: ML + Pricing. Dia 5: Agentes + RAG. Todos estes componentes alimentam o Prophet AI na Semana 2: o motor usa os modelos do Dia 4, os agentes do Dia 5 tornam-se co-pilotos, o modulo saude do Dia 3 e um add-on."
                    },
                    {
                        "titulo": "Preparacao para a Semana 2",
                        "conteudo": "Na Semana 2 vamos construir o Prophet AI: arquitetura (Dia 6), motor deterministico (Dia 7), agentes no motor (Dia 8), deploy (Dia 9), apresentacao (Dia 10). Verificar que tens: dados limpos do Dia 2, modelos pickle do Dia 4, agente auditor do Dia 5, modulo TPA do Dia 3."
                    },
                ]
            }
        }
    },

    # ──────────────────────────────────────────
    # DAY 6 - Arquitetura Prophet AI
    # ──────────────────────────────────────────
    {
        "dia": 6,
        "titulo": "Entendendo o Prophet & Arquitetando o Motor",
        "semana": 2,
        "objetivo": "Mapear o FIS Prophet para modulos especificaveis. Escrever Constitution.md e specs detalhados. Configurar Supabase com RBAC.",
        "modulos": ["Anatomia do Prophet: O Que Faz e Como", "Arquitetura via SDD, RBAC & Supabase"],
        "exercicios": [
            {"id": "ex6.1", "titulo": "Mapeamento Prophet -> Specs (Vida)", "pontos": 10,
             "descricao": "Estudar o prophet_reference_vida.md fornecido. Listar 5 funcoes core do Prophet (model points, assumptions, projection, reserves, reporting). Escrever mini-spec (1 pagina) para cada. Priorizar: quais 3 sao MVP?"},
            {"id": "ex6.2", "titulo": "Constitution.md com Regras Matematicas", "pontos": 10,
             "descricao": "Escrever constitution.md com: convencao de taxas (anuais, ACT/365), mid-year convention (formula explicita), tabua CSO 2017 (terminal 120, qx=1.0), fumador +50%, melhoramento multiplicativo. Incluir pelo menos 3 formulas (Ax, ax, V(t))."},
            {"id": "ex6.3", "titulo": "Ligar Semana 1 ao Prophet AI", "pontos": 10,
             "descricao": "Mapear outputs da Semana 1 para modulos Prophet AI: modelo mortalidade (Dia 4) -> Mortality Module, modelo lapse (Dia 4) -> Lapse Module, agente auditor (Dia 5) -> Claims Co-Pilot, modulo TPA (Dia 3) -> Health Add-on. Escrever integration-spec.md com interfaces entre modulos."},
        ],
        "desafio": {"id": "des6", "titulo": "Blueprint do Prophet AI (Vida)", "pontos": 25,
                    "descricao": "Entregar: constitution.md + 3 specs detalhados (projection, reserves, pricing) + rbac-spec.md (roles: admin, actuary, auditor, viewer) + diagrama de modulos + projeto Supabase configurado com tabelas e RLS."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Anatomia do Prophet: O Que Faz e Como",
                "topicos": [
                    {
                        "titulo": "O Que e o FIS Prophet",
                        "conteudo": "FIS Prophet e o motor atuarial mais usado no mundo para projecoes de vida e pensoes. Processa model points (apolices individuais ou agrupadas), aplica assumptions (mortalidade, lapse, juros, despesas), projeta cash flows ano a ano, e calcula reservas e metricas de rentabilidade. Licenca: 50-200K EUR/ano."
                    },
                    {
                        "titulo": "Model Points",
                        "conteudo": "Model point = representacao de uma apolice ou grupo de apolices. Campos tipicos: idade, sexo, fumador, produto, prazo, capital, premio, data inicio. O motor recebe uma tabela de model points e projeta cada um. No Prophet AI: input JSON com os mesmos campos."
                    },
                    {
                        "titulo": "Assumptions Tables",
                        "conteudo": "Tabuas de pressupostos: mortalidade (qx por idade/sexo), lapse (taxa de resgate por ano/produto), juros (yield curve ou taxa fixa), despesas (por apolice e % do premio), comissoes (por produto/ano com clawback). Cada tabua e um ficheiro CSV que o motor carrega."
                    },
                    {
                        "titulo": "Projection Engine",
                        "conteudo": "Para cada model point, para cada ano t: calcular decrementos (mortes, resgates, vencimentos), cash flows (premios recebidos, beneficios pagos, despesas), desconto (v(t) com mid-year), e acumulacao. Output: tabela com cash flows por ano e por model point."
                    },
                    {
                        "titulo": "Reservas V(t) e Reporting",
                        "conteudo": "V(t) = VPA(beneficios futuros) - VPA(premios futuros). Metodo prospectivo. Output: V(t) por ano e por model point. Reporting: profit signature (lucro por ano), VPN (valor presente do lucro), IRR, embedded value. Tudo derivado dos cash flows projetados."
                    },
                ]
            },
            "modulo_2": {
                "titulo": "Arquitetura via SDD, RBAC & Supabase",
                "topicos": [
                    {
                        "titulo": "De Specs a Arquitetura",
                        "conteudo": "A arquitetura Prophet AI emerge das specs: cada spec define um modulo (projection, reserves, pricing, claims, health). O constitution.md garante consistencia matematica entre modulos. O integration-spec.md define como os modulos comunicam (interfaces, formatos de dados)."
                    },
                    {
                        "titulo": "RBAC: Role-Based Access Control",
                        "conteudo": "RBAC define quem pode fazer o que: admin (tudo), actuary (projecoes, reservas, pricing), auditor (ver resultados, claims audit), viewer (dashboards read-only). Implementado com Supabase Row-Level Security (RLS): cada tabela tem policies que filtram dados por role."
                    },
                    {
                        "titulo": "Supabase: Auth + DB + RLS",
                        "conteudo": "Supabase = PostgreSQL + Auth + Storage + Edge Functions. Para o Prophet AI: Auth (login Google + email), DB (tabelas de model points, resultados, utilizadores), RLS (restricao por role), Edge Functions (logica serverless). Configurar em supabase.com: criar projeto, definir tabelas, ativar RLS."
                    },
                    {
                        "titulo": "Preparacao para o Dia 7",
                        "conteudo": "Ao final do Dia 6 deves ter: constitution.md validado, 3 specs prontos para implementacao, RBAC desenhado, Supabase projeto criado. Amanha (Dia 7) vamos implementar o motor a partir destas specs usando OpenCode."
                    },
                ]
            }
        }
    },

    # ──────────────────────────────────────────
    # DAY 7 - Motor Deterministico
    # ──────────────────────────────────────────
    {
        "dia": 7,
        "titulo": "Construindo o Motor Deterministico (Vida)",
        "semana": 2,
        "objetivo": "Implementar o motor de projecao passo a passo: pressupostos, cash flows, reservas V(t), profit testing. Validar contra valores de referencia.",
        "modulos": ["Cash Flow Engine: Pressupostos & Projecao", "Reservas V(t), Profit Testing & Testes"],
        "exercicios": [
            {"id": "ex7.1", "titulo": "Carregar e Preparar Pressupostos", "pontos": 10,
             "descricao": "Carregar CSO 2017 com ajuste fumador (+50%). Aplicar factores de melhoramento mortalidade (multiplicativos). Carregar taxas de resgate por produto/ano. Validar: qx para M/40/fumador com 5 anos de melhoramento deve ser ~[valor referencia]."},
            {"id": "ex7.2", "titulo": "Projecao de Cash Flows (Single Decrement)", "pontos": 10,
             "descricao": "Para um temporario 20 anos (M, 35, nao-fumador, capital 100K): projetar mortes esperadas, premios recebidos, beneficios pagos, por ano. Desconto mid-year: v(t) = 1/(1+r)^(t-0.5). Taxa fixa 4%. Validar contra spreadsheet de referencia (excel_validacao_cashflow.md)."},
            {"id": "ex7.3", "titulo": "Multiple Decrements e Premio Liquido", "pontos": 10,
             "descricao": "Adicionar lapse ao motor. Calcular premio liquido via principio de equivalencia: VPA(premios) = VPA(beneficios). Para o mesmo temporario: comparar premio com e sem lapse. Adicionar comissoes de comissoes_mediacao.csv."},
            {"id": "ex7.4", "titulo": "Reservas V(t) e Profit Testing", "pontos": 10,
             "descricao": "Calcular V(t) prospectivo para t=0,5,10,15,20. Profit signature: Lucro(t) = Premios - Beneficios - Despesas - DeltaV + Investimento. VPN do lucro. Validar V(10) contra valor de referencia. Repetir para misto 25 anos."},
        ],
        "desafio": {"id": "des7", "titulo": "Motor Vida Funcional v0.1", "pontos": 25,
                    "descricao": "Motor Python que aceita JSON input ({\"produto\": \"temporario\", \"idade\": 35, \"sexo\": \"M\", \"fumador\": false, \"prazo\": 20, \"capital\": 100000, \"taxa_desconto\": 0.04}), projeta cash flows, calcula V(t), profit signature, VPN. Suportar temporario e misto. Minimo 5 testes pytest (usando pytest.approx para comparacoes float)."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Cash Flow Engine: Pressupostos & Projecao",
                "topicos": [
                    {
                        "titulo": "Arquitetura do Motor",
                        "conteudo": "O motor tem 3 camadas: (1) Assumptions (carregar e transformar tabuas), (2) Projection (loop ano a ano com decrementos e cash flows), (3) Valuation (reservas, profit, metricas). Cada camada e um modulo Python independente, testavel, e especificado no constitution.md."
                    },
                    {
                        "titulo": "Carregar Pressupostos",
                        "conteudo": "CSO 2017: pd.read_csv, indexar por (idade, sexo). Fumador: qx_fumador = qx_base * 1.50. Melhoramento: qx(x,ano) = qx_base(x) * prod(1 - f(x,a)) para a=2017 ate ano_projecao. Lapse: taxas por (produto, ano_apolice). Yield: taxa fixa 4% para v0.1, yield curve ECB para stress no Dia 8."
                    },
                    {
                        "titulo": "Projecao Ano a Ano",
                        "conteudo": "Para cada t=1..n: lives_inicio(t) = lives_fim(t-1). Mortes(t) = lives_inicio(t) * qx(idade+t-1). Resgates(t) = (lives_inicio(t) - mortes(t)) * wx(t). Lives_fim(t) = lives_inicio(t) - mortes(t) - resgates(t). Premios(t) = lives_inicio(t) * premio_anual. Beneficio_morte(t) = mortes(t) * capital. Beneficio_resgate(t) = resgates(t) * valor_resgate(t)."
                    },
                    {
                        "titulo": "Mid-Year Convention",
                        "conteudo": "Mortes ocorrem uniformemente ao longo do ano. Beneficio por morte descontado a meio do ano: v_morte(t) = 1/(1+r)^(t-0.5). Premios pagos no inicio do ano: v_premio(t) = 1/(1+r)^(t-1). Resgate no fim do ano: v_resgate(t) = 1/(1+r)^t. Estas convencoes estao no constitution.md."
                    },
                ]
            },
            "modulo_2": {
                "titulo": "Reservas V(t), Profit Testing & Testes",
                "topicos": [
                    {
                        "titulo": "Premio Liquido (Principio de Equivalencia)",
                        "conteudo": "Premio tal que VPA(premios) = VPA(beneficios) no momento 0. Para temporario: P = capital * Ax / ax_n (anuidade temporaria). Para misto (endowment): P = capital * Ax:n / ax:n. O motor calcula P iterativamente ou por formula fechada."
                    },
                    {
                        "titulo": "Reserva V(t) Prospectiva",
                        "conteudo": "V(t) = VPA_t(beneficios futuros) - VPA_t(premios futuros). No tempo t, recalcular todos os cash flows futuros e descontar. V(0) = 0 por construcao (premio justo). V(n) = 0 (fim do contrato). V(t) cresce e depois diminui -- o maximo depende do produto."
                    },
                    {
                        "titulo": "Profit Testing",
                        "conteudo": "Profit(t) = Premios(t) + Investimento(t) - Beneficios(t) - Despesas(t) - Delta_V(t). Investimento(t) = V(t-1) * r. Delta_V(t) = V(t) - V(t-1). Profit signature: vetor de Profit(t). VPN = sum(Profit(t) * v(t)). IRR = taxa que faz VPN = 0. Profit margin = VPN / VPA(premios)."
                    },
                    {
                        "titulo": "Testes com pytest",
                        "conteudo": "Testar codigo atuarial requer: pytest.approx(valor, rel=1e-6) para comparacoes float. Fixtures para model points padrao. Testes de boundary: idade 0, idade 120 (qx=1), prazo 1, capital 0. Testes de regressao: valores esperados para cenario base. Minimo 5 testes para o motor."
                    },
                ]
            }
        }
    },

    # ──────────────────────────────────────────
    # DAY 8 - Stress Testing & Agentes no Motor
    # ──────────────────────────────────────────
    {
        "dia": 8,
        "titulo": "Cenarios de Stress Solvencia II & Co-Piloto Atuarial",
        "semana": 2,
        "objetivo": "Implementar cenarios de stress Solvencia II no motor. Integrar agente LLM como co-piloto. Dashboard de sensibilidade com tornado chart.",
        "modulos": ["Cenarios de Stress & Solvencia II", "Agente Co-Piloto & Dashboard de Sensibilidade"],
        "exercicios": [
            {"id": "ex8.1", "titulo": "Cenarios de Stress Solvencia II", "pontos": 10,
             "descricao": "Implementar funcoes de stress no motor: mortalidade +15% qx (permanente), longevidade -20% qx 65+ (so anuidades), lapse_up +50%, lapse_down -50%, mass lapse 40% ano 1, taxa de juro +/-200bps, despesas +10% + 1pp inflacao. Para cada: recalcular V(t) e VPN. Nota: simplificacao didatica vs standard formula real."},
            {"id": "ex8.2", "titulo": "Cenario COVID com Dados Reais", "pontos": 10,
             "descricao": "Usar mortalidade_covid_portugal.csv (excesso de mortalidade PT 2019-2023). Derivar multiplicadores qx por faixa etaria a partir de ratio_excesso. Aplicar como spike de 1 ano sobre CSO 2017 base. Comparar impacto nas reservas vs choque Solvencia II (+15% permanente)."},
            {"id": "ex8.3", "titulo": "Agente Co-Piloto + Tornado Chart", "pontos": 10,
             "descricao": "Integrar agente LLM com tool calling ao motor: o agente chama engine.run_projection(scenario=...) via tools. Gerar tornado chart de sensibilidade (barras horizontais: impacto de cada choque no VPN). Streamlit dashboard com selector de cenario e explicacao gerada pelo agente."},
        ],
        "desafio": {"id": "des8", "titulo": "Prophet AI com Stress Testing e Co-Piloto", "pontos": 25,
                    "descricao": "Motor com todos os cenarios Solvencia II implementados. Agente que aceita comandos em linguagem natural ('aplica choque de mortalidade e mostra o impacto'). Tornado chart interativo. Explicacoes em linguagem natural para cada cenario."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Cenarios de Stress & Solvencia II",
                "topicos": [
                    {
                        "titulo": "SCR Vida: Standard Formula",
                        "conteudo": "O SCR (Solvency Capital Requirement) mede o capital necessario para sobreviver choques adversos. Modulo Vida: mortalidade (+15% permanente), longevidade (-20% para 65+), lapse (up/down/mass), taxa de juro, despesas. Cada choque e aplicado independentemente, depois agregados com matriz de correlacao."
                    },
                    {
                        "titulo": "Implementar Choques no Motor",
                        "conteudo": "Cada choque e uma funcao que modifica os pressupostos: stress_mortality(qx, shock=0.15) retorna qx * (1+shock). O motor recebe pressupostos normais ou stressados e projeta. Delta = V(t)_stressed - V(t)_base. O SCR para cada risco = max(0, delta)."
                    },
                    {
                        "titulo": "COVID como Cenario Real",
                        "conteudo": "mortalidade_covid_portugal.csv contem excesso de mortalidade por faixa etaria 2019-2023. Usar ratio_excesso como multiplicador de qx para o ano do spike. Comparar com o choque permanente de +15%: o COVID e mais severo para certas idades mas temporario. Exercicio de julgamento atuarial."
                    },
                    {
                        "titulo": "Simplificacoes vs Realidade",
                        "conteudo": "A standard formula real usa: factores de choque dependentes da maturidade (juros), lapse mass so para surrender strain positivo, longevidade so para apolices expostas a risco de longevidade. No bootcamp simplificamos. Importante: saber que simplificamos e documentar os desvios."
                    },
                ]
            },
            "modulo_2": {
                "titulo": "Agente Co-Piloto & Dashboard de Sensibilidade",
                "topicos": [
                    {
                        "titulo": "Agente como Interface do Motor",
                        "conteudo": "Em vez de APIs com parametros rigidos, o utilizador fala em linguagem natural: 'mostra o impacto de mortalidade +20% na reserva do temporario'. O agente traduz para chamadas ao motor, executa, e apresenta resultados com explicacao. Tools: run_projection, get_reserve, apply_stress, compare_scenarios."
                    },
                    {
                        "titulo": "Tornado Chart de Sensibilidade",
                        "conteudo": "Tornado chart: barras horizontais mostrando o impacto de cada choque (positivo e negativo) no VPN ou na reserva. Ordenado por magnitude. Visualizacao standard em actuarial reporting. Plotly: go.Bar com orientation='h', dois traces (positivo e negativo)."
                    },
                    {
                        "titulo": "Guardrails para o Agente",
                        "conteudo": "O agente atuarial precisa de guardrails: nao pode modificar pressupostos base sem confirmacao, deve citar a fonte dos dados (tabua, yield curve), deve alertar quando resultados parecem anomalos (V(t) negativo, VPN > capital). Implementar via system prompt e validacoes nas tools."
                    },
                ]
            }
        }
    },

    # ──────────────────────────────────────────
    # DAY 9 - Deploy & Negocio
    # ──────────────────────────────────────────
    {
        "dia": 9,
        "titulo": "De Prototipo a Produto -- Deploy, RBAC & Modelo de Negocio",
        "semana": 2,
        "objetivo": "Deploy no Streamlit Cloud com RBAC funcional. Validar motor contra benchmarks de mercado. Construir modelo de negocio com projecao financeira.",
        "modulos": ["Deploy, Secrets & RBAC em Producao", "Benchmarks de Mercado & Modelo de Negocio"],
        "exercicios": [
            {"id": "ex9.1", "titulo": "Deploy com CI e Secrets", "pontos": 10,
             "descricao": "Preparar repositorio: .gitignore (excluir .env, secrets), requirements.txt com versoes pinadas, secrets via st.secrets (nao hardcoded). Deploy no Streamlit Cloud. Verificar: RBAC funcional (testar com 2 roles diferentes), secrets nao expostos, app acessivel publicamente."},
            {"id": "ex9.2", "titulo": "Validacao contra Mercado PT", "pontos": 10,
             "descricao": "Executar motor para 100 model points amostra. Agregar loss ratios por produto e ano. Comparar com benchmark_mercado_vida_pt.csv. Dashboard: graficos sobrepostos (motor vs mercado). Identificar e documentar desvios."},
            {"id": "ex9.3", "titulo": "Modelo de Negocio SaaS", "pontos": 10,
             "descricao": "Usar o LLM para ajudar a construir: (1) TAM Portugal (~50 seguradoras x gasto medio em software atuarial), (2) 3 tiers de pricing (Starter/Pro/Enterprise), (3) projecao de receita 12 meses com premissas explicitas, (4) pitch de 2 paragrafos gerado e refinado com AI. Preencher template_modelo_negocio.md."},
        ],
        "desafio": {"id": "des9", "titulo": "Prophet AI -- Versao SaaS", "pontos": 25,
                    "descricao": "App online e funcional: URL publica, RBAC com 3 roles testados, README.md profissional (gerado com ajuda de AI), modulo TPA Saude integrado como add-on, pricing definido com 3 tiers, landing page com proposta de valor clara."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Deploy, Secrets & RBAC em Producao",
                "topicos": [
                    {
                        "titulo": "Preparar para Deploy",
                        "conteudo": "Checklist: requirements.txt com versoes pinadas (pip freeze), .gitignore para excluir .env e secrets, README.md com instrucoes de setup, testes passam localmente. Nunca hardcoded: URLs, API keys, passwords devem vir de environment variables ou st.secrets."
                    },
                    {
                        "titulo": "Streamlit Cloud Deploy",
                        "conteudo": "Streamlit Community Cloud: gratuito, deploy direto de GitHub, SSL automatico, secrets management. Limitacoes: sem custom domain, cold starts, single-tenant. Para producao real: Railway, Render, ou AWS. Para o bootcamp: Streamlit Cloud e suficiente para demo e portfolio."
                    },
                    {
                        "titulo": "RBAC em Producao com Supabase",
                        "conteudo": "Verificar que RLS policies estao ativas: admin ve tudo, actuary pode executar projecoes, auditor ve resultados e claims, viewer so dashboards. Testar com 2 contas diferentes. Supabase RLS: CREATE POLICY nome ON tabela FOR SELECT USING (auth.role() = 'admin')."
                    },
                    {
                        "titulo": "Monitorizar e Debuggar",
                        "conteudo": "Apos deploy: verificar logs (Streamlit Cloud dashboard), testar todos os fluxos (login, projecao, stress, claims), monitorizar custos de API (OpenCode stats, Supabase dashboard). Adicionar try/except com mensagens claras para erros comuns."
                    },
                ]
            },
            "modulo_2": {
                "titulo": "Benchmarks de Mercado & Modelo de Negocio",
                "topicos": [
                    {
                        "titulo": "Validacao contra Mercado",
                        "conteudo": "O motor produz projecoes por apolice. O mercado tem dados agregados (loss ratios, premios, quotas). Ponte: executar motor para amostra de apolices, agregar, comparar. Se loss ratio do motor for 70% e mercado for 65%, investigar: pressupostos demasiado conservadores? Produto mix diferente?"
                    },
                    {
                        "titulo": "Mercado Segurador Portugues",
                        "conteudo": "ASF regula ~50 seguradoras em Portugal. Ramo Vida: premios ~10B EUR/ano. Dominado por unit-linked e PPR. Risco puro (temporario, vida inteira) e menor fatia. Oportunidade: muitas seguradoras pequenas sem acesso a ferramentas modernas de projecao."
                    },
                    {
                        "titulo": "Modelo de Negocio SaaS",
                        "conteudo": "SaaS = Software as a Service. Metricas: MRR (Monthly Recurring Revenue), CAC (Customer Acquisition Cost), LTV (Lifetime Value), Churn. Para Prophet AI: Starter (1 produto, 1000 model points, 29 EUR/mes), Pro (4 produtos, 10K model points, stress testing, 149 EUR/mes), Enterprise (ilimitado, API, 499 EUR/mes)."
                    },
                    {
                        "titulo": "Usar AI para Construir o Pitch",
                        "conteudo": "O LLM ajuda em tudo: gerar README.md a partir do codigo, escrever copy de marketing, criar projecoes financeiras, redigir o pitch. Workflow: dar ao OpenCode os dados do mercado + specs do produto + tiers desejados, pedir output formatado. Iterar ate satisfeito. O atuario valida os numeros."
                    },
                ]
            }
        }
    },

    # ──────────────────────────────────────────
    # DAY 10 - Polimento & Apresentacoes
    # ──────────────────────────────────────────
    {
        "dia": 10,
        "titulo": "Polimento Final, Peer Review & Apresentacoes",
        "semana": 2,
        "objetivo": "Polir o Prophet AI, fazer peer review, apresentar ao vivo, e planear os proximos 90 dias.",
        "modulos": ["Sprint Final & Peer Review (Manha)", "Apresentacoes & O Dia Depois do Bootcamp (Tarde)"],
        "exercicios": [
            {"id": "ex10.1", "titulo": "Polimento & Testes Finais", "pontos": 10,
             "descricao": "Corrigir bugs pendentes, garantir que todos os testes pytest passam, README.md completo (gerado com ajuda de AI), screenshots da app no README. Verificar deploy funcional e RBAC."},
            {"id": "ex10.2", "titulo": "Peer Code Review", "pontos": 10,
             "descricao": "Rever o repositorio de 1 colega usando checklist_auditoria_codigo.md. Avaliar: codigo limpo? testes existem? RBAC funcional? secrets seguros? README util? Escrever review de 1 pagina com 3 pontos fortes e 3 sugestoes de melhoria."},
            {"id": "ex10.3", "titulo": "Retrospetiva: Skills Adquiridas", "pontos": 10,
             "descricao": "Preencher o Skills Matrix: para cada dia (0-10), listar a competencia principal e auto-avaliar confianca (1-5). Listar: 3 coisas que agora sabes fazer e nao sabias ha 10 dias, 3 coisas que queres aprofundar, 1 ideia de projeto para os proximos 90 dias."},
        ],
        "desafio": {"id": "des10", "titulo": "Apresentacao Final (8 min)", "pontos": 25,
                    "descricao": "Demo ao vivo do Prophet AI (1 min contexto, 5 min demo, 2 min modelo de negocio + Q&A). Ter screenshots/video de backup caso o demo falhe. Votacao da turma para melhor projeto. Entregar: plano de 90 dias escrito (template fornecido)."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Sprint Final & Peer Review (Manha)",
                "topicos": [
                    {
                        "titulo": "Polimento Profissional",
                        "conteudo": "Antes de apresentar: corrigir todos os bugs conhecidos, limpar codigo morto, garantir que o README explica como instalar e usar, adicionar screenshots. Usar o LLM para gerar README a partir da estrutura do repositorio. O polimento e o que diferencia um projeto de bootcamp de um portfolio real."
                    },
                    {
                        "titulo": "Peer Code Review",
                        "conteudo": "Rever codigo de um colega e a melhor forma de aprender: ves abordagens diferentes ao mesmo problema, descobres bugs que olhos frescos encontram, e praticas uma competencia essencial de equipas de software. Usar a checklist de auditoria como guia estruturado."
                    },
                    {
                        "titulo": "Preparar o Demo",
                        "conteudo": "Regras de ouro para demos ao vivo: (1) ter um script escrito do que vais mostrar, (2) pre-carregar dados para evitar esperas, (3) ter screenshots como backup, (4) testar o fluxo inteiro 30 min antes, (5) falar do problema que resolves ANTES de mostrar a solucao."
                    },
                ]
            },
            "modulo_2": {
                "titulo": "Apresentacoes & O Dia Depois do Bootcamp (Tarde)",
                "topicos": [
                    {
                        "titulo": "Estrutura da Apresentacao",
                        "conteudo": "8 minutos: 1 min contexto (que problema resolvo, para quem), 5 min demo ao vivo (fluxo principal: input -> projecao -> reservas -> stress -> co-piloto), 2 min modelo de negocio + Q&A. Dica: comecar com o 'wow moment' -- mostrar o agente a responder em linguagem natural."
                    },
                    {
                        "titulo": "Caminhos Pos-Bootcamp",
                        "conteudo": "Apos o bootcamp podes seguir: (1) ML Engineering (aprofundar modelos, MLOps, deploy), (2) Full-Stack Development (APIs, databases, frontend), (3) Data Engineering (pipelines, Airflow, dbt), (4) Empreendedorismo (lancar o Prophet AI como produto real). Todos os caminhos beneficiam do que aprendeste."
                    },
                    {
                        "titulo": "Manter e Evoluir o Prophet AI",
                        "conteudo": "O Prophet AI nao acaba no Dia 10: adicionar mais produtos (unit-linked, PPR), melhorar modelos ML, integrar mais MCPs (Bloomberg, Reuters), adicionar multi-empresa. Usar o plano de 90 dias para definir prioridades. O codigo esta no GitHub, o deploy no Streamlit Cloud -- pronto para evoluir."
                    },
                    {
                        "titulo": "Comunidade e Portfolio",
                        "conteudo": "Publicar o projeto no GitHub com README profissional. Escrever um post no LinkedIn sobre o bootcamp. Partilhar no portfolio pessoal. Juntar-se a comunidades: Python Portugal, Data Science PT, Actuarial Data Science (global). O networking e tao importante quanto o codigo."
                    },
                ]
            }
        }
    },
]


def get_all_exercises() -> list:
    items = []
    for day in DAYS:
        for ex in day["exercicios"]:
            items.append({**ex, "dia": day["dia"], "tipo": "exercicio"})
        d = day["desafio"]
        items.append({**d, "dia": day["dia"], "tipo": "desafio"})
    return items


def get_max_points() -> int:
    return sum(ex["pontos"] for ex in get_all_exercises())


def get_day_exercises(dia: int) -> list:
    for day in DAYS:
        if day["dia"] == dia:
            return day["exercicios"], day["desafio"]
    return [], {}
