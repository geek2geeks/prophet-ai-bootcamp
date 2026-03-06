import streamlit as st
from lib.auth import require_auth
from lib.theme import inject_css, page_header, section_title

require_auth()
inject_css()

page_header("Recursos & Datasets", "Todos os ficheiros necessarios para o bootcamp", "📦")

def resource_list(items: dict, badge_text: str, badge_bg: str, badge_color: str):
    for name, desc in items.items():
        st.markdown(f"""
        <div class="res-item">
            <span class="res-badge" style="background:{badge_bg}; color:{badge_color};">{badge_text}</span>
            <div class="res-info">
                <strong>{name}</strong>
                <p>{desc}</p>
            </div>
        </div>
        """, unsafe_allow_html=True)


# --- Vida Semana 1 ---
section_title("Vertical VIDA — Semana 1", "📋", "#DBEAFE", "#1D4ED8")

vida_s1 = {
    "carteira_apolices_vida.csv": "Carteira de 3K apolices vida: temporario, vida inteira, misto, renda vitalicia",
    "sinistralidade_vida.csv": "Historico de eventos vida (obitos, resgates, vencimentos, rendas) — 1.5K registos, 8 anomalias",
    "exclusoes_apolice_vida.json": "Exclusoes: suicidio, guerra, desportos radicais, incontestabilidade",
    "nota_sinistro_vida.txt": "3 processos de sinistro vida (obito simples, suicidio em carencia, declaracao falsa)",
    "red_flags_fraude_vida.csv": "200 sinistros com ~40 red flags de fraude escondidos",
    "questionario_subscricao_vida.csv": "500 propostas de subscricao — ~20 declaracoes falsas",
}
resource_list(vida_s1, "S1", "#DBEAFE", "#1D4ED8")

# --- Vida Semana 2 ---
section_title("Vertical VIDA — Semana 2", "📊", "#D1FAE5", "#065F46")

vida_s2 = {
    "tabua_mortalidade_CSO2017.csv": "Tabua SOA CSO 2017 (qx por idade e sexo, 0-120 anos)",
    "taxas_resgate.csv": "Taxas de lapse por ano de apolice e produto",
    "yield_curve_ECB.csv": "Curva de taxas de juro ECB (72 meses, 6 tenors)",
    "factores_melhoramento_mortalidade.csv": "Melhoramento mortalidade 2017-2050, com choque COVID",
    "comissoes_mediacao.csv": "Comissoes por produto/ano, regras de clawback",
    "mortalidade_covid_portugal.csv": "Excesso mortalidade PT 2019-2023, por faixa etaria/sexo",
    "benchmark_mercado_vida_pt.csv": "Benchmarks mercado vida PT 2018-2025",
}
resource_list(vida_s2, "S2", "#D1FAE5", "#065F46")

# --- Saude ---
st.markdown("---")
section_title("Vertical SAUDE (Dia 3)", "🏥", "#FEF3C7", "#92400E")

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
resource_list(saude, "SAUDE", "#FEF3C7", "#92400E")

# --- Templates ---
st.markdown("---")
section_title("Templates & Utilidades", "📄", "#EDE9FE", "#5B21B6")

templates = {
    "template_constitution.md": "Template base para constitution.md (SDD)",
    "template_spec.md": "Template base para spec.md",
    "template_modelo_negocio.md": "Template para modelo de negocio (Dia 9)",
    "template_calculadora_escala.md": "Template para exercicio de escala pessoal (Dia 1)",
    "checklist_auditoria_codigo.md": "5 perguntas de auditoria de codigo gerado por IA",
    "scripts_com_bugs.md": "5 scripts com bugs atuariais escondidos (Dia 2)",
    "excel_validacao_cashflow.md": "Calculo manual de referencia para validar cash flows (Dia 7)",
}
resource_list(templates, "TPL", "#EDE9FE", "#5B21B6")

# --- Stack ---
st.markdown("---")
section_title("Stack Tecnologico", "⚡", "#FFE4E6", "#BE123C")

stack = [
    ("🐍", "Python 3.11+", "Linguagem"),
    ("🤖", "OpenCode CLI + Z.ai", "AI Coding"),
    ("💬", "DeepSeek API", "LLM"),
    ("🧠", "CrewAI", "Agentes"),
    ("📈", "Scikit-learn, XGBoost, SHAP", "ML"),
    ("🌐", "Streamlit", "Web"),
    ("🔐", "Supabase Auth + PostgreSQL + RLS", "Auth & DB"),
    ("📚", "ChromaDB", "RAG"),
    ("☁️", "Streamlit Community Cloud", "Deploy"),
]

st.markdown('<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:8px;">', unsafe_allow_html=True)
for icon, tool, cat in stack:
    st.markdown(f"""
    <div style="background:white; border:1px solid #E2E8F0; border-radius:10px; padding:14px 16px; text-align:center;">
        <div style="font-size:1.3rem; margin-bottom:4px;">{icon}</div>
        <div style="font-weight:700; color:#0F172A; font-size:0.85rem;">{tool}</div>
        <div style="color:#94A3B8; font-size:0.72rem; text-transform:uppercase; font-weight:600;">{cat}</div>
    </div>
    """, unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)
