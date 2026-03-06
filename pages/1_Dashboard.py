import streamlit as st
import plotly.graph_objects as go
from lib.auth import require_auth
from lib.course import DAYS, get_all_exercises, get_badge, BADGES
from lib.db import get_progress, get_submissions
from lib.theme import inject_css, page_header, stat_cards, circular_progress, section_title

require_auth()
inject_css()

page_header("Dashboard", "A tua visao geral de progresso no bootcamp", "📊")

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

# Top row: stats + circular progress
col_stats, col_circle = st.columns([3, 1])
with col_stats:
    stat_cards([
        {"value": str(pts_total), "label": "Pontos Total", "color": "blue", "icon": "⭐"},
        {"value": f"{completed}/{total}", "label": "Completos", "color": "green", "icon": "✓"},
        {"value": get_badge(pts_total), "label": "Badge", "color": "purple", "icon": "🏆"},
    ])
with col_circle:
    st.markdown("")
    circular_progress(pct, "completo")

st.markdown("")

# --- Progress by day ---
col_chart, col_badge = st.columns([3, 1])

with col_chart:
    section_title("Progresso por Dia", "📈", "#DBEAFE", "#1D4ED8")
    days_labels = []
    days_done = []
    days_total = []
    for day in DAYS:
        n = len(day["exercicios"]) + 1
        d = sum(1 for ex in day["exercicios"] if ex["id"] in progress)
        d += 1 if day["desafio"]["id"] in progress or day["desafio"]["id"] in submissions else 0
        days_labels.append(f"Dia {day['dia']}")
        days_done.append(d)
        days_total.append(n)

    fig = go.Figure()
    fig.add_trace(go.Bar(
        name="Completo", x=days_labels, y=days_done,
        marker_color="#3B82F6", marker_cornerradius=6,
    ))
    fig.add_trace(go.Bar(
        name="Total", x=days_labels, y=days_total,
        marker_color="#E2E8F0", marker_cornerradius=6,
    ))
    fig.update_layout(
        barmode="overlay", height=320,
        margin=dict(t=10, b=40, l=40, r=20),
        legend=dict(orientation="h", y=1.12, font=dict(size=12)),
        plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)",
        xaxis=dict(showgrid=False),
        yaxis=dict(showgrid=True, gridcolor="#F1F5F9", gridwidth=1),
        font=dict(family="Inter, sans-serif", color="#475569"),
    )
    st.plotly_chart(fig, use_container_width=True)

with col_badge:
    section_title("Niveis", "🎖", "#EDE9FE", "#5B21B6")
    for threshold, name in BADGES:
        if pts_total >= threshold:
            st.markdown(f'''
            <div style="display:flex; align-items:center; gap:8px; padding:6px 0;">
                <span class="badge-pill green">{name}</span>
                <span style="color:#64748B; font-size:0.72rem;">{threshold}+</span>
            </div>''', unsafe_allow_html=True)
        else:
            st.markdown(f'''
            <div style="display:flex; align-items:center; gap:8px; padding:6px 0; opacity:0.4;">
                <span class="badge-pill blue">{name}</span>
                <span style="color:#CBD5E1; font-size:0.72rem;">{threshold}+</span>
            </div>''', unsafe_allow_html=True)

# --- Points breakdown ---
st.markdown("---")
section_title("Detalhe de Pontos", "📋", "#D1FAE5", "#065F46")

for day in DAYS:
    with st.expander(f"Dia {day['dia']} — {day['titulo']}"):
        for ex in day["exercicios"]:
            done = ex["id"] in progress
            pts = progress.get(ex["id"], {}).get("pontos", 0) if done else 0
            status_cls = "done" if done else "todo"
            status_icon = "✅" if done else "○"
            st.markdown(f'''
            <div class="ex-card {status_cls}">
                <div class="ex-status {status_cls}">{status_icon}</div>
                <div class="ex-info">
                    <strong>{ex["titulo"]}</strong>
                    <p>{pts}/{ex["pontos"]} pontos</p>
                </div>
            </div>''', unsafe_allow_html=True)

        d = day["desafio"]
        done_d = d["id"] in progress or d["id"] in submissions
        pts_d = submissions.get(d["id"], progress.get(d["id"], {})).get("pontos", 0) if done_d else 0
        status_cls = "done" if done_d else "todo"
        status_icon = "🏆" if done_d else "○"
        st.markdown(f'''
        <div class="ex-card {status_cls}" style="border-left-color:#8B5CF6 !important;">
            <div class="ex-status {status_cls}" style="background:#EDE9FE;">{status_icon}</div>
            <div class="ex-info">
                <strong>DESAFIO: {d["titulo"]}</strong>
                <p>{pts_d}/{d["pontos"]} pontos</p>
            </div>
        </div>''', unsafe_allow_html=True)
