"""
Phase 9 — Step 2: Import Supabase data into Firebase (Auth + Firestore).

Reads:
  migration/data/auth_users.json
  migration/data/user_profiles.json
  migration/data/progress.json
  migration/data/submissions.json

Actions:
  1. For each Supabase auth user → create Firebase Auth account (temp password)
  2. Write Firestore: students/{uid}/profile
  3. Write Firestore: students/{uid}/progress/{exerciseId}
  4. Write Firestore: students/{uid}/submissions/{challengeId}
  5. Write migration/data/migration_map.json  (supabase_uid → firebase_uid)

Usage:
  pip install firebase-admin
  python migration/02_import_firebase.py [--dry-run]
"""

import json
import sys
import io
import argparse
import secrets
import string
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

DATA_DIR = Path(__file__).parent / "data"
SERVICE_ACCOUNT_PATH = Path(__file__).parent.parent / "firebase-admin-key.json"


def load_json(filename: str) -> list:
    path = DATA_DIR / filename
    if not path.exists():
        print(f"ERROR: {path} not found. Run 01_export_supabase.py first.")
        sys.exit(1)
    return json.loads(path.read_text(encoding="utf-8"))


def random_password(length: int = 24) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(secrets.choice(alphabet) for _ in range(length))


def get_firebase_app():
    try:
        import firebase_admin
        from firebase_admin import credentials
        if not firebase_admin._apps:
            cred = credentials.Certificate(str(SERVICE_ACCOUNT_PATH))
            firebase_admin.initialize_app(cred)
        return firebase_admin.get_app()
    except ImportError:
        print("ERROR: firebase-admin not installed. Run: pip install firebase-admin")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print actions without writing")
    args = parser.parse_args()
    dry_run = args.dry_run

    if dry_run:
        print("=== DRY RUN — no data will be written ===\n")

    print("=== Firebase Import ===")

    # Load exports
    auth_users = load_json("auth_users.json")
    profiles = load_json("user_profiles.json")
    progress_rows = load_json("progress.json")
    submission_rows = load_json("submissions.json")

    # Build lookup maps
    profile_by_id = {p["id"]: p for p in profiles}
    progress_by_user: dict[str, list] = {}
    for row in progress_rows:
        progress_by_user.setdefault(row["user_id"], []).append(row)
    submissions_by_user: dict[str, list] = {}
    for row in submission_rows:
        submissions_by_user.setdefault(row["user_id"], []).append(row)

    print(f"  Auth users:   {len(auth_users)}")
    print(f"  Profiles:     {len(profiles)}")
    print(f"  Progress:     {len(progress_rows)}")
    print(f"  Submissions:  {len(submission_rows)}")
    print()

    if not dry_run:
        get_firebase_app()
        from firebase_admin import auth as fb_auth, firestore as fb_firestore
        db = fb_firestore.client()

    migration_map = {}   # supabase_uid → { firebase_uid, email, temp_password }
    errors = []

    for i, user in enumerate(auth_users, 1):
        supa_uid = user.get("id") or user.get("uid")
        email = user.get("email", "").strip().lower()
        if not email:
            print(f"  [{i}/{len(auth_users)}] SKIP — no email for user {supa_uid}")
            continue

        profile = profile_by_id.get(supa_uid, {})
        nome = profile.get("nome") or email
        role = profile.get("role", "aluno")
        temp_pw = random_password()

        print(f"  [{i}/{len(auth_users)}] {email} ({nome}) role={role} …", end=" ")

        if dry_run:
            firebase_uid = f"DRY-{supa_uid}"
            print("DRY RUN skipped")
        else:
            # Create or fetch Firebase Auth user
            try:
                fb_user = fb_auth.get_user_by_email(email)
                firebase_uid = fb_user.uid
                print(f"exists (uid={firebase_uid[:8]}…)", end=" ")
            except fb_auth.UserNotFoundError:
                try:
                    fb_user = fb_auth.create_user(
                        email=email,
                        display_name=nome,
                        password=temp_pw,
                        email_verified=False,
                    )
                    firebase_uid = fb_user.uid
                    print(f"created (uid={firebase_uid[:8]}…)", end=" ")
                except Exception as e:
                    print(f"ERROR creating user: {e}")
                    errors.append({"email": email, "error": str(e)})
                    continue

            # Firestore: students/{uid}/profile
            student_ref = db.collection("students").document(firebase_uid)
            student_ref.set({
                "email": email,
                "nome": nome,
                "role": role,
                "migrated_from_supabase": True,
                "supabase_uid": supa_uid,
                "password_reset_required": True,
            }, merge=True)

            # Progress documents
            prog_count = 0
            for prog in progress_by_user.get(supa_uid, []):
                ex_id = prog.get("exercise_id")
                if not ex_id:
                    continue
                student_ref.collection("progress").document(ex_id).set({
                    "completed": prog.get("completed", False),
                    "pontos": prog.get("pontos", 0),
                    "exercise_id": ex_id,
                }, merge=True)
                prog_count += 1

            # Submission documents
            sub_count = 0
            for sub in submissions_by_user.get(supa_uid, []):
                ch_id = sub.get("challenge_id")
                if not ch_id:
                    continue
                student_ref.collection("submissions").document(ch_id).set({
                    "challenge_id": ch_id,
                    "repo_url": sub.get("repo_url", ""),
                    "pontos": sub.get("pontos", 0),
                }, merge=True)
                sub_count += 1

            print(f"prog={prog_count} subs={sub_count} ✓")

        migration_map[supa_uid] = {
            "firebase_uid": firebase_uid,
            "email": email,
            "nome": nome,
            "temp_password": temp_pw,
        }

    # Save migration map
    map_path = DATA_DIR / "migration_map.json"
    map_path.write_text(
        json.dumps(migration_map, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
    print(f"\n  Migration map saved → {map_path}")

    if errors:
        err_path = DATA_DIR / "migration_errors.json"
        err_path.write_text(json.dumps(errors, indent=2), encoding="utf-8")
        print(f"  {len(errors)} errors saved → {err_path}")

    print(f"\n=== Import complete: {len(migration_map)} users processed, {len(errors)} errors ===")

    if not dry_run and migration_map:
        print("\nNEXT STEP: Run 03_send_password_reset.py to email users a reset link.")


if __name__ == "__main__":
    main()
