import streamlit as st
import pandas as pd
from lib.auth import require_auth
from lib.course import get_badge, get_all_exercises
from lib.db import get_leaderboard, get_progress, get_submissions
from lib.theme import inject_css, page_header, stat_cards, section_title

require_auth()
inject_css()

page_header("Leaderboard", "Ranking dos alunos por pontuacao total", "🏆")

data = get_leaderboard()

if data:
    df = pd.DataFrame(data)
    if "pontos_total" in df.columns:
        df = df.sort_values("pontos_total", ascending=False).reset_index(drop=True)
        df["badge"] = df["pontos_total"].apply(get_badge)

        # Podium for top 3
        top = df.head(3).to_dict("records")
        medals = ["🥇", "🥈", "🥉"]
        podium_cls = ["podium-1", "podium-2", "podium-3"]

        if len(top) >= 2:
            st.markdown('<div class="podium">', unsafe_allow_html=True)
            # Show in order: 2nd, 1st, 3rd
            order = [1, 0, 2] if len(top) >= 3 else [1, 0]
            for i in order:
                if i < len(top):
                    r = top[i]
                    st.markdown(f'''
                    <div class="podium-item {podium_cls[i]}">
                        <div class="medal">{medals[i]}</div>
                        <div class="name">{r.get("nome", "—")}</div>
                        <div class="pts">{r.get("pontos_total", 0)} pts</div>
                        <div style="margin-top:4px;"><span class="badge-pill purple" style="font-size:0.65rem;">{r.get("badge", "")}</span></div>
                    </div>''', unsafe_allow_html=True)
            st.markdown('</div>', unsafe_allow_html=True)

        st.markdown("")

        # Full table
        section_title("Ranking Completo", "📊", "#DBEAFE", "#1D4ED8")

        df_display = df.copy()
        df_display.index = range(1, len(df_display) + 1)
        df_display.index.name = "#"
        cols_display = ["nome", "pontos_exercicios", "pontos_desafios", "pontos_total", "badge"]
        cols_available = [c for c in cols_display if c in df_display.columns]
        st.dataframe(
            df_display[cols_available].rename(columns={
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
    st.markdown("""
    <div style="text-align:center; padding:60px 20px; color:#94A3B8;">
        <div style="font-size:3rem; margin-bottom:12px;">🏆</div>
        <div style="font-size:1.1rem; font-weight:600; color:#475569; margin-bottom:4px;">Leaderboard vazio</div>
        <div style="font-size:0.9rem;">Completa exercicios para aparecer aqui!</div>
    </div>
    """, unsafe_allow_html=True)

# --- Personal stats ---
st.markdown("---")
section_title("As Tuas Estatisticas", "👤", "#D1FAE5", "#065F46")

user_id = st.session_state.user["id"]
progress = get_progress(user_id)
submissions = get_submissions(user_id)
all_ex = get_all_exercises()

pts_total = (sum(progress.get(e["id"], {}).get("pontos", 0) for e in all_ex)
             + sum(s.get("pontos", 0) for s in submissions.values()))
completed = len([e for e in all_ex if e["id"] in progress or e["id"] in submissions])

stat_cards([
    {"value": str(pts_total), "label": "Total Pontos", "color": "blue", "icon": "⭐"},
    {"value": f"{completed}/{len(all_ex)}", "label": "Exercicios Completos", "color": "green", "icon": "✓"},
    {"value": get_badge(pts_total), "label": "Badge Atual", "color": "purple", "icon": "🏆"},
])
