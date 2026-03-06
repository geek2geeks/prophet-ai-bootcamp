import streamlit as st

SUPABASE_URL = "https://naecdtkxxlawxlkljtkt.supabase.co"


def _get_anon_key():
    try:
        return st.secrets["supabase"]["key"]
    except Exception:
        return None


@st.cache_resource
def get_admin_client():
    """Admin client (service_role) for data operations. Bypasses RLS."""
    try:
        from supabase import create_client
        url = st.secrets.get("supabase", {}).get("url", SUPABASE_URL)
        key = st.secrets["supabase"]["service_key"]
        return create_client(url, key)
    except Exception:
        return None


def _fresh_auth_client():
    """Fresh client for auth operations (PKCE needs clean state)."""
    try:
        from supabase import create_client
        url = st.secrets.get("supabase", {}).get("url", SUPABASE_URL)
        key = st.secrets["supabase"]["key"]
        return create_client(url, key)
    except Exception:
        return None


def get_supabase():
    """Return admin client for data queries."""
    return get_admin_client()


def is_demo_mode():
    return _get_anon_key() is None


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
        sb = _fresh_auth_client()
        if sb:
            try:
                verifier = st.session_state.pop("_pkce_verifier", "")
                # Set verifier on the fresh client's storage so exchange can find it
                sb.auth._storage.set_item("supabase.auth.token-code-verifier", verifier)
                res = sb.auth.exchange_code_for_session({"auth_code": code})
                user = res.user
                st.session_state.user = {
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.user_metadata.get("full_name", user.email),
                    "avatar": user.user_metadata.get("avatar_url", ""),
                }
                _ensure_profile(user)
                st.session_state.role = _get_role(str(user.id))
                st.query_params.clear()
            except Exception as e:
                st.query_params.clear()
                st.error(f"Erro no callback OAuth: {e}")


def _ensure_profile(user):
    admin = get_admin_client()
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


def _get_role(user_id: str) -> str:
    admin = get_admin_client()
    if not admin:
        return "aluno"
    try:
        res = admin.table("user_profiles").select("role").eq("id", user_id).single().execute()
        return res.data["role"] if res.data else "aluno"
    except Exception:
        return "aluno"


def get_google_login_url() -> str:
    sb = _fresh_auth_client()
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
        # Store PKCE code_verifier for the callback
        try:
            verifier = sb.auth._storage.get_item("supabase.auth.token-code-verifier")
            if verifier:
                st.session_state._pkce_verifier = verifier
        except Exception:
            pass
        return res.url
    except Exception:
        return ""


def login_email(email: str, password: str) -> bool:
    sb = _fresh_auth_client()
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
        st.session_state.role = _get_role(str(res.user.id))
        return True
    except Exception as e:
        st.error(f"Erro de login: {e}")
        return False


def register_email(email: str, password: str, nome: str) -> bool:
    sb = _fresh_auth_client()
    if sb is None:
        st.session_state.user = {"id": "demo", "email": email, "name": nome, "avatar": ""}
        st.session_state.role = "aluno"
        return True
    try:
        res = sb.auth.sign_up({"email": email, "password": password})
        admin = get_admin_client()
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
    st.session_state.user = None
    st.session_state.role = None


def require_auth():
    init_session()
    if st.session_state.user is None:
        st.warning("Faz login para aceder a esta pagina.")
        st.stop()


def is_admin():
    return st.session_state.get("role") == "admin"
