import streamlit as st
import textwrap
from streamlit.errors import StreamlitAPIException
from lib.auth import require_auth
from lib.course import DAYS
from lib.theme import inject_css, page_header, section_title, render_html
from lib.i18n import t
from lib.ai import render_tutor_widget


def open_exercises(day_idx: int):
    st.session_state.exercicios_target_day = day_idx
    for target in ("pages/3_Exercicios.py", "3_Exercicios.py"):
        try:
            st.switch_page(target)
            return
        except StreamlitAPIException:
            continue

require_auth()
inject_css()

page_header(t("programa_title"), t("programa_sub"), "🗺️")

# Week selector
render_html('<div style="margin-bottom:24px;"></div>')
tabs = [t("pre_bootcamp_tab"), t("week1_tab"), t("week2_tab")]
target_week = st.session_state.pop("programa_target_week", None)
if isinstance(target_week, int) and 0 <= target_week < len(tabs):
    st.session_state.program_module_switch = tabs[target_week]

semana = st.radio(
    t("select_module"),
    tabs,
    horizontal=True,
    label_visibility="collapsed",
    key="program_module_switch",
)
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
    module_count = len(day["modulos"])
    exercise_count = len(day["exercicios"])

    html = textwrap.dedent(f"""
    <div class="timeline-item {week_cls}">
        <div class="timeline-header">
            <div class="timeline-badge">{t('day')} {day['dia']}</div>
            <div class="timeline-header-content">
                <h3>{day['titulo']}</h3>
                <p>{day['objetivo']}</p>
                <div class="timeline-mini-meta">
                    <span class="badge-pill slate">{module_count} {t('programa_modules_short')}</span>
                    <span class="badge-pill slate">{exercise_count} {t('programa_exercises_short')}</span>
                    <span class="badge-pill indigo">{day['desafio']['pontos']} {t('programa_challenge_points_short')}</span>
                </div>
            </div>
        </div>

        <div class="timeline-body">
            <h4 style="margin:0 0 12px 0; color:#475569; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em;">{t('day_lessons')}</h4>
            <ul class="timeline-modules-list">
    """)

    conteudo = day.get("conteudo", {})
    mod_offset = sum(len(d["modulos"]) for d in DAYS if d["dia"] < day["dia"])
    for i, mod in enumerate(day["modulos"], 1):
        mod_num = mod_offset + i
        html += f"<li><strong>{t('module')} {mod_num}:</strong> {mod}"
        mod_key = f"modulo_{i}"
        if mod_key in conteudo:
            topics = conteudo[mod_key].get("topicos", [])
            if topics:
                html += '<ul class="timeline-topic-list">'
                for topic in topics:
                    html += f'<li><strong>{topic["titulo"]}</strong>'
                    if topic.get("conteudo"):
                        html += f'<p class="timeline-topic-content">{topic["conteudo"]}</p>'
                    html += '</li>'
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

    full_day_idx = next(i for i, d in enumerate(DAYS) if d["dia"] == day["dia"])
    if st.button(
        f"▶ {t('start_exercises_btn')} — {t('day')} {day['dia']}",
        key=f"go_ex_day_{day['dia']}",
        type="primary",
        use_container_width=True,
    ):
        open_exercises(full_day_idx)

render_html('</div>')

# Grading Table
section_title(t("grading_title"), "🏅", "amber")
render_html(f"<p class='hero-note' style='margin-top:-0.35rem; margin-bottom:0.95rem;'>{t('programa_points_hint')}</p>")
render_html(f"""
<div class="grading-stack">
    <div class="grading-card">
        <div>
            <strong>{t('grading_prebootcamp')}</strong>
            <p>{t('grading_bonus')}</p>
        </div>
        <div class="grading-card-side">
            <span class="grading-card-points">85</span>
            <span class="badge-pill amber">{t('grading_bonus')}</span>
        </div>
    </div>
    <div class="grading-card">
        <div>
            <strong>{t('grading_exercises')}</strong>
            <p>{t('grading_exercises_desc')}</p>
        </div>
        <div class="grading-card-side">
            <span class="grading-card-points">200</span>
            <span class="badge-pill slate">20%</span>
        </div>
    </div>
    <div class="grading-card">
        <div>
            <strong>{t('grading_challenges')}</strong>
            <p>{t('grading_challenges_desc')}</p>
        </div>
        <div class="grading-card-side">
            <span class="grading-card-points">200</span>
            <span class="badge-pill slate">20%</span>
        </div>
    </div>
    <div class="grading-card">
        <div>
            <strong>{t('grading_homework')}</strong>
            <p>{t('grading_homework_desc')}</p>
        </div>
        <div class="grading-card-side">
            <span class="grading-card-points">100</span>
            <span class="badge-pill slate">10%</span>
        </div>
    </div>
    <div class="grading-card">
        <div>
            <strong>{t('grading_participation')}</strong>
            <p>{t('grading_participation_desc')}</p>
        </div>
        <div class="grading-card-side">
            <span class="grading-card-points">100</span>
            <span class="badge-pill slate">10%</span>
        </div>
    </div>
    <div class="grading-card grading-card-featured">
        <div>
            <strong>{t('grading_final')}</strong>
            <p>{t('grading_final_desc')}</p>
        </div>
        <div class="grading-card-side">
            <span class="grading-card-points">400</span>
            <span class="badge-pill indigo">40% {t('grading_decisive')}</span>
        </div>
    </div>
</div>
""")

st.markdown("---")
render_tutor_widget()
