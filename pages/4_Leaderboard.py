import streamlit as st
import pandas as pd
from lib.auth import require_auth
from lib.course import get_badge, get_all_exercises
from lib.db import get_leaderboard, get_progress, get_submissions

require_auth()

st.header("Leaderboard")
st.caption("Ranking dos alunos por pontuacao total")

data = get_leaderboard()

if data:
    df = pd.DataFrame(data)
    if "pontos_total" in df.columns:
        df = df.sort_values("pontos_total", ascending=False).reset_index(drop=True)
        df.index += 1
        df.index.name = "Rank"
        df["badge"] = df["pontos_total"].apply(get_badge)

        cols_display = ["nome", "pontos_exercicios", "pontos_desafios", "pontos_total", "badge"]
        cols_available = [c for c in cols_display if c in df.columns]
        st.dataframe(
            df[cols_available].rename(columns={
                "nome": "Nome",
                "pontos_exercicios": "Pts Exercicios",
                "pontos_desafios": "Pts Desafios",
                "pontos_total": "Total",
                "badge": "Badge"
            }),
            use_container_width=True
        )
    else:
        st.info("Sem dados de ranking ainda.")
else:
    st.info("Ainda nao ha dados no leaderboard. Completa exercicios para aparecer aqui!")

# --- Personal stats ---
st.markdown("---")
st.subheader("As Tuas Estatisticas")

user_id = st.session_state.user["id"]
progress = get_progress(user_id)
submissions = get_submissions(user_id)
all_ex = get_all_exercises()

pts_total = (sum(progress.get(e["id"], {}).get("pontos", 0) for e in all_ex)
             + sum(s.get("pontos", 0) for s in submissions.values()))
completed = len([e for e in all_ex if e["id"] in progress or e["id"] in submissions])

c1, c2, c3 = st.columns(3)
c1.metric("Total Pontos", pts_total)
c2.metric("Exercicios Completos", f"{completed}/{len(all_ex)}")
c3.metric("Badge Atual", get_badge(pts_total))
