import streamlit as st

def get_supabase():
    try:
        from supabase import create_client
        url = st.secrets["supabase"]["url"]
        key = st.secrets["supabase"]["key"]
        return create_client(url, key)
    except Exception:
        return None

def is_demo_mode():
    return get_supabase() is None

def init_session():
    if "user" not in st.session_state:
        st.session_state.user = None
    if "role" not in st.session_state:
        st.session_state.role = None
    if "demo_progress" not in st.session_state:
        st.session_state.demo_progress = {}
    if "demo_submissions" not in st.session_state:
        st.session_state.demo_submissions = {}

def login(email: str, password: str) -> bool:
    sb = get_supabase()
    if sb is None:
        # Demo mode
        st.session_state.user = {"id": "demo", "email": email}
        st.session_state.role = "admin" if "admin" in email else "aluno"
        return True
    try:
        res = sb.auth.sign_in_with_password({"email": email, "password": password})
        st.session_state.user = {"id": res.user.id, "email": res.user.email}
        profile = sb.table("user_profiles").select("role").eq("id", res.user.id).single().execute()
        st.session_state.role = profile.data["role"] if profile.data else "aluno"
        return True
    except Exception as e:
        st.error(f"Erro de login: {e}")
        return False

def register(email: str, password: str, nome: str) -> bool:
    sb = get_supabase()
    if sb is None:
        st.session_state.user = {"id": "demo", "email": email}
        st.session_state.role = "aluno"
        return True
    try:
        res = sb.auth.sign_up({"email": email, "password": password})
        sb.table("user_profiles").insert({"id": res.user.id, "nome": nome, "role": "aluno"}).execute()
        st.session_state.user = {"id": res.user.id, "email": res.user.email}
        st.session_state.role = "aluno"
        return True
    except Exception as e:
        st.error(f"Erro no registo: {e}")
        return False

def logout():
    sb = get_supabase()
    if sb:
        try:
            sb.auth.sign_out()
        except Exception:
            pass
    st.session_state.user = None
    st.session_state.role = None

def require_auth():
    init_session()
    if st.session_state.user is None:
        st.warning("Faz login para aceder a esta pagina.")
        st.stop()

def is_admin():
    return st.session_state.get("role") == "admin"
