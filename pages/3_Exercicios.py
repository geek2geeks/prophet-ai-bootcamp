import streamlit as st
from lib.auth import require_auth, is_admin
from lib.course import DAYS
from lib.db import get_progress, set_exercise_complete, set_exercise_incomplete, submit_challenge, get_submissions
from lib.theme import inject_css, page_header

require_auth()
inject_css()

page_header("Exercicios & Desafios", "Marca os exercicios como completos e submete os desafios diarios")

user_id = st.session_state.user["id"]
progress = get_progress(user_id)
submissions = get_submissions(user_id)

# Day selector
day_options = [f"Dia {d['dia']} -- {d['titulo']}" for d in DAYS]
selected = st.selectbox("Seleciona o dia", day_options)
day_idx = day_options.index(selected)
day = DAYS[day_idx]

st.markdown(f"#### Dia {day['dia']} -- {day['titulo']}")
st.caption(day["objetivo"])

# --- Exercises ---
st.markdown("##### Exercicios")

for ex in day["exercicios"]:
    col1, col2 = st.columns([4, 1])
    is_done = ex["id"] in progress

    with col1:
        new_state = st.checkbox(
            f"**{ex['titulo']}** ({ex['pontos']} pts)",
            value=is_done,
            key=f"cb_{ex['id']}",
            help=ex["descricao"]
        )

    with col2:
        if is_done:
            st.markdown(f'<span class="badge-pill green">{ex["pontos"]} pts</span>', unsafe_allow_html=True)
        else:
            st.caption("--")

    if new_state != is_done:
        if new_state:
            set_exercise_complete(user_id, ex["id"], ex["pontos"])
        else:
            set_exercise_incomplete(user_id, ex["id"])
        st.rerun()

    st.caption(ex["descricao"])
    st.markdown("---")

# --- Challenge ---
st.markdown("##### Desafio do Dia")
d = day["desafio"]
st.markdown(f'<div style="padding:8px 0;"><span class="badge-pill purple">{d["pontos"]} pts</span> <strong>{d["titulo"]}</strong></div>', unsafe_allow_html=True)
st.caption(d["descricao"])

existing_sub = submissions.get(d["id"], {})

with st.form(f"challenge_{d['id']}"):
    repo_url = st.text_input(
        "URL do repositorio GitHub",
        value=existing_sub.get("repo_url", ""),
        placeholder="https://github.com/teu-user/prophet-ai-teu-nome"
    )

    if is_admin():
        pontos = st.slider("Pontos (admin)", 0, d["pontos"], existing_sub.get("pontos", 0))
    else:
        pontos = d["pontos"]
        if existing_sub:
            st.success(f"Submetido -- {existing_sub.get('pontos', 0)} pts atribuidos")

    submitted = st.form_submit_button("Submeter Desafio", use_container_width=True)
    if submitted and repo_url:
        submit_challenge(user_id, d["id"], repo_url, pontos)
        st.success("Desafio submetido!")
        st.rerun()
