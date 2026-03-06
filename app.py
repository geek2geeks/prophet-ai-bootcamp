import streamlit as st
from lib.auth import init_session, login, register, logout, is_demo_mode

st.set_page_config(
    page_title="Prophet AI Bootcamp",
    page_icon="📐",
    layout="wide",
    initial_sidebar_state="expanded"
)

init_session()

# --- Custom CSS ---
st.markdown("""
<style>
    .main-header { font-size: 2.4rem; font-weight: 700; color: #1B4F72; margin-bottom: 0; }
    .sub-header { font-size: 1.1rem; color: #5D6D7E; margin-top: -10px; }
    .metric-card {
        background: linear-gradient(135deg, #1B4F72 0%, #2E86C1 100%);
        padding: 20px; border-radius: 12px; color: white; text-align: center;
    }
    .metric-card h3 { margin: 0; font-size: 2rem; }
    .metric-card p { margin: 0; font-size: 0.85rem; opacity: 0.85; }
    .stButton > button { border-radius: 8px; }
</style>
""", unsafe_allow_html=True)

# --- Sidebar ---
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/graduation-cap.png", width=60)
    st.markdown("### Prophet AI Bootcamp")

    if st.session_state.user:
        st.success(f"**{st.session_state.user['email']}**")
        st.caption(f"Role: {st.session_state.role}")
        if is_demo_mode():
            st.info("Modo Demo (sem Supabase)")
        if st.button("Sair", use_container_width=True):
            logout()
            st.rerun()
    st.markdown("---")
    st.caption("© 2026 Prophet AI Bootcamp\npedro@stratfordgeek.com")

# --- Main Content ---
if st.session_state.user is None:
    # Login / Register
    st.markdown('<p class="main-header">Prophet AI Bootcamp</p>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">AI & Data Science para Atuarios — De Especialista de Risco a Fundador de SaaS Atuarial</p>', unsafe_allow_html=True)
    st.markdown("---")

    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        tab_login, tab_register = st.tabs(["Entrar", "Registar"])

        with tab_login:
            with st.form("login_form"):
                email = st.text_input("Email")
                password = st.text_input("Password", type="password")
                submitted = st.form_submit_button("Entrar", use_container_width=True)
                if submitted and email and password:
                    if login(email, password):
                        st.rerun()

        with tab_register:
            with st.form("register_form"):
                nome = st.text_input("Nome completo")
                email_r = st.text_input("Email", key="reg_email")
                password_r = st.text_input("Password", type="password", key="reg_pass")
                submitted_r = st.form_submit_button("Criar conta", use_container_width=True)
                if submitted_r and nome and email_r and password_r:
                    if register(email_r, password_r, nome):
                        st.rerun()

    # --- Landing info ---
    st.markdown("---")
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown('<div class="metric-card"><h3>10</h3><p>Dias de bootcamp</p></div>', unsafe_allow_html=True)
    with c2:
        st.markdown('<div class="metric-card"><h3>80h</h3><p>De formacao intensiva</p></div>', unsafe_allow_html=True)
    with c3:
        st.markdown('<div class="metric-card"><h3>1000</h3><p>Pontos possiveis</p></div>', unsafe_allow_html=True)
    with c4:
        st.markdown('<div class="metric-card"><h3>SaaS</h3><p>Produto final deployado</p></div>', unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("""
    ### O que vais construir

    O **Prophet AI** — um clone do FIS Prophet potenciado por Inteligencia Artificial:

    - **Motor de projecao Vida**: cash flows, reservas V(t), profit testing para 4 produtos
    - **Agentes LLM**: auditoria de sinistros, cenarios de stress, explicacoes em linguagem natural
    - **RBAC**: controlo de acessos com Supabase (Admin, Atuario, Analista, Auditor)
    - **SaaS deployado**: interface Streamlit Cloud, pronto para os teus primeiros clientes

    > *"O teu conhecimento atuarial levou anos a construir. A IA so precisa de dias para o empacotar."*
    """)

else:
    # Logged in — Home dashboard
    st.markdown('<p class="main-header">Bem-vindo ao Prophet AI Bootcamp</p>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Usa o menu lateral para navegar entre as paginas do curso.</p>', unsafe_allow_html=True)
    st.markdown("---")

    from lib.course import DAYS, get_all_exercises, get_badge
    from lib.db import get_progress, get_submissions

    user_id = st.session_state.user["id"]
    progress = get_progress(user_id)
    submissions = get_submissions(user_id)
    all_ex = get_all_exercises()

    completed = len([e for e in all_ex if e["id"] in progress])
    total = len(all_ex)
    pts_ex = sum(progress.get(e["id"], {}).get("pontos", 0) for e in all_ex)
    pts_sub = sum(s.get("pontos", 0) for s in submissions.values())
    pts_total = pts_ex + pts_sub

    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.metric("Exercicios Completos", f"{completed}/{total}")
    with c2:
        st.metric("Pontos", f"{pts_total}")
    with c3:
        st.metric("Badge", get_badge(pts_total))
    with c4:
        pct = int(completed / total * 100) if total > 0 else 0
        st.metric("Progresso", f"{pct}%")

    st.progress(pct / 100)

    st.markdown("---")
    st.markdown("### Programa — 10 Dias")

    for day in DAYS:
        semana = "Semana 1" if day["semana"] == 1 else "Semana 2"
        n_ex = len(day["exercicios"]) + 1  # +1 for desafio
        done = sum(1 for ex in day["exercicios"] if ex["id"] in progress)
        done += 1 if day["desafio"]["id"] in progress or day["desafio"]["id"] in submissions else 0
        icon = "✅" if done == n_ex else "🔵" if done > 0 else "⚪"
        st.markdown(f"{icon} **Dia {day['dia']}** ({semana}) — {day['titulo']}  \n"
                    f"&nbsp;&nbsp;&nbsp;&nbsp;_{day['objetivo']}_  |  {done}/{n_ex} tarefas")
