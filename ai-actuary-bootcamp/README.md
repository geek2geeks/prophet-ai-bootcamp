# AI Actuary Bootcamp — Platform

Next.js 16 + TypeScript + Firebase course platform for the **Prophet Lite Founder Bootcamp**.

**Live URL:** https://ai-actuary-bootcamp-dev-260308.web.app

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (static export) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication (email/password) |
| Database | Firestore |
| Hosting | Firebase Hosting |
| Tests | Playwright |
| CI | GitHub Actions |

---

## Local setup

### Prerequisites

- Node.js 20+
- Firebase CLI: `npm i -g firebase-tools`

### Install

```bash
npm install
```

### Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-actuary-bootcamp-dev-260308
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Run dev server

```bash
npm run dev
```

---

## Deploy

```bash
npm run lint && npm run build && npx playwright test && npx firebase deploy --only hosting
```

To also update Firestore security rules:

```bash
npx firebase deploy --only hosting,firestore:rules
```

---

## Project structure

```
src/
  app/
    page.tsx                  # Home — progress hub, roadmap, notebook preview
    login/page.tsx            # Auth (login + register)
    missions/[day]/page.tsx   # Mission workspace for all 11 days
    portfolio/page.tsx        # Student portfolio
    admin/page.tsx            # Admin panel (keys, students, submissions)
    resources/page.tsx        # Resource downloads
  components/
    ai-tutor-widget.tsx       # Floating AI tutor (DeepSeek, all pages)
    site-header.tsx
    route-guard.tsx
    mission-workspace-tools.tsx
    submission-panel.tsx
    portfolio-progress-page.tsx
    shared-key-vault.tsx      # Shared DeepSeek/Z.ai keys (Day 0)
    day0…day10-*.tsx          # Day-specific interactive tools
  lib/
    ai-tutor-context.ts       # System prompt + course context (ported from lib/ai.py)
    course.ts                 # Type-safe curriculum helpers
    firebase.ts               # Firebase init
    auth-context.tsx          # Auth provider + useAuth hook
    use-student-state.ts      # Firestore-synced student progress
    submissions.ts            # Submission Firestore schema
  data/
    course.json               # Full 11-day curriculum
```

---

## Firestore data model

| Collection | Description |
|---|---|
| `students/{uid}` | Per-student progress, notes, metadata |
| `submissions/{id}` | Mission submissions (userId, missionId, status, artifacts) |
| `config/keys` | Shared API keys (DeepSeek, Z.ai) — read by all authenticated users, write by admin only |

**Security rules:** `firestore.rules`

---

## AI Tutor

The floating AI Tutor widget (`src/components/ai-tutor-widget.tsx`) is available on every page for authenticated students. It:

- Fetches the shared DeepSeek API key from `config/keys` in Firestore
- Calls `https://api.deepseek.com/chat/completions` (model: `deepseek-chat`, temperature: 0.4)
- Sends the full bootcamp system prompt + current day context
- Keeps up to 20 conversation turns (trims older messages to control cost)
- Guides students without giving complete answers

The system prompt is in `src/lib/ai-tutor-context.ts`, ported from the original `lib/ai.py`.

---

## Admin panel

Route: `/admin`

Access is restricted to emails in `ADMIN_EMAILS` (`src/app/admin/page.tsx`). Currently: `pedro@stratfordgeek.com`.

Features:
- **Keys tab** — view and update `config/keys` in Firestore
- **Students tab** — list all registered students and their progress count
- **Submissions tab** — list all mission submissions

The Firestore `isAdmin()` function in `firestore.rules` matches the same email list.

---

## Firebase Storage

Storage rules are written in `storage.rules` but **deployment requires Storage to be initialized first**:

1. Go to [Firebase Console](https://console.firebase.google.com/project/ai-actuary-bootcamp-dev-260308/storage)
2. Click **Get Started** and choose a region
3. Then run: `npx firebase deploy --only storage`

---

## Tests

```bash
npx playwright test
```

8 smoke tests cover: home page, mission auth guard, portfolio auth guard, admin auth guard, login form, all 11 mission routes, resources page, and 404 handling.
