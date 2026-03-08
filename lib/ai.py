import json
import streamlit as st
from typing import Any
from lib.theme import render_html
from lib.i18n import t

COURSE_CONTEXT = {
    "bootcamp": {
        "nome": "Prophet Lite Founder Bootcamp -- AI-Native Software para Atuarios",
        "duracao": "Pre-bootcamp (Dia 0) + 10 dias / 2 semanas",
        "publico": "Atuarios que querem tornar-se builders e fundadores AI-native, mesmo sem background de coding tradicional",
        "objetivo": "Construir um Prophet Lite com AI Copilot: local primeiro, deploy depois, com narrativa de mercado e lancamento publico",
        "formador": "Pedro (pedro@stratfordgeek.com)",
        "metodologia": "Spec-Driven Development (SDD) -- escrever spec primeiro, gerar codigo com AI, auditar com checklist",
        "filosofia": "O atuario deixa de ser consumidor de software e passa a fundador de produto. Os LLMs escrevem grande parte do codigo; o humano define, orienta, valida, posiciona e lanca."
    },

    "stack_tecnologico": {
        "opencode": {
            "descricao": "Agente de AI coding open-source para o terminal. Escrito em Go. TUI interativa + modo CLI.",
            "instalacao": "npm i -g opencode",
            "config": "Configuracao via variaveis de ambiente e ficheiro de definicoes do OpenCode CLI. Semelhante ao Claude Code.",
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
                "opencode agent list": "Listar agentes disponiveis",
                "opencode models": "Listar modelos disponiveis"
            },
            "agentes": "Agentes personalizados definidos na configuracao do OpenCode CLI. Cada agente tem: description, model, prompt, tools permitidas. Usar para tarefas repetitivas (ex: agente 'code-reviewer' que so le e comenta).",
            "sessions": "Sessoes guardam o historico de conversa. Continuar com --continue, retomar com --session ID, bifurcar com --fork. Exportar/importar com opencode export/import.",
            "permissoes": "Por defeito tudo permitido. Configurar nas definicoes do OpenCode CLI: permission.bash = 'ask' para pedir confirmacao antes de executar comandos shell."
        },
        "python": "Python 3.11+ como runtime do MVP. O objetivo nao e ensinar programacao profunda, mas permitir que o aluno opere, leia e valide o que o LLM gera.",
        "z_ai": "Z.ai Coding Plan (GLM-5) para planear implementacoes, rever specs e estruturar trabalho antes de mandar construir.",
        "llm_api": "DeepSeek API (endpoint OpenAI-compatible). Barato ($0.14/M input), rapido, bom para o bootcamp. Alternativas: Anthropic Claude, OpenAI GPT.",
        "agentes_framework": "O foco do bootcamp e um copiloto AI simples e util. Tool calling nativo basta para o MVP; frameworks mais pesados sao opcionais depois.",
        "ml": "ML nao e o centro do MVP. Pode surgir como extensao futura, mas o produto principal assenta em specs, interfaces, projection deterministic e UX clara.",
        "web": "Streamlit para apps web rapidas. Conceitos: st.title(), st.dataframe(), st.plotly_chart(), st.selectbox(), st.sidebar, st.columns(), st.form(). Deploy: Streamlit Community Cloud (gratuito).",
        "auth_db": "Supabase Auth (Google OAuth + email/password) + PostgreSQL + Row-Level Security (RLS). Roles: admin, actuary, auditor, viewer.",
        "rag": "ChromaDB (vector database local). Base para document drop, memoria pesquisavel e copiloto que responde com contexto de documentos reais.",
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
        "JSON_mode": "Pedir resposta estruturada em JSON. Essencial para pipelines: extrair dados de texto, gerar configs, criar datasets.",
        "streaming": "Tokens aparecem um a um (interativo) vs batch (resposta completa). OpenCode TUI usa streaming, 'opencode run' pode usar batch.",
        "RAG": "Retrieval-Augmented Generation: documentos -> embeddings -> vector DB -> pesquisa semantica -> LLM gera resposta com contexto recuperado.",
        "embeddings": "Vetores numericos que capturam significado semantico. Textos similares = vetores proximos. Usados em RAG e pesquisa semantica.",
        "tool_calling": "O LLM decide qual funcao chamar e com que parametros. O resultado e devolvido ao LLM. Base dos agentes autonomos.",
        "RBAC": "Role-Based Access Control. Roles no Prophet Lite: admin (tudo), actuary (projecoes), auditor (ver+claims), viewer (dashboards). Implementado com Supabase RLS.",
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
        "dia_0": "carteira_vida_sample.csv (30 apolices vida com idade, capital, premio, estado, fumador), tabua_mortalidade_CSO2017.csv (121 idades, qx M/F, lx, ex) -- ambos em data/day0/",
        "dia_2": "carteira_apolices_vida.csv (3000 apolices, 4 produtos), sinistralidade_vida.csv (1500 eventos, 8 anomalias), red_flags_fraude_vida.csv (200 sinistros, ~40 red flags)",
        "dia_3": "medical_costs_sample.csv (10K registos saude), sinistralidade_historica.csv (5K sinistros saude, 10 anomalias), exclusoes_apolice.json (CIDs), 5 faturas PDF + 3 recibos JPG, condicoes_gerais_saude.pdf, nota_alta_hospitalar.txt, tabua_morbilidade_saude.csv, carteira_beneficiarios.csv",
        "dia_4": "tabua_mortalidade_CSO2017.csv (121 idades, M/F), taxas_resgate.csv (30 anos x 4 produtos), questionario_subscricao_vida.csv (500 propostas, ~35 falsas)",
        "dia_5": "nota_sinistro_vida.txt (3 processos: coberto, recusado, pendente), exclusoes_apolice_vida.json (12 exclusoes)",
        "dia_7": "factores_melhoramento_mortalidade.csv (121 idades x 34 anos), yield_curve_ECB.csv (72 meses x 6 tenors), comissoes_mediacao.csv, excel_validacao_cashflow.md (valores referencia)",
        "dia_8": "mortalidade_covid_portugal.csv (720 linhas, excesso mortalidade 2019-2023)",
        "dia_9": "benchmark_mercado_vida_pt.csv (mercado PT 2018-2025, 5 ramos, loss ratios, quotas)"
    },

    "estrutura_dias": {
        "dia_0": "Setup do builder AI-native: terminal desde zero (5 comandos essenciais, Node.js, resolucao de erros), API key DeepSeek (passo a passo completo com configuracao permanente), OpenCode CLI instalado e testado (similar ao Claude Code), analise de carteira vida real e tabua mortalidade com prompts, comparacao prompt preciso vs explorador, mapa da stack AI e 5 regras de seguranca para atuarios. 3 modulos, 6 exercicios com tempo estimado, 1 desafio.",
        "dia_1": "Mudanca de identidade: de atuario a fundador AI-native. Comeca com glossario de termos novos (SaaS, MVP, wedge, UX, workflow, etc.), depois compara vender horas vs vender produto, analisa o Prophet, escolhe 3 frustracoes vendaveis, escreve memo do fundador e termina com quiz de conceitos. 6 exercicios + desafio. Modulo 1 define vocabulario; Modulo 2 explica porque criar produto; Modulo 3 ensina a escolher o ponto de entrada no mercado.",
        "dia_2": "Specs com Speckit: spec.md, constitution.md, acceptance criteria, coding plans com GLM-5 e auditoria do output",
        "dia_3": "Dados como interfaces: CSV, JSON, YAML, model points, assumptions, API calls e contratos de integracao",
        "dia_4": "Comparar LLMs por tarefa: docs, custos, structured output, benchmarking, scorecards e papel de cada modelo no stack",
        "dia_5": "Prophet Lite architecture: o que replicar, o que ignorar, modulos MVP, governance minima e user roles",
        "dia_6": "Document drop e memoria do produto: OCR, extracao, metadata, review humana, RAG e pesquisa semantica",
        "dia_7": "Founder packaging: UX mobile-first, landing copy, pricing, fluxos core e build plan local-first",
        "dia_8": "Build local do motor deterministic: assumptions, model points, projection base, resultados e testes minimos",
        "dia_9": "Build local da app: Streamlit, uploads, dashboard, copiloto AI e document drop ligado ao MVP",
        "dia_10": "Deploy, demo e ativacao de mercado: secrets, auth basica, app online, README, post no LinkedIn e lancamento publico"
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
        "fim_dia_0": "Tens o terminal dominado, API key configurada de forma permanente, OpenCode operacional, analisaste uma carteira vida e uma tabua de mortalidade com prompts precisos e exploradores, percebes tokens e custos, e tens 5 regras de seguranca para trabalho atuarial com LLMs.",
        "fim_dia_1": "Dominas o vocabulario novo (SaaS, MVP, wedge, UX, workflow, posicionamento, incumbent, etc.), sabes a diferenca entre vender horas e vender produto, analisaste o Prophet, escolheste 3 frustracoes vendaveis, tens um memo do fundador, passaste o quiz de conceitos e escreveste uma tese para o primeiro cliente. Pronto para especificar no Dia 2.",
        "fim_dia_2": "Consegues escrever specs que um LLM consegue implementar sem ambiguidades centrais.",
        "fim_dia_3": "Percebes os dados, os schemas e as APIs necessarias para ligar inputs, runs e outputs do MVP.",
        "fim_dia_4": "Sabes escolher o modelo certo para cada tarefa do bootcamp e justificar a decisao.",
        "fim_dia_5": "Tens a arquitetura MVP do Prophet Lite definida com foco, governance minima e utilizadores claros.",
        "fim_dia_6": "Desenhaste um document drop util e credivel, com memoria pesquisavel e review humana.",
        "fim_dia_7": "Fechaste UX mobile-first, pricing, landing copy e o plano de build local-first.",
        "fim_dia_8": "Tens o motor local a correr com assumptions, model points, projection base e validacao minima.",
        "fim_dia_9": "Tens a app local utilizavel, com copiloto AI e document drop integrados no fluxo principal.",
        "fim_dia_10": "Tens um MVP online e uma narrativa publica: demo, README e post de lancamento no LinkedIn."
    }
}

SYSTEM_PROMPT = f"""Es o AI Tutor do Prophet Lite Founder Bootcamp -- um bootcamp para atuarios se tornarem builders e fundadores AI-native.

PAPEL:
- Ajudar alunos com duvidas sobre exercicios, specs, ferramentas, prompts e arquitetura do bootcamp.
- Explicar os conceitos atuarialmente relevantes apenas na medida em que suportam o produto Prophet Lite.
- Ajudar com OpenCode, APIs, Streamlit, document drop, copiloto AI, UX mobile-first, deploy e narrativa de produto.
- Explicar o Spec-Driven Development (SDD): escrever spec, gerar codigo, auditar e iterar.
- NAO dar respostas completas -- guiar o aluno a pensar e resolver sozinho.
- Se o aluno pedir codigo, dar dicas, pseudo-codigo e orientacao, nao a solucao completa.
- Quando o aluno parecer perdido, RECAPITULAR onde esta no bootcamp e o que ja aprendeu.

CONTEXTO COMPLETO DO BOOTCAMP:
{json.dumps(COURSE_CONTEXT, indent=2, ensure_ascii=False)}

REGRAS:
- Responde sempre em portugues de Portugal (a menos que o aluno escreva noutra lingua).
- Se nao sabes algo, diz que nao sabes.
- Referencia os ficheiros de dados especificos quando relevante.
- Para formulas, mostra a expressao matematica so quando isso ajuda a validar o produto ou compreender a logica do run.
- Para exercicios, lembra o aluno de usar a metodologia SDD (escrever spec primeiro).
- Quando o aluno estiver num dia especifico, contextualiza: o que ja fez antes, o que vem a seguir.
- Usa os recapitulativos para ajudar alunos a situar-se.
- Para OpenCode: conheces todas as 14 ferramentas built-in e os comandos CLI.
- O foco do bootcamp nao e ensinar coding manual, mas ensinar o aluno a especificar, validar, empacotar, deployar e divulgar um produto.
- O ultimo passo do curso inclui preparar o lancamento publico no LinkedIn.
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
                submitted = st.form_submit_button(t("submit_btn"), width="stretch", type="primary")
            with col2:
                clear = st.form_submit_button(f"🗑", width="stretch")

        if submitted and user_input:
            st.session_state.tutor_widget_messages.append({"role": "user", "content": user_input})
            with st.spinner(t("thinking")):
                response = get_ai_response(st.session_state.tutor_widget_messages)
            st.session_state.tutor_widget_messages.append({"role": "assistant", "content": response})
            st.rerun()

        if clear:
            st.session_state.tutor_widget_messages = []
            st.rerun()


def get_ai_response(messages: list[dict[str, str]]) -> str:
    try:
        api_key = st.secrets["deepseek"]["api_key"]
    except Exception:
        return t("tutor_unavailable")

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
        full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=full_messages,  # type: ignore[arg-type]
            max_tokens=1024,
            temperature=0.7
        )
        content = response.choices[0].message.content
        if isinstance(content, str) and content.strip():
            return content
        return t("tutor_no_response")
    except Exception as e:
        return t("tutor_contact_error", error=e)
