import os
import streamlit as st
from streamlit.errors import StreamlitAPIException
from lib.auth import init_session, login_email, register_email, logout, is_demo_mode, get_google_login_url
from lib.theme import inject_css, page_header, stat_cards, section_title, render_html
from lib.i18n import init_i18n, t, LANGUAGES, get_lang

st.set_page_config(
    page_title=t("app_page_title") if "lang" in st.session_state else "AI Founder Bootcamp",
    page_icon="https://img.icons8.com/nolan/64/graduation-cap.png",
    layout="wide",
    initial_sidebar_state="collapsed"
)
init_session()
init_i18n()
inject_css()

if os.getenv("PROPHET_UI_REVIEW") == "1":
    render_html(f"""
    <div class="review-banner">
        <strong style="color:#F05A37;">{t('ui_review_mode_title')}</strong>
        <span style="color:#5C6B7B;">{t('ui_review_mode_body')}</span>
    </div>
    """)

# --- Sidebar ---
with st.sidebar:
    render_html("""
    <div class="sidebar-shell">
        <div class="sidebar-brand">
            <div class="sidebar-mark">P</div>
            <div class="sidebar-title">""" + t("sidebar_brand_title") + """</div>
            <div class="sidebar-subtitle">""" + t("sidebar_subtitle") + """</div>
        </div>
    </div>
    """)

    if st.session_state.user:
        name = st.session_state.user.get("name", st.session_state.user["email"])
        avatar = st.session_state.user.get("avatar", "")
        if avatar:
            render_html(f"""
            <div class="sidebar-user-card">
                <div class="sidebar-user-avatar"><img src="{avatar}" alt="{name}"></div>
                <div>
                    <div class="sidebar-user-name">{name}</div>
                    <div class="sidebar-user-role">{st.session_state.role}</div>
                </div>
            </div>
            """)
        else:
            render_html(f"""
            <div class="sidebar-user-card">
                <div class="sidebar-user-avatar">{name[0].upper()}</div>
                <div>
                    <div class="sidebar-user-name">{name}</div>
                    <div class="sidebar-user-role">{st.session_state.role}</div>
                </div>
            </div>
            """)

        if is_demo_mode():
            render_html(f"""
            <div class="sidebar-alert">
                ⚠️ {t('demo_mode')}
            </div>
            """)

        if st.button(t("logout"), width="stretch"):
            logout()
            st.rerun()

    render_html(f"<div class='sidebar-section-label'>{t('language')}</div>")

    # Language selector
    lang_options = list(LANGUAGES.keys())
    lang_labels = list(LANGUAGES.values())
    current_idx = lang_options.index(get_lang()) if get_lang() in lang_options else 0
    new_lang = st.selectbox(
        t("language"), lang_labels, index=current_idx, key="lang_select"
    )
    selected_lang = lang_options[lang_labels.index(new_lang)]
    if selected_lang != get_lang():
        st.session_state.lang = selected_lang
        st.rerun()

    render_html(f"<div class='sidebar-section-label'>{t('dark_mode')}</div>")

    # Dark mode toggle
    dark = st.toggle(t("dark_mode"), value=st.session_state.get("dark_mode", False), key="dark_toggle")
    if dark != st.session_state.get("dark_mode", False):
        st.session_state.dark_mode = dark
        st.rerun()

    render_html("""
    <div class="sidebar-footer-card">
        <strong>""" + t("sidebar_footer_title") + """</strong><br>
        &copy; 2026 Prophet Lite Lab<br>pedro@stratfordgeek.com
    </div>
    """)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# LANDING PAGE (not logged in)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if st.session_state.user is None:
    current_lang = get_lang()
    render_html(
        "<div class='lang-switch'>"
        + "".join(
            [
                f"<a class='lang-chip {'active' if current_lang == code else ''}' href='?lang={code}'>{label}</a>"
                for code, label in [("pt", "PT"), ("en", "EN"), ("fr", "FR")]
            ]
        )
        + "</div>"
    )

    render_html(f"""
    <div class="mobile-hero-intro">
        <div class="landing-kicker">{t('hero_kicker')}</div>
        <h1 class="landing-title mobile-only-title">
            {t('hero_title_1')}<br>{t('hero_title_2')} <span class="accent">{t('hero_title_3')}</span>
        </h1>
        <p class="landing-lead">{t('hero_subtitle')}</p>
    </div>
    """)

    col_hero, col_auth = st.columns([1.15, 0.85], gap="large")

    with col_hero:
        render_html(f"""
        <div class="landing-kicker desktop-hero-only">{t('hero_kicker')}</div>
        <h1 class="landing-title desktop-hero-only">
            {t('hero_title_1')}<br>{t('hero_title_2')} <span class="accent">{t('hero_title_3')}</span>
        </h1>
        <p class="landing-lead desktop-hero-only">{t('hero_subtitle')}</p>

        <div class="landing-metrics">
            <div class="landing-metric">
                <strong>10</strong>
                <span>{t('landing_metric_days')}</span>
            </div>
            <div class="landing-metric">
                <strong>12+</strong>
                <span>{t('landing_metric_cases')}</span>
            </div>
            <div class="landing-metric">
                <strong>1</strong>
                <span>{t('landing_metric_launch')}</span>
            </div>
        </div>

        <div class="landing-spotlight">
            <h4 style="margin:0; font-size:1.15rem;">{t('landing_build_title')}</h4>
            <div class="landing-spotlight-grid">
                <div class="landing-spotlight-item">
                    <span class="landing-spotlight-icon">01</span>
                    <p style="margin:0;">{t('landing_build_1')}</p>
                </div>
                <div class="landing-spotlight-item">
                    <span class="landing-spotlight-icon">02</span>
                    <p style="margin:0;">{t('landing_build_2')}</p>
                </div>
                <div class="landing-spotlight-item">
                    <span class="landing-spotlight-icon">03</span>
                    <p style="margin:0;">{t('landing_build_3')}</p>
                </div>
            </div>
        </div>
        """)

    with col_auth:
        with st.container(border=True):
            render_html(f"""
            <div class="auth-panel-intro">
                <div class="auth-panel-badge">{t('landing_auth_badge')}</div>
                <h3>{t('login_title')}</h3>
                <p>{t('login_subtitle')}</p>
            </div>
            <div class="auth-benefit-list">
                <span class="auth-benefit-pill">{t('auth_benefit_1')}</span>
                <span class="auth-benefit-pill">{t('auth_benefit_2')}</span>
                <span class="auth-benefit-pill">{t('auth_benefit_3')}</span>
            </div>
            """)

            google_url = get_google_login_url()
            if google_url:
                render_html(f"""
                <a href="{google_url}" class="google-oauth-btn" target="_self">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20">
                    <span>{t('continue_google')}</span>
                </a>
                """)
            else:
                render_html(f"""
                <div class="google-oauth-btn" style="opacity:0.55; cursor:not-allowed;">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20">
                    <span>{t('continue_google')}</span>
                </div>
                """)

            render_html(f"""
            <div style="display:flex; align-items:center; margin:20px 0;">
                <div style="flex-grow:1; border-bottom:1px solid #D9E2E8;"></div>
                <span style="padding:0 12px; color:#7B8794; font-size:0.85rem;">{t('or_email')}</span>
                <div style="flex-grow:1; border-bottom:1px solid #D9E2E8;"></div>
            </div>
            """)

            tab_login, tab_register = st.tabs([t("tab_login"), t("tab_register")])

            with tab_login:
                with st.form("login_form"):
                    email = st.text_input(t("email"), placeholder=t("auth_email_placeholder"))
                    password = st.text_input(t("password"), type="password")
                    submitted = st.form_submit_button(t("btn_login"), width="stretch", type="primary")
                    if submitted and email and password:
                        if login_email(email, password):
                            st.rerun()

            with tab_register:
                with st.form("register_form"):
                    nome = st.text_input(t("full_name"))
                    email_r = st.text_input(t("email"), key="reg_email", placeholder=t("auth_email_placeholder"))
                    password_r = st.text_input(t("password"), type="password", key="reg_pass")
                    submitted_r = st.form_submit_button(t("btn_register"), width="stretch", type="primary")
                    if submitted_r and nome and email_r and password_r:
                        if register_email(email_r, password_r, nome):
                            st.rerun()

            render_html(f"<p class='auth-panel-note'>{t('landing_auth_note')}</p>")

    render_html(f"""
    <div class="landing-section-head compact-head">
        <span>{t('what_you_learn')}</span>
        <h3>{t('landing_curriculum_title')}</h3>
        <p>{t('landing_curriculum_sub')}</p>
    </div>
    <div class="feature-grid feature-grid-tight">
        <div class="feature-tile feature-tile-tight">
            <div class="feature-icon">🤖</div>
            <div>
                <h4>{t('feat_agents')}</h4>
                <p>{t('feat_agents_desc')}</p>
            </div>
        </div>
        <div class="feature-tile feature-tile-tight">
            <div class="feature-icon">⚙️</div>
            <div>
                <h4>{t('feat_ml')}</h4>
                <p>{t('feat_ml_desc')}</p>
            </div>
        </div>
        <div class="feature-tile feature-tile-tight">
            <div class="feature-icon">🏦</div>
            <div>
                <h4>{t('feat_engine')}</h4>
                <p>{t('feat_engine_desc')}</p>
            </div>
        </div>
        <div class="feature-tile feature-tile-tight">
            <div class="feature-icon">☁️</div>
            <div>
                <h4>{t('feat_deploy')}</h4>
                <p>{t('feat_deploy_desc')}</p>
            </div>
        </div>
    </div>
    """)

    render_html(f"""
    <div class="landing-section-head compact-head">
        <span>{t('landing_founder_kicker')}</span>
        <h3>{t('landing_founder_title')}</h3>
    </div>
    <div class="feature-grid feature-grid-tight founder-flow-grid">
        <div class="feature-tile feature-tile-tight founder-flow-card">
            <div class="founder-step">01</div>
            <div>
                <h4>{t('landing_founder_1_title')}</h4>
                <p>{t('landing_founder_1_desc')}</p>
            </div>
        </div>
        <div class="feature-tile feature-tile-tight founder-flow-card">
            <div class="founder-step">02</div>
            <div>
                <h4>{t('landing_founder_2_title')}</h4>
                <p>{t('landing_founder_2_desc')}</p>
            </div>
        </div>
        <div class="feature-tile feature-tile-tight founder-flow-card">
            <div class="founder-step">03</div>
            <div>
                <h4>{t('landing_founder_3_title')}</h4>
                <p>{t('landing_founder_3_desc')}</p>
            </div>
        </div>
    </div>
    """)

    render_html(f"""
    <div class="landing-section-head compact-head quote-head">
        <span>{t('landing_quote_kicker')}</span>
        <h3>{t('landing_quote_title')}</h3>
    </div>
    <div class="quote-grid">
        <div class="quote-card"><p>{t('landing_quote_1')}</p></div>
        <div class="quote-card"><p>{t('landing_quote_2')}</p></div>
        <div class="quote-card"><p>{t('landing_quote_3')}</p></div>
    </div>
    """)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# HOME DASHBOARD (logged in)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
else:
    from lib.course import DAYS, get_all_exercises, get_badge
    from lib.db import get_progress, get_submissions

    name = st.session_state.user.get("name", st.session_state.user["email"])
    user_id = st.session_state.user["id"]
    progress = get_progress(user_id)
    submissions = get_submissions(user_id)
    all_ex = get_all_exercises()

    completed = len([e for e in all_ex if e["id"] in progress or e["id"] in submissions])
    total = len(all_ex)
    pts_ex = sum(progress.get(e["id"], {}).get("pontos", 0) for e in all_ex)
    pts_sub = sum(s.get("pontos", 0) for s in submissions.values())
    pts_total = pts_ex + pts_sub
    pct = int(completed / total * 100) if total > 0 else 0
    badge = get_badge(pts_total)

    render_html(f"""
    <div class="dashboard-hero">
        <div class="dashboard-hero-copy">
            <div class="dashboard-kicker">{t('dashboard_kicker')}</div>
            <h1>{t('hello', name=name)} 👋</h1>
            <p>{t('progress_msg', done=completed, total=total)}</p>
            <div class="dashboard-chip-row">
                <span class="dashboard-chip">⚡ XP {pts_total}</span>
                <span class="dashboard-chip">🎯 {completed}/{total} {t('completed')}</span>
                <span class="dashboard-chip">🎓 {badge}</span>
            </div>
        </div>
        <div class="dashboard-progress-card">
            <div class="dashboard-progress-label">{t('completion_rate')}</div>
            <div class="dashboard-progress-value">{pct}%</div>
            <div class="dashboard-progress-meta">{completed}/{total} {t('tasks_submitted')}</div>
        </div>
    </div>
    """)
    
    # Progress Bar UI
    st.progress(pct / 100.0)
    st.markdown('<div style="margin-bottom:32px;"></div>', unsafe_allow_html=True)

    # Stats Modern Grid
    stat_cards([
        {"value": str(pts_total), "label": t("xp_points"), "icon": "⚡"},
        {"value": f"{completed}/{total}", "label": t("tasks_submitted"), "icon": "🎯"},
        {"value": badge, "label": t("current_rank"), "icon": "🎓"},
    ])

    # Day cards layout
    section_title(t("featured_modules"), "📚", "indigo")

    def _go_to_programa(week_idx):
        st.session_state.programa_target_week = week_idx
        for target in ("pages/2_Programa.py", "2_Programa.py"):
            try:
                st.switch_page(target)
                return
            except StreamlitAPIException:
                continue

    def _go_to_exercicios():
        for target in ("pages/3_Exercicios.py", "3_Exercicios.py"):
            try:
                st.switch_page(target)
                return
            except StreamlitAPIException:
                continue

    week_cols = st.columns(3, gap="medium")
    for idx, col in enumerate(week_cols):
        week_idx = idx
        title = [t("pre_bootcamp"), t("week_1"), t("week_2")][idx]
        desc = [t("pre_bootcamp_desc"), t("week1_desc"), t("week2_desc")][idx]
        icon = ["🛠️", "⚡", "🚀"][idx]
        accent_cls = ["amber", "emerald", "indigo"][idx]
        days_w = [d for d in DAYS if d["semana"] == week_idx]
        total_week_ex = sum(len(d["exercicios"]) + 1 for d in days_w)
        done_week_ex = 0
        for day_w in days_w:
            done_week_ex += sum(1 for ex in day_w["exercicios"] if ex["id"] in progress)
            done_week_ex += 1 if day_w["desafio"]["id"] in progress or day_w["desafio"]["id"] in submissions else 0
        pct_w = int((done_week_ex / total_week_ex) * 100) if total_week_ex else 0

        with col:
            render_html(f"""
            <div class="week-card">
                <div class="week-card-top">
                    <div class="week-card-icon">{icon}</div>
                    <span class="badge-pill {accent_cls}">{done_week_ex} / {total_week_ex}</span>
                </div>
                <h4>{title}</h4>
                <p>{desc}</p>
                <div class="week-card-progress">
                    <span style="font-size:0.8rem; font-weight:700; color:#5C6B7B; text-transform:uppercase; letter-spacing:0.08em;">{t('progress')}</span>
                    <span style="font-size:0.9rem; font-weight:700; color:#12263F;">{pct_w}%</span>
                </div>
            </div>
            """)
            btn_cols = st.columns(2, gap="small")
            with btn_cols[0]:
                if st.button(f"📖 {t('start_exercises_btn')}", key=f"home_view_{idx}", use_container_width=True):
                    _go_to_programa(idx)
            with btn_cols[1]:
                if st.button(f"📝 {t('dashboard_go_exercises')}", key=f"home_ex_{idx}", use_container_width=True):
                    _go_to_exercicios()
