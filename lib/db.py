import streamlit as st
from .auth import get_supabase, is_demo_mode

def get_progress(user_id: str) -> dict:
    if is_demo_mode():
        return st.session_state.get("demo_progress", {})
    sb = get_supabase()
    try:
        res = sb.table("progress").select("*").eq("user_id", user_id).execute()
        return {r["exercise_id"]: r for r in res.data}
    except Exception:
        return {}

def set_exercise_complete(user_id: str, exercise_id: str, pontos: int):
    if is_demo_mode():
        st.session_state.demo_progress[exercise_id] = {
            "exercise_id": exercise_id, "completed": True, "pontos": pontos
        }
        return
    sb = get_supabase()
    try:
        sb.table("progress").upsert({
            "user_id": user_id, "exercise_id": exercise_id,
            "completed": True, "pontos": pontos
        }).execute()
    except Exception:
        pass

def set_exercise_incomplete(user_id: str, exercise_id: str):
    if is_demo_mode():
        st.session_state.demo_progress.pop(exercise_id, None)
        return
    sb = get_supabase()
    try:
        sb.table("progress").delete().eq("user_id", user_id).eq("exercise_id", exercise_id).execute()
    except Exception:
        pass

def submit_challenge(user_id: str, challenge_id: str, repo_url: str, pontos: int):
    if is_demo_mode():
        st.session_state.demo_submissions[challenge_id] = {
            "challenge_id": challenge_id, "repo_url": repo_url, "pontos": pontos
        }
        return
    sb = get_supabase()
    try:
        sb.table("submissions").upsert({
            "user_id": user_id, "challenge_id": challenge_id,
            "repo_url": repo_url, "pontos": pontos
        }).execute()
    except Exception:
        pass

def get_submissions(user_id: str) -> dict:
    if is_demo_mode():
        return st.session_state.get("demo_submissions", {})
    sb = get_supabase()
    try:
        res = sb.table("submissions").select("*").eq("user_id", user_id).execute()
        return {r["challenge_id"]: r for r in res.data}
    except Exception:
        return {}

def get_leaderboard() -> list:
    if is_demo_mode():
        prog = st.session_state.get("demo_progress", {})
        subs = st.session_state.get("demo_submissions", {})
        pts_ex = sum(r["pontos"] for r in prog.values())
        pts_ch = sum(r["pontos"] for r in subs.values())
        email = st.session_state.get("user", {}).get("email", "Demo User")
        return [{"nome": email, "pontos_exercicios": pts_ex,
                 "pontos_desafios": pts_ch, "pontos_total": pts_ex + pts_ch}]
    sb = get_supabase()
    try:
        res = sb.table("leaderboard").select("*").execute()
        return res.data
    except Exception:
        return []
