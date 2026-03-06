import streamlit as st
from lib.auth import require_auth
from lib.theme import inject_css, page_header

require_auth()
inject_css()

page_header("Recursos & Datasets", "Todos os ficheiros necessarios para o bootcamp")

# --- Vida Semana 1 ---
st.markdown("#### Vertical VIDA -- Semana 1")

vida_s1 = {
    "carteira_apolices_vida.csv": "Carteira de 3K apolices vida: temporario, vida inteira, misto, renda vitalicia",
    "sinistralidade_vida.csv": "Historico de eventos vida (obitos, resgates, vencimentos, rendas) -- 1.5K registos, 8 anomalias",
    "exclusoes_apolice_vida.json": "Exclusoes: suicidio, guerra, desportos radicais, incontestabilidade",
    "nota_sinistro_vida.txt": "3 processos de sinistro vida (obito simples, suicidio em carencia, declaracao falsa)",
    "red_flags_fraude_vida.csv": "200 sinistros com ~40 red flags de fraude escondidos",
    "questionario_subscricao_vida.csv": "500 propostas de subscricao -- ~20 declaracoes falsas",
}

for name, desc in vida_s1.items():
    st.markdown(f"""
    <div style="display:flex; align-items:flex-start; gap:10px; padding:8px 0; border-bottom:1px solid #F1F5F9;">
        <code style="background:#EFF6FF; color:#1D4ED8; padding:2px 8px; border-radius:6px; font-size:0.8rem; white-space:nowrap; flex-shrink:0;">/semana-1/</code>
        <div>
            <strong style="color:#0F172A; font-size:0.9rem;">{name}</strong>
            <div style="color:#64748B; font-size:0.82rem;">{desc}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# --- Vida Semana 2 ---
st.markdown("")
st.markdown("#### Vertical VIDA -- Semana 2")

vida_s2 = {
    "tabua_mortalidade_CSO2017.csv": "Tabua SOA CSO 2017 (qx por idade e sexo, 0-120 anos)",
    "taxas_resgate.csv": "Taxas de lapse por ano de apolice e produto",
    "yield_curve_ECB.csv": "Curva de taxas de juro ECB (72 meses, 6 tenors)",
    "factores_melhoramento_mortalidade.csv": "Melhoramento mortalidade 2017-2050, com choque COVID",
    "comissoes_mediacao.csv": "Comissoes por produto/ano, regras de clawback",
    "mortalidade_covid_portugal.csv": "Excesso mortalidade PT 2019-2023, por faixa etaria/sexo",
    "benchmark_mercado_vida_pt.csv": "Benchmarks mercado vida PT 2018-2025",
}

for name, desc in vida_s2.items():
    st.markdown(f"""
    <div style="display:flex; align-items:flex-start; gap:10px; padding:8px 0; border-bottom:1px solid #F1F5F9;">
        <code style="background:#F0FDF4; color:#065F46; padding:2px 8px; border-radius:6px; font-size:0.8rem; white-space:nowrap; flex-shrink:0;">/semana-2/</code>
        <div>
            <strong style="color:#0F172A; font-size:0.9rem;">{name}</strong>
            <div style="color:#64748B; font-size:0.82rem;">{desc}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# --- Saude ---
st.markdown("")
st.markdown("---")
st.markdown("#### Vertical SAUDE (Dia 3)")

saude = {
    "medical_costs_sample.csv": "10K registos de custos medicos (idade, IMC, fumador, custo)",
    "sinistralidade_historica.csv": "5K sinistros saude com 10 anomalias intencionais",
    "exclusoes_apolice.json": "Exclusoes saude com codigos CID",
    "fatura_hospital_*.pdf": "5 faturas hospitalares para OCR",
    "fatura_farmacia_*.jpg": "3 recibos de farmacia para OCR",
    "condicoes_gerais_saude.pdf": "Clausulado geral de seguro saude (~30 paginas, para RAG)",
    "nota_alta_hospitalar.txt": "3 notas de alta hospitalar",
    "tabua_morbilidade_saude.csv": "Frequencia + severidade por faixa etaria",
    "carteira_beneficiarios.csv": "5K beneficiarios saude",
}

for name, desc in saude.items():
    st.markdown(f"""
    <div style="display:flex; align-items:flex-start; gap:10px; padding:8px 0; border-bottom:1px solid #F1F5F9;">
        <code style="background:#FEF3C7; color:#92400E; padding:2px 8px; border-radius:6px; font-size:0.8rem; white-space:nowrap; flex-shrink:0;">saude</code>
        <div>
            <strong style="color:#0F172A; font-size:0.9rem;">{name}</strong>
            <div style="color:#64748B; font-size:0.82rem;">{desc}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# --- Templates ---
st.markdown("")
st.markdown("---")
st.markdown("#### Templates & Utilidades")

templates = {
    "template_constitution.md": "Template base para constitution.md (SDD)",
    "template_spec.md": "Template base para spec.md",
    "template_modelo_negocio.md": "Template para modelo de negocio (Dia 9)",
    "template_calculadora_escala.md": "Template para exercicio de escala pessoal (Dia 1)",
    "checklist_auditoria_codigo.md": "5 perguntas de auditoria de codigo gerado por IA",
    "scripts_com_bugs.md": "5 scripts com bugs atuariais escondidos (Dia 2)",
    "excel_validacao_cashflow.md": "Calculo manual de referencia para validar cash flows (Dia 7)",
}

for name, desc in templates.items():
    st.markdown(f"""
    <div style="display:flex; align-items:flex-start; gap:10px; padding:8px 0; border-bottom:1px solid #F1F5F9;">
        <code style="background:#EDE9FE; color:#5B21B6; padding:2px 8px; border-radius:6px; font-size:0.8rem; white-space:nowrap; flex-shrink:0;">/templates/</code>
        <div>
            <strong style="color:#0F172A; font-size:0.9rem;">{name}</strong>
            <div style="color:#64748B; font-size:0.82rem;">{desc}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# --- Stack ---
st.markdown("")
st.markdown("---")
st.markdown("#### Stack Tecnologico")

stack = [
    ("Linguagem", "Python 3.11+"),
    ("AI Coding", "OpenCode CLI + Z.ai Coding Plan (GLM-5)"),
    ("LLM API", "DeepSeek (endpoint OpenAI-compatible)"),
    ("Agentes", "CrewAI"),
    ("ML", "Scikit-learn, XGBoost, SHAP"),
    ("Web", "Streamlit"),
    ("Auth & DB", "Supabase (Auth + PostgreSQL + RLS)"),
    ("RAG", "ChromaDB (local)"),
    ("Deploy", "Streamlit Community Cloud"),
]

for cat, tool in stack:
    st.markdown(f"""
    <div style="display:flex; align-items:center; gap:12px; padding:6px 0;">
        <span style="min-width:90px; font-weight:600; color:#64748B; font-size:0.82rem; text-transform:uppercase;">{cat}</span>
        <span style="color:#1E293B; font-size:0.9rem;">{tool}</span>
    </div>
    """, unsafe_allow_html=True)
