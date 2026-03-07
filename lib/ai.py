import json
import streamlit as st

COURSE_CONTEXT = {
    "bootcamp": {
        "nome": "Prophet AI Bootcamp -- AI & Data Science para Atuarios de Vida",
        "duracao": "Pre-bootcamp (Dia 0) + 10 dias / 2 semanas",
        "publico": "Atuarios de Vida (com modulo complementar de Saude/OCR no Dia 3)",
        "objetivo": "Construir o Prophet AI -- clone do FIS Prophet potenciado por IA, deployado como SaaS",
        "formador": "Pedro (pedro@stratfordgeek.com)",
        "metodologia": "Spec-Driven Development (SDD) -- escrever spec primeiro, gerar codigo com AI, auditar com checklist",
        "filosofia": "O atuario e o especificador e auditor. A IA e o codificador. Nao precisas de ser programador -- precisas de saber especificar e validar."
    },

    "stack_tecnologico": {
        "opencode": {
            "descricao": "Agente de AI coding open-source para o terminal. Escrito em Go. TUI interativa + modo CLI.",
            "instalacao": "npm i -g opencode",
            "config": "opencode.jsonc na raiz do projeto ou ~/.config/opencode/opencode.jsonc (global)",
            "ferramentas_builtin": [
                "read (ler ficheiros)", "write (criar ficheiros)", "edit (editar com string replacement)",
                "bash (executar comandos shell)", "grep (pesquisar conteudo com regex)",
                "glob (encontrar ficheiros por padrao)", "list (listar diretorios)",
                "webfetch (ler paginas web)", "websearch (pesquisar na web via Exa AI)",
                "lsp (code intelligence)", "patch (aplicar patches)", "skill (carregar instrucoes)",
                "question (perguntar ao utilizador)", "todowrite/todoread (gerir tarefas)"
            ],
            "cli_comandos": {
                "opencode": "Abre a TUI interativa",
                "opencode run 'prompt'": "Executa prompt sem TUI (modo headless)",
                "opencode run --file mortalidade.csv 'analisa'": "Anexa ficheiro ao prompt",
                "opencode run --model provider/modelo 'prompt'": "Escolhe modelo especifico",
                "opencode run --continue": "Continua ultima sessao",
                "opencode run --format json 'prompt'": "Output em JSON estruturado",
                "opencode stats": "Ver consumo de tokens e custos",
                "opencode mcp list": "Listar MCPs configurados",
                "opencode agent list": "Listar agentes disponiveis",
                "opencode models": "Listar modelos disponiveis"
            },
            "agentes": "Agentes personalizados definidos no opencode.jsonc. Cada agente tem: description, model, prompt, tools permitidas. Usar para tarefas repetitivas (ex: agente 'code-reviewer' que so le e comenta).",
            "sessions": "Sessoes guardam o historico de conversa. Continuar com --continue, retomar com --session ID, bifurcar com --fork. Exportar/importar com opencode export/import.",
            "permissoes": "Por defeito tudo permitido. Configurar no opencode.jsonc: permission.bash = 'ask' para pedir confirmacao antes de executar comandos shell."
        },
        "mcps": {
            "descricao": "Model Context Protocol -- servidores que estendem LLMs com ferramentas externas. Protocolo aberto criado pela Anthropic.",
            "config_formato": "No opencode.jsonc, seccao 'mcp'. Cada servidor tem nome unico, tipo (local/remote), e comando/url.",
            "excel_mcp": {
                "pacote": "@negokaz/excel-mcp-server",
                "instalacao": "Configurar no opencode.jsonc",
                "config_exemplo": '{"mcp": {"excel": {"type": "local", "command": ["npx", "--yes", "@negokaz/excel-mcp-server"]}}}',
                "tools": [
                    "excel_describe_sheets (listar sheets e metadata)",
                    "excel_read_sheet (ler celulas com paginacao, formulas, estilos)",
                    "excel_write_to_sheet (escrever valores e formulas -- formulas comecam com '=')",
                    "excel_create_table (converter range em tabela formatada)",
                    "excel_copy_sheet (duplicar sheets)",
                    "excel_format_range (aplicar borders, fonts, fills, number formats)"
                ],
                "formatos": "xlsx, xlsm, xltx, xltm",
                "env": "EXCEL_MCP_PAGING_CELLS_LIMIT=4000 (max celulas por leitura)"
            },
            "supabase_mcp": {
                "url": "https://mcp.supabase.com/mcp",
                "tipo": "remote",
                "tools": "list_tables, execute_sql, apply_migration, get_logs, deploy_edge_function, generate_typescript_types, search_docs",
                "auth": "OAuth automatico via browser ou Bearer token manual",
                "seguranca": "Usar read_only=true para dados reais, project_ref para limitar acesso"
            },
            "filesystem_mcp": "Servidor oficial MCP para operacoes de ficheiros com controlo de acesso. Util para navegar projetos e ler dados.",
            "pdf_reader_mcp": "Extrair texto e metadados de PDFs. Util para regulamentacao (Solvencia II), clausulados, notas de alta.",
            "google_sheets_mcp": "Ler/escrever spreadsheets partilhadas via Google Drive. Packages: @xing5/mcp-google-sheets, mcp-gsheets.",
            "context7_mcp": "Pesquisar documentacao tecnica atualizada. URL: https://mcp.context7.com/mcp (remote, sem auth)."
        },
        "python": "Python 3.11+. Linguagem principal do bootcamp. Pandas para dados, scikit-learn/XGBoost para ML, Plotly para graficos, Streamlit para web apps.",
        "z_ai": "Z.ai Coding Plan (GLM-5). Gera planos de implementacao a partir de specs. Complementar ao OpenCode.",
        "llm_api": "DeepSeek API (endpoint OpenAI-compatible). Barato ($0.14/M input), rapido, bom para o bootcamp. Alternativas: Anthropic Claude, OpenAI GPT.",
        "agentes_framework": "Tool calling nativo (API OpenAI/Anthropic) para agentes simples. CrewAI ou LangGraph para multi-agentes complexos. Comecar com tool calling puro (30 linhas), escalar se necessario.",
        "ml": "Scikit-learn (pipelines, logistic regression), XGBoost (classificacao, pricing), SHAP (explicabilidade). Plotly para visualizacoes interativas.",
        "web": "Streamlit para apps web rapidas. Conceitos: st.title(), st.dataframe(), st.plotly_chart(), st.selectbox(), st.sidebar, st.columns(), st.form(). Deploy: Streamlit Community Cloud (gratuito).",
        "auth_db": "Supabase Auth (Google OAuth + email/password) + PostgreSQL + Row-Level Security (RLS). Roles: admin, actuary, auditor, viewer.",
        "rag": "ChromaDB (vector database local). Embeddings para converter texto em vetores. Pesquisa semantica sobre documentos (clausulados, regulamentacao).",
        "versionamento": "Git + GitHub. Conceitos: commit, push, branch, pull request. OpenCode pode fazer commits e gerir Git.",
        "deploy": "Streamlit Community Cloud (gratuito, deploy de GitHub, SSL, secrets management). Para producao real: Railway, Render, AWS."
    },

    "produtos_vida": {
        "temporario": {
            "descricao": "Term life -- premio nivelado, beneficio por morte, sem valor de resgate",
            "duracoes": "10, 15, 20, 25, 30 anos",
            "pricing": "P = Capital * Ax:n / ax:n"
        },
        "vida_inteira": {
            "descricao": "Whole life -- premio vitalicio, beneficio por morte, valor de resgate crescente",
            "duracao": "Ate idade 120",
            "pricing": "P = Capital * Ax / ax"
        },
        "misto": {
            "descricao": "Endowment -- premio temporario, beneficio morte OU sobrevivencia, valor de resgate",
            "duracoes": "15, 20, 25 anos",
            "pricing": "P = Capital * Ax:n / ax:n (com componente endowment)"
        },
        "renda_vitalicia": {
            "descricao": "Annuity -- premio unico ou acumulacao, pagamento periodico vitalicio",
            "risco": "Longevidade",
            "pricing": "Premio unico = Renda * ax (anuidade vitalicia)"
        }
    },

    "conceitos_atuariais": {
        "V(t)": "Reserva matematica prospectiva = VPA_t(beneficios futuros) - VPA_t(premios futuros). V(0)=0 por construcao, V(n)=0 no fim do contrato.",
        "qx": "Probabilidade de morte entre idade x e x+1. Fonte: tabua CSO 2017.",
        "tpx": "Probabilidade de sobreviver t anos desde idade x. tpx = prod(1-q(x+k)) para k=0..t-1.",
        "wx": "Taxa de resgate/lapse no ano t da apolice. Varia por produto e ano.",
        "VPA": "Valor Presente Atuarial = sum(CF(t) * v(t) * tpx). Desconta cash flows futuros com mortalidade e juros.",
        "Ax": "Seguro vida inteira (VPA de 1 unidade de beneficio por morte). Ax = sum(v^(t+0.5) * tpx * q(x+t)).",
        "ax_n": "Anuidade temporaria (VPA de 1 unidade de premio por n anos). ax:n = sum(v^t * tpx) para t=0..n-1.",
        "premio_liquido": "Premio calculado pelo principio de equivalencia: VPA(premios) = VPA(beneficios). P = Capital * Ax:n / ax:n.",
        "profit_signature": "Lucro(t) = Premios(t) + Investimento(t) - Beneficios(t) - Despesas(t) - Delta_V(t). Vetor de lucros por ano.",
        "VPN": "Valor Presente Liquido do lucro = sum(Profit(t) * v(t)). Se VPN > 0, o produto e rentavel.",
        "IRR": "Taxa Interna de Retorno: taxa que faz VPN = 0. Medida de rentabilidade.",
        "SCR_vida": "Solvency Capital Requirement -- capital para sobreviver choques: mortalidade +15%, longevidade -20% (65+), lapse +/-50% e mass 40%, juros +/-200bps, despesas +10%+1pp.",
        "incontestabilidade": "Apos 24 meses, seguradora nao pode contestar declaracoes do segurado (exceto fraude comprovada).",
        "lapse": "Resgate/cancelamento de apolice pelo segurado. Taxa de lapse varia por produto e ano.",
        "clawback": "Devolucao de comissao se apolice cancelada prematuramente (tipicamente nos primeiros 2-3 anos).",
        "mid_year_discount": "Convencao: mortes ocorrem a meio do ano. v_morte(t) = 1/(1+r)^(t-0.5). Premios no inicio: v_premio(t) = 1/(1+r)^(t-1).",
        "frequency_severity": "Pricing saude: premio = E[frequencia] x E[severidade]. Frequencia = sinistros/exposto/ano. Severidade = custo medio/sinistro.",
        "CID": "Classificacao Internacional de Doencas. Z41=cosmetico (exclusao), R99=causa mal definida (fraude flag), X70=suicidio (condicional 24m)."
    },

    "conceitos_tecnicos": {
        "tokens": "Unidades de texto (~4 chars ingles, ~3 portugues). Input + output = custo. Context window limita quanto o modelo 've'. 1 pagina A4 ~ 500-700 tokens.",
        "temperature": "0 = deterministico/preciso, 1 = criativo/variado. Para calculos atuariais: 0-0.3. Para brainstorming: 0.7-1.0.",
        "MCP": "Model Context Protocol -- servidores que dao ao LLM acesso a ferramentas externas. Configurados via JSON no opencode.jsonc. Protocolo aberto (Anthropic).",
        "JSON_mode": "Pedir resposta estruturada em JSON. Essencial para pipelines: extrair dados de texto, gerar configs, criar datasets.",
        "streaming": "Tokens aparecem um a um (interativo) vs batch (resposta completa). OpenCode TUI usa streaming, 'opencode run' pode usar batch.",
        "RAG": "Retrieval-Augmented Generation: documentos -> embeddings -> vector DB -> pesquisa semantica -> LLM gera resposta com contexto recuperado.",
        "embeddings": "Vetores numericos que capturam significado semantico. Textos similares = vetores proximos. Usados em RAG e pesquisa semantica.",
        "tool_calling": "O LLM decide qual funcao chamar e com que parametros. O resultado e devolvido ao LLM. Base dos agentes autonomos.",
        "RBAC": "Role-Based Access Control. Roles no Prophet AI: admin (tudo), actuary (projecoes), auditor (ver+claims), viewer (dashboards). Implementado com Supabase RLS.",
        "SDD": "Spec-Driven Development: spec.md -> gerar codigo com AI -> auditar com checklist -> iterar. O constitution.md define regras matematicas globais.",
        "SHAP": "SHapley Additive exPlanations: decompoe previsao ML em contribuicao de cada feature. Summary plot (global), force plot (individual). Essencial para regulamentacao."
    },

    "regras_matematicas": {
        "taxas": "Sempre anuais nominais. Conversao mensal: (1+r)^(1/12)-1. NUNCA r/12.",
        "base": "365 dias, ACT/365",
        "desconto": "Mid-year convention para mortes. Inicio de ano para premios. Fim de ano para resgates.",
        "arredondamento": "Monetarios 2 casas, taxas 8 intermedias / 6 output. Arredondar so no final.",
        "tabua": "CSO 2017, idade terminal 120 (qx=1.0), sem interpolacao entre idades",
        "fumador": "Agravamento +50% sobre qx base: qx_fumador = qx * 1.50",
        "melhoramento": "Multiplicativo: qx(x,ano) = qx_base(x) * prod(1-f(x,a)) para cada ano a",
        "taxa_desconto_base": "4% anual para motor deterministico v0.1. Yield curve ECB para cenarios de stress.",
        "produtos_suportados": "Temporario (term), Misto (endowment). Vida inteira e renda vitalicia como extensoes pos-bootcamp."
    },

    "dados_disponiveis": {
        "dia_0": "sample_data.csv (dados genericos para pratica), tabua mortalidade em Excel (.xlsx) para exercicio MCP",
        "dia_2": "carteira_apolices_vida.csv (3000 apolices, 4 produtos), sinistralidade_vida.csv (1500 eventos, 8 anomalias), red_flags_fraude_vida.csv (200 sinistros, ~40 red flags)",
        "dia_3": "medical_costs_sample.csv (10K registos saude), sinistralidade_historica.csv (5K sinistros saude, 10 anomalias), exclusoes_apolice.json (CIDs), 5 faturas PDF + 3 recibos JPG, condicoes_gerais_saude.pdf, nota_alta_hospitalar.txt, tabua_morbilidade_saude.csv, carteira_beneficiarios.csv",
        "dia_4": "tabua_mortalidade_CSO2017.csv (121 idades, M/F), taxas_resgate.csv (30 anos x 4 produtos), questionario_subscricao_vida.csv (500 propostas, ~35 falsas)",
        "dia_5": "nota_sinistro_vida.txt (3 processos: coberto, recusado, pendente), exclusoes_apolice_vida.json (12 exclusoes)",
        "dia_7": "factores_melhoramento_mortalidade.csv (121 idades x 34 anos), yield_curve_ECB.csv (72 meses x 6 tenors), comissoes_mediacao.csv, excel_validacao_cashflow.md (valores referencia)",
        "dia_8": "mortalidade_covid_portugal.csv (720 linhas, excesso mortalidade 2019-2023)",
        "dia_9": "benchmark_mercado_vida_pt.csv (mercado PT 2018-2025, 5 ramos, loss ratios, quotas)"
    },

    "estrutura_dias": {
        "dia_0": "Pre-Bootcamp: OpenCode CLI (14 ferramentas, modo TUI e CLI, sessions, agentes), Excel MCP (ler/escrever spreadsheets via LLM), outros MCPs (filesystem, Supabase, PDF), conceitos LLM (tokens, temperature, JSON mode, streaming, APIs, custos)",
        "dia_1": "SDD: Spec-Driven Development (spec.md, constitution.md, checklist auditoria), Setup (Python, Git, Z.ai), primeira spec + geracao + auditoria",
        "dia_2": "Python/Pandas crash course (DataFrame, .describe, .groupby, plotly), Data Wrangling Vida (8 anomalias), Streamlit primer (st.title, st.dataframe, st.plotly_chart), primeiro dashboard",
        "dia_3": "Recolha dados programatica: OCR (Tesseract vs Vision LLM), pipeline PDF->JSON, regras de negocio (CIDs, exclusoes), pricing saude (frequencia x severidade), modulo TPA como add-on Prophet AI",
        "dia_4": "ML: classificacao binaria (Logistic Regression, XGBoost), train/test split, AUC-ROC, SHAP, fairness. Modelos: mortalidade, lapse, fraude subscricao. Guardar como pickle para Dia 7",
        "dia_5": "RAG (ChromaDB, embeddings, pesquisa semantica), agentes (tool calling nativo, loop ReAct), auditor sinistros, analytics conversacional, multi-agente. Consolidacao Semana 1",
        "dia_6": "FIS Prophet (model points, assumptions, projection, reserves, reporting), arquitetura SDD (constitution, specs, integration), RBAC (roles, Supabase RLS), ligar outputs Semana 1 ao Prophet AI",
        "dia_7": "Motor deterministico: pressupostos (CSO2017+fumador+melhoramento+lapse), projecao (single/multiple decrement, mid-year), premio liquido (equivalencia), V(t) prospectivo, profit testing (signature, VPN, IRR). pytest",
        "dia_8": "Stress Solvencia II (7 choques), COVID com dados reais PT, agente co-piloto com tool calling ao motor, tornado chart sensibilidade, guardrails",
        "dia_9": "Deploy (Streamlit Cloud, secrets, CI), RBAC producao, validacao motor vs mercado PT, modelo negocio SaaS (TAM, tiers, projecao 12m), integrar modulo TPA Saude",
        "dia_10": "Polimento final, peer code review, retrospetiva skills, apresentacao 8 min (demo + negocio + Q&A), plano 90 dias, caminhos pos-bootcamp"
    },

    "solvencia_ii_vida": {
        "mortalidade": "+15% qx todas as idades (permanente, para seguros onde aumento de mortalidade aumenta liabilities)",
        "longevidade": "-20% qx idades 65+ (permanente, para anuidades/produtos expostos a risco de longevidade)",
        "lapse_up": "+50% todas as taxas de resgate",
        "lapse_down": "-50% todas as taxas de resgate",
        "lapse_mass": "40% resgates no ano 1 (so para apolices com surrender strain positivo)",
        "taxa_juro": "+/- 200bps na yield curve (simplificacao; standard formula real usa factores dependentes da maturidade)",
        "despesas": "+10% custos unitarios + 1pp inflacao de despesas",
        "nota": "No bootcamp simplificamos vs standard formula real. Sempre documentar simplificacoes."
    },

    "anomalias_intencionais": {
        "sinistralidade_vida": "8 anomalias: 2 idades negativas, 3 idades impossiveis (150, 200, 999), 3 capitais negativos",
        "red_flags_fraude": "~40 flags: aumento capital pre-obito, alteracao beneficiario, stacking (multiplas apolices mesmo beneficiario), timing suspeito (early claims), premios lump sum, CIDs suspeitos (R99, X99, W19)",
        "sinistralidade_saude": "10 anomalias intencionais no dataset de saude",
        "questionario_subscricao": "~35 declaracoes falsas (coluna verificacao_posterior com 'Verificado:')"
    },

    "recapitulativos": {
        "fim_dia_0": "Sabes usar OpenCode CLI e MCPs para tarefas de escritorio. Consegues manipular Excel via LLM. Entendes tokens, temperature, e custos.",
        "fim_dia_1": "Tens o ambiente completo (Python, Git, OpenCode, Z.ai). Sabes escrever specs e auditar codigo gerado por AI. Fizeste a tua primeira spec independente.",
        "fim_dia_2": "Sabes Python/pandas o suficiente para auditar. Limpaste a carteira vida. Fizeste o primeiro dashboard Streamlit.",
        "fim_dia_3": "Sabes extrair dados de PDFs e imagens (OCR). Construiste um motor de regras de negocio. Tens um modulo TPA Saude para integrar no Prophet AI.",
        "fim_dia_4": "Treinaste modelos ML (mortalidade, lapse, fraude). Sabes avaliar (AUC, SHAP) e explicar previsoes. Guardaste modelos como pickle.",
        "fim_dia_5": "Construiste RAG sobre clausulados e agentes autonomos para auditoria. Consolidaste tudo da Semana 1. Estas pronto para construir o Prophet AI.",
        "fim_dia_6": "Tens a arquitetura completa: constitution, 3 specs, RBAC, Supabase configurado. Mapeaste outputs da Semana 1 para modulos do Prophet AI.",
        "fim_dia_7": "Tens um motor funcional: pressupostos, projecao, premio, reservas V(t), profit testing. Validado com testes pytest.",
        "fim_dia_8": "Motor suporta 7 cenarios de stress Solvencia II + COVID real. Agente co-piloto responde em linguagem natural. Tornado chart de sensibilidade.",
        "fim_dia_9": "Prophet AI esta online (Streamlit Cloud), com RBAC funcional, validado contra mercado PT, com modelo de negocio definido.",
        "fim_dia_10": "Apresentaste ao vivo. Fizeste peer review. Tens plano de 90 dias e skills matrix. O Prophet AI e o teu portfolio."
    }
}

SYSTEM_PROMPT = f"""Es o AI Tutor do Prophet AI Bootcamp -- um bootcamp de AI & Data Science para Atuarios de Vida.

PAPEL:
- Ajudar alunos com duvidas sobre exercicios, conceitos atuariais, e tecnologia do bootcamp.
- Explicar conceitos de Vida (mortalidade, reservas, profit testing, Solvencia II).
- Ajudar com OpenCode, MCPs (Excel MCP, Supabase MCP), Python, Pandas, Streamlit, agentes, RAG.
- Explicar o Spec-Driven Development (SDD): escrever spec, gerar codigo, auditar.
- NAO dar respostas completas -- guiar o aluno a pensar e resolver sozinho.
- Se o aluno pedir codigo, dar dicas, pseudo-codigo e orientacao, nao a solucao completa.
- Quando o aluno parecer perdido, RECAPITULAR onde esta no bootcamp e o que ja aprendeu.

CONTEXTO COMPLETO DO BOOTCAMP:
{json.dumps(COURSE_CONTEXT, indent=2, ensure_ascii=False)}

REGRAS:
- Responde sempre em portugues de Portugal (a menos que o aluno escreva noutra lingua).
- Se nao sabes algo, diz que nao sabes.
- Referencia os ficheiros de dados especificos quando relevante.
- Para formulas, mostra a expressao matematica e explica cada variavel.
- Para exercicios, lembra o aluno de usar a metodologia SDD (escrever spec primeiro).
- Quando o aluno estiver num dia especifico, contextualiza: o que ja fez antes, o que vem a seguir.
- Usa os recapitulativos para ajudar alunos a situar-se.
- Para OpenCode: conheces todas as 14 ferramentas built-in e os comandos CLI.
- Para MCPs: sabes configurar Excel MCP, Supabase MCP, filesystem, PDF reader.
- Para ML: sabes explicar Logistic Regression, XGBoost, SHAP, train/test split, AUC-ROC.
- Para Solvencia II: conheces os 7 choques do modulo Vida da Standard Formula.
"""


def render_tutor_widget():
    """Render a compact AI Tutor chat widget. Call at the bottom of any page."""
    from lib.i18n import t

    if "tutor_widget_messages" not in st.session_state:
        st.session_state.tutor_widget_messages = []

    with st.expander(f"🤖 {t('tutor_title')} — {t('tutor_ask_hint')}", expanded=False):
        render_html(f"""
        <div class="suggestion-card" style="margin-bottom:12px;">
            <strong>{t('tutor_title')}</strong>
            <p style="margin:4px 0 0;">{t('tutor_ready')}</p>
        </div>
        """)
        for msg in st.session_state.tutor_widget_messages[-6:]:
            role_label = "🧑" if msg["role"] == "user" else "🤖"
            st.markdown(f"**{role_label}** {msg['content']}")

        with st.form("tutor_widget_form", clear_on_submit=True, border=False):
            user_input = st.text_input(
                t("chat_placeholder"),
                placeholder=t("chat_placeholder"),
                label_visibility="collapsed",
                key="tutor_widget_text",
            )
            col1, col2 = st.columns([4, 1])
            with col1:
                submitted = st.form_submit_button(t("submit_btn"), use_container_width=True, type="primary")
            with col2:
                clear = st.form_submit_button(f"🗑", use_container_width=True)

        if submitted and user_input:
            st.session_state.tutor_widget_messages.append({"role": "user", "content": user_input})
            with st.spinner(t("thinking")):
                response = get_ai_response(st.session_state.tutor_widget_messages)
            st.session_state.tutor_widget_messages.append({"role": "assistant", "content": response})
            st.rerun()

        if clear:
            st.session_state.tutor_widget_messages = []
            st.rerun()


def get_ai_response(messages: list) -> str:
    try:
        api_key = st.secrets["deepseek"]["api_key"]
    except Exception:
        return "AI Tutor indisponivel -- configura a chave DeepSeek em secrets.toml."

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
        full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=full_messages,
            max_tokens=1024,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Erro ao contactar o AI Tutor: {e}"
