import streamlit as st
from lib.auth import require_auth
from lib.ai import get_ai_response
from lib.theme import inject_css, page_header, render_html
from lib.i18n import t

require_auth()
inject_css()

page_header(t("tutor_title"), t("tutor_sub"), "🤖")

# Init chat history
if "chat_messages" not in st.session_state:
    st.session_state.chat_messages = []

# Welcome state
if not st.session_state.chat_messages:
    suggestions = [
        ("📋", t("tutor_sug_1")),
        ("📐", t("tutor_sug_2")),
        ("🏛", t("tutor_sug_3")),
        ("🔌", t("tutor_sug_4")),
        ("💰", t("tutor_sug_5")),
        ("🔍", t("tutor_sug_6")),
    ]

    render_html(f"""
    <div class="tutor-hero">
        <div class="hero-copy">
            <div class="hero-kicker">{t('tutor_title')}</div>
            <h2 class="hero-title">{t('tutor_welcome')}</h2>
            <p>{t('tutor_welcome_sub')}</p>
            <p class="hero-note">{t('tutor_ready')}</p>
            <div class="tutor-capability-list">
                <div class="tutor-capability-item"><span class="tutor-capability-bullet">01</span><p>{t('tutor_capability_1')}</p></div>
                <div class="tutor-capability-item"><span class="tutor-capability-bullet">02</span><p>{t('tutor_capability_2')}</p></div>
                <div class="tutor-capability-item"><span class="tutor-capability-bullet">03</span><p>{t('tutor_capability_3')}</p></div>
                <div class="tutor-capability-item"><span class="tutor-capability-bullet">04</span><p>{t('tutor_capability_4')}</p></div>
            </div>
        </div>
        <div class="suggestion-card">
            <strong>{t('tutor_prompt_title')}</strong>
            <p>{t('tutor_ask_hint')}</p>
            <div class="tutor-suggestion-grid">
                <div class="suggestion-card"><strong>{suggestions[0][0]}</strong><p>{suggestions[0][1]}</p></div>
                <div class="suggestion-card"><strong>{suggestions[1][0]}</strong><p>{suggestions[1][1]}</p></div>
                <div class="suggestion-card"><strong>{suggestions[2][0]}</strong><p>{suggestions[2][1]}</p></div>
                <div class="suggestion-card"><strong>{suggestions[3][0]}</strong><p>{suggestions[3][1]}</p></div>
            </div>
        </div>
    </div>
    """)

    cols = st.columns(2)
    for i, (icon, text) in enumerate(suggestions):
        with cols[i % 2]:
            if st.button(f"{icon}  {text}", key=f"sug_{i}", width="stretch"):
                st.session_state.chat_messages.append({"role": "user", "content": text})
                st.rerun()

# Display chat history
render_html('<div class="tutor-chat-shell">')
for msg in st.session_state.chat_messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Chat input
if prompt := st.chat_input(t("chat_placeholder")):
    st.session_state.chat_messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner(t("thinking")):
            response = get_ai_response(st.session_state.chat_messages)
        st.markdown(response)

    st.session_state.chat_messages.append({"role": "assistant", "content": response})
render_html('</div>')

# Clear chat
if st.session_state.chat_messages:
    st.markdown("")
    if st.button(f"🗑  {t('clear_chat')}"):
        st.session_state.chat_messages = []
        st.rerun()
