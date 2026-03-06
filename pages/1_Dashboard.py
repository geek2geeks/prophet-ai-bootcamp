import streamlit as st
import plotly.graph_objects as go
from lib.auth import require_auth
from lib.course import DAYS, get_all_exercises, get_badge, BADGES
from lib.db import get_progress, get_submissions

require_auth()

st.header("Dashboard do Aluno")

user_id = st.session_state.user["id"]
progress = get_progress(user_id)
submissions = get_submissions(user_id)
all_ex = get_all_exercises()

pts_ex = sum(progress.get(e["id"], {}).get("pontos", 0) for e in all_ex)
pts_sub = sum(s.get("pontos", 0) for s in submissions.values())
pts_total = pts_ex + pts_sub
completed = len([e for e in all_ex if e["id"] in progress or e["id"] in submissions])
total = len(all_ex)

# --- Metrics row ---
c1, c2, c3, c4 = st.columns(4)
c1.metric("Pontos Total", pts_total, help="Exercicios + Desafios")
c2.metric("Exercicios", f"{completed}/{total}")
c3.metric("Badge", get_badge(pts_total))
c4.metric("Pontos Exercicios / Desafios", f"{pts_ex} / {pts_sub}")

st.markdown("---")

# --- Progress by day ---
col_chart, col_badge = st.columns([3, 1])

with col_chart:
    st.subheader("Progresso por Dia")
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
    fig.add_trace(go.Bar(name="Completo", x=days_labels, y=days_done,
                         marker_color="#2E86C1"))
    fig.add_trace(go.Bar(name="Total", x=days_labels, y=days_total,
                         marker_color="#D5DBDB"))
    fig.update_layout(barmode="overlay", height=350, margin=dict(t=20, b=40),
                      legend=dict(orientation="h", y=1.1))
    st.plotly_chart(fig, use_container_width=True)

with col_badge:
    st.subheader("Niveis")
    for threshold, name in BADGES:
        if pts_total >= threshold:
            st.markdown(f"**✅ {name}** ({threshold}+ pts)")
        else:
            st.markdown(f"⬜ {name} ({threshold}+ pts)")

# --- Points breakdown ---
st.markdown("---")
st.subheader("Detalhe de Pontos")

for day in DAYS:
    with st.expander(f"Dia {day['dia']} — {day['titulo']}"):
        for ex in day["exercicios"]:
            done = ex["id"] in progress
            pts = progress.get(ex["id"], {}).get("pontos", 0) if done else 0
            icon = "✅" if done else "⬜"
            st.markdown(f"{icon} {ex['titulo']} — **{pts}/{ex['pontos']}** pts")

        d = day["desafio"]
        done_d = d["id"] in progress or d["id"] in submissions
        pts_d = submissions.get(d["id"], progress.get(d["id"], {})).get("pontos", 0) if done_d else 0
        icon = "✅" if done_d else "⬜"
        st.markdown(f"{icon} **DESAFIO:** {d['titulo']} — **{pts_d}/{d['pontos']}** pts")
