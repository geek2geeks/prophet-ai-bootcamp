import streamlit as st
import re

def render_html(html_str: str):
    """Safely render HTML without Streamlit converting indented lines to markdown code blocks."""
    import re
    cleaned = re.sub(r'^[ \t]+', '', html_str, flags=re.MULTILINE)
    st.markdown(cleaned, unsafe_allow_html=True)


def inject_css():
    """Inject global CSS for a premium SaaS look. Call at top of every page."""
    dark = st.session_state.get("dark_mode", False)
    dark_css = ""
    if dark:
        dark_css = """
/* ── Dark Mode Overrides ── */
html, body, [class*="css"] {
    background-color: #0F172A !important;
    color: #E2E8F0 !important;
}
.stApp { background: #0F172A !important; }
h1, h2, h3, h4, h5, h6 { color: #F1F5F9 !important; }
p { color: #94A3B8 !important; }

section[data-testid="stSidebar"] {
    background-color: #1E293B !important;
    border-right: 1px solid #334155 !important;
}
section[data-testid="stSidebar"] * { color: #CBD5E1 !important; }
section[data-testid="stSidebar"] hr { border-color: #334155 !important; }
section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"]:hover { background: #334155 !important; }
section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"][aria-current="page"] { background: #1E1B4B !important; border-left-color: #818CF8 !important; }
section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"][aria-current="page"] span { color: #A5B4FC !important; }

.stButton > button { background: #1E293B !important; color: #E2E8F0 !important; border-color: #334155 !important; }
.stButton > button:hover { background: #334155 !important; border-color: #475569 !important; }
.stButton > button[kind="primary"], button[kind="primaryFormSubmit"] { background: #4F46E5 !important; color: white !important; border: none !important; }
.stButton > button[kind="primary"]:hover, button[kind="primaryFormSubmit"]:hover { background: #4338CA !important; }

.stTextInput > div > div > input, textarea {
    background: #1E293B !important; color: #E2E8F0 !important; border-color: #334155 !important;
}
.stTextInput > div > div > input:focus, textarea:focus { border-color: #818CF8 !important; box-shadow: 0 0 0 3px rgba(129,140,248,0.2) !important; }

.saas-card { background: #1E293B !important; border-color: #334155 !important; }
.saas-card:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3) !important; }

.todo-card { background: #1E293B !important; border-color: #334155 !important; }
.todo-card:hover { border-color: #475569 !important; }

.badge-pill.slate { background: #334155; color: #94A3B8; border-color: #475569; }

.timeline-item { background: #1E293B !important; border-color: #334155 !important; }
.timeline-header { background: #0F172A !important; border-bottom-color: #334155 !important; }
.timeline-badge { background: #1E293B !important; border-color: #334155 !important; color: #E2E8F0 !important; }

.google-oauth-btn { background: #1E293B !important; color: #E2E8F0 !important; border-color: #334155 !important; }
.google-oauth-btn:hover { background: #334155 !important; }

hr { border-color: #334155 !important; }

.stProgress > div > div { background: #334155 !important; }

/* Dark mode tabs */
.stTabs [data-baseweb="tab-list"] { border-bottom-color: #334155 !important; }
.stTabs [data-baseweb="tab"] { color: #94A3B8 !important; }

/* Dark mode expander */
details { border-color: #334155 !important; }
details summary { color: #E2E8F0 !important; }

/* Dark mode selectbox */
[data-baseweb="select"] > div { background: #1E293B !important; border-color: #334155 !important; color: #E2E8F0 !important; }

/* Dark mode checkbox */
.stCheckbox label span { color: #E2E8F0 !important; }

/* Dark mode radio */
.stRadio label span { color: #E2E8F0 !important; }
"""

    st.markdown("""
<style>
/* ── Global ── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

html, body, [class*="css"] {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    background-color: #FAFAFC !important;
    color: #0F172A !important;
}

/* Hide Streamlit default UI elements */
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
header {visibility: hidden;}

/* Main Background */
.stApp {
    background: #FAFAFC !important;
}

.block-container {
    max-width: 1040px !important;
    padding-top: 3rem !important;
    padding-bottom: 5rem !important;
}

/* ── Typography ── */
h1, h2, h3, h4, h5, h6 {
    color: #0F172A !important;
    font-weight: 700 !important;
    letter-spacing: -0.02em !important;
}

h1 { font-size: 2.25rem !important; line-height: 2.5rem !important; }
h2 { font-size: 1.5rem !important; line-height: 2rem !important; }
h3 { font-size: 1.25rem !important; line-height: 1.75rem !important; }

p {
    color: #475569 !important;
    line-height: 1.625 !important;
}

/* ── Sidebar ── */
section[data-testid="stSidebar"] {
    background-color: #FFFFFF !important;
    border-right: 1px solid #E2E8F0 !important;
}
section[data-testid="stSidebar"] * {
    color: #334155 !important;
}
section[data-testid="stSidebar"] .stMarkdown h1,
section[data-testid="stSidebar"] .stMarkdown h2,
section[data-testid="stSidebar"] .stMarkdown h3 {
    color: #0F172A !important;
    font-weight: 800 !important;
}
section[data-testid="stSidebar"] hr {
    border-color: #E2E8F0 !important;
}

/* Sidebar nav links - Modern look */
section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"] {
    border-radius: 6px !important;
    padding: 8px 12px !important;
    margin: 4px 16px !important;
    transition: all 0.2s ease !important;
    font-weight: 500 !important;
}
section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"]:hover {
    background: #F1F5F9 !important;
}
section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"][aria-current="page"] {
    background: #EEF2FF !important;
    border-left: 3px solid #6366F1 !important;
}
section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"][aria-current="page"] span {
    color: #4F46E5 !important;
    font-weight: 600 !important;
}

/* ── Buttons ── */
.stButton > button {
    border-radius: 8px !important;
    font-weight: 600 !important;
    font-size: 0.875rem !important;
    padding: 0.5rem 1rem !important;
    transition: all 0.2s ease !important;
    border: 1px solid #E2E8F0 !important;
    background: #FFFFFF !important;
    color: #0F172A !important;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
}
.stButton > button:hover {
    background: #F8FAFC !important;
    border-color: #CBD5E1 !important;
}
.stButton > button[kind="primary"],
button[kind="primaryFormSubmit"] {
    background: #0F172A !important;
    color: white !important;
    border: none !important;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
}
.stButton > button[kind="primary"]:hover,
button[kind="primaryFormSubmit"]:hover {
    background: #1E293B !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
}

/* ── Progress bar ── */
.stProgress > div > div > div {
    background: linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%) !important;
    border-radius: 9999px !important;
}
.stProgress > div > div {
    background: #E2E8F0 !important;
    border-radius: 9999px !important;
}

/* ── Forms & Inputs ── */
.stTextInput > div > div > input,
textarea {
    border-radius: 8px !important;
    border: 1px solid #CBD5E1 !important;
    padding: 10px 14px !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
    background: #FFFFFF !important;
    color: #0F172A !important;
}
.stTextInput > div > div > input:focus,
textarea:focus {
    border-color: #6366F1 !important;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
    outline: none !important;
}

/* ── Badges ── */
.badge-pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    letter-spacing: 0.025em;
}
.badge-pill.indigo { background: #EEF2FF; color: #4F46E5; border: 1px solid #C7D2FE; }
.badge-pill.emerald { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
.badge-pill.rose { background: #FFF1F2; color: #E11D48; border: 1px solid #FECDD3; }
.badge-pill.amber { background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A; }
.badge-pill.slate { background: #F8FAFC; color: #475569; border: 1px solid #E2E8F0; }

/* ── Dividers ── */
hr {
    border-color: #E2E8F0 !important;
    margin: 2rem 0 !important;
}

/* ── Hide anchor links ── */
h1 a, h2 a, h3 a, h4 a { display: none !important; }

/* ── Custom Component Wrappers ── */

/* SaaS Card */
.saas-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    margin-bottom: 24px;
    transition: all 0.2s ease;
}
.saas-card:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* ── Page Header Component ── */
.page-header-container {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #E2E8F0;
    display: flex;
    align-items: center;
    gap: 16px;
}
.page-header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
    border: 1px solid #C7D2FE;
    border-radius: 16px;
    font-size: 2rem;
    box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1);
}
.page-header-text h1 {
    font-size: 2.25rem;
    font-weight: 800;
    color: #0F172A;
    margin: 0;
    letter-spacing: -0.03em;
}
.page-header-text p {
    font-size: 1.1rem;
    color: #64748B;
    margin: 4px 0 0 0;
    font-weight: 400;
}

/* ── Stat Cards Component ── */
.stat-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}
.stat-card-item {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    display: flex;
    flex-direction: column;
}
.stat-card-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748B;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}
.stat-card-title svg, .stat-card-title span.icon {
    color: #94A3B8;
    font-size: 1rem;
}
.stat-card-value {
    font-size: 2rem;
    font-weight: 700;
    color: #0F172A;
    line-height: 1;
}

/* ── Timeline (Programa) ── */
.timeline-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 24px;
}
.timeline-item {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 0;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    overflow: hidden;
    position: relative;
    border-left: 4px solid #6366F1;
}
.timeline-item.week2 {
    border-left-color: #8B5CF6;
}
.timeline-item.pre-bootcamp {
    border-left-color: #F59E0B;
}

.timeline-header {
    background: #F8FAFC;
    padding: 16px 24px;
    border-bottom: 1px solid #E2E8F0;
    display: flex;
    align-items: center;
    gap: 16px;
}
.timeline-badge {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
    border-radius: 8px;
    padding: 6px 12px;
    font-weight: 700;
    font-size: 0.85rem;
    color: #0F172A;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.timeline-header-content {
    flex: 1;
}
.timeline-header-content h3 {
    margin: 0 0 4px 0;
    font-size: 1.15rem;
    color: #0F172A;
}
.timeline-header-content p {
    margin: 0;
    font-size: 0.9rem;
    color: #64748B;
}

.timeline-body {
    padding: 24px;
}
.timeline-modules-list {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
}
.timeline-modules-list li {
    position: relative;
    padding-left: 24px;
    margin-bottom: 10px;
    font-size: 0.95rem;
    color: #334155;
    font-weight: 500;
}
.timeline-modules-list li::before {
    content: "📘";
    position: absolute;
    left: 0;
    top: 0px;
    font-size: 0.9em;
}

.timeline-exercises {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px dashed #E2E8F0;
}
.timeline-exercise-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
}
.timeline-exercise-points {
    margin-top: 2px;
}
.timeline-exercise-content h4 {
    margin: 0 0 4px 0;
    font-size: 0.95rem;
    color: #0F172A;
}
.timeline-exercise-content p {
    margin: 0;
    font-size: 0.85rem;
    color: #64748B;
    line-height: 1.4;
}

/* ── Custom Landing / Auth Elements ── */
.auth-container {
    max-width: 440px;
    margin: 0 auto;
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    text-align: center;
}
.auth-container h2 {
    margin-top: 0;
    font-size: 1.75rem;
}
.google-oauth-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 12px 24px;
    background: #FFFFFF;
    border: 1px solid #CBD5E1;
    border-radius: 8px;
    font-weight: 600;
    color: #334155;
    text-decoration: none !important;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.google-oauth-btn:hover {
    background: #F8FAFC;
    border-color: #94A3B8;
    color: #0F172A;
}

/* ── ToDo Layout for Exercicios ── */
.todo-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 12px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    display: flex;
    align-items: flex-start;
    gap: 16px;
    transition: all 0.2s ease;
}
.todo-card:hover {
    border-color: #CBD5E1;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
.todo-card.completed {
    background: #F8FAFC;
    border-color: #E2E8F0;
    opacity: 0.8;
}
.todo-card-checkbox {
    margin-top: 2px;
}
.todo-card-content {
    flex: 1;
}
.todo-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
}
.todo-card-header h4 {
    margin: 0;
    font-size: 1.05rem;
    color: #0F172A;
}
.todo-card.completed .todo-card-header h4 {
    text-decoration: line-through;
    color: #64748B;
}
.todo-card-content p {
    margin: 0;
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.5;
}

/* ── Mobile Responsive ── */
@media (max-width: 768px) {
    .block-container {
        padding-top: 1.5rem !important;
        padding-left: 1rem !important;
        padding-right: 1rem !important;
    }
    .page-header-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    .page-header-icon {
        width: 48px;
        height: 48px;
        font-size: 1.5rem;
        border-radius: 12px;
    }
    .page-header-text h1 {
        font-size: 1.5rem !important;
    }
    .page-header-text p {
        font-size: 0.9rem;
    }
    .stat-card-grid {
        grid-template-columns: 1fr !important;
    }
    .saas-card {
        padding: 16px;
    }
    .google-oauth-btn {
        padding: 10px 16px;
        font-size: 0.9rem;
    }
}

</style>
""", unsafe_allow_html=True)

    st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Source+Sans+3:wght@400;500;600;700&display=swap');

:root {
    --brand-ink: #12263F;
    --brand-deep: #0B1F33;
    --brand-muted: #5C6B7B;
    --brand-line: #D9E2E8;
    --brand-accent: #FF7A59;
    --brand-accent-strong: #F05A37;
    --brand-accent-soft: #FFF0EA;
    --brand-teal: #2C8C7B;
    --brand-teal-soft: #E7F5F1;
    --surface-base: #FFF9F2;
    --surface-panel: rgba(255, 255, 255, 0.78);
    --surface-muted: #EEF3F6;
    --shadow-soft: 0 20px 45px -28px rgba(18, 38, 63, 0.4);
    --bg-indigo: #FFE8DE;
    --bg-emerald: #E7F5F1;
    --bg-amber: #FFF1D8;
    --bg-rose: #FFE3D6;
}

html, body, [class*="css"] {
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif !important;
    background: var(--surface-base) !important;
    color: var(--brand-ink) !important;
}

.stApp {
    background:
        radial-gradient(circle at top left, rgba(255, 122, 89, 0.16), transparent 30%),
        radial-gradient(circle at 85% 12%, rgba(44, 140, 123, 0.12), transparent 26%),
        linear-gradient(180deg, #FFF9F2 0%, #F6F8FB 52%, #EEF4F6 100%) !important;
}

.block-container {
    max-width: 1120px !important;
    padding-top: 1rem !important;
    padding-bottom: 4rem !important;
    padding-left: 1.1rem !important;
    padding-right: 1.1rem !important;
}

h1, h2, h3, h4, h5, h6,
.page-header-text h1,
.landing-title,
.dashboard-hero h1,
.stat-card-value {
    font-family: 'Manrope', 'Source Sans 3', sans-serif !important;
    color: var(--brand-ink) !important;
}

p,
label,
.stMarkdown,
.timeline-header-content p,
.timeline-exercise-content p,
.todo-card-content p {
    color: var(--brand-muted) !important;
}

.stButton > button,
button[kind="secondary"] {
    min-height: 3rem !important;
    border-radius: 16px !important;
    border: 1px solid var(--brand-line) !important;
    background: rgba(255, 255, 255, 0.82) !important;
    color: var(--brand-ink) !important;
    box-shadow: 0 12px 32px -26px rgba(18, 38, 63, 0.45) !important;
}

.stButton > button:hover,
button[kind="secondary"]:hover {
    transform: translateY(-1px) !important;
    border-color: #B6C4CF !important;
    background: rgba(255, 255, 255, 0.96) !important;
}

.stButton > button[kind="primary"],
button[kind="primaryFormSubmit"] {
    background: linear-gradient(135deg, var(--brand-accent) 0%, #FF9A76 100%) !important;
    color: #FFFFFF !important;
    box-shadow: 0 18px 30px -22px rgba(240, 90, 55, 0.75) !important;
}

.stButton > button[kind="primary"]:hover,
button[kind="primaryFormSubmit"]:hover {
    background: linear-gradient(135deg, var(--brand-accent-strong) 0%, var(--brand-accent) 100%) !important;
}

.stTextInput > div > div > input,
textarea,
[data-baseweb="select"] > div {
    border-radius: 16px !important;
    border-color: var(--brand-line) !important;
    background: rgba(255, 255, 255, 0.84) !important;
    color: var(--brand-ink) !important;
}

.stTextInput > div > div > input:focus,
textarea:focus,
[data-baseweb="select"] > div:focus-within {
    border-color: var(--brand-accent) !important;
    box-shadow: 0 0 0 4px rgba(255, 122, 89, 0.16) !important;
}

.stTabs [data-baseweb="tab-list"] {
    gap: 0.5rem !important;
    border-bottom: 1px solid var(--brand-line) !important;
}

.stTabs [data-baseweb="tab"] {
    height: auto !important;
    padding: 0.55rem 0.95rem !important;
    border-radius: 999px 999px 0 0 !important;
    color: var(--brand-muted) !important;
    font-weight: 700 !important;
}

.stTabs [aria-selected="true"] {
    color: var(--brand-ink) !important;
    background: rgba(255, 255, 255, 0.7) !important;
}

.stProgress > div > div,
.stProgress > div > div > div {
    border-radius: 999px !important;
}

.stProgress > div > div {
    background: rgba(18, 38, 63, 0.08) !important;
}

.stProgress > div > div > div {
    background: linear-gradient(90deg, var(--brand-teal) 0%, var(--brand-accent) 100%) !important;
}

.saas-card,
.stat-card-item,
.timeline-item,
.todo-card,
[data-testid="stVerticalBlockBorderWrapper"] {
    background: var(--surface-panel) !important;
    border: 1px solid rgba(217, 226, 232, 0.92) !important;
    border-radius: 24px !important;
    box-shadow: var(--shadow-soft) !important;
    backdrop-filter: blur(16px);
}

.saas-card:hover,
.timeline-item:hover,
.todo-card:hover {
    border-color: #C7D3DC !important;
}

.page-header-container {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 1rem;
    padding: 1.15rem 1.2rem;
    margin-bottom: 1.35rem;
    border: 1px solid rgba(217, 226, 232, 0.92);
    border-radius: 28px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 244, 238, 0.86) 100%);
    box-shadow: var(--shadow-soft);
}

.page-header-container::after {
    content: "";
    position: absolute;
    right: -2rem;
    bottom: -2.5rem;
    width: 9rem;
    height: 9rem;
    border-radius: 999px;
    background: rgba(255, 122, 89, 0.09);
}

.page-header-container::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(44, 140, 123, 0.08), transparent 38%);
    pointer-events: none;
}

.page-header-icon {
    position: relative;
    z-index: 1;
    width: 68px;
    height: 68px;
    border-radius: 20px;
    font-size: 2rem;
    background: linear-gradient(135deg, var(--brand-accent-soft) 0%, #FFE7D6 100%) !important;
    border-color: #FFD3C2 !important;
    box-shadow: 0 18px 30px -24px rgba(240, 90, 55, 0.55) !important;
}

.page-header-text {
    position: relative;
    z-index: 1;
}

.page-header-text h1 {
    font-size: clamp(1.7rem, 4vw, 2.45rem);
    line-height: 1.02;
    margin: 0;
}

.page-header-text p {
    margin: 0.32rem 0 0 0;
    max-width: 42rem;
    font-size: 1rem;
}

.sidebar-shell {
    padding: 0.85rem 0.85rem 1rem;
    margin: 0.65rem 0.8rem 1rem;
    border-radius: 24px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.78) 0%, rgba(246, 248, 251, 0.82) 100%);
    border: 1px solid rgba(217, 226, 232, 0.92);
    box-shadow: 0 22px 38px -34px rgba(18, 38, 63, 0.45);
}

.sidebar-brand {
    text-align: center;
    padding: 0.6rem 0 0.2rem;
}

.sidebar-mark {
    width: 58px;
    height: 58px;
    margin: 0 auto 0.85rem;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-size: 1.75rem;
    font-weight: 800;
    color: #FFFFFF !important;
    background: linear-gradient(135deg, var(--brand-ink) 0%, #214765 100%);
    box-shadow: 0 18px 34px -24px rgba(18, 38, 63, 0.8);
}

.sidebar-title {
    font-family: 'Manrope', sans-serif;
    font-size: 1.04rem;
    font-weight: 800;
    color: var(--brand-ink) !important;
    letter-spacing: -0.02em;
}

.sidebar-subtitle {
    margin-top: 0.2rem;
    font-size: 0.76rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: var(--brand-muted) !important;
}

.sidebar-user-card,
.sidebar-alert,
.sidebar-footer-card {
    border-radius: 18px;
    border: 1px solid rgba(217, 226, 232, 0.88);
}

.sidebar-user-card {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.85rem 0.9rem;
    margin-bottom: 0.9rem;
    background: rgba(255, 255, 255, 0.76);
}

.sidebar-user-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.05rem;
    color: #FFFFFF !important;
    background: linear-gradient(135deg, var(--brand-accent) 0%, #FF9A76 100%);
    box-shadow: 0 12px 24px -20px rgba(240, 90, 55, 0.85);
    overflow: hidden;
    flex: 0 0 auto;
}

.sidebar-user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.sidebar-user-name {
    font-weight: 800;
    color: var(--brand-ink) !important;
    line-height: 1.2;
}

.sidebar-user-role {
    margin-top: 0.14rem;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--brand-muted) !important;
}

.sidebar-alert {
    padding: 0.75rem 0.85rem;
    margin: 0.7rem 0;
    background: rgba(255, 241, 216, 0.78);
    color: #AA6D12 !important;
    font-size: 0.78rem;
    font-weight: 700;
}

.sidebar-section-label {
    margin: 0.8rem 0 0.45rem;
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--brand-muted) !important;
}

.sidebar-footer-card {
    padding: 0.8rem 0.9rem;
    background: rgba(255, 255, 255, 0.74);
    text-align: center;
    font-size: 0.74rem;
    line-height: 1.5;
    color: var(--brand-muted) !important;
}

.sidebar-footer-card strong {
    color: var(--brand-ink) !important;
}

.sidebar-shell + div[data-testid="stSidebarNav"] {
    margin-top: 0.15rem;
}

section[data-testid="stSidebar"] .stSelectbox,
section[data-testid="stSidebar"] .stToggle,
section[data-testid="stSidebar"] .stButton {
    margin-bottom: 0.85rem;
}

section[data-testid="stSidebar"] [data-baseweb="select"] > div {
    background: rgba(255, 255, 255, 0.82) !important;
}

section[data-testid="stSidebar"] .stButton > button {
    background: linear-gradient(135deg, var(--brand-accent) 0%, #FF9A76 100%) !important;
    color: #FFFFFF !important;
    border: none !important;
}

section[data-testid="stSidebar"] .stButton > button:hover {
    background: linear-gradient(135deg, var(--brand-accent-strong) 0%, var(--brand-accent) 100%) !important;
}

section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"] {
    border-radius: 16px !important;
    padding: 0.72rem 0.9rem !important;
    margin: 0.2rem 0 !important;
    border: 1px solid transparent !important;
}

section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"][aria-current="page"] {
    background: rgba(255, 122, 89, 0.12) !important;
    border-left: none !important;
    border-color: rgba(255, 122, 89, 0.22) !important;
}

section[data-testid="stSidebar"] a[data-testid="stSidebarNavLink"] span {
    font-weight: 700 !important;
}

section[data-testid="stSidebar"] hr {
    margin: 1rem 0 !important;
}

.stat-card-grid {
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.stat-card-item {
    padding: 1.1rem 1.15rem;
}

.stat-card-title {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.74rem;
}

.badge-pill.indigo {
    background: var(--brand-accent-soft) !important;
    color: var(--brand-accent-strong) !important;
    border-color: #FFD0C2 !important;
}

.badge-pill.emerald {
    background: var(--brand-teal-soft) !important;
    color: #216A5E !important;
    border-color: #BEE3DA !important;
}

.badge-pill.amber {
    background: #FFF1D8 !important;
    color: #AA6D12 !important;
    border-color: #FFD89D !important;
}

.badge-pill.rose {
    background: #FFE3D6 !important;
    color: #C45634 !important;
    border-color: #FFC4AE !important;
}

.badge-pill.slate {
    background: var(--surface-muted) !important;
    color: var(--brand-muted) !important;
    border-color: var(--brand-line) !important;
}

.google-oauth-btn {
    border-radius: 16px !important;
    padding: 0.95rem 1.1rem !important;
    border-color: var(--brand-line) !important;
    background: rgba(255, 255, 255, 0.88) !important;
    color: var(--brand-ink) !important;
}

.google-oauth-btn:hover {
    border-color: #B8C5D0 !important;
    background: rgba(255, 255, 255, 1) !important;
}

.lang-switch {
    display: inline-flex;
    gap: 0.45rem;
    align-items: center;
    padding: 0.35rem;
    margin-bottom: 1rem;
    border-radius: 999px;
    border: 1px solid rgba(217, 226, 232, 0.95);
    background: rgba(255, 255, 255, 0.72);
    box-shadow: 0 12px 24px -22px rgba(18, 38, 63, 0.5);
}

.lang-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3.25rem;
    padding: 0.55rem 0.8rem;
    border-radius: 999px;
    color: var(--brand-muted);
    text-decoration: none !important;
    font-weight: 700;
    letter-spacing: 0.03em;
}

.lang-chip.active {
    background: var(--brand-ink);
    color: #FFFFFF !important;
    box-shadow: 0 14px 24px -22px rgba(18, 38, 63, 0.8);
}

.landing-kicker,
.dashboard-kicker,
.auth-panel-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.8rem;
    border-radius: 999px;
    background: rgba(255, 122, 89, 0.12);
    color: var(--brand-accent-strong) !important;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    margin-bottom: 1rem;
}

.landing-title {
    font-size: clamp(2.6rem, 7vw, 4.7rem) !important;
    line-height: 0.96 !important;
    letter-spacing: -0.05em !important;
    margin: 0 0 1rem 0 !important;
    max-width: 10ch;
}

.landing-title .accent {
    color: var(--brand-accent) !important;
}

.landing-lead {
    max-width: 34rem;
    font-size: 1.12rem;
    line-height: 1.65;
    margin: 0 0 1.25rem 0;
}

.landing-metrics,
.feature-grid,
.week-grid,
.tool-grid {
    display: grid;
    gap: 1rem;
}

.landing-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin: 1.25rem 0;
}

.landing-metric,
.feature-tile,
.week-card,
.tool-card {
    padding: 1rem 1.05rem;
    border-radius: 22px;
    border: 1px solid rgba(217, 226, 232, 0.92);
    background: rgba(255, 255, 255, 0.72);
    box-shadow: 0 16px 32px -28px rgba(18, 38, 63, 0.35);
}

.landing-metric strong {
    display: block;
    margin-bottom: 0.2rem;
    font-family: 'Manrope', sans-serif;
    font-size: 1.65rem;
    line-height: 1;
    color: var(--brand-ink);
}

.landing-metric span,
.feature-tile p,
.week-card p,
.tool-card div:last-child {
    color: var(--brand-muted);
    font-size: 0.92rem;
    line-height: 1.45;
}

.landing-spotlight {
    padding: 1.15rem;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(18, 38, 63, 0.96) 0%, rgba(31, 79, 99, 0.92) 100%);
    color: #FFFFFF !important;
    box-shadow: 0 24px 48px -30px rgba(11, 31, 51, 0.8);
}

.landing-spotlight h4,
.landing-spotlight p,
.dashboard-hero h1,
.dashboard-hero p,
.dashboard-progress-card * {
    color: #FFFFFF !important;
}

.landing-spotlight-grid {
    display: grid;
    gap: 0.85rem;
    margin-top: 0.9rem;
}

.landing-spotlight-item {
    display: flex;
    gap: 0.8rem;
    align-items: flex-start;
}

.landing-spotlight-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    flex: 0 0 auto;
}

.auth-panel-intro h3 {
    margin: 0;
    font-size: 1.6rem;
}

.auth-panel-intro p,
.auth-panel-note {
    margin: 0.35rem 0 0;
    color: var(--brand-muted) !important;
    font-size: 0.95rem;
    line-height: 1.5;
}

.landing-section-head {
    margin: 3rem 0 1rem;
}

.landing-section-head span {
    display: block;
    margin-bottom: 0.35rem;
    color: var(--brand-accent-strong);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.landing-section-head h3 {
    margin: 0;
    font-size: 2rem;
}

.landing-section-head p {
    margin: 0.45rem 0 0;
    max-width: 42rem;
    font-size: 1rem;
}

.feature-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

.feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 16px;
    margin-bottom: 0.85rem;
    background: var(--brand-accent-soft);
    font-size: 1.2rem;
}

.feature-tile h4,
.week-card h4,
.tool-card div:nth-child(2) {
    margin: 0 0 0.35rem 0;
    color: var(--brand-ink);
    font-size: 1.02rem;
}

.dashboard-hero {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(220px, 0.7fr);
    gap: 1rem;
    padding: 1.45rem;
    margin-bottom: 1.5rem;
    border-radius: 28px;
    background: linear-gradient(145deg, var(--brand-deep) 0%, #14324B 62%, #21616B 100%);
    box-shadow: 0 30px 55px -34px rgba(11, 31, 51, 0.85);
}

.dashboard-hero::after {
    content: "";
    position: absolute;
    inset: auto -3rem -3rem auto;
    width: 11rem;
    height: 11rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
}

.dashboard-hero h1 {
    margin: 0 0 0.45rem 0 !important;
    font-size: clamp(2rem, 4vw, 3rem) !important;
    line-height: 1.02 !important;
}

.dashboard-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1rem;
}

.dashboard-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.45rem 0.75rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: #FFFFFF !important;
    font-size: 0.85rem;
    font-weight: 700;
}

.dashboard-progress-card {
    position: relative;
    z-index: 1;
    padding: 1rem;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(18px);
    text-align: right;
}

.dashboard-progress-label {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    opacity: 0.82;
}

.dashboard-progress-value {
    margin: 0.3rem 0;
    font-family: 'Manrope', sans-serif;
    font-size: 3.4rem;
    font-weight: 800;
    line-height: 0.95;
}

.dashboard-progress-meta {
    font-size: 0.95rem;
    opacity: 0.9;
}

.week-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.week-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.85rem;
}

.week-card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 16px;
    font-size: 1.2rem;
    background: var(--surface-muted);
}

.week-card-progress {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 0.85rem;
    border-top: 1px solid rgba(217, 226, 232, 0.92);
}

.tool-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    margin-top: 0.5rem;
}

.tool-card {
    text-align: center;
}

.table-scroll {
    overflow-x: auto;
}

.table-scroll table {
    min-width: 620px;
}

.info-hero,
.resource-hero,
.exercise-hero,
.tutor-hero,
.insight-card,
.resource-section-card,
.suggestion-card,
.timeline-intro-card,
.exercise-meta-card,
.review-banner {
    border-radius: 24px;
    border: 1px solid rgba(217, 226, 232, 0.92);
    box-shadow: var(--shadow-soft);
}

.info-hero,
.resource-hero,
.exercise-hero,
.tutor-hero {
    display: grid;
    gap: 1rem;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.86) 0%, rgba(255, 246, 240, 0.94) 100%);
}

.resource-hero,
.exercise-hero,
.tutor-hero {
    grid-template-columns: minmax(0, 1.2fr) minmax(220px, 0.8fr);
}

.review-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 1rem;
    margin: 0 0 1rem 0;
    background: linear-gradient(135deg, rgba(255, 122, 89, 0.14) 0%, rgba(255, 240, 234, 0.88) 100%);
}

.hero-kicker {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-bottom: 0.75rem;
    padding: 0.42rem 0.75rem;
    border-radius: 999px;
    background: rgba(255, 122, 89, 0.1);
    color: var(--brand-accent-strong) !important;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.hero-title {
    margin: 0;
    font-size: clamp(1.65rem, 4vw, 2.5rem);
    line-height: 1.05;
}

.hero-copy p,
.hero-note,
.meta-label,
.meta-value,
.hero-subtle,
.resource-item p,
.resource-item strong,
.suggestion-card p,
.suggestion-card strong,
.timeline-intro-card p,
.insight-card p {
    color: var(--brand-muted) !important;
}

.meta-grid,
.insight-grid,
.resource-summary-grid,
.tutor-suggestion-grid {
    display: grid;
    gap: 0.85rem;
}

.meta-grid,
.resource-summary-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.insight-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    margin-bottom: 1rem;
}

.progress-card-shell,
.details-card-shell,
.challenge-form-shell,
.tutor-chat-shell {
    padding: 1rem 1.05rem;
    border-radius: 24px;
    border: 1px solid rgba(217, 226, 232, 0.92);
    background: rgba(255, 255, 255, 0.76);
    box-shadow: var(--shadow-soft);
}

.progress-card-shell,
.challenge-form-shell,
.tutor-chat-shell {
    margin-bottom: 1rem;
}

.tutor-chat-shell:empty {
    display: none;
}

.details-card-shell {
    margin-top: 1rem;
}

.meta-card,
.insight-card,
.resource-summary-card,
.exercise-meta-card {
    padding: 0.95rem 1rem;
    background: rgba(255, 255, 255, 0.72);
}

.meta-value,
.resource-summary-card strong,
.exercise-meta-value {
    display: block;
    font-family: 'Manrope', sans-serif;
    font-size: 1.6rem;
    line-height: 1;
    color: var(--brand-ink) !important;
}

.meta-label,
.resource-summary-card span,
.exercise-meta-label {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.84rem;
}

.resource-section-card h3,
.tutor-hero h3,
.timeline-intro-card h3,
.exercise-meta-card h4 {
    margin: 0 0 0.45rem 0;
    color: var(--brand-ink) !important;
}

.resource-section-card {
    padding: 1.1rem 1.15rem;
    margin-bottom: 1rem;
    background: rgba(255, 255, 255, 0.76);
}

.resource-list {
    display: grid;
    gap: 0.8rem;
}

.resource-item {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid rgba(217, 226, 232, 0.72);
}

.resource-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.resource-badge {
    flex: 0 0 auto;
    min-width: 2.7rem;
    text-align: center;
    padding: 0.35rem 0.6rem;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
}

.exercise-grid {
    display: grid;
    gap: 0.9rem;
}

.exercise-checkbox-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(217, 226, 232, 0.72);
}

.exercise-status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--brand-muted) !important;
    justify-content: flex-end;
}

.challenge-heading {
    margin: 0 0 0.4rem 0;
    color: var(--brand-ink) !important;
}

.tutor-capability-list {
    display: grid;
    gap: 0.7rem;
    margin-top: 0.9rem;
}

.tutor-capability-item {
    display: flex;
    gap: 0.7rem;
    align-items: flex-start;
    padding: 0.8rem 0.9rem;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.74);
    border: 1px solid rgba(217, 226, 232, 0.82);
}

.tutor-capability-bullet {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 999px;
    background: var(--brand-accent-soft);
    color: var(--brand-accent-strong) !important;
    font-size: 0.78rem;
    font-weight: 800;
    flex: 0 0 auto;
}

.section-title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 32px 0 16px 0;
}

.section-title-icon {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
}

.section-title-text {
    margin: 0;
    font-size: 1.4rem;
}

.exercise-item-card {
    padding: 1rem 1.05rem;
    background: rgba(255, 255, 255, 0.76);
    border-radius: 22px;
    border: 1px solid rgba(217, 226, 232, 0.92);
    box-shadow: 0 18px 35px -30px rgba(18, 38, 63, 0.34);
}

.exercise-item-card.done {
    background: linear-gradient(135deg, rgba(231, 245, 241, 0.9) 0%, rgba(255, 255, 255, 0.76) 100%);
}

.exercise-item-top,
.exercise-challenge-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.8rem;
    margin-bottom: 0.5rem;
}

.exercise-title {
    margin: 0;
    font-size: 1.02rem;
    color: var(--brand-ink) !important;
}

.exercise-desc,
.challenge-note {
    margin: 0;
    color: var(--brand-muted) !important;
    line-height: 1.5;
}

.timeline-intro-card {
    padding: 1rem 1.05rem;
    margin-bottom: 1rem;
    background: rgba(255, 255, 255, 0.78);
}

.tutor-suggestion-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 1rem;
}

.suggestion-card {
    padding: 0.95rem 1rem;
    background: rgba(255, 255, 255, 0.78);
}

.stChatMessage {
    border-radius: 20px !important;
    border: 1px solid rgba(217, 226, 232, 0.92) !important;
    background: rgba(255, 255, 255, 0.76) !important;
    box-shadow: 0 18px 32px -30px rgba(18, 38, 63, 0.35) !important;
    padding: 0.9rem 1rem !important;
}

.tutor-hero .saas-card {
    margin-bottom: 0;
}

@media (max-width: 768px) {
    .block-container {
        padding-top: 0.6rem !important;
        padding-left: 1rem !important;
        padding-right: 1rem !important;
        padding-bottom: 2.5rem !important;
    }
    [data-testid="stHorizontalBlock"] {
        flex-wrap: wrap !important;
        gap: 0.9rem !important;
    }
    [data-testid="column"] {
        width: 100% !important;
        flex: 1 1 100% !important;
        min-width: 100% !important;
    }
    .landing-title {
        max-width: none;
        font-size: clamp(2.2rem, 10vw, 3rem) !important;
    }
    .landing-metrics,
    .feature-grid,
    .week-grid,
    .dashboard-hero,
    .tool-grid,
    .meta-grid,
    .resource-summary-grid,
    .resource-hero,
    .exercise-hero,
    .tutor-hero,
    .tutor-suggestion-grid {
        grid-template-columns: 1fr !important;
    }
    .lang-switch {
        width: 100%;
        justify-content: space-between;
    }
    .lang-chip {
        flex: 1 1 auto;
    }
    .landing-section-head h3 {
        font-size: 1.55rem;
    }
    .dashboard-progress-card {
        text-align: left;
    }
    .timeline-header,
    .timeline-exercise-item,
    .todo-card-header,
    .week-card-top,
    .week-card-progress,
    .exercise-checkbox-wrap,
    .section-title-row {
        flex-direction: column;
        align-items: flex-start !important;
    }
}
</style>
""", unsafe_allow_html=True)

    # Dark mode — injected as separate style block
    if dark:
        st.markdown("<style>" + dark_css + "</style>", unsafe_allow_html=True)
        st.markdown("""
<style>
:root {
    --brand-ink: #F8FAFC;
    --brand-deep: #08121F;
    --brand-muted: #A8B8C8;
    --brand-line: #284055;
    --brand-accent: #FF8D70;
    --brand-accent-strong: #FF6D49;
    --brand-accent-soft: rgba(255, 141, 112, 0.12);
    --brand-teal: #58B3A3;
    --brand-teal-soft: rgba(88, 179, 163, 0.14);
    --surface-base: #091625;
    --surface-panel: rgba(15, 30, 47, 0.82);
    --surface-muted: #11253A;
}

.stApp {
    background:
        radial-gradient(circle at top left, rgba(255, 141, 112, 0.14), transparent 28%),
        radial-gradient(circle at 85% 12%, rgba(88, 179, 163, 0.12), transparent 26%),
        linear-gradient(180deg, #08121F 0%, #0A1725 52%, #0F1F31 100%) !important;
}

.saas-card,
.stat-card-item,
.timeline-item,
.todo-card,
[data-testid="stVerticalBlockBorderWrapper"] {
    background: rgba(15, 30, 47, 0.86) !important;
    border-color: rgba(40, 64, 85, 0.95) !important;
}

.lang-switch,
.landing-metric,
.feature-tile,
.week-card,
.tool-card,
.google-oauth-btn {
    background: rgba(15, 30, 47, 0.78) !important;
    border-color: rgba(40, 64, 85, 0.95) !important;
}

.lang-chip { color: #D8E3EC !important; }
.lang-chip.active { background: #F8FAFC; color: #08121F !important; }
.landing-spotlight { background: linear-gradient(135deg, #10253A 0%, #123C45 100%) !important; }
.dashboard-hero { background: linear-gradient(145deg, #08121F 0%, #0D243A 62%, #14505A 100%) !important; }
</style>
""", unsafe_allow_html=True)


def page_header(title: str, subtitle: str = "", icon: str = ""):
    """Render a modern SaaS page header."""
    import textwrap
    icon_html = f'<div class="page-header-icon">{icon}</div>' if icon else ''
    render_html(textwrap.dedent(f'''
    <div class="page-header-container">
        {icon_html}
        <div class="page-header-text">
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
    </div>
    '''))


def stat_cards(items: list[dict]):
    """Render a grid of modern stat cards. items = [{"value", "label", "icon"}]"""
    import textwrap
    html = '<div class="stat-card-grid">\n'
    for item in items:
        icon_html = f'<span class="icon">{item["icon"]}</span>' if item.get("icon") else ''
        html += textwrap.dedent(f'''
        <div class="stat-card-item">
            <div class="stat-card-title">{icon_html} {item["label"]}</div>
            <div class="stat-card-value">{item["value"]}</div>
        </div>
        ''')
    html += '</div>'
    render_html(html)


def section_title(title: str, icon: str = "", badge_color: str = "indigo"):
    """Section title with a small accompanying icon/emoji."""
    import textwrap
    st.markdown(textwrap.dedent(f'''
    <div class="section-title-row">
        <span class="section-title-icon" style="background:var(--bg-{badge_color}, #F1F5F9);">{icon}</span>
        <h2 class="section-title-text">{title}</h2>
    </div>
    '''))

def circular_progress(pct: int, label: str = "Progresso"):
    """Render a circular progress indicator (Restored for backwards compatibility)."""
    r = 56
    c = 2 * 3.14159 * r
    offset = c * (1 - pct / 100)
    render_html(f'''
    <div style="width:140px; height:140px; margin:0 auto; position:relative;">
        <svg width="140" height="140" style="transform:rotate(-90deg);">
            <circle cx="70" cy="70" r="{r}" fill="none" stroke="var(--surface-muted)" stroke-width="10"/>
            <circle cx="70" cy="70" r="{r}" fill="none" stroke="var(--brand-accent)" stroke-width="10"
                    stroke-dasharray="{c}" stroke-dashoffset="{offset}" stroke-linecap="round"/>
        </svg>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center;">
            <div style="font-size:1.8rem; font-weight:800; color:var(--brand-ink); line-height:1;">{pct}%</div>
            <div style="font-size:0.7rem; color:var(--brand-muted); text-transform:uppercase; font-weight:600; letter-spacing:0.05em;">{label}</div>
        </div>
    </div>
    ''')
