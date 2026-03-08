import streamlit as st
from lib.auth import require_auth, is_admin
from lib.course import DAYS
from lib.db import get_progress, set_exercise_complete, set_exercise_incomplete, submit_challenge, get_submissions
from lib.theme import inject_css, page_header, section_title, render_html
from lib.i18n import t
from lib.ai import render_tutor_widget

require_auth()
inject_css()

page_header(t("exercicios_title"), t("exercicios_sub"), "📝")

user_id = st.session_state.user["id"]
progress = get_progress(user_id)
submissions = get_submissions(user_id)

# Day selector
render_html('<div style="margin-bottom:24px;"></div>')
day_options = [f"{t('day')} {d['dia']} — {d['titulo']}" for d in DAYS]
selected = st.selectbox(t("select_day"), day_options, index=0, label_visibility="collapsed")
day_idx = day_options.index(selected)
day = DAYS[day_idx]

# Day header card
n_total = len(day["exercicios"]) + 1
n_done = sum(1 for ex in day["exercicios"] if ex["id"] in progress)
n_done += 1 if day["desafio"]["id"] in submissions or day["desafio"]["id"] in progress else 0

render_html(f"""
<div class="exercise-hero">
    <div class="hero-copy">
        <div class="hero-kicker">{t('exercise_sprint')}</div>
        <h2 class="hero-title">{t('day')} {day['dia']} — {day['titulo']}</h2>
        <p>{day['objetivo']}</p>
    </div>
    <div class="meta-grid">
        <div class="exercise-meta-card">
            <span class="exercise-meta-value">{n_done}/{n_total}</span>
            <span class="exercise-meta-label">{t('tasks_done')}</span>
        </div>
        <div class="exercise-meta-card">
            <span class="exercise-meta-value">{sum(ex['pontos'] for ex in day['exercicios'])}</span>
            <span class="exercise-meta-label">{t('exercise_checklist')}</span>
        </div>
        <div class="exercise-meta-card">
            <span class="exercise-meta-value">{day['desafio']['pontos']}</span>
            <span class="exercise-meta-label">{t('day_challenge')}</span>
        </div>
    </div>
</div>
""")

# --- Exercises ---
section_title(t("exercise_checklist"), "✅", "emerald")

for ex in day["exercicios"]:
    is_done = ex["id"] in progress

    with st.container():
        render_html(f"""
        <div class="exercise-item-card {'done' if is_done else ''}">
            <div class="exercise-item-top">
                <h4 class="exercise-title">{ex['titulo']}</h4>
                <span class="badge-pill {'emerald' if is_done else 'slate'}">{'✓ ' if is_done else ''}{ex['pontos']} pts</span>
            </div>
            <p class="exercise-desc">{ex['descricao']}</p>
        </div>
        """)
        col_check, col_status = st.columns([4, 1], vertical_alignment="center")
        with col_check:
            new_state = st.checkbox(t("mark_complete"), value=is_done, key=f"cb_{ex['id']}")
        with col_status:
            if is_done:
                render_html(f'<div class="exercise-status-chip">✓ {t("exercise_status_completed")}</div>')
            else:
                render_html(f'<div class="exercise-status-chip">○ {t("exercise_status_open")}</div>')

        if new_state != is_done:
            if new_state:
                set_exercise_complete(user_id, ex["id"], ex["pontos"])
            else:
                set_exercise_incomplete(user_id, ex["id"])
            st.rerun()

# --- Challenge ---
section_title(t("day_challenge"), "🏆", "indigo")
d = day["desafio"]

render_html(f"""
<div class="saas-card" style="border: 1px solid #FFD0C2; background: linear-gradient(135deg, #FFF0EA 0%, #FFFFFF 100%); margin-bottom: 24px;">
    <div class="exercise-challenge-top">
        <span class="badge-pill indigo" style="background:#4F46E5; color:white; border:none;">{d["pontos"]} pts</span>
        <h3 style="margin:0; color:#12263F; font-size:1.15rem;">{d["titulo"]}</h3>
    </div>
    <p style="margin:0; color:#5C6B7B; font-size:0.95rem; line-height:1.6;">{d["descricao"]}</p>
</div>
""")

existing_sub = submissions.get(d["id"], {})

with st.container():
    render_html('<div class="challenge-form-shell">')
    st.markdown(f"#### {t('submit_project')}")
    render_html(f"<p style='font-size:0.9rem; color:#64748B;'>{t('submit_description')}</p>")
    render_html(f"<p class='challenge-note'>{t('exercise_repo_hint')}</p>")
    with st.form(f"challenge_{d['id']}", border=False):
        repo_url = st.text_input(
            t("repo_label"),
            value=existing_sub.get("repo_url", ""),
            placeholder=t("repo_placeholder"),
            label_visibility="collapsed"
        )

        if is_admin():
            st.markdown("---")
            st.markdown(f"👑 **{t('admin_panel')}**")
            pontos = st.slider(t("assign_score"), 0, d["pontos"], existing_sub.get("pontos", 0))
        else:
            pontos = d["pontos"]
            if existing_sub:
                render_html(f"""
                <div style="margin-top:12px; padding:12px; background:#ECFDF5; border:1px solid #A7F3D0; border-radius:8px; display:flex; align-items:center; gap:12px;">
                    <span style="font-size:1.2rem;">✅</span>
                    <div>
                        <strong style="color:#065F46; font-size:0.9rem;">{t('project_submitted')}</strong><br/>
                        <span style="color:#047857; font-size:0.85rem;">{t('graded_msg', pts=existing_sub.get('pontos', 0), max=d['pontos'])}</span>
                    </div>
                </div>
                """)

        render_html('<div style="margin-top:16px;"></div>')
        submitted = st.form_submit_button(t("submit_btn"), width="stretch", type="primary")
        if submitted and repo_url:
            submit_challenge(user_id, d["id"], repo_url, pontos)
            st.success(t("submitted_success"))
            st.rerun()
    render_html('</div>')

st.markdown("---")
render_tutor_widget()
