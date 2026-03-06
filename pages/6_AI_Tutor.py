import streamlit as st
from lib.auth import require_auth
from lib.ai import get_ai_response
from lib.theme import inject_css, page_header

require_auth()
inject_css()

page_header("AI Tutor", "O teu assistente pessoal para duvidas do bootcamp -- powered by DeepSeek")

# Init chat history
if "chat_messages" not in st.session_state:
    st.session_state.chat_messages = []

# Suggested questions
if not st.session_state.chat_messages:
    st.markdown("""
    <div style="text-align:center; padding:24px 0 16px; color:#64748B;">
        <div style="font-size:1.1rem; font-weight:600; color:#0F172A; margin-bottom:4px;">Experimenta perguntar</div>
        <div style="font-size:0.85rem;">Clica numa sugestao ou escreve a tua propria pergunta</div>
    </div>
    """, unsafe_allow_html=True)

    suggestions = [
        "O que e a clausula de incontestabilidade e como afeta os sinistros?",
        "Como calculo a reserva V(t) para um seguro temporario?",
        "Quais sao os choques de Solvencia II para o modulo Vida?",
        "Como configuro o CrewAI para usar a API DeepSeek?",
        "Explica-me a diferenca entre Net Premium Reserve e Gross Premium Reserve.",
        "Como deteto anomalias no sinistralidade_vida.csv?",
    ]
    cols = st.columns(2)
    for i, s in enumerate(suggestions):
        with cols[i % 2]:
            if st.button(s, key=f"sug_{i}", use_container_width=True):
                st.session_state.chat_messages.append({"role": "user", "content": s})
                st.rerun()

# Display chat history
for msg in st.session_state.chat_messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Chat input
if prompt := st.chat_input("Escreve a tua pergunta..."):
    st.session_state.chat_messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner("A pensar..."):
            response = get_ai_response(st.session_state.chat_messages)
        st.markdown(response)

    st.session_state.chat_messages.append({"role": "assistant", "content": response})

# Clear chat button
if st.session_state.chat_messages:
    st.markdown("")
    if st.button("Limpar conversa"):
        st.session_state.chat_messages = []
        st.rerun()
