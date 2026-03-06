import streamlit as st

def inject_css():
    """Inject global CSS for professional look. Call at top of every page."""
    st.markdown("""
<style>
/* ── Global ── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

html, body, [class*="css"] {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
}

/* ── Sidebar ── */
section[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%) !important;
    border-right: 1px solid #334155 !important;
}
section[data-testid="stSidebar"] * {
    color: #CBD5E1 !important;
}
section[data-testid="stSidebar"] .stMarkdown h1,
section[data-testid="stSidebar"] .stMarkdown h2,
section[data-testid="stSidebar"] .stMarkdown h3 {
    color: #F1F5F9 !important;
}
section[data-testid="stSidebar"] hr {
    border-color: #334155 !important;
}
section[data-testid="stSidebar"] .stAlert {
    background: rgba(59, 130, 246, 0.15) !important;
    border: 1px solid rgba(59, 130, 246, 0.3) !important;
}
section[data-testid="stSidebar"] .stAlert * {
    color: #93C5FD !important;
}

/* Sidebar nav links */
section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"] {
    border-radius: 8px !important;
    padding: 8px 12px !important;
    margin: 2px 8px !important;
    transition: all 0.2s ease !important;
}
section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"]:hover {
    background: rgba(59, 130, 246, 0.15) !important;
}
section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"][aria-current="page"] {
    background: rgba(59, 130, 246, 0.2) !important;
    border-left: 3px solid #3B82F6 !important;
}
section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"][aria-current="page"] span {
    color: #FFFFFF !important;
    font-weight: 600 !important;
}

/* ── Main content ── */
.stApp {
    background: #F8FAFC !important;
}
.block-container {
    max-width: 1100px !important;
    padding-top: 2rem !important;
}

/* ── Buttons ── */
.stButton > button {
    border-radius: 8px !important;
    font-weight: 600 !important;
    font-size: 0.875rem !important;
    padding: 0.5rem 1.25rem !important;
    transition: all 0.2s ease !important;
    border: none !important;
}
.stButton > button[kind="primary"],
.stButton > button:not([kind]) {
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important;
    color: white !important;
    box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3) !important;
}
.stButton > button:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
}

/* ── Form submit buttons ── */
button[kind="primaryFormSubmit"] {
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%) !important;
    color: white !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    border: none !important;
    padding: 0.6rem 1.5rem !important;
    transition: all 0.2s ease !important;
}
button[kind="primaryFormSubmit"]:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
}

/* ── Tabs ── */
.stTabs [data-baseweb="tab-list"] {
    gap: 0 !important;
    background: #F1F5F9 !important;
    border-radius: 10px !important;
    padding: 4px !important;
}
.stTabs [data-baseweb="tab"] {
    border-radius: 8px !important;
    padding: 8px 20px !important;
    font-weight: 600 !important;
    color: #64748B !important;
}
.stTabs [aria-selected="true"] {
    background: white !important;
    color: #1E293B !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
}
.stTabs [data-baseweb="tab-highlight"] { display: none !important; }
.stTabs [data-baseweb="tab-border"] { display: none !important; }

/* ── Metrics ── */
div[data-testid="stMetric"] {
    background: white !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    padding: 20px !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
}
div[data-testid="stMetric"] label {
    color: #64748B !important;
    font-size: 0.8rem !important;
    font-weight: 500 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
}
div[data-testid="stMetric"] div[data-testid="stMetricValue"] {
    color: #1E293B !important;
    font-weight: 700 !important;
}

/* ── Expanders ── */
details[data-testid="stExpander"] {
    background: white !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 12px !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
    margin-bottom: 8px !important;
}
details[data-testid="stExpander"] summary {
    font-weight: 600 !important;
    color: #1E293B !important;
}

/* ── Text inputs ── */
.stTextInput > div > div > input {
    border-radius: 8px !important;
    border: 1.5px solid #E2E8F0 !important;
    padding: 10px 14px !important;
    transition: border-color 0.2s !important;
}
.stTextInput > div > div > input:focus {
    border-color: #3B82F6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
}

/* ── Select boxes ── */
.stSelectbox > div > div { border-radius: 8px !important; }

/* ── Progress bar ── */
.stProgress > div > div > div {
    background: linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%) !important;
    border-radius: 10px !important;
}
.stProgress > div > div {
    background: #E2E8F0 !important;
    border-radius: 10px !important;
}

/* ── Chat ── */
.stChatMessage {
    border-radius: 12px !important;
    border: 1px solid #E2E8F0 !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04) !important;
}

/* ── Alerts ── */
.stAlert { border-radius: 10px !important; }

/* ── Dataframes ── */
.stDataFrame { border-radius: 12px !important; overflow: hidden !important; }

/* ── Dividers ── */
hr { border-color: #E2E8F0 !important; margin: 1.5rem 0 !important; }

/* ── Hide anchor links ── */
h1 a, h2 a, h3 a, h4 a { display: none !important; }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CUSTOM COMPONENTS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── Dark Hero ── */
.dark-hero {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0F172A 100%);
    border-radius: 24px;
    padding: 56px 40px 48px;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
}
.dark-hero::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 50%, rgba(59,130,246,0.12) 0%, transparent 50%),
                radial-gradient(circle at 70% 50%, rgba(139,92,246,0.08) 0%, transparent 50%);
    animation: hero-glow 8s ease-in-out infinite alternate;
}
@keyframes hero-glow {
    0% { transform: translate(0, 0); }
    100% { transform: translate(-5%, 5%); }
}
.dark-hero * { position: relative; z-index: 1; }
.dark-hero h1 {
    font-size: 3rem;
    font-weight: 900;
    color: #F8FAFC;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 0 0 8px;
}
.dark-hero h1 .gradient-text {
    background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.dark-hero .subtitle {
    font-size: 1.1rem;
    color: #94A3B8;
    max-width: 560px;
    margin: 0 auto 28px;
    line-height: 1.6;
}
.dark-hero .pill-row {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
}
.dark-hero .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 16px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    font-size: 0.82rem;
    color: #CBD5E1;
    font-weight: 500;
}

/* ── Stat Cards ── */
.stat-card {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    border-radius: 16px;
    padding: 22px 20px;
    color: white;
    text-align: center;
}
.stat-card .stat-icon { font-size: 1.5rem; margin-bottom: 4px; }
.stat-card .stat-value {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 2px;
}
.stat-card .stat-label {
    font-size: 0.75rem;
    font-weight: 500;
    opacity: 0.85;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.stat-card.green { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
.stat-card.purple { background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); }
.stat-card.amber { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); }
.stat-card.rose { background: linear-gradient(135deg, #F43F5E 0%, #E11D48 100%); }

/* ── Pro Cards ── */
.pro-card {
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    transition: all 0.2s ease;
}
.pro-card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    transform: translateY(-2px);
}

/* ── Google Button ── */
.google-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 12px 24px;
    background: white;
    border: 2px solid #E2E8F0;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1E293B;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
}
.google-btn:hover {
    border-color: #3B82F6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
    text-decoration: none;
    color: #1E293B;
}
.google-btn img { width: 20px; height: 20px; }
.google-btn.disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: default;
}
.divider-text {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 20px 0;
    color: #94A3B8;
    font-size: 0.85rem;
}
.divider-text::before,
.divider-text::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #E2E8F0;
}

/* ── Page Header ── */
.page-header { margin-bottom: 8px; }
.page-header h1 {
    font-size: 1.8rem !important;
    font-weight: 800 !important;
    color: #0F172A !important;
    margin-bottom: 2px !important;
    letter-spacing: -0.02em;
}
.page-header p {
    color: #64748B;
    font-size: 0.95rem;
    margin-top: 0;
}

/* ── Badge pill ── */
.badge-pill {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.badge-pill.blue { background: #DBEAFE; color: #1D4ED8; }
.badge-pill.green { background: #D1FAE5; color: #065F46; }
.badge-pill.purple { background: #EDE9FE; color: #5B21B6; }
.badge-pill.amber { background: #FEF3C7; color: #92400E; }
.badge-pill.rose { background: #FFE4E6; color: #BE123C; }

/* ── Feature cards (landing) ── */
.feature-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin: 24px 0;
}
@media (max-width: 768px) {
    .feature-grid { grid-template-columns: repeat(2, 1fr); }
}
.feature-card {
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 28px 20px 24px;
    text-align: center;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
}
.feature-card::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3B82F6, #8B5CF6);
    opacity: 0;
    transition: opacity 0.25s ease;
}
.feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.08);
}
.feature-card:hover::after { opacity: 1; }
.feature-card .fc-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    margin-bottom: 14px;
    font-weight: 800;
}
.feature-card .fc-icon.blue { background: #DBEAFE; color: #1D4ED8; }
.feature-card .fc-icon.green { background: #D1FAE5; color: #065F46; }
.feature-card .fc-icon.purple { background: #EDE9FE; color: #5B21B6; }
.feature-card .fc-icon.amber { background: #FEF3C7; color: #92400E; }
.feature-card h4 {
    margin: 0 0 4px;
    color: #0F172A;
    font-weight: 700;
    font-size: 1rem;
}
.feature-card p {
    margin: 0;
    color: #64748B;
    font-size: 0.82rem;
    line-height: 1.4;
}

/* ── Day card ── */
.day-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    margin-bottom: 8px;
    transition: all 0.15s ease;
}
.day-item:hover {
    border-color: #93C5FD;
    box-shadow: 0 2px 8px rgba(59,130,246,0.08);
}
.day-item .day-num {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.95rem;
    flex-shrink: 0;
}
.day-item .day-num.done { background: #D1FAE5; color: #065F46; }
.day-item .day-num.partial { background: #DBEAFE; color: #1D4ED8; }
.day-item .day-num.todo { background: #F1F5F9; color: #94A3B8; }
.day-item .day-info { flex: 1; }
.day-item .day-info strong { color: #0F172A; font-size: 0.9rem; }
.day-item .day-info p { margin: 2px 0 0; color: #64748B; font-size: 0.8rem; }
.day-item .day-progress {
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748B;
    white-space: nowrap;
}

/* ── Timeline (Programa) ── */
.timeline-card {
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 12px;
    border-left: 4px solid #3B82F6;
    transition: all 0.2s ease;
}
.timeline-card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    transform: translateX(4px);
}
.timeline-card.week2 { border-left-color: #8B5CF6; }

/* ── Podium (Leaderboard) ── */
.podium {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 12px;
    padding: 20px 0 0;
}
.podium-item {
    text-align: center;
    padding: 20px 16px;
    border-radius: 16px 16px 0 0;
    min-width: 120px;
}
.podium-item .medal { font-size: 2rem; }
.podium-item .name { font-weight: 700; font-size: 0.9rem; color: #0F172A; margin: 4px 0 2px; }
.podium-item .pts { font-size: 0.8rem; color: #64748B; font-weight: 600; }
.podium-1 { background: linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%); min-height: 160px; order: 2; }
.podium-2 { background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%); min-height: 130px; order: 1; }
.podium-3 { background: linear-gradient(180deg, #FED7AA 0%, #FDBA74 100%); min-height: 110px; order: 3; }

/* ── Tutor welcome ── */
.tutor-welcome {
    text-align: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #EFF6FF 0%, #EDE9FE 50%, #FFF1F2 100%);
    border-radius: 20px;
    margin-bottom: 20px;
}
.tutor-welcome .tw-icon { font-size: 3rem; margin-bottom: 8px; }
.tutor-welcome h3 { color: #0F172A; font-weight: 800; margin: 0 0 6px; font-size: 1.3rem; }
.tutor-welcome p { color: #64748B; font-size: 0.9rem; margin: 0; }

/* ── Suggestion cards ── */
.sug-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 16px 0;
}
@media (max-width: 768px) {
    .sug-grid { grid-template-columns: 1fr; }
}

/* ── Exercise card ── */
.ex-card {
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.15s ease;
}
.ex-card:hover { border-color: #93C5FD; }
.ex-card.done { border-left: 4px solid #10B981; }
.ex-card.todo { border-left: 4px solid #E2E8F0; }
.ex-card .ex-status {
    width: 32px; height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
}
.ex-card .ex-status.done { background: #D1FAE5; }
.ex-card .ex-status.todo { background: #F1F5F9; }
.ex-card .ex-info { flex: 1; }
.ex-card .ex-info strong { color: #0F172A; font-size: 0.9rem; }
.ex-card .ex-info p { margin: 2px 0 0; color: #64748B; font-size: 0.8rem; }

/* ── Resource item ── */
.res-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    background: white;
    border: 1px solid #F1F5F9;
    border-radius: 10px;
    margin-bottom: 6px;
    transition: all 0.15s ease;
}
.res-item:hover {
    border-color: #CBD5E1;
    background: #FAFBFC;
}
.res-item .res-badge {
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}
.res-item .res-info strong { color: #0F172A; font-size: 0.88rem; }
.res-item .res-info p { margin: 2px 0 0; color: #64748B; font-size: 0.8rem; line-height: 1.4; }

/* ── Section title with icon ── */
.section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 24px 0 12px;
}
.section-title .st-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
}
.section-title h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #0F172A;
}

/* ── Circular progress ── */
.circle-progress {
    width: 140px;
    height: 140px;
    margin: 0 auto;
    position: relative;
}
.circle-progress svg { transform: rotate(-90deg); }
.circle-progress .cp-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}
.circle-progress .cp-value {
    font-size: 1.8rem;
    font-weight: 800;
    color: #0F172A;
    line-height: 1;
}
.circle-progress .cp-label {
    font-size: 0.7rem;
    color: #94A3B8;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;
}
</style>
""", unsafe_allow_html=True)


def page_header(title: str, subtitle: str = "", icon: str = ""):
    """Render a standardized page header with optional icon."""
    icon_html = f'<span style="font-size:1.5rem; margin-right:8px;">{icon}</span>' if icon else ''
    html = f'<div class="page-header"><h1>{icon_html}{title}</h1>'
    if subtitle:
        html += f'<p>{subtitle}</p>'
    html += '</div>'
    st.markdown(html, unsafe_allow_html=True)
    st.markdown("---")


def stat_cards(items: list[dict]):
    """Render stat cards. items = [{"value", "label", "color", "icon"}]"""
    cols = st.columns(len(items))
    colors = {"blue": "", "green": "green", "purple": "purple", "amber": "amber", "rose": "rose"}
    for col, item in zip(cols, items):
        cls = colors.get(item.get("color", "blue"), "")
        icon_html = f'<div class="stat-icon">{item["icon"]}</div>' if "icon" in item else ''
        with col:
            st.markdown(f'''
            <div class="stat-card {cls}">
                {icon_html}
                <div class="stat-value">{item["value"]}</div>
                <div class="stat-label">{item["label"]}</div>
            </div>
            ''', unsafe_allow_html=True)


def section_title(title: str, icon: str = "", bg: str = "#DBEAFE", color: str = "#1D4ED8"):
    """Section title with icon badge."""
    st.markdown(f'''
    <div class="section-title">
        <div class="st-icon" style="background:{bg}; color:{color};">{icon}</div>
        <h3>{title}</h3>
    </div>
    ''', unsafe_allow_html=True)


def circular_progress(pct: int, label: str = "Progresso"):
    """Render a circular progress indicator."""
    r = 56
    c = 2 * 3.14159 * r
    offset = c * (1 - pct / 100)
    st.markdown(f'''
    <div class="circle-progress">
        <svg width="140" height="140">
            <circle cx="70" cy="70" r="{r}" fill="none" stroke="#E2E8F0" stroke-width="10"/>
            <circle cx="70" cy="70" r="{r}" fill="none" stroke="url(#grad)" stroke-width="10"
                    stroke-dasharray="{c}" stroke-dashoffset="{offset}" stroke-linecap="round"/>
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#3B82F6"/>
                    <stop offset="100%" style="stop-color:#8B5CF6"/>
                </linearGradient>
            </defs>
        </svg>
        <div class="cp-text">
            <div class="cp-value">{pct}%</div>
            <div class="cp-label">{label}</div>
        </div>
    </div>
    ''', unsafe_allow_html=True)
