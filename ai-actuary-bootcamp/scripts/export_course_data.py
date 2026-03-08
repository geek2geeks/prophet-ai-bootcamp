from __future__ import annotations

import json
import sys
from pathlib import Path


APP_ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = APP_ROOT.parent
TARGET = APP_ROOT / "src" / "data" / "course.json"

sys.path.insert(0, str(WORKSPACE_ROOT))

from lib.course import BADGES, COURSE_SUBTITLE, COURSE_TITLE, DAYS, TOTAL_POINTS  # noqa: E402


payload = {
    "title": COURSE_TITLE,
    "subtitle": COURSE_SUBTITLE,
    "totalPoints": TOTAL_POINTS,
    "badges": BADGES,
    "days": DAYS,
}

TARGET.parent.mkdir(parents=True, exist_ok=True)
TARGET.write_text(json.dumps(payload, ensure_ascii=True, indent=2), encoding="utf-8")

print(f"Wrote {TARGET}")
