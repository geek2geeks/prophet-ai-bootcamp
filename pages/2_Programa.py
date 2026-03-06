import streamlit as st
from lib.auth import require_auth
from lib.course import DAYS
from lib.theme import inject_css, page_header

require_auth()
inject_css()

page_header("Programa do Curso", "10 dias / 2 semanas / 80 horas -- AI & Data Science para Atuarios de Vida")

# Semana selector
semana = st.radio("Semana", ["Semana 1 (Dias 1-5)", "Semana 2 (Dias 6-10)"],
                  horizontal=True)
sem_num = 1 if "1" in semana else 2

days_filtered = [d for d in DAYS if d["semana"] == sem_num]

if sem_num == 1:
    st.info("**Semana 1:** AI Engineering & Competencias Core -- Dominar as ferramentas. "
            "Especificar, gerar, auditar e deployar codigo atuarial com IA. "
            "Foco em dados de Vida. Dia 3 dedicado a Saude (OCR, pricing, pipeline).")
else:
    st.info("**Semana 2:** Construindo o Prophet AI & Empreendedorismo -- "
            "Construir um clone do Prophet focado em Vida, potenciado por agentes LLM. "
            "Transforma-lo num produto SaaS com RBAC e deploy no Streamlit Cloud.")

for day in days_filtered:
    with st.expander(f"Dia {day['dia']} -- {day['titulo']}", expanded=False):
        st.markdown(f"**Objetivo:** {day['objetivo']}")

        st.markdown("##### Modulos")
        for i, mod in enumerate(day["modulos"], 1):
            st.markdown(f"- Modulo {(day['dia']-1)*2 + i}: {mod}")

        st.markdown("##### Exercicios")
        for ex in day["exercicios"]:
            st.markdown(f'<div style="padding:4px 0;"><span class="badge-pill blue">{ex["pontos"]} pts</span> <strong>{ex["id"].upper()}</strong> -- {ex["titulo"]}</div>', unsafe_allow_html=True)
            st.caption(f"  {ex['descricao']}")

        d = day["desafio"]
        st.markdown(f"##### Desafio do Dia")
        st.markdown(f'<div style="padding:4px 0;"><span class="badge-pill purple">{d["pontos"]} pts</span> <strong>{d["titulo"]}</strong></div>', unsafe_allow_html=True)
        st.caption(d["descricao"])

st.markdown("---")
st.markdown("#### Avaliacao")
st.markdown("""
| Componente | Pontos | Peso |
|---|---|---|
| Exercicios Diarios (Dias 1-9) | 200 | 20% |
| Desafios Diarios (melhor 8 de 9) | 200 | 20% |
| Tarefas para Casa | 100 | 10% |
| Participacao & Forum | 100 | 10% |
| **Projeto Final (Prophet AI)** | **400** | **40%** |
""")
