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

DAYS = [
    {
        "dia": 1,
        "titulo": "Pensar em Escala -- O Porque Antes do Como",
        "semana": 1,
        "objetivo": "Entender porque a tecnologia e a escalabilidade mudam tudo para um atuario. Configurar o ecossistema de AI Coding.",
        "modulos": ["O Atuario como Empreendedor Tecnologico", "Setup do Ecossistema AI & Introducao ao SDD"],
        "exercicios": [
            {"id": "ex1.1", "titulo": "Setup do Ecossistema AI", "pontos": 10,
             "descricao": "Instalar Python, OpenCode, Z.ai, Git. Inicializar repositorio com Spec Kit."},
            {"id": "ex1.2", "titulo": "Calculadora de Escala Pessoal", "pontos": 10,
             "descricao": "Preencher o template de escala com os teus numeros: cobro ___ por precificacao, sirvo ___ clientes."},
        ],
        "desafio": {"id": "des1", "titulo": "A Tua Primeira Spec", "pontos": 25,
                    "descricao": "Escrever spec.md para um problema atuarial, gerar codigo com OpenCode, auditar com checklist."},
    },
    {
        "dia": 2,
        "titulo": "Data Wrangling -- Delegando o Trabalho Pesado a IA",
        "semana": 1,
        "objetivo": "Especificar problemas de limpeza de dados para o LLM. Foco em carteira de apolices vida e sinistralidade.",
        "modulos": ["Spec-Driven Data Wrangling", "Code Review Atuarial"],
        "exercicios": [
            {"id": "ex2.1", "titulo": "Data Wrangling da Carteira Vida", "pontos": 10,
             "descricao": "Limpar carteira_apolices_vida.csv e sinistralidade_vida.csv. Tratar 8 anomalias intencionais."},
            {"id": "ex2.2", "titulo": "Analise Exploratoria da Carteira", "pontos": 10,
             "descricao": "Distribuicao por produto, piramide etaria, capital medio, taxa de sinistralidade."},
            {"id": "ex2.3", "titulo": "Detecao de Red Flags de Fraude", "pontos": 10,
             "descricao": "Explorar red_flags_fraude_vida.csv e descobrir pelo menos 30 dos ~40 red flags escondidos."},
        ],
        "desafio": {"id": "des2", "titulo": "Micro-Dashboard Atuarial (Vida)", "pontos": 25,
                    "descricao": "App Streamlit com distribuicao da carteira, sinistralidade, piramide etaria interativa."},
    },
    {
        "dia": 3,
        "titulo": "Modulo Saude -- OCR, Pipeline & Pricing",
        "semana": 1,
        "objetivo": "Dia dedicado ao dominio complementar de Saude. OCR de faturas, pricing com XGBoost, validacao contra exclusoes.",
        "modulos": ["OCR, Vision Models & Data Wrangling Saude", "Pricing Saude, Pipeline & Conformidade Legal"],
        "exercicios": [
            {"id": "ex3.1", "titulo": "Motor de OCR via Spec", "pontos": 10,
             "descricao": "Processar faturas hospitalares (PDF) e recibos de farmacia (JPG) com OCR."},
            {"id": "ex3.2", "titulo": "Data Wrangling & Pricing Saude", "pontos": 10,
             "descricao": "Limpar sinistralidade_historica.csv + treinar modelo pricing com medical_costs_sample.csv."},
            {"id": "ex3.3", "titulo": "Validacao de Regras de Negocio", "pontos": 10,
             "descricao": "Cruzar CIDs extraidos com exclusoes_apolice.json. Fatura 03 tem CID Z41 (exclusao absoluta)."},
        ],
        "desafio": {"id": "des3", "titulo": "Modulo TPA Saude", "pontos": 25,
                    "descricao": "Modulo Streamlit completo: upload fatura, OCR, cruzamento exclusoes, alerta fraude, pricing."},
    },
    {
        "dia": 4,
        "titulo": "Machine Learning para Vida -- Mortalidade, Lapse & Pricing",
        "semana": 1,
        "objetivo": "Modelos preditivos de mortalidade e lapse para vida. Justica algoritmica e explicabilidade.",
        "modulos": ["ML Encontra o Atuario de Vida", "Pipelines Preditivos & Interpretabilidade"],
        "exercicios": [
            {"id": "ex4.1", "titulo": "Modelo de Mortalidade", "pontos": 10,
             "descricao": "Prever P(obito) com Logistic Regression vs XGBoost. Comparar com tabua CSO 2017. SHAP values."},
            {"id": "ex4.2", "titulo": "Modelo de Lapse/Resgate", "pontos": 10,
             "descricao": "Prever P(resgate) por ano de apolice e perfil. Comparar com taxas_resgate.csv."},
            {"id": "ex4.3", "titulo": "Subscricao: Detetar Declaracoes Falsas", "pontos": 10,
             "descricao": "Usar ML para identificar ~20 propostas falsas em questionario_subscricao_vida.csv."},
        ],
        "desafio": {"id": "des4", "titulo": "Motor de Pricing Vida Inteligente", "pontos": 25,
                    "descricao": "Backend: perfil -> premio puro baseado em mortalidade+lapse. SHAP, fairness, comparacao com CSO."},
    },
    {
        "dia": 5,
        "titulo": "Agentes Autonomos, RAG & Revisao da Semana 1",
        "semana": 1,
        "objetivo": "Agentes autonomos para auditoria de sinistros vida. RAG para clausulados. Consolidar Semana 1.",
        "modulos": ["RAG e Frameworks de Agentes", "O Co-Piloto Atuarial com Tool Calling"],
        "exercicios": [
            {"id": "ex5.1", "titulo": "RAG sobre Clausulados", "pontos": 10,
             "descricao": "Criar servico RAG com ChromaDB sobre condicoes_gerais_saude.pdf."},
            {"id": "ex5.2", "titulo": "Agente Auditor de Sinistros Vida", "pontos": 10,
             "descricao": "Agente CrewAI que audita 3 processos de sinistro (exclusoes, incontestabilidade, fraude)."},
            {"id": "ex5.3", "titulo": "Agente Python REPL (Analytics Vida)", "pontos": 10,
             "descricao": "Agente com PythonREPLTool para analytics conversacional sobre sinistralidade_vida.csv."},
            {"id": "ex5.4", "titulo": "Agente Detetor de Fraude", "pontos": 10,
             "descricao": "Agente que analisa red_flags_fraude_vida.csv e atribui score de risco a cada sinistro."},
        ],
        "desafio": {"id": "des5", "titulo": "Equipa de Agentes Auditores Vida", "pontos": 25,
                    "descricao": "CrewAI: Agente Recetor + Compliance + Anti-Fraude + Atuarial + Coordenador. Acertar 3 pareceres."},
    },
    {
        "dia": 6,
        "titulo": "Entendendo o Prophet & Arquitetando o Motor",
        "semana": 2,
        "objetivo": "Mapear o Prophet para Vida, decompor em modulos especificaveis, desenhar arquitetura com RBAC.",
        "modulos": ["Anatomia do Prophet: O Que Faz e Como", "Arquitetura via SDD & RBAC"],
        "exercicios": [
            {"id": "ex6.1", "titulo": "Mapeamento Prophet -> Specs (Vida)", "pontos": 10,
             "descricao": "Listar 5 funcoes do Prophet, escrever specs, priorizar MVP."},
            {"id": "ex6.2", "titulo": "Constitution, RBAC & Supabase Setup", "pontos": 10,
             "descricao": "Constitution.md com regras matematicas + RBAC spec + projeto Supabase configurado."},
        ],
        "desafio": {"id": "des6", "titulo": "Blueprint do Prophet AI (Vida)", "pontos": 25,
                    "descricao": "Constitution.md + 3 specs detalhados + rbac-spec.md + diagrama de modulos."},
    },
    {
        "dia": 7,
        "titulo": "Construindo o Motor Deterministico (Vida)",
        "semana": 2,
        "objetivo": "Motor de projecao: fluxos de caixa por produto, tabuas, reservas V(t), profit testing.",
        "modulos": ["Cash Flow Engine Vida", "Tabuas, Lapse & Profit Testing"],
        "exercicios": [
            {"id": "ex7.1", "titulo": "Cash Flow Engine Vida", "pontos": 10,
             "descricao": "Gerar motor com OpenCode. Validar desconto, decremento multiplo, V(t). Comparar com calculo manual."},
            {"id": "ex7.2", "titulo": "Modulo de Tabuas e Reservas", "pontos": 10,
             "descricao": "Carregar CSO 2017 + lapse. Calcular V(t) para temporario 20 anos e misto 25 anos."},
        ],
        "desafio": {"id": "des7", "titulo": "Motor Vida Funcional v0.1", "pontos": 25,
                    "descricao": "Motor que aceita JSON, projeta 20 anos, calcula V(t), profit signature, VPN. Testes pytest."},
    },
    {
        "dia": 8,
        "titulo": "Agentes LLM, Cenarios de Stress & RBAC",
        "semana": 2,
        "objetivo": "Agentes no motor, cenarios Solvencia II, RBAC funcional com Supabase.",
        "modulos": ["O Co-Piloto Atuarial: Agentes no Motor", "Cenarios de Stress Vida & RBAC"],
        "exercicios": [
            {"id": "ex8.1", "titulo": "Integrar Agente ao Motor Vida", "pontos": 10,
             "descricao": "Agente conversa com motor: cenarios mortalidade +20%, lapse mass 40%, COVID real."},
            {"id": "ex8.2", "titulo": "RBAC & Dashboard de Sensibilidade", "pontos": 10,
             "descricao": "RBAC Supabase funcional + tornado chart de sensibilidade."},
        ],
        "desafio": {"id": "des8", "titulo": "Prophet AI Inteligente com RBAC", "pontos": 25,
                    "descricao": "Comandos em linguagem natural, cenarios Solvencia II, explicacoes, RBAC, tornado chart."},
    },
    {
        "dia": 9,
        "titulo": "De Prototipo a Produto -- Deploy & Modelo de Negocio",
        "semana": 2,
        "objetivo": "Deploy no Streamlit Cloud, modelo de pricing SaaS, contexto de mercado PT.",
        "modulos": ["Deploy no Streamlit Cloud & Empacotamento SaaS", "O Negocio do Software Atuarial"],
        "exercicios": [
            {"id": "ex9.1", "titulo": "Deploy do Prophet AI no Streamlit Cloud", "pontos": 10,
             "descricao": "Repositorio pronto, deploy no Streamlit Cloud, secrets configurados, RBAC em producao."},
            {"id": "ex9.2", "titulo": "Contexto de Mercado", "pontos": 10,
             "descricao": "Comparar motor com benchmark_mercado_vida_pt.csv. Loss ratios, tendencias, quota de mercado."},
            {"id": "ex9.3", "titulo": "Modelo de Negocio", "pontos": 10,
             "descricao": "Template preenchido: proposta de valor, pricing, tiers, pitch de 2 paragrafos."},
        ],
        "desafio": {"id": "des9", "titulo": "Prophet AI -- Versao SaaS", "pontos": 25,
                    "descricao": "Online, RBAC funcional, interface profissional, README, pricing definido."},
    },
    {
        "dia": 10,
        "titulo": "Polimento Final & Apresentacoes",
        "semana": 2,
        "objetivo": "Finalizar Prophet AI, apresentar, celebrar o inicio do caminho como empreendedor tecnologico.",
        "modulos": ["Sprint Final (Manha)", "O Dia Depois do Bootcamp: Roadmap (Tarde)"],
        "exercicios": [
            {"id": "ex10.1", "titulo": "Polimento & Testes Finais", "pontos": 10,
             "descricao": "Ultimos ajustes, correcao de bugs, README.md, ensaio da apresentacao."},
        ],
        "desafio": {"id": "des10", "titulo": "Apresentacao Final (5 min)", "pontos": 25,
                    "descricao": "Demo ao vivo do Prophet AI + modelo de negocio + proximos 90 dias. Votacao da turma."},
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
