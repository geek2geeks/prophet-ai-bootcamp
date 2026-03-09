"""
Phase 9 — Step 1: Export Supabase data to JSON files.

Exports:
  - user_profiles  → migration/data/user_profiles.json
  - auth users     → migration/data/auth_users.json  (via admin list users)
  - progress       → migration/data/progress.json
  - submissions    → migration/data/submissions.json

Usage:
  set SUPABASE_URL=https://your-project.supabase.co
  set SUPABASE_SERVICE_KEY=your_service_role_key
  python migration/01_export_supabase.py
"""

import json
import os
import sys
import io
from pathlib import Path

# Force UTF-8 stdout on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

SUPABASE_URL = os.environ.get(
    "SUPABASE_URL", "https://naecdtkxxlawxlkljtkt.supabase.co"
)
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

OUT_DIR = Path(__file__).parent / "data"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def get_admin_client():
    if not SERVICE_KEY:
        print("ERROR: missing SUPABASE_SERVICE_KEY environment variable.")
        sys.exit(1)
    try:
        from supabase import create_client

        return create_client(SUPABASE_URL, SERVICE_KEY)
    except ImportError:
        print("ERROR: supabase-py not installed. Run: pip install supabase")
        sys.exit(1)


def export_table(client, table_name: str) -> list:
    """Export all rows from a Supabase table using pagination."""
    all_rows = []
    page_size = 1000
    offset = 0
    while True:
        res = (
            client.table(table_name)
            .select("*")
            .range(offset, offset + page_size - 1)
            .execute()
        )
        rows = res.data or []
        all_rows.extend(rows)
        print(f"  [{table_name}] fetched {len(all_rows)} rows (page offset {offset})")
        if len(rows) < page_size:
            break
        offset += page_size
    return all_rows


def export_auth_users(client) -> list:
    """Export Supabase Auth user list via admin API."""
    import urllib.request
    import urllib.error

    users = []
    page = 1
    per_page = 1000
    while True:
        url = f"{SUPABASE_URL}/auth/v1/admin/users?page={page}&per_page={per_page}"
        req = urllib.request.Request(
            url,
            headers={
                "apikey": SERVICE_KEY or "",
                "Authorization": f"Bearer {SERVICE_KEY or ''}",
            },
        )
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read())
                # Supabase returns {"users": [...], "aud": "...", ...}
                batch = data.get("users", [])
                users.extend(batch)
                print(f"  [auth_users] fetched {len(users)} users (page {page})")
                if len(batch) < per_page:
                    break
                page += 1
        except urllib.error.HTTPError as e:
            print(f"  [auth_users] HTTP error {e.code}: {e.read()}")
            break
        except Exception as e:
            print(f"  [auth_users] Error: {e}")
            break
    return users


def main():
    print("=== Supabase Export ===")
    client = get_admin_client()

    # Export auth users
    print("\n[1/4] Exporting auth users...")
    auth_users = export_auth_users(client)
    out_path = OUT_DIR / "auth_users.json"
    out_path.write_text(json.dumps(auth_users, indent=2, default=str), encoding="utf-8")
    print(f"  Saved {len(auth_users)} auth users → {out_path}")

    # Export user_profiles
    print("\n[2/4] Exporting user_profiles...")
    profiles = export_table(client, "user_profiles")
    out_path = OUT_DIR / "user_profiles.json"
    out_path.write_text(json.dumps(profiles, indent=2, default=str), encoding="utf-8")
    print(f"  Saved {len(profiles)} profiles → {out_path}")

    # Export progress
    print("\n[3/4] Exporting progress...")
    progress = export_table(client, "progress")
    out_path = OUT_DIR / "progress.json"
    out_path.write_text(json.dumps(progress, indent=2, default=str), encoding="utf-8")
    print(f"  Saved {len(progress)} progress rows → {out_path}")

    # Export submissions
    print("\n[4/4] Exporting submissions...")
    submissions = export_table(client, "submissions")
    out_path = OUT_DIR / "submissions.json"
    out_path.write_text(
        json.dumps(submissions, indent=2, default=str), encoding="utf-8"
    )
    print(f"  Saved {len(submissions)} submissions → {out_path}")

    print("\n=== Export complete ===")
    print(f"Output directory: {OUT_DIR.resolve()}")


if __name__ == "__main__":
    main()
