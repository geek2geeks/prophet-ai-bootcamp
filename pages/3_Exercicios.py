import streamlit as st
from lib.auth import require_auth, is_admin
from lib.course import DAYS
from lib.db import get_progress, set_exercise_complete, set_exercise_incomplete, submit_challenge, get_submissions
from lib.theme import inject_css, page_header, section_title

require_auth()
inject_css()

page_header("Exercicios & Desafios", "Marca os exercicios como completos e submete os desafios diarios", "✏️")

user_id = st.session_state.user["id"]
progress = get_progress(user_id)
submissions = get_submissions(user_id)

# Day selector
day_options = [f"Dia {d['dia']} — {d['titulo']}" for d in DAYS]
selected = st.selectbox("Seleciona o dia", day_options)
day_idx = day_options.index(selected)
day = DAYS[day_idx]

# Day header card
n_total = len(day["exercicios"]) + 1
n_done = sum(1 for ex in day["exercicios"] if ex["id"] in progress)
n_done += 1 if day["desafio"]["id"] in submissions or day["desafio"]["id"] in progress else 0

st.markdown(f"""
<div style="background:linear-gradient(135deg,#EFF6FF,#F5F3FF); border-radius:14px; padding:18px 24px; margin:8px 0 20px;
            display:flex; align-items:center; justify-content:space-between;">
    <div>
        <div style="font-weight:800; color:#0F172A; font-size:1.15rem;">Dia {day['dia']} — {day['titulo']}</div>
        <div style="color:#64748B; font-size:0.85rem; margin-top:4px;">{day['objetivo']}</div>
    </div>
    <div style="text-align:center; padding-left:20px;">
        <div style="font-size:1.8rem; font-weight:800; color:#3B82F6;">{n_done}/{n_total}</div>
        <div style="font-size:0.7rem; color:#64748B; text-transform:uppercase; font-weight:600;">Tarefas</div>
    </div>
</div>
""", unsafe_allow_html=True)

# --- Exercises ---
section_title("Exercicios", "📝", "#DBEAFE", "#1D4ED8")

for ex in day["exercicios"]:
    is_done = ex["id"] in progress

    col1, col2 = st.columns([5, 1])
    with col1:
        new_state = st.checkbox(
            f"**{ex['titulo']}** ({ex['pontos']} pts)",
            value=is_done,
            key=f"cb_{ex['id']}",
            help=ex["descricao"]
        )
    with col2:
        if is_done:
            st.markdown(f'<span class="badge-pill green" style="margin-top:8px;">✓ {ex["pontos"]} pts</span>', unsafe_allow_html=True)
        else:
            st.markdown(f'<span class="badge-pill blue" style="margin-top:8px; opacity:0.5;">{ex["pontos"]} pts</span>', unsafe_allow_html=True)

    if new_state != is_done:
        if new_state:
            set_exercise_complete(user_id, ex["id"], ex["pontos"])
        else:
            set_exercise_incomplete(user_id, ex["id"])
        st.rerun()

    st.caption(ex["descricao"])
    st.markdown('<div style="border-bottom:1px solid #F1F5F9; margin:4px 0 12px;"></div>', unsafe_allow_html=True)

# --- Challenge ---
section_title("Desafio do Dia", "🏆", "#EDE9FE", "#5B21B6")
d = day["desafio"]

st.markdown(f"""
<div class="pro-card" style="border-left:4px solid #8B5CF6; margin-bottom:16px;">
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
        <span class="badge-pill purple">{d["pontos"]} pts</span>
        <strong style="color:#0F172A; font-size:1rem;">{d["titulo"]}</strong>
    </div>
    <div style="color:#64748B; font-size:0.88rem; line-height:1.5;">{d["descricao"]}</div>
</div>
""", unsafe_allow_html=True)

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
            st.success(f"✅ Submetido — {existing_sub.get('pontos', 0)} pts atribuidos")

    submitted = st.form_submit_button("Submeter Desafio", use_container_width=True)
    if submitted and repo_url:
        submit_challenge(user_id, d["id"], repo_url, pontos)
        st.success("Desafio submetido!")
        st.rerun()
