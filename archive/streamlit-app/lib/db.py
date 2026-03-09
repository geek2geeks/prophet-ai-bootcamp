import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import streamlit as st

from .auth import get_supabase, is_demo_mode


ROOT_DIR = Path(__file__).resolve().parent.parent
FIREBASE_SERVICE_ACCOUNT_PATH = ROOT_DIR / "firebase-admin-key.json"
FIREBASE_MIGRATION_MAP_PATH = ROOT_DIR / "migration" / "data" / "migration_map.json"


@st.cache_resource
def get_firestore_client():
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        if not firebase_admin._apps:
            credential = None

            try:
                firebase_secret = st.secrets.get("firebase", {}).get("service_account")
                if isinstance(firebase_secret, dict) and firebase_secret:
                    credential = credentials.Certificate(dict(firebase_secret))
                elif isinstance(firebase_secret, str) and firebase_secret.strip():
                    credential = credentials.Certificate(json.loads(firebase_secret))
            except Exception:
                credential = None

            if credential is None and FIREBASE_SERVICE_ACCOUNT_PATH.exists():
                credential = credentials.Certificate(str(FIREBASE_SERVICE_ACCOUNT_PATH))

            if credential is None:
                return None

            firebase_admin.initialize_app(credential)

        return firestore.client()
    except Exception:
        return None


@st.cache_data
def _load_firebase_migration_map() -> dict[str, Any]:
    if not FIREBASE_MIGRATION_MAP_PATH.exists():
        return {}

    try:
        return json.loads(FIREBASE_MIGRATION_MAP_PATH.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _resolve_firebase_uid(user_id: str) -> str:
    user = st.session_state.get("user", {})
    if isinstance(user, dict):
        for key in ("firebase_uid", "uid"):
            value = user.get(key)
            if value:
                return str(value)

    migration_map = _load_firebase_migration_map()
    mapped = migration_map.get(user_id, {})
    if isinstance(mapped, dict) and mapped.get("firebase_uid"):
        return str(mapped["firebase_uid"])

    return user_id


def _get_student_ref(user_id: str):
    db = get_firestore_client()
    if db is None:
        return None
    return db.collection("students").document(_resolve_firebase_uid(user_id))


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_ai_reviews(user_id: str, day: int | None = None) -> dict:
    if is_demo_mode():
        reviews = st.session_state.get("demo_ai_reviews", {})
        if day is None:
            return reviews
        return {
            review_id: review
            for review_id, review in reviews.items()
            if review.get("day") == day
        }

    student_ref = _get_student_ref(user_id)
    if student_ref is None:
        return st.session_state.get("ai_reviews_fallback", {})

    try:
        docs = student_ref.collection("ai_reviews").stream()
        items = {}
        for doc in docs:
            payload = doc.to_dict() or {}
            if day is not None and payload.get("day") != day:
                continue
            items[doc.id] = payload
        return items
    except Exception:
        return st.session_state.get("ai_reviews_fallback", {})


def save_ai_review(user_id: str, review_id: str, payload: dict[str, Any]):
    payload = {
        **payload,
        "updated_at": payload.get("updated_at", _now_iso()),
    }

    if is_demo_mode():
        if "demo_ai_reviews" not in st.session_state:
            st.session_state.demo_ai_reviews = {}
        existing = st.session_state.demo_ai_reviews.get(review_id, {})
        st.session_state.demo_ai_reviews[review_id] = {**existing, **payload}
        return

    student_ref = _get_student_ref(user_id)
    if student_ref is None:
        if "ai_reviews_fallback" not in st.session_state:
            st.session_state.ai_reviews_fallback = {}
        existing = st.session_state.ai_reviews_fallback.get(review_id, {})
        st.session_state.ai_reviews_fallback[review_id] = {**existing, **payload}
        return

    try:
        student_ref.collection("ai_reviews").document(review_id).set(payload, merge=True)
    except Exception:
        if "ai_reviews_fallback" not in st.session_state:
            st.session_state.ai_reviews_fallback = {}
        existing = st.session_state.ai_reviews_fallback.get(review_id, {})
        st.session_state.ai_reviews_fallback[review_id] = {**existing, **payload}

def get_progress(user_id: str) -> dict:
    if is_demo_mode():
        return st.session_state.get("demo_progress", {})
    student_ref = _get_student_ref(user_id)
    if student_ref is not None:
        try:
            docs = student_ref.collection("progress").stream()
            items = {}
            for doc in docs:
                payload = doc.to_dict() or {}
                items[doc.id] = payload
            return items
        except Exception:
            pass

    sb = get_supabase()
    if sb is None:
        return {}
    try:
        res = sb.table("progress").select("*").eq("user_id", user_id).execute()
        data = res.data or []
        return {
            str(r.get("exercise_id")): r
            for r in data
            if isinstance(r, dict) and r.get("exercise_id")
        }
    except Exception:
        return {}

def set_exercise_complete(user_id: str, exercise_id: str, pontos: int):
    if is_demo_mode():
        st.session_state.demo_progress[exercise_id] = {
            "exercise_id": exercise_id, "completed": True, "pontos": pontos
        }
        return

    student_ref = _get_student_ref(user_id)
    if student_ref is not None:
        try:
            student_ref.collection("progress").document(exercise_id).set({
                "exercise_id": exercise_id,
                "completed": True,
                "pontos": pontos,
                "completed_at": _now_iso(),
            }, merge=True)
            return
        except Exception:
            pass

    sb = get_supabase()
    if sb is None:
        return
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

    student_ref = _get_student_ref(user_id)
    if student_ref is not None:
        try:
            student_ref.collection("progress").document(exercise_id).delete()
            return
        except Exception:
            pass

    sb = get_supabase()
    if sb is None:
        return
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

    student_ref = _get_student_ref(user_id)
    if student_ref is not None:
        try:
            student_ref.collection("submissions").document(challenge_id).set({
                "challenge_id": challenge_id,
                "repo_url": repo_url,
                "pontos": pontos,
                "submitted_at": _now_iso(),
            }, merge=True)
            return
        except Exception:
            pass

    sb = get_supabase()
    if sb is None:
        return
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

    student_ref = _get_student_ref(user_id)
    if student_ref is not None:
        try:
            docs = student_ref.collection("submissions").stream()
            items = {}
            for doc in docs:
                payload = doc.to_dict() or {}
                items[doc.id] = payload
            return items
        except Exception:
            pass

    sb = get_supabase()
    if sb is None:
        return {}
    try:
        res = sb.table("submissions").select("*").eq("user_id", user_id).execute()
        data = res.data or []
        return {
            str(r.get("challenge_id")): r
            for r in data
            if isinstance(r, dict) and r.get("challenge_id")
        }
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
    if sb is None:
        return []
    try:
        res = sb.table("leaderboard").select("*").execute()
        return res.data
    except Exception:
        return []
