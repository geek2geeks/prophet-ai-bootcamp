import streamlit as st
import plotly.graph_objects as go
from lib.auth import require_auth
from lib.course import DAYS, get_all_exercises, get_badge, BADGES
from lib.db import get_progress, get_submissions
from lib.theme import inject_css, page_header, stat_cards

require_auth()
inject_css()

page_header("Dashboard", "A tua visao geral de progresso no bootcamp")

user_id = st.session_state.user["id"]
progress = get_progress(user_id)
submissions = get_submissions(user_id)
all_ex = get_all_exercises()

pts_ex = sum(progress.get(e["id"], {}).get("pontos", 0) for e in all_ex)
pts_sub = sum(s.get("pontos", 0) for s in submissions.values())
pts_total = pts_ex + pts_sub
completed = len([e for e in all_ex if e["id"] in progress or e["id"] in submissions])
total = len(all_ex)

stat_cards([
    {"value": str(pts_total), "label": "Pontos Total", "color": "blue"},
    {"value": f"{completed}/{total}", "label": "Exercicios Completos", "color": "green"},
    {"value": get_badge(pts_total), "label": "Badge Atual", "color": "purple"},
    {"value": f"{pts_ex} / {pts_sub}", "label": "Exercicios / Desafios", "color": "amber"},
])

st.markdown("")

# --- Progress by day ---
col_chart, col_badge = st.columns([3, 1])

with col_chart:
    st.markdown("#### Progresso por Dia")
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
        barmode="overlay",
        height=340,
        margin=dict(t=10, b=40, l=40, r=20),
        legend=dict(orientation="h", y=1.12, font=dict(size=12)),
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        xaxis=dict(showgrid=False),
        yaxis=dict(showgrid=True, gridcolor="#F1F5F9", gridwidth=1),
        font=dict(family="Inter, sans-serif", color="#475569"),
    )
    st.plotly_chart(fig, use_container_width=True)

with col_badge:
    st.markdown("#### Niveis")
    for threshold, name in BADGES:
        if pts_total >= threshold:
            st.markdown(f'<div style="padding:6px 0;"><span class="badge-pill green">{name}</span> <span style="color:#94A3B8; font-size:0.75rem;">{threshold}+ pts</span></div>', unsafe_allow_html=True)
        else:
            st.markdown(f'<div style="padding:6px 0;"><span class="badge-pill blue" style="opacity:0.5;">{name}</span> <span style="color:#CBD5E1; font-size:0.75rem;">{threshold}+ pts</span></div>', unsafe_allow_html=True)

# --- Points breakdown ---
st.markdown("---")
st.markdown("#### Detalhe de Pontos")

for day in DAYS:
    with st.expander(f"Dia {day['dia']} -- {day['titulo']}"):
        for ex in day["exercicios"]:
            done = ex["id"] in progress
            pts = progress.get(ex["id"], {}).get("pontos", 0) if done else 0
            if done:
                st.markdown(f'<div style="padding:4px 0;"><span class="badge-pill green">OK</span> {ex["titulo"]} -- <strong>{pts}/{ex["pontos"]}</strong> pts</div>', unsafe_allow_html=True)
            else:
                st.markdown(f'<div style="padding:4px 0; color:#94A3B8;">{ex["titulo"]} -- 0/{ex["pontos"]} pts</div>', unsafe_allow_html=True)

        d = day["desafio"]
        done_d = d["id"] in progress or d["id"] in submissions
        pts_d = submissions.get(d["id"], progress.get(d["id"], {})).get("pontos", 0) if done_d else 0
        if done_d:
            st.markdown(f'<div style="padding:4px 0;"><span class="badge-pill purple">DESAFIO</span> {d["titulo"]} -- <strong>{pts_d}/{d["pontos"]}</strong> pts</div>', unsafe_allow_html=True)
        else:
            st.markdown(f'<div style="padding:4px 0; color:#94A3B8;">DESAFIO: {d["titulo"]} -- 0/{d["pontos"]} pts</div>', unsafe_allow_html=True)
