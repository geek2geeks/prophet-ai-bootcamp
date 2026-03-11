import streamlit as st
from lib.auth import require_auth
from lib.theme import inject_css, page_header, section_title, render_html
from lib.i18n import t
from lib.ai import render_tutor_widget

require_auth()
inject_css()

page_header(t("launch_title"), t("launch_sub"), "📣")

render_html(f"""
<div class="tutor-hero">
    <div class="hero-copy">
        <div class="hero-kicker">{t('launch_kicker')}</div>
        <h2 class="hero-title">{t('launch_title')}</h2>
        <p>{t('launch_sub')}</p>
    </div>
    <div class="suggestion-card">
        <strong>{t('launch_why_title')}</strong>
        <div class="tutor-capability-list" style="margin-top:0.85rem;">
            <div class="tutor-capability-item"><span class="tutor-capability-bullet">01</span><p>{t('launch_why_1')}</p></div>
            <div class="tutor-capability-item"><span class="tutor-capability-bullet">02</span><p>{t('launch_why_2')}</p></div>
            <div class="tutor-capability-item"><span class="tutor-capability-bullet">03</span><p>{t('launch_why_3')}</p></div>
        </div>
    </div>
</div>
""")

section_title(t("launch_template_title"), "✍️", "rose")
st.text_area(
    t("launch_template_title"),
    value=t("launch_template_body"),
    height=320,
    key="launch_template_body",
    label_visibility="collapsed",
)

col_assets, col_check = st.columns(2, gap="large")

with col_assets:
    section_title(t("launch_assets_title"), "🧩", "emerald")
    render_html(f"""
    <div class="grading-stack">
        <div class="grading-card"><div><strong>01</strong><p>{t('launch_assets_1')}</p></div></div>
        <div class="grading-card"><div><strong>02</strong><p>{t('launch_assets_2')}</p></div></div>
        <div class="grading-card"><div><strong>03</strong><p>{t('launch_assets_3')}</p></div></div>
        <div class="grading-card"><div><strong>04</strong><p>{t('launch_assets_4')}</p></div></div>
    </div>
    """)

with col_check:
    section_title(t("launch_checklist_title"), "✅", "amber")
    render_html(f"""
    <div class="grading-stack">
        <div class="grading-card"><div><strong>01</strong><p>{t('launch_check_1')}</p></div></div>
        <div class="grading-card"><div><strong>02</strong><p>{t('launch_check_2')}</p></div></div>
        <div class="grading-card"><div><strong>03</strong><p>{t('launch_check_3')}</p></div></div>
        <div class="grading-card"><div><strong>04</strong><p>{t('launch_check_4')}</p></div></div>
    </div>
    """)

st.markdown("---")
render_tutor_widget()
