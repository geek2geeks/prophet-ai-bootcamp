import streamlit as st
from lib.auth import require_auth
from lib.course import DAYS
from lib.theme import inject_css, page_header, section_title

require_auth()
inject_css()

page_header("Programa do Curso", "10 dias / 2 semanas / 80 horas — AI & Data Science para Atuarios de Vida", "📖")

# Semana selector
semana = st.radio("Semana", ["Semana 1 (Dias 1–5)", "Semana 2 (Dias 6–10)"], horizontal=True)
sem_num = 1 if "1" in semana else 2

days_filtered = [d for d in DAYS if d["semana"] == sem_num]

if sem_num == 1:
    st.markdown("""
    <div style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE); border-radius:14px; padding:16px 20px; margin-bottom:16px;">
        <div style="font-weight:700; color:#1D4ED8; font-size:0.95rem; margin-bottom:4px;">
            ⚡ Semana 1: AI Engineering & Competencias Core
        </div>
        <div style="color:#475569; font-size:0.85rem; line-height:1.5;">
            Dominar as ferramentas. Especificar, gerar, auditar e deployar codigo atuarial com IA.
            Foco em dados de Vida. Dia 3 dedicado a Saude (OCR, pricing, pipeline).
        </div>
    </div>
    """, unsafe_allow_html=True)
else:
    st.markdown("""
    <div style="background:linear-gradient(135deg,#F5F3FF,#EDE9FE); border-radius:14px; padding:16px 20px; margin-bottom:16px;">
        <div style="font-weight:700; color:#6D28D9; font-size:0.95rem; margin-bottom:4px;">
            🚀 Semana 2: Construindo o Prophet AI & Empreendedorismo
        </div>
        <div style="color:#475569; font-size:0.85rem; line-height:1.5;">
            Construir um clone do Prophet focado em Vida, potenciado por agentes LLM.
            Transforma-lo num produto SaaS com RBAC e deploy no Streamlit Cloud.
        </div>
    </div>
    """, unsafe_allow_html=True)

for day in days_filtered:
    week_cls = "" if day["semana"] == 1 else " week2"
    st.markdown(f"""
    <div class="timeline-card{week_cls}">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
            <div style="background:{'#DBEAFE' if day['semana']==1 else '#EDE9FE'}; color:{'#1D4ED8' if day['semana']==1 else '#6D28D9'};
                        font-weight:800; padding:4px 14px; border-radius:8px; font-size:0.85rem;">
                DIA {day['dia']}
            </div>
            <div style="font-weight:700; color:#0F172A; font-size:1.05rem;">{day['titulo']}</div>
        </div>
        <div style="color:#64748B; font-size:0.88rem; margin-bottom:12px;">{day['objetivo']}</div>
    </div>
    """, unsafe_allow_html=True)

    with st.expander(f"   Ver detalhes — Dia {day['dia']}", expanded=False):
        st.markdown("**Modulos**")
        for i, mod in enumerate(day["modulos"], 1):
            st.markdown(f"- Modulo {(day['dia']-1)*2 + i}: {mod}")

        st.markdown("**Exercicios**")
        for ex in day["exercicios"]:
            st.markdown(f'''
            <div style="display:flex; align-items:center; gap:10px; padding:6px 0;">
                <span class="badge-pill blue">{ex["pontos"]} pts</span>
                <strong style="color:#0F172A; font-size:0.9rem;">{ex["id"].upper()}</strong>
                <span style="color:#475569; font-size:0.88rem;">— {ex["titulo"]}</span>
            </div>''', unsafe_allow_html=True)
            st.caption(f"  {ex['descricao']}")

        d = day["desafio"]
        st.markdown("**Desafio do Dia**")
        st.markdown(f'''
        <div style="display:flex; align-items:center; gap:10px; padding:6px 0;">
            <span class="badge-pill purple">{d["pontos"]} pts</span>
            <strong style="color:#0F172A; font-size:0.9rem;">{d["titulo"]}</strong>
        </div>''', unsafe_allow_html=True)
        st.caption(d["descricao"])

st.markdown("---")
section_title("Avaliacao", "📝", "#FEF3C7", "#92400E")
st.markdown("""
| Componente | Pontos | Peso |
|---|---|---|
| Exercicios Diarios (Dias 1-9) | 200 | 20% |
| Desafios Diarios (melhor 8 de 9) | 200 | 20% |
| Tarefas para Casa | 100 | 10% |
| Participacao & Forum | 100 | 10% |
| **Projeto Final (Prophet AI)** | **400** | **40%** |
""")
