import streamlit as st
import plotly.graph_objects as go
from lib.auth import require_auth
from lib.course import DAYS, get_all_exercises, get_badge, BADGES
from lib.db import get_progress, get_submissions
from lib.theme import inject_css, page_header, stat_cards, circular_progress, section_title, render_html
from lib.i18n import t
from lib.ai import render_tutor_widget

require_auth()
inject_css()

page_header(t("dashboard"), t("dashboard_sub"), "📊")

user_id = st.session_state.user["id"]
progress = get_progress(user_id)
submissions = get_submissions(user_id)
all_ex = get_all_exercises()

pts_ex = sum(progress.get(e["id"], {}).get("pontos", 0) for e in all_ex)
pts_sub = sum(s.get("pontos", 0) for s in submissions.values())
pts_total = pts_ex + pts_sub
completed = len([e for e in all_ex if e["id"] in progress or e["id"] in submissions])
total = len(all_ex)
pct = int(completed / total * 100) if total > 0 else 0
next_badge_threshold = next((threshold for threshold, _ in BADGES if threshold > pts_total), None)
remaining_to_next = max(next_badge_threshold - pts_total, 0) if next_badge_threshold is not None else 0
submitted_challenges = len(submissions)

render_html(f"""
<div class="info-hero">
    <div class="hero-copy">
        <div class="hero-kicker">{t('dashboard_kicker')}</div>
        <h2 class="hero-title">{t('dashboard')}</h2>
        <p>{t('dashboard_focus')}</p>
        <p class="hero-subtle">{submitted_challenges} {t('dashboard_challenges_done')} · {remaining_to_next if next_badge_threshold is not None else 0} {t('dashboard_points_to_next') if next_badge_threshold is not None else t('dashboard_top_level')}</p>
    </div>
    <div class="meta-grid">
        <div class="meta-card">
            <span class="meta-value">{completed}/{total}</span>
            <span class="meta-label">{t('completed')}</span>
        </div>
        <div class="meta-card">
            <span class="meta-value">{pts_total}</span>
            <span class="meta-label">{t('total_points')}</span>
        </div>
        <div class="meta-card">
            <span class="meta-value">{get_badge(pts_total)}</span>
            <span class="meta-label">{t('badge')}</span>
        </div>
    </div>
</div>
""")

# Top row: stats + circular progress
col_stats, col_circle = st.columns([3, 1])
with col_stats:
    stat_cards([
        {"value": str(pts_total), "label": t("total_points"), "icon": "⭐"},
        {"value": f"{completed}/{total}", "label": t("completed"), "icon": "✓"},
        {"value": get_badge(pts_total), "label": t("badge"), "icon": "🏆"},
    ])
with col_circle:
    render_html('<div class="progress-card-shell">')
    circular_progress(pct, t("complete"))
    render_html('</div>')

st.markdown("")

# --- Progress by day ---
col_chart, col_badge = st.columns([3, 1])

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

    fig = go.Figure()
    fig.add_trace(go.Bar(
        name=t("chart_complete"), x=days_labels, y=days_done,
        marker_color="#3B82F6", marker_cornerradius=6,
    ))
    fig.add_trace(go.Bar(
        name=t("chart_total"), x=days_labels, y=days_total,
        marker_color="#E2E8F0", marker_cornerradius=6,
    ))
    fig.update_layout(
        barmode="overlay", height=320,
        margin=dict(t=10, b=40, l=40, r=20),
        legend=dict(orientation="h", y=1.12, font=dict(size=12)),
        plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)",
        xaxis=dict(showgrid=False),
        yaxis=dict(showgrid=True, gridcolor="#F1F5F9", gridwidth=1),
        font=dict(family="Source Sans 3, sans-serif", color="#475569"),
    )
    with st.container(border=True):
        st.plotly_chart(fig, use_container_width=True)

with col_badge:
    section_title(t("levels"), "🎖", "indigo")
    with st.container(border=True):
        for threshold, name in BADGES:
            if pts_total >= threshold:
                render_html(f'''
                <div style="display:flex; align-items:center; gap:8px; padding:6px 0;">
                    <span class="badge-pill emerald">{name}</span>
                    <span style="color:#64748B; font-size:0.72rem;">{threshold}+</span>
                </div>''')
            else:
                render_html(f'''
                <div style="display:flex; align-items:center; gap:8px; padding:6px 0; opacity:0.4;">
                    <span class="badge-pill slate">{name}</span>
                    <span style="color:#CBD5E1; font-size:0.72rem;">{threshold}+</span>
                </div>''')

# --- Points breakdown ---
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
            render_html(f'''
            <div class="todo-card {'completed' if done else ''}">
                <div class="todo-card-checkbox">{status_icon}</div>
                <div class="todo-card-content">
                    <div class="todo-card-header">
                        <h4>{ex["titulo"]}</h4>
                        <span class="badge-pill {badge_cls}">{pts}/{ex["pontos"]} pts</span>
                    </div>
                </div>
            </div>''')

        d = day["desafio"]
        done_d = d["id"] in progress or d["id"] in submissions
        pts_d = submissions.get(d["id"], progress.get(d["id"], {})).get("pontos", 0) if done_d else 0
        badge_cls = "emerald" if done_d else "indigo"
        status_icon = "🏆" if done_d else "○"
        render_html(f'''
        <div class="todo-card {'completed' if done_d else ''}">
            <div class="todo-card-checkbox">{status_icon}</div>
            <div class="todo-card-content">
                <div class="todo-card-header">
                    <h4>{t('challenge')}: {d["titulo"]}</h4>
                    <span class="badge-pill {badge_cls}">{pts_d}/{d["pontos"]} pts</span>
                </div>
            </div>
        </div>''')

render_html('</div>')

st.markdown("---")
render_tutor_widget()
