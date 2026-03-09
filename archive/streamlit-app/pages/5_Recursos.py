import streamlit as st
from pathlib import Path
from lib.auth import require_auth
from lib.theme import inject_css, page_header, section_title, render_html
from lib.i18n import t
from lib.ai import render_tutor_widget

require_auth()
inject_css()

page_header(t("recursos_title"), t("recursos_sub"), "📦")


DOWNLOADABLE_DATASETS = {
    "Dia 0": [
        (Path("data/day0/carteira_vida_sample.csv"), "Carteira sample para analise inicial com OpenCode."),
        (Path("data/day0/tabua_mortalidade_CSO2017.csv"), "Tabua de mortalidade para prompts precisos e exploradores."),
    ],
    "Dia 1": [
        (Path("data/day1/reporting_vida_q4_2025.csv"), "Mock reporting trimestral base para run comparison."),
        (Path("data/day1/reporting_vida_q1_2026.csv"), "Mock reporting trimestral seguinte para explicar variacoes."),
        (Path("data/day1/manual_reporting_tasks.csv"), "Lista de tarefas manuais que AI pode reduzir."),
    ],
}


def render_downloadable_datasets():
    section_title("Dados descarregaveis", "⬇️", "rose")
    render_html("<div class='resource-section-card'><h3>CSV acessiveis diretamente na app</h3><p>Os ficheiros dos Dias 0 e 1 estao agora disponiveis para download sem depender de links externos.</p></div>")

    for group_name, files in DOWNLOADABLE_DATASETS.items():
        st.markdown(f"### {group_name}")
        for path, description in files:
            if not path.exists():
                st.warning(f"Ficheiro em falta: {path}")
                continue
            col_info, col_download = st.columns([4, 1], vertical_alignment="center")
            with col_info:
                render_html(f"""
                <div class="resource-item" style="margin-bottom:12px;">
                    <span class="resource-badge" style="background:#FCE7F3; color:#9D174D;">CSV</span>
                    <div>
                        <strong style="color:#0F172A; font-size:0.92rem;">{path.name}</strong>
                        <p style="margin:2px 0 0; font-size:0.85rem; color:#64748B;">{description}</p>
                    </div>
                </div>
                """)
            with col_download:
                st.download_button(
                    "Download",
                    data=path.read_bytes(),
                    file_name=path.name,
                    mime="text/csv",
                    key=f"resource_download_{group_name}_{path.name}",
                    use_container_width=True,
                )

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
    "stack": 8,
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

render_downloadable_datasets()

st.markdown("---")


vida_s1 = {
    "carteira_apolices_vida.csv": t("resource_vida_s1_carteira_apolices_vida_desc"),
    "sinistralidade_vida.csv": t("resource_vida_s1_sinistralidade_vida_desc"),
    "exclusoes_apolice_vida.json": t("resource_vida_s1_exclusoes_apolice_vida_desc"),
    "nota_sinistro_vida.txt": t("resource_vida_s1_nota_sinistro_vida_desc"),
    "red_flags_fraude_vida.csv": t("resource_vida_s1_red_flags_fraude_vida_desc"),
    "questionario_subscricao_vida.csv": t("resource_vida_s1_questionario_subscricao_vida_desc"),
}

# --- Vida Semana 1 ---
render_resource_section(t("vida_s1"), "📋", "indigo", resource_totals["vida_s1"], vida_s1, t("vida_s1_badge"), "#DBEAFE", "#1D4ED8")

vida_s2 = {
    "tabua_mortalidade_CSO2017.csv": t("resource_vida_s2_tabua_mortalidade_cso2017_desc"),
    "taxas_resgate.csv": t("resource_vida_s2_taxas_resgate_desc"),
    "yield_curve_ECB.csv": t("resource_vida_s2_yield_curve_ecb_desc"),
    "factores_melhoramento_mortalidade.csv": t("resource_vida_s2_factores_melhoramento_mortalidade_desc"),
    "comissoes_mediacao.csv": t("resource_vida_s2_comissoes_mediacao_desc"),
    "mortalidade_covid_portugal.csv": t("resource_vida_s2_mortalidade_covid_portugal_desc"),
    "benchmark_mercado_vida_pt.csv": t("resource_vida_s2_benchmark_mercado_vida_pt_desc"),
}

# --- Vida Semana 2 ---
render_resource_section(t("vida_s2"), "📊", "emerald", resource_totals["vida_s2"], vida_s2, t("vida_s2_badge"), "#D1FAE5", "#065F46")

# --- Saude ---
st.markdown("---")

saude = {
    "medical_costs_sample.csv": t("resource_saude_medical_costs_sample_desc"),
    "sinistralidade_historica.csv": t("resource_saude_sinistralidade_historica_desc"),
    "exclusoes_apolice.json": t("resource_saude_exclusoes_apolice_desc"),
    "fatura_hospital_*.pdf": t("resource_saude_fatura_hospital_desc"),
    "fatura_farmacia_*.jpg": t("resource_saude_fatura_farmacia_desc"),
    "condicoes_gerais_saude.pdf": t("resource_saude_condicoes_gerais_desc"),
    "nota_alta_hospitalar.txt": t("resource_saude_nota_alta_hospitalar_desc"),
    "tabua_morbilidade_saude.csv": t("resource_saude_tabua_morbilidade_desc"),
    "carteira_beneficiarios.csv": t("resource_saude_carteira_beneficiarios_desc"),
}
render_resource_section(t("saude_dia3"), "🏥", "amber", resource_totals["saude_dia3"], saude, t("saude_dia3"), "#FEF3C7", "#92400E")

# --- Templates ---
st.markdown("---")

templates = {
    "template_constitution.md": t("resource_template_constitution_desc"),
    "template_spec.md": t("resource_template_spec_desc"),
    "template_modelo_negocio.md": t("resource_template_modelo_negocio_desc"),
    "template_calculadora_premio.md": t("resource_template_calculadora_premio_desc"),
    "checklist_auditoria_codigo.md": t("resource_checklist_auditoria_codigo_desc"),
    "scripts_com_bugs.md": t("resource_scripts_com_bugs_desc"),
    "prophet_reference_vida.md": t("resource_prophet_reference_vida_desc"),
    "excel_validacao_cashflow.md": t("resource_excel_validacao_cashflow_desc"),
}
render_resource_section(t("templates"), "📄", "indigo", resource_totals["templates"], templates, t("templates_badge"), "#EDE9FE", "#5B21B6")

# --- Stack ---
st.markdown("---")
section_title(t("tech_stack"), "⚡", "rose")
render_html(f"<div class='resource-section-card'><h3>{t('tech_stack')}</h3><p>{t('resource_count', count=resource_totals['stack'])}</p>")

stack = [
    ("🐍", "Python 3.11+", t("stack_category_runtime")),
    ("🤖", "OpenCode CLI", t("stack_category_ai_builder")),
    ("🧭", "GLM-5 via Z.ai / Speckit", t("stack_category_planning")),
    ("💬", "DeepSeek API", t("stack_category_llm")),
    ("🌐", "Streamlit", t("stack_category_local_mvp_ui")),
    ("📚", "ChromaDB", t("stack_category_docs_memory")),
    ("🔐", "Supabase Auth + PostgreSQL + RLS", t("stack_category_auth_db")),
    ("☁️", "Streamlit Community Cloud", t("stack_category_deploy")),
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
