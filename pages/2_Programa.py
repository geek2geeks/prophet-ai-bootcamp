import streamlit as st
import textwrap
from lib.auth import require_auth
from lib.course import DAYS
from lib.theme import inject_css, page_header, section_title, render_html
from lib.i18n import t
from lib.ai import render_tutor_widget

require_auth()
inject_css()

page_header(t("programa_title"), t("programa_sub"), "🗺️")

# Week selector
render_html('<div style="margin-bottom:24px;"></div>')
semana = st.radio(
    t("select_module"),
    [t("pre_bootcamp_tab"), t("week1_tab"), t("week2_tab")],
    horizontal=True,
    label_visibility="collapsed",
)
tabs = [t("pre_bootcamp_tab"), t("week1_tab"), t("week2_tab")]
sem_num = tabs.index(semana) if semana in tabs else 0

days_filtered = [d for d in DAYS if d["semana"] == sem_num]
filtered_exercises = sum(len(d["exercicios"]) for d in days_filtered)
filtered_challenge_points = sum(d["desafio"]["pontos"] for d in days_filtered)

render_html(f"""
<div class="info-hero">
    <div class="hero-copy">
        <div class="hero-kicker">{t('programa_snapshot')}</div>
        <h2 class="hero-title">{semana}</h2>
        <p>{t('programa_sub')}</p>
    </div>
    <div class="meta-grid">
        <div class="meta-card">
            <span class="meta-value">{len(days_filtered)}</span>
            <span class="meta-label">{t('day_lessons')}</span>
        </div>
        <div class="meta-card">
            <span class="meta-value">{filtered_exercises}</span>
            <span class="meta-label">{t('exercise_checklist')}</span>
        </div>
        <div class="meta-card">
            <span class="meta-value">{filtered_challenge_points}</span>
            <span class="meta-label">{t('grading_points')}</span>
        </div>
    </div>
</div>
""")

# Week intros
if sem_num == 0:
    render_html(f"""
    <div class="timeline-intro-card" style="border-top:4px solid #F59E0B; background: linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 100%);">
        <h3 style="color:#D97706; margin-top:0;">🛠 {t('pre_bootcamp_intro_title')}</h3>
        <p style="color:#475569; margin-bottom:0; font-size:1.05rem;">{t('pre_bootcamp_intro_desc')}</p>
    </div>
    """)
elif sem_num == 1:
    render_html(f"""
    <div class="timeline-intro-card" style="border-top:4px solid #3B82F6; background: linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%);">
        <h3 style="color:#2563EB; margin-top:0;">⚡ {t('week1_intro_title')}</h3>
        <p style="color:#475569; margin-bottom:0; font-size:1.05rem;">{t('week1_intro_desc')}</p>
    </div>
    """)
else:
    render_html(f"""
    <div class="timeline-intro-card" style="border-top:4px solid #8B5CF6; background: linear-gradient(135deg, #F5F3FF 0%, #FFFFFF 100%);">
        <h3 style="color:#7C3AED; margin-top:0;">🚀 {t('week2_intro_title')}</h3>
        <p style="color:#475569; margin-bottom:0; font-size:1.05rem;">{t('week2_intro_desc')}</p>
    </div>
    """)

# Render Timeline
st.markdown('<div class="timeline-container">', unsafe_allow_html=True)

for day in days_filtered:
    week_cls = "pre-bootcamp" if day["semana"] == 0 else ("" if day["semana"] == 1 else "week2")

    html = textwrap.dedent(f"""
    <div class="timeline-item {week_cls}">
        <div class="timeline-header">
            <div class="timeline-badge">{t('day')} {day['dia']}</div>
            <div class="timeline-header-content">
                <h3>{day['titulo']}</h3>
                <p>{day['objetivo']}</p>
            </div>
        </div>

        <div class="timeline-body">
            <h4 style="margin:0 0 12px 0; color:#475569; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em;">{t('day_lessons')}</h4>
            <ul class="timeline-modules-list">
    """)

    conteudo = day.get("conteudo", {})
    for i, mod in enumerate(day["modulos"], 1):
        mod_num = (day['dia'] - 1) * 2 + i if day['dia'] > 0 else i
        html += f"<li><strong>{t('module')} {mod_num}:</strong> {mod}"
        mod_key = f"modulo_{i}"
        if mod_key in conteudo:
            topics = conteudo[mod_key].get("topicos", [])
            if topics:
                html += '<ul style="margin:6px 0 4px 0; padding-left:20px; list-style:none;">'
                for topic in topics:
                    html += f'<li style="font-size:0.85rem; color:#64748B; font-weight:400; padding:1px 0; margin:0;">&mdash; {topic["titulo"]}</li>'
                html += '</ul>'
        html += "</li>"

    html += f"""
            </ul>

            <div class="timeline-exercises">
                <h4 style="margin:0 0 16px 0; color:#475569; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em;">{t('practical_work')}</h4>
    """

    for ex in day["exercicios"]:
        html += textwrap.dedent(f"""
        <div class="timeline-exercise-item">
            <span class="badge-pill slate">{ex["pontos"]} pts</span>
            <div class="timeline-exercise-content">
                <h4><span style="color:#64748B;">{ex["id"].upper()} -</span> {ex["titulo"]}</h4>
                <p>{ex["descricao"]}</p>
            </div>
        </div>
        """)

    d = day["desafio"]
    html += textwrap.dedent(f"""
        <div class="timeline-exercise-item" style="margin-top:20px; padding-top:16px; border-top:1px dashed #E2E8F0;">
            <span class="badge-pill indigo" style="background:#4F46E5; color:white; border:none;">{d["pontos"]} pts</span>
            <div class="timeline-exercise-content">
                <h4 style="color:#4F46E5;">🏆 {t('challenge_label')}: {d["titulo"]}</h4>
                <p>{d["descricao"]}</p>
            </div>
        </div>
    """)

    html += """
            </div>
        </div>
    </div>
    """
    render_html(html)

render_html('</div>')

# Grading Table
section_title(t("grading_title"), "🏅", "amber")
st.markdown(f"""
<div class="saas-card table-scroll" style="padding:0; overflow:hidden;">
    <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
            <tr style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
                <th style="padding:16px 24px; color:#475569; font-weight:600; font-size:0.85rem; text-transform:uppercase;">{t('grading_component')}</th>
                <th style="padding:16px 24px; color:#475569; font-weight:600; font-size:0.85rem; text-transform:uppercase;">{t('grading_points')}</th>
                <th style="padding:16px 24px; color:#475569; font-weight:600; font-size:0.85rem; text-transform:uppercase;">{t('grading_weight')}</th>
            </tr>
        </thead>
        <tbody>
            <tr style="border-bottom:1px solid #E2E8F0;">
                <td style="padding:16px 24px; font-weight:500; color:#0F172A;">{t('grading_prebootcamp')}</td>
                <td style="padding:16px 24px;">85</td>
                <td style="padding:16px 24px;"><span class="badge-pill amber">{t('grading_bonus')}</span></td>
            </tr>
            <tr style="border-bottom:1px solid #E2E8F0;">
                <td style="padding:16px 24px; font-weight:500; color:#0F172A;">{t('grading_exercises')}</td>
                <td style="padding:16px 24px;">200</td>
                <td style="padding:16px 24px;">20%</td>
            </tr>
            <tr style="border-bottom:1px solid #E2E8F0;">
                <td style="padding:16px 24px; font-weight:500; color:#0F172A;">{t('grading_challenges')}</td>
                <td style="padding:16px 24px;">200</td>
                <td style="padding:16px 24px;">20%</td>
            </tr>
            <tr style="border-bottom:1px solid #E2E8F0;">
                <td style="padding:16px 24px; font-weight:500; color:#0F172A;">{t('grading_homework')}</td>
                <td style="padding:16px 24px;">100</td>
                <td style="padding:16px 24px;">10%</td>
            </tr>
            <tr style="border-bottom:1px solid #E2E8F0;">
                <td style="padding:16px 24px; font-weight:500; color:#0F172A;">{t('grading_participation')}</td>
                <td style="padding:16px 24px;">100</td>
                <td style="padding:16px 24px;">10%</td>
            </tr>
            <tr style="background:#F8FAFC;">
                <td style="padding:16px 24px; font-weight:700; color:#4F46E5;">{t('grading_final')}</td>
                <td style="padding:16px 24px; font-weight:700;">400</td>
                <td style="padding:16px 24px; font-weight:700;"><span class="badge-pill indigo" style="font-size:0.85rem;">40% {t('grading_decisive')}</span></td>
            </tr>
        </tbody>
    </table>
</div>
""", unsafe_allow_html=True)

st.markdown("---")
render_tutor_widget()
