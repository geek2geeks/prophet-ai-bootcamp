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
    <div style="text-align:center; padding: 20px 0 12px;">
        <div style="width:48px; height:48px; margin:0 auto 8px; background:linear-gradient(135deg,#3B82F6,#8B5CF6);
                    border-radius:14px; display:flex; align-items:center; justify-content:center;
                    font-size:1.4rem; color:white; font-weight:900;">P</div>
        <div style="font-size:1.05rem; font-weight:700; color:#F1F5F9 !important; letter-spacing:-0.02em;">Prophet AI Bootcamp</div>
        <div style="font-size:0.72rem; color:#64748B !important; margin-top:2px;">AI & Data Science para Atuarios</div>
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
            <div style="display:flex; align-items:center; gap:10px; padding:8px 4px;">
                <div style="width:36px; height:36px; border-radius:50%; background:#334155;
                            display:flex; align-items:center; justify-content:center;
                            font-weight:700; font-size:0.9rem; color:#CBD5E1;">{name[0].upper()}</div>
                <div>
                    <div style="font-size:0.85rem; font-weight:600; color:#F1F5F9 !important;">{name}</div>
                    <div style="font-size:0.7rem; color:#94A3B8 !important;">{st.session_state.role}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)

        if is_demo_mode():
            st.markdown("""
            <div style="background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.25);
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

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# LANDING PAGE (not logged in)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if st.session_state.user is None:
    # Dark hero
    st.markdown("""
    <div class="dark-hero">
        <h1>Torna-te um<br><span class="gradient-text">AI Actuary</span></h1>
        <p class="subtitle">
            10 dias intensivos de AI & Data Science para Atuarios de Vida.<br>
            Constroi o teu proprio motor de projecao. Deploya como SaaS.
        </p>
        <div class="pill-row">
            <span class="pill">Python + AI Coding</span>
            <span class="pill">Machine Learning</span>
            <span class="pill">Agentes LLM</span>
            <span class="pill">Solvencia II</span>
            <span class="pill">SaaS Deploy</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Feature cards
    st.markdown("""
    <div class="feature-grid">
        <div class="feature-card">
            <div class="fc-icon blue">10</div>
            <h4>Dias Intensivos</h4>
            <p>80 horas de formacao pratica com IA e dados reais</p>
        </div>
        <div class="feature-card">
            <div class="fc-icon green">35</div>
            <h4>Exercicios</h4>
            <p>Hands-on com datasets de seguros de vida reais</p>
        </div>
        <div class="feature-card">
            <div class="fc-icon purple">AI</div>
            <h4>Agentes LLM</h4>
            <p>CrewAI, RAG, auditoria automatica de sinistros</p>
        </div>
        <div class="feature-card">
            <div class="fc-icon amber">$</div>
            <h4>Produto SaaS</h4>
            <p>Deploya o teu proprio Prophet AI no final</p>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("")

    # Login area
    _left, center, _right = st.columns([1.2, 2, 1.2])
    with center:
        st.markdown("""
        <div style="text-align:center; margin-bottom:16px;">
            <h3 style="color:#0F172A; font-weight:800; font-size:1.4rem; margin:0 0 4px;">Acede ao Bootcamp</h3>
            <p style="color:#64748B; font-size:0.88rem; margin:0;">Entra para comecar a tua jornada</p>
        </div>
        """, unsafe_allow_html=True)

        # Google OAuth — always show the button
        google_url = get_google_login_url()
        if google_url:
            st.markdown(f"""
            <a href="{google_url}" class="google-btn" target="_self">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
                Continuar com Google
            </a>
            """, unsafe_allow_html=True)
        else:
            # Show button even in demo mode (disabled visual)
            st.markdown("""
            <div class="google-btn disabled" title="Configura Supabase para ativar Google login">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
                Continuar com Google
            </div>
            """, unsafe_allow_html=True)

        st.markdown('<div class="divider-text">ou entra com email</div>', unsafe_allow_html=True)

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

    st.markdown("---")

    # Two-column info
    col_a, col_b = st.columns(2)
    with col_a:
        st.markdown("""
        <div class="pro-card" style="height:100%;">
            <div style="font-size:1.5rem; margin-bottom:10px;">🏗</div>
            <h4 style="color:#0F172A; margin:0 0 10px; font-weight:700;">O que vais construir</h4>
            <p style="color:#475569; font-size:0.88rem; line-height:1.8; margin:0;">
                O <strong>Prophet AI</strong> — um clone do FIS Prophet potenciado por IA.<br>
                Motor de projecao de cash flows, reservas V(t) e profit testing para 4 produtos vida.
                Agentes LLM para auditoria de sinistros e cenarios de stress Solvencia II.
                RBAC com Supabase. Deploy no Streamlit Cloud.
            </p>
        </div>
        """, unsafe_allow_html=True)

    with col_b:
        st.markdown("""
        <div class="pro-card" style="height:100%;">
            <div style="font-size:1.5rem; margin-bottom:10px;">⚡</div>
            <h4 style="color:#0F172A; margin:0 0 10px; font-weight:700;">Stack Tecnologico</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px 16px;">
                <div style="color:#475569; font-size:0.85rem;"><strong style="color:#3B82F6;">Python</strong> 3.11+</div>
                <div style="color:#475569; font-size:0.85rem;"><strong style="color:#8B5CF6;">CrewAI</strong> Agentes</div>
                <div style="color:#475569; font-size:0.85rem;"><strong style="color:#10B981;">DeepSeek</strong> LLM API</div>
                <div style="color:#475569; font-size:0.85rem;"><strong style="color:#F59E0B;">XGBoost</strong> + SHAP</div>
                <div style="color:#475569; font-size:0.85rem;"><strong style="color:#EF4444;">Streamlit</strong> Web</div>
                <div style="color:#475569; font-size:0.85rem;"><strong style="color:#06B6D4;">Supabase</strong> Auth+DB</div>
                <div style="color:#475569; font-size:0.85rem;"><strong style="color:#EC4899;">ChromaDB</strong> RAG</div>
                <div style="color:#475569; font-size:0.85rem;"><strong style="color:#84CC16;">OpenCode</strong> AI Coding</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("""
    <div style="text-align:center; padding:32px 0 16px; color:#94A3B8; font-size:0.85rem; font-style:italic;">
        "O teu conhecimento atuarial levou anos a construir. A IA so precisa de dias para o empacotar."
    </div>
    """, unsafe_allow_html=True)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# HOME DASHBOARD (logged in)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
else:
    from lib.course import DAYS, get_all_exercises, get_badge
    from lib.db import get_progress, get_submissions
    from lib.theme import circular_progress, section_title

    name = st.session_state.user.get("name", st.session_state.user["email"])
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
    badge = get_badge(pts_total)

    # Welcome banner
    st.markdown(f"""
    <div style="background:linear-gradient(135deg,#EFF6FF 0%,#EDE9FE 50%,#FCE7F3 100%);
                border-radius:20px; padding:28px 32px; margin-bottom:24px;">
        <div style="font-size:1.6rem; font-weight:800; color:#0F172A; letter-spacing:-0.02em;">
            Ola, {name}! 👋
        </div>
        <div style="color:#475569; font-size:0.95rem; margin-top:4px;">
            Continua a tua jornada de AI Actuary. Ja completaste <strong>{completed}</strong> de <strong>{total}</strong> tarefas.
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Stats + circular progress
    col_stats, col_circle = st.columns([3, 1])

    with col_stats:
        stat_cards([
            {"value": str(pts_total), "label": "Pontos Total", "color": "blue", "icon": "⭐"},
            {"value": f"{completed}/{total}", "label": "Exercicios", "color": "green", "icon": "✓"},
            {"value": badge, "label": "Badge Atual", "color": "purple", "icon": "🏆"},
        ])

    with col_circle:
        st.markdown("")
        circular_progress(pct, "completo")

    st.markdown("---")

    # Day cards
    section_title("Programa — 10 Dias", "📚", "#DBEAFE", "#1D4ED8")

    # Week tabs
    w1, w2 = st.tabs(["Semana 1 (Dias 1–5)", "Semana 2 (Dias 6–10)"])

    for tab, sem_num in [(w1, 1), (w2, 2)]:
        with tab:
            for day in [d for d in DAYS if d["semana"] == sem_num]:
                n_ex = len(day["exercicios"]) + 1
                done = sum(1 for ex in day["exercicios"] if ex["id"] in progress)
                done += 1 if day["desafio"]["id"] in progress or day["desafio"]["id"] in submissions else 0
                status = "done" if done == n_ex else ("partial" if done > 0 else "todo")

                st.markdown(f"""
                <div class="day-item">
                    <div class="day-num {status}">{day['dia']}</div>
                    <div class="day-info">
                        <strong>{day['titulo']}</strong>
                        <p>{day['objetivo'][:90]}{'...' if len(day['objetivo']) > 90 else ''}</p>
                    </div>
                    <div class="day-progress">{done}/{n_ex}</div>
                </div>
                """, unsafe_allow_html=True)
