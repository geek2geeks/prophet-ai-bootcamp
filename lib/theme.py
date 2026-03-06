import streamlit as st

ACCENT = "#3B82F6"
ACCENT_DARK = "#2563EB"
DARK_BG = "#0F172A"
CARD_BG = "#FFFFFF"
SURFACE = "#F8FAFC"
TEXT = "#1E293B"
TEXT_MUTED = "#64748B"
BORDER = "#E2E8F0"
SUCCESS = "#10B981"
WARNING = "#F59E0B"

def inject_css():
    """Inject global CSS for professional look. Call at top of every page."""
    st.markdown("""
<style>
/* ── Global ── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

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
.stTabs [data-baseweb="tab-highlight"] {
    display: none !important;
}
.stTabs [data-baseweb="tab-border"] {
    display: none !important;
}

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
.stSelectbox > div > div {
    border-radius: 8px !important;
}

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
.stAlert {
    border-radius: 10px !important;
}

/* ── Dataframes ── */
.stDataFrame {
    border-radius: 12px !important;
    overflow: hidden !important;
}

/* ── Dividers ── */
hr {
    border-color: #E2E8F0 !important;
    margin: 1.5rem 0 !important;
}

/* ── Cards (custom HTML) ── */
.pro-card {
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    transition: all 0.2s ease;
}
.pro-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transform: translateY(-2px);
}
.stat-card {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    text-align: center;
}
.stat-card .stat-value {
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 4px;
}
.stat-card .stat-label {
    font-size: 0.8rem;
    font-weight: 500;
    opacity: 0.85;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.stat-card.green { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
.stat-card.purple { background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); }
.stat-card.amber { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); }

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
.google-btn img {
    width: 20px;
    height: 20px;
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
.page-header {
    margin-bottom: 8px;
}
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

/* ── Hero section (landing) ── */
.hero {
    text-align: center;
    padding: 48px 24px 32px;
}
.hero h1 {
    font-size: 2.8rem;
    font-weight: 800;
    color: #0F172A;
    letter-spacing: -0.03em;
    line-height: 1.15;
    margin-bottom: 12px;
}
.hero h1 span {
    background: linear-gradient(135deg, #3B82F6, #8B5CF6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.hero .subtitle {
    font-size: 1.1rem;
    color: #64748B;
    max-width: 600px;
    margin: 0 auto 32px;
    line-height: 1.5;
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

/* ── Feature cards ── */
.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin: 24px 0;
}
.feature-card {
    background: white;
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 24px 20px;
    text-align: center;
    transition: all 0.2s ease;
}
.feature-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.feature-card .icon {
    font-size: 2rem;
    margin-bottom: 10px;
}
.feature-card h4 {
    margin: 0 0 6px;
    color: #0F172A;
    font-weight: 700;
    font-size: 1.4rem;
}
.feature-card p {
    margin: 0;
    color: #64748B;
    font-size: 0.85rem;
}

/* ── Day card for home ── */
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
    width: 40px;
    height: 40px;
    border-radius: 10px;
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
.day-item .day-info p { margin: 0; color: #64748B; font-size: 0.8rem; }
.day-item .day-progress {
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748B;
    white-space: nowrap;
}

/* ── Checkboxes ── */
.stCheckbox label span {
    font-size: 0.95rem !important;
}

/* ── Hide anchor links on headers ── */
h1 a, h2 a, h3 a, h4 a {
    display: none !important;
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
</style>
""", unsafe_allow_html=True)


def page_header(title: str, subtitle: str = ""):
    """Render a standardized page header."""
    html = f'<div class="page-header"><h1>{title}</h1>'
    if subtitle:
        html += f'<p>{subtitle}</p>'
    html += '</div>'
    st.markdown(html, unsafe_allow_html=True)
    st.markdown("---")


def stat_cards(items: list[dict]):
    """Render a row of stat cards. items = [{"value": "10", "label": "Days", "color": "blue|green|purple|amber"}]"""
    cols = st.columns(len(items))
    colors = {"blue": "", "green": "green", "purple": "purple", "amber": "amber"}
    for col, item in zip(cols, items):
        cls = colors.get(item.get("color", "blue"), "")
        with col:
            st.markdown(f'''
            <div class="stat-card {cls}">
                <div class="stat-value">{item["value"]}</div>
                <div class="stat-label">{item["label"]}</div>
            </div>
            ''', unsafe_allow_html=True)
