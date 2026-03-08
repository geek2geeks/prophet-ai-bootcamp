import streamlit as st
from streamlit.errors import StreamlitAPIException
from lib.auth import require_auth
from lib.course import DAYS, get_all_exercises, get_badge, BADGES
from lib.db import get_progress, get_submissions
from lib.theme import inject_css, page_header, section_title, render_html
from lib.i18n import t
from lib.ai import render_tutor_widget

require_auth()
inject_css()

page_header(t("dashboard"), t("dashboard_sub"), "📊")

user_id = st.session_state.user["id"]
progress = get_progress(user_id)
submissions = get_submissions(user_id)
all_ex = get_all_exercises()


def open_program_week(week_index: int):
    st.session_state.programa_target_week = week_index
    for target in ("pages/2_Programa.py", "2_Programa.py"):
        try:
            st.switch_page(target)
            return
        except StreamlitAPIException:
            continue

pts_ex = sum(progress.get(e["id"], {}).get("pontos", 0) for e in all_ex)
pts_sub = sum(s.get("pontos", 0) for s in submissions.values())
pts_total = pts_ex + pts_sub
completed = len([e for e in all_ex if e["id"] in progress or e["id"] in submissions])
total = len(all_ex)
pct = int(completed / total * 100) if total > 0 else 0
badge = get_badge(pts_total)
next_badge_threshold = next((threshold for threshold, _ in BADGES if threshold > pts_total), None)
remaining_to_next = max(next_badge_threshold - pts_total, 0) if next_badge_threshold is not None else 0
submitted_challenges = len(submissions)

week_progress = []
for week_idx, label in [(0, t("pre_bootcamp")), (1, t("week_1")), (2, t("week_2"))]:
    days = [d for d in DAYS if d["semana"] == week_idx]
    total_items = sum(len(d["exercicios"]) + 1 for d in days)
    done_items = 0
    for day in days:
        done_items += sum(1 for ex in day["exercicios"] if ex["id"] in progress)
        done_items += 1 if day["desafio"]["id"] in progress or day["desafio"]["id"] in submissions else 0
    week_progress.append((label, done_items, total_items))

if pct < 25:
    current_focus = t("dashboard_stage_1")
    next_action = t("dashboard_next_action_stage_1")
elif pct < 50:
    current_focus = t("dashboard_stage_2")
    next_action = t("dashboard_next_action_stage_2")
elif pct < 80:
    current_focus = t("dashboard_stage_3")
    next_action = t("dashboard_next_action_stage_3")
else:
    current_focus = t("dashboard_stage_4")
    next_action = t("dashboard_next_action_stage_4")

render_html(f"""
<div class="dashboard-hero founder-dashboard-hero">
    <div class="dashboard-hero-copy">
        <div class="dashboard-kicker">{t('dashboard_kicker')}</div>
        <h1>{t('dashboard')}</h1>
        <p>{t('dashboard_focus')}</p>
        <div class="dashboard-chip-row">
            <span class="dashboard-chip">⚡ {pts_total} XP</span>
            <span class="dashboard-chip">🏆 {badge}</span>
            <span class="dashboard-chip">🚀 {submitted_challenges} {t('dashboard_challenges_done')}</span>
        </div>
    </div>
    <div class="dashboard-progress-card founder-progress-card">
        <div class="dashboard-progress-label">{t('completion_rate')}</div>
        <div class="dashboard-progress-value">{pct}%</div>
        <div class="dashboard-progress-meta">{completed}/{total} {t('tasks_submitted')}</div>
    </div>
</div>

<div class="founder-focus-grid">
    <div class="insight-card founder-focus-card">
        <span class="hero-kicker">{t('dashboard_focus_title')}</span>
        <h3>{current_focus}</h3>
        <p>{t('progress_msg', done=completed, total=total)}</p>
    </div>
    <div class="insight-card founder-focus-card">
        <span class="hero-kicker">{t('dashboard_next_action')}</span>
        <h3>{remaining_to_next if next_badge_threshold is not None else 0} pts</h3>
        <p>{next_action if next_badge_threshold is not None else t('dashboard_top_state_copy')}</p>
    </div>
    <div class="insight-card founder-focus-card">
        <span class="hero-kicker">{t('dashboard_launch_title')}</span>
        <h3>{min(pct, 100)}%</h3>
        <p>{t('dashboard_launch_copy')}</p>
    </div>
</div>
""")

section_title(t("dashboard_stage_title"), "🧭", "amber")
render_html(f"""
<div class="founder-stage-grid">
    <div class="founder-stage-card">
        <span class="founder-step">01</span>
        <strong>{t('dashboard_stage_1')}</strong>
        <p>{week_progress[0][1]}/{week_progress[0][2]} {t('complete')}</p>
    </div>
    <div class="founder-stage-card">
        <span class="founder-step">02</span>
        <strong>{t('dashboard_stage_2')}</strong>
        <p>{week_progress[1][1]}/{week_progress[1][2]} {t('complete')}</p>
    </div>
    <div class="founder-stage-card">
        <span class="founder-step">03</span>
        <strong>{t('dashboard_stage_3')}</strong>
        <p>{week_progress[2][1]}/{week_progress[2][2]} {t('complete')}</p>
    </div>
    <div class="founder-stage-card">
        <span class="founder-step">04</span>
        <strong>{t('dashboard_stage_4')}</strong>
        <p>{submitted_challenges} {t('dashboard_launches_in_motion')}</p>
    </div>
</div>
""")

section_title(t("featured_modules"), "📚", "indigo")
render_html('<div class="week-grid">')
for idx, (label, done_items, total_items) in enumerate(week_progress):
    desc = [t("pre_bootcamp_desc"), t("week1_desc"), t("week2_desc")][idx]
    icon = ["🛠️", "⚡", "🚀"][idx]
    accent = ["amber", "emerald", "indigo"][idx]
    pct_week = int((done_items / total_items) * 100) if total_items else 0
    render_html(f"""
    <div class="week-card founder-week-card">
        <div class="week-card-top">
            <div class="week-card-icon">{icon}</div>
            <span class="badge-pill {accent}">{done_items}/{total_items}</span>
        </div>
        <h4>{label}</h4>
        <p>{desc}</p>
        <div class="week-card-progress">
            <span>{t('progress')}</span>
            <span>{pct_week}%</span>
        </div>
    </div>
    """)
render_html('</div>')

section_title(t("dashboard_lessons_title"), "➡️", "rose")
hero_cta_cols = st.columns([2, 1, 1, 1], gap="small")
with hero_cta_cols[0]:
    if st.button(f"▶ {t('dashboard_lessons_open_now')}", width="stretch", key="open_lessons_now"):
        open_program_week(1)
with hero_cta_cols[1]:
    if st.button(f"📝 {t('dashboard_go_exercises')}", width="stretch", key="open_exercises_top"):
        for target in ("pages/3_Exercicios.py", "3_Exercicios.py"):
            try:
                st.switch_page(target)
                break
            except StreamlitAPIException:
                continue
with hero_cta_cols[2]:
    if st.button(f"🛠 {t('dashboard_lessons_pre_bootcamp_short')}", width="stretch", key="open_lessons_pre_top"):
        open_program_week(0)
with hero_cta_cols[3]:
    if st.button(f"🚀 {t('dashboard_lessons_week_2_short')}", width="stretch", key="open_lessons_week2_top"):
        open_program_week(2)

render_html(f'<p class="hero-note" style="margin:0.55rem 0 1rem 0;">{t("dashboard_lessons_help_text")}</p>')

nav_cols = st.columns(3, gap="small")
for idx, col in enumerate(nav_cols):
    with col:
        label = [
            f"🛠 {t('dashboard_lessons_open_pre_bootcamp')}",
            f"⚡ {t('dashboard_lessons_open_week_1')}",
            f"🚀 {t('dashboard_lessons_open_week_2')}",
        ][idx]
        if st.button(label, width="stretch", key=f"goto_week_{idx}"):
            open_program_week(idx)

action_cols = st.columns(3, gap="large")
for idx, col in enumerate(action_cols):
    label = [t("pre_bootcamp"), t("week_1"), t("week_2")][idx]
    desc = [t("pre_bootcamp_desc"), t("week1_desc"), t("week2_desc")][idx]
    done_items = week_progress[idx][1]
    total_items = week_progress[idx][2]
    pct_week = int((done_items / total_items) * 100) if total_items else 0
    accent = ["amber", "emerald", "indigo"][idx]
    with col:
        render_html(f"""
        <div class="week-card founder-week-card founder-action-card">
            <div class="week-card-top">
                <span class="badge-pill {accent}">{done_items}/{total_items}</span>
                <span style="font-size:0.8rem; font-weight:800; color:#64748B;">{pct_week}%</span>
            </div>
            <h4>{label}</h4>
            <p>{desc}</p>
            <p style="margin-top:0.7rem; font-weight:700; color:#F05A37 !important;">{t('dashboard_lessons_open_this_week')}</p>
        </div>
        """)
        if st.button(f"{t('dashboard_lessons_open_prefix')} {label}", width="stretch", key=f"open_program_card_{idx}"):
            open_program_week(idx)

col_chart, col_levels = st.columns([1.75, 1], gap="large")

with col_chart:
    section_title(t("progress_by_day"), "📈", "indigo")
    days_labels = []
    days_done = []
    days_total = []
    for day in DAYS:
        n = len(day["exercicios"]) + 1
        d = sum(1 for ex in day["exercicios"] if ex["id"] in progress)
        d += 1 if day["desafio"]["id"] in progress or day["desafio"]["id"] in submissions else 0
        days_labels.append(f"{t('day')} {day['dia']}")
        days_done.append(d)
        days_total.append(n)

    with st.container(border=True):
        try:
            import plotly.graph_objects as go

            fig = go.Figure()
            fig.add_trace(go.Bar(
                name=t("chart_total"), x=days_labels, y=days_total,
                marker_color="rgba(18, 38, 63, 0.14)", marker_cornerradius=8,
            ))
            fig.add_trace(go.Bar(
                name=t("chart_complete"), x=days_labels, y=days_done,
                marker_color="#F05A37", marker_cornerradius=8,
            ))
            fig.update_layout(
                barmode="overlay",
                height=320,
                margin=dict(t=10, b=30, l=25, r=20),
                legend=dict(orientation="h", y=1.12, font=dict(size=12)),
                plot_bgcolor="rgba(0,0,0,0)",
                paper_bgcolor="rgba(0,0,0,0)",
                xaxis=dict(showgrid=False),
                yaxis=dict(showgrid=True, gridcolor="#F1F5F9", gridwidth=1),
                font=dict(family="Source Sans 3, sans-serif", color="#475569"),
            )
            st.plotly_chart(fig, width="stretch")
        except ModuleNotFoundError:
            render_html('<div class="grading-stack">')
            for label, done_count, total_count in zip(days_labels, days_done, days_total):
                pct_day = int((done_count / total_count) * 100) if total_count else 0
                render_html(f"""
                <div class="grading-card">
                    <div>
                        <strong>{label}</strong>
                        <p>{done_count}/{total_count} {t('completed').lower()}</p>
                    </div>
                    <div class="grading-card-side">
                        <span class="grading-card-points">{pct_day}%</span>
                        <span class="badge-pill amber">fallback</span>
                    </div>
                </div>
                """)
            render_html('</div>')

with col_levels:
    section_title(t("levels"), "🎖", "indigo")
    render_html('<div class="details-card-shell founder-level-shell">')
    for threshold, name in BADGES:
        state_cls = "emerald" if pts_total >= threshold else "slate"
        opacity = "1" if pts_total >= threshold else "0.42"
        render_html(f"""
        <div style="display:flex; align-items:center; justify-content:space-between; gap:0.6rem; padding:0.45rem 0; opacity:{opacity};">
            <span class="badge-pill {state_cls}">{name}</span>
            <span style="color:#64748B; font-size:0.75rem;">{threshold}+</span>
        </div>
        """)
    render_html('</div>')

st.markdown("---")
section_title(t("points_detail"), "📋", "emerald")
render_html('<div class="details-card-shell">')
for day in DAYS:
    with st.expander(f"{t('day')} {day['dia']} — {day['titulo']}"):
        for ex in day["exercicios"]:
            done = ex["id"] in progress
            pts = progress.get(ex["id"], {}).get("pontos", 0) if done else 0
            badge_cls = "emerald" if done else "slate"
            status_icon = "✅" if done else "○"
            render_html(f"""
            <div class="todo-card {'completed' if done else ''}">
                <div class="todo-card-checkbox">{status_icon}</div>
                <div class="todo-card-content">
                    <div class="todo-card-header">
                        <h4>{ex['titulo']}</h4>
                        <span class="badge-pill {badge_cls}">{pts}/{ex['pontos']} pts</span>
                    </div>
                </div>
            </div>
            """)

        d = day["desafio"]
        done_d = d["id"] in progress or d["id"] in submissions
        pts_d = submissions.get(d["id"], progress.get(d["id"], {})).get("pontos", 0) if done_d else 0
        badge_cls = "emerald" if done_d else "indigo"
        status_icon = "🏆" if done_d else "○"
        render_html(f"""
        <div class="todo-card {'completed' if done_d else ''}">
            <div class="todo-card-checkbox">{status_icon}</div>
            <div class="todo-card-content">
                <div class="todo-card-header">
                    <h4>{t('challenge')}: {d['titulo']}</h4>
                    <span class="badge-pill {badge_cls}">{pts_d}/{d['pontos']} pts</span>
                </div>
            </div>
        </div>
        """)
render_html('</div>')

st.markdown("---")
render_tutor_widget()
