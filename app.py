import streamlit as st
from lib.auth import init_session, login_email, register_email, logout, is_demo_mode, get_google_login_url
from lib.theme import inject_css, page_header, stat_cards

st.set_page_config(
    page_title="Prophet AI Bootcamp",
    page_icon="https://img.icons8.com/fluency/48/graduation-cap.png",
    layout="wide",
    initial_sidebar_state="expanded"
)

init_session()
inject_css()

# --- Sidebar ---
with st.sidebar:
    st.markdown("""
    <div style="text-align:center; padding: 16px 0 8px;">
        <img src="https://img.icons8.com/fluency/64/graduation-cap.png" width="48" style="margin-bottom:4px;">
        <div style="font-size:1.05rem; font-weight:700; color:#F1F5F9 !important; letter-spacing:-0.02em;">Prophet AI Bootcamp</div>
        <div style="font-size:0.75rem; color:#94A3B8 !important;">AI & Data Science para Atuarios</div>
    </div>
    """, unsafe_allow_html=True)
    st.markdown("---")

    if st.session_state.user:
        name = st.session_state.user.get("name", st.session_state.user["email"])
        avatar = st.session_state.user.get("avatar", "")
        if avatar:
            st.markdown(f"""
            <div style="display:flex; align-items:center; gap:10px; padding:8px 4px;">
                <img src="{avatar}" width="36" style="border-radius:50%; border:2px solid #334155;">
                <div>
                    <div style="font-size:0.85rem; font-weight:600; color:#F1F5F9 !important;">{name}</div>
                    <div style="font-size:0.7rem; color:#94A3B8 !important;">{st.session_state.role}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div style="padding:8px 4px;">
                <div style="font-size:0.85rem; font-weight:600; color:#F1F5F9 !important;">{name}</div>
                <div style="font-size:0.7rem; color:#94A3B8 !important;">{st.session_state.role}</div>
            </div>
            """, unsafe_allow_html=True)

        if is_demo_mode():
            st.markdown("""
            <div style="background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.3);
                        border-radius:8px; padding:8px 12px; margin:8px 0; font-size:0.75rem; color:#FBBF24 !important;">
                Modo Demo (sem Supabase)
            </div>
            """, unsafe_allow_html=True)

        if st.button("Sair", use_container_width=True):
            logout()
            st.rerun()
    st.markdown("---")
    st.markdown("""
    <div style="font-size:0.7rem; color:#475569 !important; padding:4px 0;">
        &copy; 2026 Prophet AI Bootcamp<br>pedro@stratfordgeek.com
    </div>
    """, unsafe_allow_html=True)

# --- Main Content ---
if st.session_state.user is None:
    # ── Landing / Login ──
    st.markdown("""
    <div class="hero">
        <h1>Prophet AI <span>Bootcamp</span></h1>
        <p class="subtitle">
            AI & Data Science para Atuarios de Vida &mdash;
            De Especialista de Risco a Fundador de SaaS Atuarial
        </p>
    </div>
    """, unsafe_allow_html=True)

    # Feature cards
    st.markdown("""
    <div class="feature-grid">
        <div class="feature-card">
            <div class="icon">10</div>
            <h4>Dias</h4>
            <p>De bootcamp intensivo</p>
        </div>
        <div class="feature-card">
            <div class="icon">80h</div>
            <h4>Formacao</h4>
            <p>Hands-on com IA</p>
        </div>
        <div class="feature-card">
            <div class="icon">1000</div>
            <h4>Pontos</h4>
            <p>Para ganhar e competir</p>
        </div>
        <div class="feature-card">
            <div class="icon">SaaS</div>
            <h4>Produto</h4>
            <p>Deployado no final</p>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("")

    # Login form area
    _left, center, _right = st.columns([1.2, 2, 1.2])
    with center:
        st.markdown("""
        <div class="pro-card" style="padding:32px; margin-top:8px;">
            <h3 style="text-align:center; margin:0 0 4px; color:#0F172A; font-weight:700;">Acede ao Bootcamp</h3>
            <p style="text-align:center; color:#64748B; font-size:0.85rem; margin:0 0 20px;">
                Entra com a tua conta para aceder ao curso
            </p>
        </div>
        """, unsafe_allow_html=True)

    with center:
        # Google OAuth button
        google_url = get_google_login_url()
        if google_url:
            st.markdown(f"""
            <a href="{google_url}" class="google-btn" target="_self">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
                Continuar com Google
            </a>
            <div class="divider-text">ou entra com email</div>
            """, unsafe_allow_html=True)

        tab_login, tab_register = st.tabs(["Entrar", "Criar Conta"])

        with tab_login:
            with st.form("login_form"):
                email = st.text_input("Email", placeholder="nome@exemplo.com")
                password = st.text_input("Password", type="password", placeholder="A tua password")
                submitted = st.form_submit_button("Entrar", use_container_width=True)
                if submitted and email and password:
                    if login_email(email, password):
                        st.rerun()

        with tab_register:
            with st.form("register_form"):
                nome = st.text_input("Nome completo", placeholder="O teu nome")
                email_r = st.text_input("Email", key="reg_email", placeholder="nome@exemplo.com")
                password_r = st.text_input("Password", type="password", key="reg_pass", placeholder="Min. 6 caracteres")
                submitted_r = st.form_submit_button("Criar Conta", use_container_width=True)
                if submitted_r and nome and email_r and password_r:
                    if register_email(email_r, password_r, nome):
                        st.rerun()

    # What you'll build section
    st.markdown("")
    st.markdown("---")

    col_a, col_b = st.columns(2)
    with col_a:
        st.markdown("""
        <div class="pro-card">
            <h4 style="color:#0F172A; margin-top:0;">O que vais construir</h4>
            <p style="color:#475569; font-size:0.9rem; line-height:1.7;">
                O <strong>Prophet AI</strong> &mdash; um clone do FIS Prophet potenciado por IA:
            </p>
            <ul style="color:#475569; font-size:0.88rem; line-height:2;">
                <li><strong>Motor de projecao Vida</strong>: cash flows, reservas V(t), profit testing</li>
                <li><strong>Agentes LLM</strong>: auditoria de sinistros, cenarios de stress</li>
                <li><strong>RBAC</strong>: controlo de acessos com Supabase</li>
                <li><strong>SaaS deployado</strong>: interface Streamlit Cloud</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with col_b:
        st.markdown("""
        <div class="pro-card">
            <h4 style="color:#0F172A; margin-top:0;">Stack Tecnologico</h4>
            <ul style="color:#475569; font-size:0.88rem; line-height:2;">
                <li><strong>Linguagem</strong>: Python 3.11+</li>
                <li><strong>AI Coding</strong>: OpenCode + Z.ai (GLM-5)</li>
                <li><strong>LLM</strong>: DeepSeek API</li>
                <li><strong>Agentes</strong>: CrewAI</li>
                <li><strong>ML</strong>: Scikit-learn, XGBoost, SHAP</li>
                <li><strong>Deploy</strong>: Streamlit Cloud + Supabase</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("")
    st.markdown("""
    <div style="text-align:center; padding:24px 0; color:#94A3B8; font-size:0.8rem;">
        <em>"O teu conhecimento atuarial levou anos a construir. A IA so precisa de dias para o empacotar."</em>
    </div>
    """, unsafe_allow_html=True)

else:
    # ── Logged in — Home Dashboard ──
    name = st.session_state.user.get("name", st.session_state.user["email"])
    page_header(f"Bem-vindo, {name}", "Usa o menu lateral para navegar entre as paginas do curso.")

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
    pct = int(completed / total * 100) if total > 0 else 0

    stat_cards([
        {"value": f"{completed}/{total}", "label": "Exercicios", "color": "blue"},
        {"value": str(pts_total), "label": "Pontos Total", "color": "green"},
        {"value": get_badge(pts_total), "label": "Badge Atual", "color": "purple"},
        {"value": f"{pct}%", "label": "Progresso", "color": "amber"},
    ])

    st.markdown("")
    st.progress(pct / 100)

    st.markdown("---")
    st.markdown('<div class="page-header"><h1 style="font-size:1.3rem !important;">Programa &mdash; 10 Dias</h1></div>', unsafe_allow_html=True)

    for day in DAYS:
        semana = "Sem. 1" if day["semana"] == 1 else "Sem. 2"
        n_ex = len(day["exercicios"]) + 1
        done = sum(1 for ex in day["exercicios"] if ex["id"] in progress)
        done += 1 if day["desafio"]["id"] in progress or day["desafio"]["id"] in submissions else 0

        if done == n_ex:
            status = "done"
        elif done > 0:
            status = "partial"
        else:
            status = "todo"

        st.markdown(f"""
        <div class="day-item">
            <div class="day-num {status}">{day['dia']}</div>
            <div class="day-info">
                <strong>{day['titulo']}</strong>
                <p>{day['objetivo'][:80]}{'...' if len(day['objetivo']) > 80 else ''}</p>
            </div>
            <div class="day-progress">{done}/{n_ex} &bull; {semana}</div>
        </div>
        """, unsafe_allow_html=True)
