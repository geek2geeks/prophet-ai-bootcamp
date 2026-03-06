import streamlit as st

SUPABASE_URL = "https://naecdtkxxlawxlkljtkt.supabase.co"

@st.cache_resource
def _create_supabase_client():
    """Create and cache the Supabase client. Returns None if secrets not configured."""
    try:
        from supabase import create_client
        url = st.secrets.get("supabase", {}).get("url", SUPABASE_URL)
        key = st.secrets["supabase"]["key"]
        return create_client(url, key)
    except Exception:
        return None

@st.cache_resource
def _create_supabase_admin():
    """Create admin client with service_role key for profile inserts."""
    try:
        from supabase import create_client
        url = st.secrets.get("supabase", {}).get("url", SUPABASE_URL)
        key = st.secrets["supabase"]["service_key"]
        return create_client(url, key)
    except Exception:
        return None

def get_supabase():
    return _create_supabase_client()

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
    _handle_oauth_callback()

def _get_redirect_url():
    try:
        return st.secrets.get("app", {}).get("url", "http://localhost:8501")
    except Exception:
        return "http://localhost:8501"

def _handle_oauth_callback():
    params = st.query_params
    code = params.get("code")
    if code and st.session_state.get("user") is None:
        sb = get_supabase()
        if sb:
            try:
                res = sb.auth.exchange_code_for_session({"auth_code": code})
                user = res.user
                st.session_state.user = {
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.user_metadata.get("full_name", user.email),
                    "avatar": user.user_metadata.get("avatar_url", ""),
                }
                _ensure_profile(user)
                st.session_state.role = _get_role(sb, str(user.id))
                st.query_params.clear()
            except Exception as e:
                st.query_params.clear()
                st.error(f"Erro no callback OAuth: {e}")

def _ensure_profile(user):
    """Create user profile using admin client to bypass RLS."""
    admin = _create_supabase_admin()
    if not admin:
        return
    try:
        existing = admin.table("user_profiles").select("id").eq("id", str(user.id)).execute()
        if not existing.data:
            name = user.user_metadata.get("full_name", user.email)
            admin.table("user_profiles").insert({
                "id": str(user.id), "nome": name, "role": "aluno"
            }).execute()
    except Exception:
        pass

def _get_role(sb, user_id: str) -> str:
    try:
        res = sb.table("user_profiles").select("role").eq("id", user_id).single().execute()
        return res.data["role"] if res.data else "aluno"
    except Exception:
        return "aluno"

def get_google_login_url() -> str:
    sb = get_supabase()
    if sb is None:
        return ""
    try:
        redirect_url = _get_redirect_url()
        res = sb.auth.sign_in_with_oauth({
            "provider": "google",
            "options": {
                "redirect_to": redirect_url,
            }
        })
        return res.url
    except Exception:
        return ""

def login_email(email: str, password: str) -> bool:
    sb = get_supabase()
    if sb is None:
        st.session_state.user = {"id": "demo", "email": email, "name": email, "avatar": ""}
        st.session_state.role = "admin" if "admin" in email else "aluno"
        return True
    try:
        res = sb.auth.sign_in_with_password({"email": email, "password": password})
        st.session_state.user = {
            "id": str(res.user.id), "email": res.user.email,
            "name": res.user.user_metadata.get("full_name", res.user.email),
            "avatar": res.user.user_metadata.get("avatar_url", ""),
        }
        _ensure_profile(res.user)
        st.session_state.role = _get_role(sb, str(res.user.id))
        return True
    except Exception as e:
        st.error(f"Erro de login: {e}")
        return False

def register_email(email: str, password: str, nome: str) -> bool:
    sb = get_supabase()
    if sb is None:
        st.session_state.user = {"id": "demo", "email": email, "name": nome, "avatar": ""}
        st.session_state.role = "aluno"
        return True
    try:
        res = sb.auth.sign_up({"email": email, "password": password})
        admin = _create_supabase_admin()
        if admin:
            admin.table("user_profiles").insert({
                "id": str(res.user.id), "nome": nome, "role": "aluno"
            }).execute()
        st.session_state.user = {
            "id": str(res.user.id), "email": res.user.email,
            "name": nome, "avatar": "",
        }
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
