import json
import streamlit as st

COURSE_CONTEXT = {
    "bootcamp": {
        "nome": "Prophet AI Bootcamp -- AI & Data Science para Atuarios",
        "duracao": "10 dias / 2 semanas / 80 horas",
        "publico": "Atuarios de Vida (com modulo complementar de Saude no Dia 3)",
        "objetivo": "Construir o Prophet AI -- clone do FIS Prophet potenciado por IA, deployado como SaaS",
        "formador": "Pedro (pedro@stratfordgeek.com)",
        "metodologia": "Spec-Driven Development (SDD) -- GitHub Spec Kit"
    },
    "stack_tecnologico": {
        "linguagem": "Python 3.11+",
        "ai_coding": "OpenCode CLI + Z.ai Coding Plan (GLM-5)",
        "llm_api": "DeepSeek API (endpoint OpenAI-compatible)",
        "agentes": "CrewAI",
        "ml": "Scikit-learn, XGBoost, SHAP",
        "web": "Streamlit",
        "auth": "Supabase Auth + Row-Level Security",
        "db": "Supabase PostgreSQL",
        "rag": "ChromaDB (local)",
        "versionamento": "Git + GitHub",
        "deploy": "Streamlit Community Cloud"
    },
    "produtos_vida": {
        "temporario": {
            "descricao": "Term life -- premio nivelado, beneficio por morte, sem valor de resgate",
            "duracoes": "10, 15, 20, 25, 30 anos"
        },
        "vida_inteira": {
            "descricao": "Whole life -- premio vitalicio, beneficio por morte, valor de resgate crescente",
            "duracao": "Ate idade 120"
        },
        "misto": {
            "descricao": "Endowment -- premio temporario, beneficio morte OU sobrevivencia, valor de resgate",
            "duracoes": "15, 20, 25 anos"
        },
        "renda_vitalicia": {
            "descricao": "Annuity -- premio unico ou acumulacao, pagamento periodico vitalicio",
            "risco": "Longevidade"
        }
    },
    "conceitos_chave": {
        "V(t)": "Reserva matematica = VPA(beneficios futuros) - VPA(premios futuros)",
        "qx": "Probabilidade de morte entre idade x e x+1",
        "tpx": "Probabilidade de sobreviver t anos desde idade x",
        "VPA": "Valor Presente Atuarial = sum(CF(t) * v(t) * tpx)",
        "profit_signature": "Lucro(t) = Premios - Beneficios - Despesas - DeltaV + Investimento",
        "VPN": "Valor Presente Liquido do lucro (NPV)",
        "IRR": "Taxa Interna de Retorno",
        "SCR_vida": "Solvency Capital Requirement -- modulos: mortalidade, longevidade, lapse, despesas, catastrofe",
        "incontestabilidade": "Apos 24 meses, seguradora nao pode contestar declaracoes do segurado",
        "lapse": "Resgate/cancelamento de apolice pelo segurado",
        "clawback": "Devolucao de comissao se apolice cancelada prematuramente",
        "mid_year_discount": "v(t) = 1/(1+r)^(t-0.5) -- mortes ocorrem ao longo do ano"
    },
    "regras_matematicas": {
        "taxas": "Sempre anuais nominais. Conversao mensal: (1+r)^(1/12)-1. NUNCA r/12.",
        "base": "365 dias, ACT/365",
        "desconto": "Mid-year convention",
        "arredondamento": "Monetarios 2 casas, taxas 8 intermedias / 6 output. Arredondar so no final.",
        "tabua": "CSO 2017, idade terminal 120 (qx=1.0), sem interpolacao",
        "fumador": "Agravamento +50% sobre qx base",
        "melhoramento": "Multiplicativo: qx(x,ano) = qx_base * prod(1-f(x,a))"
    },
    "dados_disponiveis": {
        "carteira_apolices_vida.csv": "3000 apolices vida (temporario, vida_inteira, misto, renda_vitalicia)",
        "sinistralidade_vida.csv": "1500 eventos (obito, resgate, vencimento, renda) com 8 anomalias intencionais",
        "exclusoes_apolice_vida.json": "12 exclusoes (suicidio X70 condicional 24m, guerra Y35, etc.)",
        "nota_sinistro_vida.txt": "3 processos de sinistro (obito simples, suicidio em carencia, declaracao falsa)",
        "red_flags_fraude_vida.csv": "200 sinistros com ~40 red flags escondidos",
        "questionario_subscricao_vida.csv": "500 propostas, ~20 declaracoes falsas",
        "tabua_mortalidade_CSO2017.csv": "121 idades (0-120), qx masculino e feminino",
        "taxas_resgate.csv": "Lapse rates por produto e ano (1-30+)",
        "yield_curve_ECB.csv": "72 meses (2020-2025), 6 tenors",
        "factores_melhoramento_mortalidade.csv": "242 linhas, 2017-2050, com choque COVID",
        "comissoes_mediacao.csv": "Comissoes por produto/ano, clawback rules",
        "mortalidade_covid_portugal.csv": "720 linhas, excesso mortalidade 2019-2023",
        "benchmark_mercado_vida_pt.csv": "Mercado PT 2018-2025, 5 ramos vida"
    },
    "estrutura_dias": {
        "dia_1": "Setup AI Coding + Primeira Spec + Calculadora de Escala",
        "dia_2": "Data Wrangling Vida + Code Review + Fraude Exploratoria",
        "dia_3": "Modulo Saude: OCR faturas + Pricing XGBoost + Pipeline LGPD",
        "dia_4": "ML Vida: Mortalidade + Lapse + Subscricao/Declaracoes Falsas",
        "dia_5": "Agentes: RAG + Auditor Sinistros + REPL + Anti-Fraude",
        "dia_6": "Arquitetura Prophet AI: Constitution + Specs + RBAC + Supabase",
        "dia_7": "Motor: Cash Flow Engine + Tabuas + Reservas V(t) + Profit Testing",
        "dia_8": "Agentes no Motor + Cenarios Stress Solvencia II + RBAC Funcional",
        "dia_9": "Deploy Streamlit Cloud + Benchmarks Mercado + Modelo de Negocio",
        "dia_10": "Polimento + Apresentacoes Finais + Roadmap 90 dias"
    },
    "solvencia_ii_vida": {
        "mortalidade": "+15% qx todas as idades",
        "longevidade": "-20% qx idades 65+",
        "lapse_up": "+50% todas as taxas de resgate",
        "lapse_down": "-50% todas as taxas de resgate",
        "lapse_mass": "40% resgates no ano 1",
        "taxa_juro": "+/- 200bps na yield curve",
        "despesas": "+10% custos + 1pp inflacao"
    },
    "anomalias_intencionais": {
        "sinistralidade_vida": "2 idades negativas, 3 idades impossiveis (150, 200, 999), 3 capitais negativos",
        "red_flags_fraude": "Aumento capital pre-obito, alteracao beneficiario, stacking, timing suspeito, lump sum premios, early claims"
    }
}

SYSTEM_PROMPT = f"""Es o AI Tutor do Prophet AI Bootcamp.

PAPEL:
- Ajudar alunos com duvidas sobre exercicios e conceitos do bootcamp.
- Explicar conceitos atuariais de Vida (mortalidade, reservas, profit testing, Solvencia II).
- Ajudar com Python, Pandas, Streamlit, CrewAI, Supabase, Spec-Driven Development.
- NAO dar respostas completas -- guiar o aluno a pensar e resolver sozinho.
- Se o aluno pedir codigo, dar dicas e pseudo-codigo, nao a solucao completa.

CONTEXTO COMPLETO DO BOOTCAMP:
{json.dumps(COURSE_CONTEXT, indent=2, ensure_ascii=False)}

REGRAS:
- Responde sempre em portugues de Portugal.
- Se nao sabes algo, diz que nao sabes.
- Referencia os ficheiros de dados especificos quando relevante.
- Para formulas, mostra a expressao matematica e explica cada variavel.
- Para exercicios, lembra o aluno de usar a metodologia SDD (escrever spec primeiro, depois gerar codigo).
"""

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
