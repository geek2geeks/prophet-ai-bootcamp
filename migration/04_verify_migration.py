"""
Phase 9 — Step 4: Verification harness.

Spot-checks that Firestore data matches Supabase source data.

Checks:
  - Every user in migration_map has a Firestore students/{uid}/profile doc
  - Progress counts match (per user)
  - Submission counts match (per user)
  - Randomly samples 5 progress rows and verifies field values

Usage:
  python migration/04_verify_migration.py
"""

import json
import random
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

DATA_DIR = Path(__file__).parent / "data"
SERVICE_ACCOUNT_PATH = Path(__file__).parent.parent / "firebase-admin-key.json"

PASS = "✓"
FAIL = "✗"


def get_firebase_app():
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore
        if not firebase_admin._apps:
            cred = credentials.Certificate(str(SERVICE_ACCOUNT_PATH))
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        return db
    except ImportError:
        print("ERROR: firebase-admin not installed.")
        sys.exit(1)


def load_json(filename: str):
    path = DATA_DIR / filename
    if not path.exists():
        print(f"ERROR: {path} not found.")
        sys.exit(1)
    return json.loads(path.read_text(encoding="utf-8"))


def main():
    print("=== Migration Verification ===\n")

    migration_map = load_json("migration_map.json")
    progress_rows = load_json("progress.json")
    submission_rows = load_json("submissions.json")

    # Build expected counts per supabase UID
    expected_progress: dict[str, int] = {}
    for row in progress_rows:
        uid = row["user_id"]
        expected_progress[uid] = expected_progress.get(uid, 0) + 1

    expected_submissions: dict[str, int] = {}
    for row in submission_rows:
        uid = row["user_id"]
        expected_submissions[uid] = expected_submissions.get(uid, 0) + 1

    db = get_firebase_app()

    total = len(migration_map)
    passed = 0
    failed = 0
    failures = []

    for supa_uid, info in migration_map.items():
        fb_uid = info["firebase_uid"]
        email = info["email"]

        if fb_uid.startswith("DRY-"):
            print(f"  SKIP (dry run uid) {email}")
            continue

        # Check profile doc
        profile_doc = db.collection("students").document(fb_uid).get()
        if not profile_doc.exists:
            msg = f"MISSING profile doc for {email} (uid={fb_uid})"
            print(f"  {FAIL} {msg}")
            failures.append(msg)
            failed += 1
            continue

        profile_data = profile_doc.to_dict()

        # Check progress count
        prog_docs = db.collection("students").document(fb_uid).collection("progress").stream()
        prog_count = sum(1 for _ in prog_docs)
        exp_prog = expected_progress.get(supa_uid, 0)

        prog_ok = prog_count == exp_prog
        if not prog_ok:
            msg = f"Progress mismatch for {email}: expected {exp_prog}, got {prog_count}"
            failures.append(msg)
            failed += 1
            print(f"  {FAIL} {msg}")
        else:
            passed += 1

        # Check submission count
        sub_docs = db.collection("students").document(fb_uid).collection("submissions").stream()
        sub_count = sum(1 for _ in sub_docs)
        exp_subs = expected_submissions.get(supa_uid, 0)

        sub_ok = sub_count == exp_subs
        if not sub_ok:
            msg = f"Submission mismatch for {email}: expected {exp_subs}, got {sub_count}"
            failures.append(msg)
            failed += 1
            print(f"  {FAIL} {msg}")
        elif prog_ok:
            print(f"  {PASS} {email} — profile OK, prog={prog_count}, subs={sub_count}")

    # Random spot-check: 5 progress rows
    if progress_rows:
        print("\n--- Spot-checking 5 random progress rows ---")
        sample = random.sample(progress_rows, min(5, len(progress_rows)))
        for row in sample:
            supa_uid = row["user_id"]
            ex_id = row["exercise_id"]
            info = migration_map.get(supa_uid)
            if not info:
                print(f"  SKIP {supa_uid} not in migration map")
                continue
            fb_uid = info["firebase_uid"]
            if fb_uid.startswith("DRY-"):
                continue
            doc = (db.collection("students").document(fb_uid)
                     .collection("progress").document(ex_id).get())
            if not doc.exists:
                print(f"  {FAIL} Missing progress/{ex_id} for {info['email']}")
                failures.append(f"Missing progress/{ex_id} for {info['email']}")
            else:
                d = doc.to_dict()
                exp_pts = row.get("pontos", 0)
                got_pts = d.get("pontos", 0)
                ok = got_pts == exp_pts
                sym = PASS if ok else FAIL
                print(f"  {sym} {info['email']} progress/{ex_id} pontos={got_pts} (expected {exp_pts})")
                if not ok:
                    failures.append(f"Pontos mismatch {ex_id} for {info['email']}: {got_pts} vs {exp_pts}")

    print(f"\n=== Results: {passed} passed, {failed} failed out of {total} users ===")

    if failures:
        report_path = DATA_DIR / "verification_failures.json"
        report_path.write_text(json.dumps(failures, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"Failures saved → {report_path}")
        sys.exit(1)
    else:
        print("All checks passed!")


if __name__ == "__main__":
    main()
