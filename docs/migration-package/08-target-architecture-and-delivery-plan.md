# Target Architecture and Delivery Plan

## Purpose

Turn the preserved content and redesigned UX into a practical migration plan for `Next.js + TypeScript + Firebase + Google Cloud`.

## Key sections

- Target stack overview
- Proposed service mapping
- Firebase Auth, Firestore, Storage, and Functions roles
- GCloud services for AI orchestration, background jobs, and observability
- Recommended domain model and API boundaries
- Migration phases and milestones
- Export/build/cutover sequence
- Risks, dependencies, and acceptance criteria

## How to use the current repo as source material

- Use `app.py` and page files to identify current runtime responsibilities that must be redistributed across frontend, backend, and content layers.
- Use `lib/ai.py` to define AI backend requirements such as streaming, prompt versioning, tutor context assembly, and provider abstraction.
- Use `DEPLOYMENT.md` and `DEPLOYMENT_AUTO_REPORT.md` to understand current deployment pain points and avoid reproducing them in the new platform.
- Use `api.md` to capture any existing integration assumptions that need to survive the rebuild.
- Base migration phases on content extraction first, then backend contracts, then UX implementation, so the rewrite does not lose the repo's strongest assets.
