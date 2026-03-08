from typing import Any


COURSE_TITLE = "AI Founder Bootcamp para Atuarios"
COURSE_SUBTITLE = "Do conhecimento atuarial ao Prophet Lite com copiloto AI"
TOTAL_POINTS = 635

BADGES = [
    (0, "Builder Ready"),
    (120, "Tool Operator"),
    (240, "Spec Strategist"),
    (360, "Workflow Architect"),
    (480, "Product Builder"),
    (600, "AI Founder"),
]


def get_badge(points: int) -> str:
    badge = BADGES[0][1]
    for threshold, name in BADGES:
        if points >= threshold:
            badge = name
    return badge


DAYS = [
    {
        "dia": 0,
        "titulo": "OpenCode, MCPs & Setup do Builder AI",
        "semana": 0,
        "objetivo": "Entrar no bootcamp sem medo do terminal. Configurar OpenCode, DeepSeek, MCPs e o workflow base que vai permitir construir software com LLMs sem depender de programacao manual.",
        "modulos": [
            "OpenCode CLI, Terminal & MCPs para Produtividade",
            "LLMs, Tokens, APIs & Regras de Operacao"
        ],
        "exercicios": [
            {"id": "ex0.1", "titulo": "Instalar OpenCode e Configurar o Stack", "pontos": 10,
             "descricao": "Instalar OpenCode CLI, ligar a API key DeepSeek, abrir a TUI, testar 'opencode run', e documentar num ficheiro setup_log.md os comandos que funcionaram."},
            {"id": "ex0.2", "titulo": "Primeiros Comandos sem Panico", "pontos": 10,
             "descricao": "Usar 5 comandos seguros no terminal: ver pasta atual, listar ficheiros, abrir ajuda, correr um comando simples e sair limpo. Pedir ao OpenCode para explicar cada comando em linguagem de negocio."},
            {"id": "ex0.3", "titulo": "Configurar um MCP Util", "pontos": 10,
             "descricao": "Configurar o Excel MCP ou PDF Reader MCP no opencode.jsonc. Testar leitura de uma tabua ou de um PDF e guardar um screenshot ou log do output."},
            {"id": "ex0.4", "titulo": "OpenCode para Trabalho Real", "pontos": 10,
             "descricao": "Usar OpenCode para resumir um documento, converter um CSV para JSON e explicar um ficheiro do bootcamp como se estivesses a preparar uma feature de produto."},
            {"id": "ex0.5", "titulo": "Comparar Parametros de LLM", "pontos": 10,
             "descricao": "Testar o mesmo prompt com temperature=0 e temperature=1. Registar quando queres precisao, quando queres exploracao, e como isso afeta o trabalho atuarial e fundador."},
            {"id": "ex0.6", "titulo": "Mapa da Stack AI", "pontos": 10,
             "descricao": "Criar um diagrama simples com: OpenCode, GLM-5, DeepSeek, MCPs, APIs, ficheiros locais e app final. O objetivo e perceber quem faz o que antes de construir."},
        ],
        "desafio": {"id": "des0", "titulo": "Kit do Fundador AI", "pontos": 25,
                    "descricao": "Entregar um founder-kit com: opencode.jsonc configurado, 3 prompts reutilizaveis, 1 MCP funcional, 1 pagina com o mapa da stack e um checklist pessoal de operacao segura com LLMs."},
        "conteudo": {
            "modulo_1": {
                "titulo": "OpenCode CLI, Terminal & MCPs para Produtividade",
                "topicos": [
                    {"titulo": "OpenCode como Forca de Trabalho", "conteudo": "OpenCode nao e apenas um chat. E o cockpit do bootcamp: le ficheiros, executa comandos, procura docs, edita projetos e coordena trabalho tecnico a partir das tuas instrucoes."},
                    {"titulo": "Terminal sem Trauma", "conteudo": "O objetivo nao e decorar comandos. E ganhar fluidez suficiente para abrir projetos, correr ferramentas, ler erros e continuar a construir sem bloqueios."},
                    {"titulo": "MCPs como Alavanca", "conteudo": "MCPs ligam o LLM a ferramentas reais: Excel, PDFs, ficheiros, bases de dados e docs. Um fundador AI-native usa conectores em vez de copiar manualmente informacao para o prompt."},
                    {"titulo": "Regra de Ouro do Bootcamp", "conteudo": "Nao precisas de escrever o codigo todo. Precisas de conseguir dizer ao LLM o que fazer, verificar se fez bem e iterar rapidamente."},
                ]
            },
            "modulo_2": {
                "titulo": "LLMs, Tokens, APIs & Regras de Operacao",
                "topicos": [
                    {"titulo": "LLM vs API vs CLI vs App", "conteudo": "O modelo gera texto e raciocinio. A API da acesso ao modelo. O CLI e a forma de o operares. A app final e o produto que o cliente usa. Esta distincao evita confusao desde o inicio."},
                    {"titulo": "Tokens, Contexto & Custo", "conteudo": "Custos, contexto e qualidade andam juntos. O fundador precisa de saber quanto contexto mandar, quando resumir e como evitar workflows caros ou lentos."},
                    {"titulo": "JSON Mode e Structured Output", "conteudo": "Grande parte do software AI-native vive de outputs estruturados. Pedir JSON nao e detalhe tecnico: e a ponte entre ideias, automacao e produto."},
                    {"titulo": "Seguranca Basica", "conteudo": "Nao colar dados sensiveis em modelos publicos, separar secrets do codigo, e registar o que foi feito. A credibilidade de um produto para seguros comeca aqui."},
                ]
            }
        }
    },
    {
        "dia": 1,
        "titulo": "De Atuario a Fundador AI-Native",
        "semana": 1,
        "objetivo": "Mudar o frame mental: sair da logica de analista interno e entrar na logica de fundador. Entender o que Prophet resolve, onde ha espaco para um Prophet Lite, e que problema concreto vale a pena atacar primeiro.",
        "modulos": ["Porque Software Cria Alavanca", "Escolher a Wedge do Prophet Lite"],
        "exercicios": [
            {"id": "ex1.1", "titulo": "Analisar o Mercado sem Construir Demais", "pontos": 10,
             "descricao": "Ler o prophet_reference_vida.md e identificar: o que o Prophet faz muito bem, o que e demasiado grande para um MVP e onde uma equipa pequena pode entrar com vantagem."},
            {"id": "ex1.2", "titulo": "Escolher um Problema Vendedor", "pontos": 10,
             "descricao": "Listar 3 dores reais em Vida que um SaaS mais moderno poderia resolver. Para cada uma: utilizador, frequencia, impacto e porque o mercado atual e fraco ou pesado."},
            {"id": "ex1.3", "titulo": "Founder Memo de 1 Pagina", "pontos": 10,
             "descricao": "Escrever uma nota curta com: cliente ideal, problema, wedge, o que o teu Prophet Lite faz primeiro, o que nao faz e porque isso e bom foco."},
        ],
        "desafio": {"id": "des1", "titulo": "Tese do Produto", "pontos": 25,
                    "descricao": "Entregar a tua tese de fundador: quem compras, que workflow vais simplificar, que modulo Prophet vais replicar primeiro e qual o posicionamento da tua versao AI-native."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Porque Software Cria Alavanca",
                "topicos": [
                    {"titulo": "Nao e sobre Escrever Codigo", "conteudo": "Neste bootcamp o objetivo nao e formar programadores. E formar pessoas capazes de transformar conhecimento de negocio em software usando LLMs como motor de execucao."},
                    {"titulo": "O Que o Mercado Compra", "conteudo": "Seguradoras nao compram formulas. Compram velocidade, controlo, rastreabilidade, consistencia e menos dependencia de folhas de calculo ou ferramentas legacy."},
                    {"titulo": "Software como Multiplicador", "conteudo": "Um atuario sem produto vende horas. Um atuario com produto vende um workflow repetivel. Essa diferenca muda margem, escala e posicionamento."},
                    {"titulo": "Mentalidade de Fundador", "conteudo": "Pensar como fundador significa escolher onde ser pequeno de proposito, para ganhar tracao mais depressa e aprender com utilizadores reais."},
                ]
            },
            "modulo_2": {
                "titulo": "Escolher a Wedge do Prophet Lite",
                "topicos": [
                    {"titulo": "O Que Replicar do Prophet", "conteudo": "Model points, assumptions, projections, reporting e governance sao as zonas centrais. O MVP deve escolher uma fracao pequena destas e executa-la muito bem."},
                    {"titulo": "O Que Ignorar no Inicio", "conteudo": "Cobertura regulatoria total, estocastico profundo, multiplos paises, accounting completo e bibliotecas gigantes de produtos sao distraoes demasiado cedo."},
                    {"titulo": "Wedge Sugerida", "conteudo": "Uma wedge forte para este bootcamp e: upload de assumptions + upload de model points + projecao deterministica Vida + explicacao AI + document drop para memos e clausulados."},
                    {"titulo": "Definir o Cliente", "conteudo": "O teu primeiro cliente pode ser uma equipa atuarial pequena, consultora, broker ou seguradora sem stack moderna. O produto deve falar a esse contexto."},
                ]
            }
        }
    },
    {
        "dia": 2,
        "titulo": "Specs com Speckit -- Diz ao LLM o Que Construir",
        "semana": 1,
        "objetivo": "Aprender a trabalhar por especificacao. Usar Speckit, spec.md e constitution.md para transformar ideias vagas em instrucoes claras que o LLM consegue implementar e que o fundador consegue validar.",
        "modulos": ["Spec-Driven Development com Speckit", "Acceptance Criteria, Git & Iteracao"],
        "exercicios": [
            {"id": "ex2.1", "titulo": "Spec para Upload de Assumptions", "pontos": 10,
             "descricao": "Usar template_spec.md para descrever uma feature de upload e validacao de tabuas de mortalidade, lapse e discount. Incluir inputs, erros esperados, validacoes e output esperado."},
            {"id": "ex2.2", "titulo": "Spec para Document Drop", "pontos": 10,
             "descricao": "Especificar a feature onde o utilizador arrasta PDFs ou imagens e a app classifica, extrai metadados e guarda informacao para pesquisa posterior."},
            {"id": "ex2.3", "titulo": "Auditar uma Spec com GLM-5 e OpenCode", "pontos": 10,
             "descricao": "Pedir a GLM-5 para criar um coding plan a partir da spec e ao OpenCode para encontrar ambiguidades, edge cases e criterios de aceite em falta."},
        ],
        "desafio": {"id": "des2", "titulo": "Pacote de Especificacao MVP", "pontos": 25,
                    "descricao": "Entregar spec.md, constitution.md e checklist de aceite para o teu Prophet Lite. O pacote deve ser claro o suficiente para um LLM comecar a gerar o projeto sem te fazer perguntas essenciais."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Spec-Driven Development com Speckit",
                "topicos": [
                    {"titulo": "A Skill Central", "conteudo": "A grande vantagem de um founder com LLMs nao e velocidade a programar. E a capacidade de descrever com clareza o comportamento que quer."},
                    {"titulo": "Speckit como Estrutura", "conteudo": "Speckit ajuda a transformar requisitos dispersos em blocos claros: objetivo, fluxos, validacoes, edge cases, criterios de aceite e entregaveis."},
                    {"titulo": "Boa Spec, Mau Codigo Evitado", "conteudo": "Muitos erros atribuimos ao modelo quando, na verdade, a instrucao estava vaga. Uma boa spec reduz retrabalho e melhora a qualidade do output."},
                    {"titulo": "Escrever para Maquina e para Equipa", "conteudo": "A spec serve o LLM hoje e uma equipa humana amanha. E documentacao operacional, nao papel burocratico."},
                ]
            },
            "modulo_2": {
                "titulo": "Acceptance Criteria, Git & Iteracao",
                "topicos": [
                    {"titulo": "Constitution.md", "conteudo": "O constitution define regras globais: convencoes de arredondamento, assumptions de referencia, politicas de validacao e principios de interface. Evita inconsistencias entre modulos."},
                    {"titulo": "Acceptance Criteria", "conteudo": "Cada feature deve responder a uma pergunta simples: como sei que isto esta feito? Sem essa resposta, o LLM vai produzir algo plausivel mas dificil de aprovar."},
                    {"titulo": "Git como Memoria de Decisao", "conteudo": "Nao precisas de dominar Git em profundidade, mas precisas de o usar para guardar versoes de specs, prompts e iteracoes relevantes."},
                    {"titulo": "Iterar sem Perder o Norte", "conteudo": "O ciclo ideal e curto: escrever spec, gerar, rever, corrigir, documentar. A velocidade vem da clareza, nao da pressa."},
                ]
            }
        }
    },
    {
        "dia": 3,
        "titulo": "Dados, JSON & APIs -- A Linguagem do Produto",
        "semana": 1,
        "objetivo": "Dar ao atuario literacy suficiente para operar software moderno: perceber CSV, JSON e YAML, fazer uma API call, ler uma resposta, e mapear o fluxo de dados do produto sem precisar de ser programador tradicional.",
        "modulos": ["Dados Estruturados sem Drama", "APIs, Docs & Contratos de Integracao"],
        "exercicios": [
            {"id": "ex3.1", "titulo": "Inspecionar Inputs Reais do Produto", "pontos": 10,
             "descricao": "Abrir carteira_apolices_vida.csv, tabua_mortalidade_CSO2017.csv, taxas_resgate.csv e yield_curve_ECB.csv. Identificar o papel de cada ficheiro no MVP e registar 5 regras de validacao para cada um."},
            {"id": "ex3.2", "titulo": "Primeira API Call com Proposito", "pontos": 10,
             "descricao": "Executar uma chamada de API a um modelo LLM ou a um servico simples, documentando endpoint, payload JSON, resposta e erros mais comuns."},
            {"id": "ex3.3", "titulo": "Definir o Contrato de Dados", "pontos": 10,
             "descricao": "Criar um schema simples para model points, assumptions e run results. O objetivo e saber que dados entram, que dados saem e como isso liga ao frontend."},
        ],
        "desafio": {"id": "des3", "titulo": "Mapa de Integracao do MVP", "pontos": 25,
                    "descricao": "Entregar um integration-pack com 3 contratos: model_points.json, assumptions_schema.json e run_result.json, mais uma nota a explicar como um utilizador nao-tecnico os alimenta via interface."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Dados Estruturados sem Drama",
                "topicos": [
                    {"titulo": "CSV, JSON e YAML", "conteudo": "Estas estruturas sao a lingua do produto. Um fundador AI-native nao precisa de saber programar tudo, mas precisa de reconhecer formatos, campos obrigatorios e erros tipicos."},
                    {"titulo": "Model Points como Produto", "conteudo": "Uma tabela de apolices nao e apenas um dataset. E uma interface de entrada para o motor. Isso muda a forma como defines colunas, validacoes e feedback ao utilizador."},
                    {"titulo": "Assumptions como Ativo", "conteudo": "Mortality, lapse e discount tables sao inputs criticos do negocio. Devem ser versionados, validados e apresentados com cuidado na app."},
                    {"titulo": "Schemas como Guardrails", "conteudo": "O schema e uma das melhores formas de tornar um produto com LLMs mais robusto: limita ambiguidades e facilita automacao."},
                ]
            },
            "modulo_2": {
                "titulo": "APIs, Docs & Contratos de Integracao",
                "topicos": [
                    {"titulo": "Como Ler Docs sem Perder Tempo", "conteudo": "Nao e preciso ler tudo. Procurar auth, endpoint, exemplo de request, exemplo de response, erros, limites e preco costuma bastar para comecar."},
                    {"titulo": "HTTP em Linguagem Clara", "conteudo": "Uma API call e um pedido com estrutura. Saber ler um request e uma response e o suficiente para conversar com ferramentas e integrar servicos."},
                    {"titulo": "Registar o Que Funcionou", "conteudo": "Cada chamada que funciona deve virar nota reutilizavel. Isto reduz friccao e cria uma biblioteca interna de operacao para o fundador."},
                    {"titulo": "A Ponte para a App", "conteudo": "Os dados nao existem em abstrato. Eles ligam uploads, calculos, dashboards, copiloto e integrações futuras. Pensar por contratos ajuda a escalar melhor."},
                ]
            }
        }
    },
    {
        "dia": 4,
        "titulo": "Escolher o Melhor LLM para Cada Tarefa",
        "semana": 1,
        "objetivo": "Comparar DeepSeek, GLM-5 e o workflow com OpenCode de forma pragmatica. Aprender a avaliar modelos por tarefa, custo, clareza, consistencia e utilidade para construir um produto real.",
        "modulos": ["Ler Model Cards e Documentacao", "Benchmarking e Avaliacao de Modelos"],
        "exercicios": [
            {"id": "ex4.1", "titulo": "Mesma Tarefa, Modelos Diferentes", "pontos": 10,
             "descricao": "Dar o mesmo prompt a GLM-5 e DeepSeek: rever uma spec de assumptions upload, sugerir validacoes e simplificar o texto para um utilizador nao tecnico. Comparar outputs com uma rubrica."},
            {"id": "ex4.2", "titulo": "Ler Docs com Intencao", "pontos": 10,
             "descricao": "Ler uma pagina de docs de um modelo ou API e extrair: janela de contexto, custos, structured output, tool use, limites, latencia e exemplos."},
            {"id": "ex4.3", "titulo": "Mini Scorecard LLM", "pontos": 10,
             "descricao": "Criar uma tabela de comparacao para 3 tarefas do bootcamp: planear uma feature, resumir um memo atuarial e sugerir uma API call. Avaliar acao, clareza, fiabilidade e custo."},
        ],
        "desafio": {"id": "des4", "titulo": "Playbook de Model Selection", "pontos": 25,
                    "descricao": "Entregar um playbook com: qual modelo usas para planear, qual usas para construir, qual usas para segunda opiniao e qual usas para explicacao ao cliente ou equipa."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Ler Model Cards e Documentacao",
                "topicos": [
                    {"titulo": "Modelos Nao Sao Todos Iguais", "conteudo": "Uns planeiam melhor, outros escrevem melhor, outros sao mais baratos ou mais previsiveis. O founder precisa de escolher, nao de adivinhar."},
                    {"titulo": "O Que Importa nas Docs", "conteudo": "Structured output, custos, janela de contexto, tool use, limites de rate e exemplos contam mais no dia a dia do que benchmarks abstratos."},
                    {"titulo": "Evitar Fe no Primeiro Output", "conteudo": "A competencia chave e comparar respostas e perceber qual serve melhor o trabalho que tens em maos."},
                    {"titulo": "OpenCode como Orquestrador", "conteudo": "OpenCode pode ser o cockpit enquanto GLM-5 e DeepSeek funcionam como raciocinadores, revisores ou simplificadores conforme a tarefa."},
                ]
            },
            "modulo_2": {
                "titulo": "Benchmarking e Avaliacao de Modelos",
                "topicos": [
                    {"titulo": "Benchmark por Workflow", "conteudo": "Comparar modelos faz mais sentido quando usas tarefas reais: rever specs, explicar resultados, validar documentos e propor proximos passos."},
                    {"titulo": "Rubrica Repetivel", "conteudo": "Uma boa rubrica mede utilidade, acao, fiabilidade, custo e consistencia. Isto ajuda a construir um stack sustentavel e nao dependente de hype."},
                    {"titulo": "Escolha por Papel", "conteudo": "Podes usar um modelo para planeamento, outro para execucao e outro para explicacao. O stack ideal e combinado, nao monolitico."},
                    {"titulo": "Registo de Decisao", "conteudo": "Guardar porque escolheste um modelo hoje ajuda a rever custos e qualidade quando o produto comecar a ser usado em serio."},
                ]
            }
        }
    },
    {
        "dia": 5,
        "titulo": "Prophet Lite -- O Que Replicar e O Que Ignorar",
        "semana": 1,
        "objetivo": "Transformar a referencia do Prophet numa arquitetura pequena e credivel. Perceber que o MVP nao vende por ter tudo: vende por resolver bem um workflow central com controlo e clareza.",
        "modulos": ["Anatomia do Prophet", "Definir o MVP com Governanca"],
        "exercicios": [
            {"id": "ex5.1", "titulo": "Mapa de Modulos Prophet -> MVP", "pontos": 10,
             "descricao": "Com base em prophet_reference_vida.md, mapear modulos core do Prophet para uma versao simplificada: inputs, assumptions, projection, results, governance, docs."},
            {"id": "ex5.2", "titulo": "Definir User Roles e Audit Trail", "pontos": 10,
             "descricao": "Escolher os utilizadores do MVP (ex: admin, actuary, reviewer, viewer) e listar o que deve ficar auditado: uploads, versoes, runs, erros e overrides."},
            {"id": "ex5.3", "titulo": "Escolher o Escopo Certo", "pontos": 10,
             "descricao": "Escrever uma lista explicita do que fica fora do MVP: estocastico, multiplas geografias, health completo, accounting, ML profundo ou outra tentacao de scope creep."},
        ],
        "desafio": {"id": "des5", "titulo": "Blueprint do Prophet Lite", "pontos": 25,
                    "descricao": "Entregar um blueprint com: modulos MVP, user roles, fluxos principais, itens fora de scope, e explicacao de porque esta versao pequena pode ser vendida ou demonstrada com credibilidade."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Anatomia do Prophet",
                "topicos": [
                    {"titulo": "Core Jobs", "conteudo": "Prophet existe para organizar model points, assumptions, runs, outputs e governance. Essa e a espinha que importa compreender."},
                    {"titulo": "Porque o Mercado Confia", "conteudo": "A forca do incumbent nao e apenas calculo. E repetibilidade, audit trail, approvals, run management e integracao com reporting."},
                    {"titulo": "Onde um MVP Ganha", "conteudo": "Um produto novo ganha quando e mais simples, mais claro, mais rapido a usar e mais facil de explicar do que uma suite pesada."},
                    {"titulo": "Prophet Lite", "conteudo": "A proposta deste bootcamp e um workspace pequeno para Vida: assumptions, model points, run deterministic, resultados, copiloto AI e memos/documentos ligados ao trabalho."},
                ]
            },
            "modulo_2": {
                "titulo": "Definir o MVP com Governanca",
                "topicos": [
                    {"titulo": "Governanca desde o Dia 1", "conteudo": "Mesmo um MVP precisa de versionamento, validacao, logs e no minimo um rasto claro do que foi usado em cada run."},
                    {"titulo": "User Roles", "conteudo": "O produto nao e so um motor. E tambem uma experiencia para quem sobe ficheiros, revê assumptions, consulta resultados e faz auditoria."},
                    {"titulo": "Scope como Vantagem", "conteudo": "Dizer nao a muita coisa faz parte do design. O MVP deve caber em 3 dias de build local mais deploy, nao numa aspiracao indefinida."},
                    {"titulo": "Modulos Essenciais", "conteudo": "Upload de assumptions, upload de model points, projection deterministic, dashboard de resultados, document drop, AI copilot e audit basics."},
                ]
            }
        }
    },
    {
        "dia": 6,
        "titulo": "Document Drop, OCR & Memoria do Produto",
        "semana": 2,
        "objetivo": "Transformar documentos em vantagem competitiva. Desenhar e prototipar o fluxo onde PDFs, imagens e memos sao classificados, extraidos, guardados e pesquisados como memoria operacional do produto.",
        "modulos": ["OCR, Extracao & Metadados", "RAG, Pesquisa e Review Humano"],
        "exercicios": [
            {"id": "ex6.1", "titulo": "Classificar Documentos do Bootcamp", "pontos": 10,
             "descricao": "Pegar em 5 documentos do conjunto existente (PDFs, imagens, memos ou clausulados) e definir para cada um: tipo, entidade de negocio, campos chave e risco de erro."},
            {"id": "ex6.2", "titulo": "Schema de Extracao", "pontos": 10,
             "descricao": "Desenhar um schema JSON para o document drop com metadata minima: doc_type, product, policy_id opcional, effective_date, extracted_fields, confidence e reviewer_status."},
            {"id": "ex6.3", "titulo": "Primeiro RAG Util", "pontos": 10,
             "descricao": "Criar um mini fluxo com ChromaDB ou equivalente para guardar texto de documentos e permitir perguntas como: 'qual a versao mais recente do memo?' ou 'o que mudou nesta assumption?'"},
        ],
        "desafio": {"id": "des6", "titulo": "Knowledge Workspace", "pontos": 25,
                    "descricao": "Entregar o desenho do modulo de document drop com pipeline, schema, regras de review humana, e 5 queries de negocio que o utilizador deve conseguir fazer depois do upload."},
        "conteudo": {
            "modulo_1": {
                "titulo": "OCR, Extracao & Metadados",
                "topicos": [
                    {"titulo": "Documentos como Input de Produto", "conteudo": "Memos, clausulados, especificacoes e PDFs nao sao anexo morto. Podem virar estrutura reutilizavel dentro do produto."},
                    {"titulo": "Template-First, AI-Second", "conteudo": "Quando houver formato repetivel, usa regras e templates. Usa LLM para lidar com variacao, texto livre e sumarizacao."},
                    {"titulo": "Metadata que Vale Ouro", "conteudo": "Tipo, data efetiva, produto, versao, owner e confidence sao mais importantes do que tentar extrair tudo de uma vez."},
                    {"titulo": "Extrair para Usar Depois", "conteudo": "O valor nao esta so em ler um PDF hoje. Esta em encontra-lo, relaciona-lo e reutiliza-lo meses depois num workflow real."},
                ]
            },
            "modulo_2": {
                "titulo": "RAG, Pesquisa e Review Humano",
                "topicos": [
                    {"titulo": "RAG como Memoria", "conteudo": "RAG ajuda a recuperar contexto de documentos sem fingir que o modelo sabe tudo. E especialmente util para clausulados, memos e docs internos."},
                    {"titulo": "Review Humano e Obrigatorio", "conteudo": "Em seguros, um bom fluxo de review vale mais do que promessas de automacao total. O objetivo e acelerar verificacao, nao eliminar controlo."},
                    {"titulo": "Busca que Faz Sentido", "conteudo": "O utilizador quer encontrar rapido por produto, data, versao, keyword ou pergunta em linguagem natural. Esse e o UX target do modulo."},
                    {"titulo": "Diferenciador do Produto", "conteudo": "Muita gente tenta construir calculadoras. Menos gente transforma o caos documental em memoria operacional pesquisavel. Aqui ha vantagem competitiva."},
                ]
            }
        }
    },
    {
        "dia": 7,
        "titulo": "UX Mobile-First, Pricing & Plano de Build",
        "semana": 2,
        "objetivo": "Fechar o lado fundador antes de programar: jornada do utilizador, experiencia mobile-first, posicionamento, pricing e checklist de build local. O objetivo e chegar ao Dia 8 com um plano executavel.",
        "modulos": ["UX, Jornadas & Interface do MVP", "Pricing, Landing Page & Build Pack"],
        "exercicios": [
            {"id": "ex7.1", "titulo": "Desenhar 3 Fluxos Core", "pontos": 10,
             "descricao": "Desenhar os fluxos mobile-first para: upload de assumptions, correr projection e fazer document drop. Cada fluxo deve caber em poucos passos e ter mensagens de erro claras."},
            {"id": "ex7.2", "titulo": "Landing Copy e Posicionamento", "pontos": 10,
             "descricao": "Escrever hero, proposta de valor, 3 bullets de resultados e 1 CTA para a tua landing page. Usar LLM para gerar variantes e escolher a mais clara."},
            {"id": "ex7.3", "titulo": "Pricing Hipotetico", "pontos": 10,
             "descricao": "Definir 3 tiers simples para o teu SaaS e explicar o que muda entre eles: volume de runs, numero de utilizadores, document storage, copiloto AI ou exportacoes."},
        ],
        "desafio": {"id": "des7", "titulo": "Founder Launch Pack", "pontos": 25,
                    "descricao": "Entregar o build pack final com: spec consolidada, mapa de ecras mobile-first, landing copy, pricing, checklist de validacao e plano de build dos Dias 8-10."},
        "conteudo": {
            "modulo_1": {
                "titulo": "UX, Jornadas & Interface do MVP",
                "topicos": [
                    {"titulo": "Mobile-First por Disciplina", "conteudo": "Se o produto for claro no telemovel, normalmente tambem sera claro no desktop. Mobile-first obriga a foco, pouco texto e acao evidente."},
                    {"titulo": "3 Ecras que Importam", "conteudo": "Input, resultado e detalhe/documento. Quase todo o MVP pode ser pensado a partir destes tres momentos."},
                    {"titulo": "UX para Utilizador Nao Tecnico", "conteudo": "Upload simples, labels claras, validacoes visiveis, explicacoes curtas e chamadas para acao sem jargao tecnico."},
                    {"titulo": "Design como Credibilidade", "conteudo": "No software B2B, boa UX nao e vaidade. E sinal de cuidado, reduz erro operacional e aumenta confianca no produto."},
                ]
            },
            "modulo_2": {
                "titulo": "Pricing, Landing Page & Build Pack",
                "topicos": [
                    {"titulo": "Vender Antes de Sofisticar", "conteudo": "Um produto simples mas bem posicionado vale mais do que um sistema complexo sem narrativa clara."},
                    {"titulo": "Landing Page como Teste", "conteudo": "A landing page obriga-te a responder: quem serve, que problema resolve e porque a tua abordagem AI-native e melhor."},
                    {"titulo": "Pricing como Escolha de Cliente", "conteudo": "O preco tambem define para quem o produto e feito. Nao e apenas uma conta financeira; e posicionamento."},
                    {"titulo": "Fechar o Plano de Build", "conteudo": "No final do Dia 7 deves saber o que vai existir localmente, o que sera adiado e o que tens de validar antes do deploy."},
                ]
            }
        }
    },
    {
        "dia": 8,
        "titulo": "Build Local -- Motor Deterministico Prophet Lite",
        "semana": 2,
        "objetivo": "Construir localmente o nucleo matematico do MVP: carregar assumptions, ler model points, projetar cash flows e devolver resultados verificaveis. O foco e um motor pequeno, testavel e explicavel.",
        "modulos": ["Assumptions, Model Points & Projection", "Validacao, Testes & Explicabilidade"],
        "exercicios": [
            {"id": "ex8.1", "titulo": "Carregar Inputs do Motor", "pontos": 10,
             "descricao": "Implementar com ajuda do LLM o carregamento de tabua_mortalidade_CSO2017.csv, taxas_resgate.csv, yield_curve_ECB.csv e model points. Validar colunas obrigatorias e erros de formato."},
            {"id": "ex8.2", "titulo": "Projecao Base de Vida", "pontos": 10,
             "descricao": "Gerar a projecao deterministica de um temporario simples com premio, beneficio e desconto. Comparar um caso com o excel_validacao_cashflow.md e documentar diferencas."},
            {"id": "ex8.3", "titulo": "Testes e Output Legivel", "pontos": 10,
             "descricao": "Criar testes minimos para o motor e garantir que o output e legivel por humano e por app: cash flows, reserve proxy, profit metricas simples e mensagens de erro claras."},
        ],
        "desafio": {"id": "des8", "titulo": "Motor Local v0.1", "pontos": 25,
                    "descricao": "Entregar um motor local funcional que aceita inputs simples, corre a projecao base, devolve resultados estruturados e passa num conjunto minimo de testes de confianca."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Assumptions, Model Points & Projection",
                "topicos": [
                    {"titulo": "O Motor Nao Tem de Fazer Tudo", "conteudo": "O objetivo do bootcamp e um motor deterministic simples para 1-2 produtos. Credibilidade vem de foco e validacao, nao de complexidade."},
                    {"titulo": "Inputs com Regras", "conteudo": "Um bom produto falha bem: informa o que falta, que coluna esta errada e como corrigir. Isso faz parte do build, nao e detalhe."},
                    {"titulo": "Cash Flows Primeiro", "conteudo": "Antes de pensar em features sofisticadas, o motor tem de conseguir produzir cash flows coerentes e consistentes com a spec."},
                    {"titulo": "Assumptions como Camada Separada", "conteudo": "Separar assumptions da logica de projection torna o produto mais governavel e mais perto do mindset Prophet."},
                ]
            },
            "modulo_2": {
                "titulo": "Validacao, Testes & Explicabilidade",
                "topicos": [
                    {"titulo": "Trust but Verify", "conteudo": "Mesmo quando o LLM gera o codigo, o fundador valida com casos de referencia, testes e outputs transparentes."},
                    {"titulo": "Testes Minimos que Salvam Projetos", "conteudo": "Casos simples, valores esperados e erros bem tratados evitam demos bonitas com logica fraca por baixo."},
                    {"titulo": "Output para App", "conteudo": "O resultado do motor deve ser um objeto estruturado que o frontend consiga consumir sem improvisacao."},
                    {"titulo": "Explicar o que o Motor Fez", "conteudo": "Se nao conseguires explicar ao utilizador que assumptions foram usadas e como o run correu, o produto perde valor rapidamente."},
                ]
            }
        }
    },
    {
        "dia": 9,
        "titulo": "Build Local -- App, Copiloto AI & Documentos",
        "semana": 2,
        "objetivo": "Envolver o motor numa experiencia de produto: Streamlit local, uploads, dashboard de resultados, copiloto AI e document drop ligado a memoria do sistema.",
        "modulos": ["Frontend Local e Fluxo End-to-End", "Copiloto AI, Busca e Diferenciacao"],
        "exercicios": [
            {"id": "ex9.1", "titulo": "Construir a Shell da App", "pontos": 10,
             "descricao": "Ligar num app local os 3 fluxos core: upload assumptions, upload model points e correr projection. Mostrar estados de carregamento, validacao e resultados."},
            {"id": "ex9.2", "titulo": "Adicionar Copiloto AI", "pontos": 10,
             "descricao": "Criar um copiloto simples que explica outputs, indica assumptions em falta e responde a perguntas sobre o run. O copiloto deve apoiar o utilizador, nao esconder a logica."},
            {"id": "ex9.3", "titulo": "Ligar Document Drop", "pontos": 10,
             "descricao": "Adicionar o fluxo de document drop com OCR/extracao basica, armazenamento de metadata e pesquisa ou recuperacao minima no contexto da app local."},
        ],
        "desafio": {"id": "des9", "titulo": "Prophet Lite Local", "pontos": 25,
                    "descricao": "Entregar uma app local navegavel onde um utilizador sobe inputs, corre um run, consulta resultados, faz upload de um documento e usa o copiloto AI para entender o que aconteceu."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Frontend Local e Fluxo End-to-End",
                "topicos": [
                    {"titulo": "Do Motor ao Produto", "conteudo": "O valor aumenta quando o motor fica embrulhado numa experiencia simples: upload, run, resultado, explicacao e historico."},
                    {"titulo": "Streamlit como Veiculo", "conteudo": "Streamlit e suficiente para um MVP founder-first: rapido para testar, simples para iterar e bom para demonstracoes e pilotos iniciais."},
                    {"titulo": "Menos Ecras, Mais Clareza", "conteudo": "Em vez de muitos modulos, o MVP deve privilegiar poucos ecras com fluxo limpo e chamadas de acao evidentes."},
                    {"titulo": "Mobile-First na Pratica", "conteudo": "Cartoes compactos, uploads claros, copy curta e estados bem visiveis ajudam a app a funcionar bem em telemovel e em desktop."},
                ]
            },
            "modulo_2": {
                "titulo": "Copiloto AI, Busca e Diferenciacao",
                "topicos": [
                    {"titulo": "LLM no Lugar Certo", "conteudo": "O copiloto deve explicar, orientar, resumir e detetar lacunas. O calculo core continua deterministic e validavel."},
                    {"titulo": "Documento + Resultado + Copiloto", "conteudo": "A combinacao de motor, docs e IA cria uma experiencia mais util do que uma simples calculadora."},
                    {"titulo": "Diferenciacao via UX", "conteudo": "Num mercado pesado e legacy, explicabilidade, simplicidade e rapidez de onboarding podem ser a tua grande vantagem."},
                    {"titulo": "Demo-Readiness", "conteudo": "No fim do dia a app tem de aguentar uma demo real. Isso significa percursos curtos, mensagens claras e menos dependencias fragis."},
                ]
            }
        }
    },
    {
        "dia": 10,
        "titulo": "Deploy, LinkedIn Launch & Demo",
        "semana": 2,
        "objetivo": "Levar o MVP para fora do computador local. Fazer deploy, organizar secrets e auth, preparar a narrativa publica do produto e transformar o projeto num ativo de mercado via LinkedIn e demo final.",
        "modulos": ["Deploy, Auth & Preparacao para Uso", "LinkedIn, Demo e Ativacao de Mercado"],
        "exercicios": [
            {"id": "ex10.1", "titulo": "Deploy Seguro do MVP", "pontos": 10,
             "descricao": "Preparar requirements, secrets, README e fazer deploy da app. Confirmar que o fluxo principal funciona fora da maquina local."},
            {"id": "ex10.2", "titulo": "Polir a Narrativa do Produto", "pontos": 10,
             "descricao": "Escrever a descricao do produto, 3 screenshots ou gifs, e um resumo curto sobre o problema, a wedge e o valor do teu Prophet Lite com AI Copilot."},
            {"id": "ex10.3", "titulo": "Publicar no LinkedIn", "pontos": 10,
             "descricao": "Criar um post de lancamento no LinkedIn com imagem, URL, problema resolvido, stack usada, aprendizagem e convite para feedback ou pilotos. O objetivo e aprender a distribuir, nao so a construir."},
        ],
        "desafio": {"id": "des10", "titulo": "Lancamento Publico do Produto", "pontos": 25,
                    "descricao": "Entregar a app deployada, README final, demo curta e o post de lancamento no LinkedIn. O projeto deixa de ser exercicio interno e passa a ativo publico de carreira e mercado."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Deploy, Auth & Preparacao para Uso",
                "topicos": [
                    {"titulo": "Local Primeiro, Cloud Depois", "conteudo": "Esta ordem reduz stress e acelera aprendizagem. So faz sentido deployar depois de o fluxo principal funcionar localmente."},
                    {"titulo": "Secrets e Higiene", "conteudo": "Separar credentials do codigo, organizar dependencias e preparar README sao sinais minimos de profissionalismo."},
                    {"titulo": "Auth Basica e Credibilidade", "conteudo": "Mesmo um MVP ganha seriedade quando tens no minimo uma nocao clara de quem entra, o que ve e o que pode fazer."},
                    {"titulo": "Deploy como Skill de Fundador", "conteudo": "Conseguir por um produto online e uma alavanca enorme. O mercado responde muito melhor a demos reais do que a PDFs e ideias."},
                ]
            },
            "modulo_2": {
                "titulo": "LinkedIn, Demo e Ativacao de Mercado",
                "topicos": [
                    {"titulo": "Distribuicao Tambem e Produto", "conteudo": "Se ninguem ve o que construiste, perdes metade do valor. LinkedIn e uma extensao do lancamento, nao um extra cosmico."},
                    {"titulo": "Narrativa que Gera Interesse", "conteudo": "O post ideal mostra problema, construcao, stack, resultado e convite a conversa. Fala da transformacao de conhecimento em produto."},
                    {"titulo": "Demo de Fundador", "conteudo": "A demo deve mostrar um fluxo completo e dar vontade de ver mais. Comeca pelo problema, mostra o produto a resolver e fecha com a visao de negocio."},
                    {"titulo": "Do Bootcamp para o Mercado", "conteudo": "O objetivo final nao e so aprender. E sair com um ativo publico que abre portas a clientes, parceiros, entrevistas e futuras iteracoes."},
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


def get_day_exercises(dia: int) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    for day in DAYS:
        if day["dia"] == dia:
            return day["exercicios"], day["desafio"]
    return [], {}
