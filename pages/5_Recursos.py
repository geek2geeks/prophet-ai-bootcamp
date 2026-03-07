import streamlit as st
from lib.auth import require_auth
from lib.theme import inject_css, page_header, section_title, render_html
from lib.i18n import t
from lib.ai import render_tutor_widget

require_auth()
inject_css()

page_header(t("recursos_title"), t("recursos_sub"), "📦")

def resource_list(items: dict, badge_text: str, badge_bg: str, badge_color: str):
    render_html('<div class="resource-list">')
    for name, desc in items.items():
        render_html(f"""
        <div class="resource-item">
            <span class="resource-badge" style="background:{badge_bg}; color:{badge_color};">{badge_text}</span>
            <div>
                <strong style="color:#0F172A; font-size:0.92rem;">{name}</strong>
                <p style="margin:2px 0 0; font-size:0.85rem; color:#64748B;">{desc}</p>
            </div>
        </div>
        """)
    render_html('</div>')


def render_resource_section(title: str, icon: str, badge_color_name: str, count: int, items: dict, badge_text: str, badge_bg: str, badge_color: str):
    section_title(title, icon, badge_color_name)
    render_html(f"<div class='resource-section-card'><h3>{title}</h3><p>{t('resource_count', count=count)}</p>")
    resource_list(items, badge_text, badge_bg, badge_color)
    render_html('</div>')


resource_totals = {
    "vida_s1": 6,
    "vida_s2": 7,
    "saude_dia3": 9,
    "templates": 8,
    "stack": 9,
}
total_resources = (
    resource_totals["vida_s1"]
    + resource_totals["vida_s2"]
    + resource_totals["saude_dia3"]
    + resource_totals["templates"]
)

render_html(f"""
<div class="resource-hero">
    <div class="hero-copy">
        <div class="hero-kicker">{t('resources_kicker')}</div>
        <h2 class="hero-title">{t('recursos_title')}</h2>
        <p>{t('recursos_sub')}</p>
    </div>
    <div class="resource-summary-grid">
        <div class="resource-summary-card">
            <strong>{total_resources}</strong>
            <span>{t('resource_count', count=total_resources)}</span>
        </div>
        <div class="resource-summary-card">
            <strong>{resource_totals['templates']}</strong>
            <span>{t('templates')}</span>
        </div>
        <div class="resource-summary-card">
            <strong>{resource_totals['stack']}</strong>
            <span>{t('tech_stack')}</span>
        </div>
    </div>
</div>
""")


vida_s1 = {
    "carteira_apolices_vida.csv": "Carteira de 3K apolices vida: temporario, vida inteira, misto, renda vitalicia",
    "sinistralidade_vida.csv": "Historico de eventos vida (obitos, resgates, vencimentos, rendas) — 1.5K registos, 8 anomalias",
    "exclusoes_apolice_vida.json": "Exclusoes: suicidio, guerra, desportos radicais, incontestabilidade",
    "nota_sinistro_vida.txt": "3 processos de sinistro vida (obito simples, suicidio em carencia, declaracao falsa)",
    "red_flags_fraude_vida.csv": "200 sinistros com ~40 red flags de fraude escondidos",
    "questionario_subscricao_vida.csv": "500 propostas de subscricao — ~35 declaracoes falsas",
}

# --- Vida Semana 1 ---
render_resource_section(t("vida_s1"), "📋", "indigo", resource_totals["vida_s1"], vida_s1, t("vida_s1_badge"), "#DBEAFE", "#1D4ED8")

vida_s2 = {
    "tabua_mortalidade_CSO2017.csv": "Tabua SOA CSO 2017 (qx por idade e sexo, 0-120 anos)",
    "taxas_resgate.csv": "Taxas de lapse por ano de apolice e produto",
    "yield_curve_ECB.csv": "Curva de taxas de juro ECB (72 meses, 6 tenors)",
    "factores_melhoramento_mortalidade.csv": "Melhoramento mortalidade 2017-2050, com choque COVID",
    "comissoes_mediacao.csv": "Comissoes por produto/ano, regras de clawback",
    "mortalidade_covid_portugal.csv": "Excesso mortalidade PT 2019-2023, por faixa etaria/sexo",
    "benchmark_mercado_vida_pt.csv": "Benchmarks mercado vida PT 2018-2025",
}

# --- Vida Semana 2 ---
render_resource_section(t("vida_s2"), "📊", "emerald", resource_totals["vida_s2"], vida_s2, t("vida_s2_badge"), "#D1FAE5", "#065F46")

# --- Saude ---
st.markdown("---")

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
render_resource_section(t("saude_dia3"), "🏥", "amber", resource_totals["saude_dia3"], saude, t("saude_dia3"), "#FEF3C7", "#92400E")

# --- Templates ---
st.markdown("---")

templates = {
    "template_constitution.md": "Template base para constitution.md (SDD)",
    "template_spec.md": "Template base para spec.md",
    "template_modelo_negocio.md": "Template para modelo de negocio (Dia 9)",
    "template_calculadora_premio.md": "Template para exercicio de Calculadora de Premio Simples (Dia 1)",
    "checklist_auditoria_codigo.md": "5 perguntas de auditoria de codigo gerado por IA",
    "scripts_com_bugs.md": "5 scripts com bugs atuariais escondidos (Dia 2)",
    "prophet_reference_vida.md": "Referencia funcional do FIS Prophet para motor Vida (Dia 6)",
    "excel_validacao_cashflow.md": "Calculo manual de referencia para validar cash flows (Dia 7)",
}
render_resource_section(t("templates"), "📄", "indigo", resource_totals["templates"], templates, "TPL", "#EDE9FE", "#5B21B6")

# --- Stack ---
st.markdown("---")
section_title(t("tech_stack"), "⚡", "rose")
render_html(f"<div class='resource-section-card'><h3>{t('tech_stack')}</h3><p>{t('resource_count', count=resource_totals['stack'])}</p>")

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

render_html('<div class="tool-grid">')
for icon, tool, cat in stack:
    render_html(f"""
    <div class="tool-card">
        <div style="font-size:1.3rem; margin-bottom:4px;">{icon}</div>
        <div style="font-weight:700; color:#0F172A; font-size:0.85rem;">{tool}</div>
        <div style="color:#94A3B8; font-size:0.72rem; text-transform:uppercase; font-weight:600;">{cat}</div>
    </div>
    """)
render_html('</div>')
render_html('</div>')

st.markdown("---")
render_tutor_widget()
