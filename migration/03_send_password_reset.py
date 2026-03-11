"""
Phase 9 — Step 3: Send Firebase password-reset emails to migrated users.

Reads migration/data/migration_map.json, sends a password-reset link to every
user that was created (not pre-existing) via Firebase Auth's generatePasswordResetLink.

Usage:
  python migration/03_send_password_reset.py [--dry-run]

Note: Uses Firebase Admin SDK to generate reset links.
      Sending is done via a simple SMTP relay (configurable below) or just
      prints the links in dry-run mode.
"""

import json
import sys
import io
import argparse
import smtplib
from email.mime.text import MIMEText
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

DATA_DIR = Path(__file__).parent / "data"
SERVICE_ACCOUNT_PATH = Path(__file__).parent.parent / "firebase-admin-key.json"

# ---- SMTP config (fill in if you want actual email delivery) ----------------
SMTP_HOST = ""          # e.g. "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = ""          # e.g. "no-reply@yourapp.com"
SMTP_PASS = ""          # app password
FROM_EMAIL = ""         # sender address
# -----------------------------------------------------------------------------

APP_URL = "https://ai-actuary-bootcamp-dev-260308.web.app"

EMAIL_SUBJECT = "Bem-vindo ao AI Actuary Bootcamp — Reset da sua palavra-passe"

EMAIL_BODY_PT = """\
Olá {nome},

A tua conta no AI Actuary Bootcamp foi migrada para a nova plataforma.

Para acederes, clica no link abaixo para definir a tua palavra-passe:

{reset_link}

Após o reset, faz login em:
{app_url}

Se não pediste este e-mail, podes ignorá-lo.

Bons estudos,
Equipa AI Actuary Bootcamp
"""


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


def send_email(to_email: str, subject: str, body: str) -> bool:
    if not SMTP_HOST or not SMTP_USER:
        return False
    try:
        msg = MIMEText(body, "plain", "utf-8")
        msg["Subject"] = subject
        msg["From"] = FROM_EMAIL or SMTP_USER
        msg["To"] = to_email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(SMTP_USER, SMTP_PASS)
            smtp.sendmail(msg["From"], [to_email], msg.as_string())
        return True
    except Exception as e:
        print(f"    SMTP error: {e}")
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    dry_run = args.dry_run

    map_path = DATA_DIR / "migration_map.json"
    if not map_path.exists():
        print("ERROR: migration_map.json not found. Run 02_import_firebase.py first.")
        sys.exit(1)

    migration_map = json.loads(map_path.read_text(encoding="utf-8"))
    print(f"=== Password Reset Emails ({len(migration_map)} users) ===")
    if dry_run:
        print("DRY RUN — links will be printed, no emails sent\n")

    if not dry_run:
        get_firebase_app()
        from firebase_admin import auth as fb_auth

    results = []
    for supa_uid, info in migration_map.items():
        email = info["email"]
        nome = info.get("nome", email)
        firebase_uid = info["firebase_uid"]

        if dry_run:
            reset_link = f"https://example.com/reset?mode=resetPassword&oobCode=DRY_RUN_CODE"
        else:
            try:
                reset_link = fb_auth.generate_password_reset_link(email)
            except Exception as e:
                print(f"  {email} — ERROR generating reset link: {e}")
                results.append({"email": email, "status": "error", "error": str(e)})
                continue

        body = EMAIL_BODY_PT.format(nome=nome, reset_link=reset_link, app_url=APP_URL)

        if dry_run or not SMTP_HOST:
            print(f"  {email}")
            print(f"    reset: {reset_link}")
        else:
            sent = send_email(email, EMAIL_SUBJECT, body)
            status = "sent" if sent else "smtp_not_configured"
            print(f"  {email} → {status}")
            results.append({"email": email, "status": status, "reset_link": reset_link})

    # Save reset links regardless (useful for manual delivery)
    links_path = DATA_DIR / "reset_links.json"
    links_path.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nReset links saved → {links_path}")
    print("=== Done ===")


if __name__ == "__main__":
    main()
