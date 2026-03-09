# Execution Order and Cost Plan

## Purpose

Define the working order for the rebuild, the CLI and access assumptions already verified locally, the main cost surfaces, and the rules that keep the new platform aligned with a local-first bootcamp.

## Locked operating assumptions

- The curriculum content is preserved, but the product experience is rebuilt from scratch.
- Students build locally first. The platform guides, tracks, reviews, and packages the journey.
- The bootcamp provides one shared `DeepSeek` key and one shared `Z.ai` coding-plan key to students.
- The class must explicitly teach where each tool belongs:
  - `DeepSeek` for document understanding, extraction cleanup, JSON structuring, summarization, and reasoning.
  - `Z.ai` for planning, coding plans, and build support.
  - the web platform for curriculum, progress, assets, feedback, and submissions.
- Day 6 and Day 9 must not imply that the platform itself is the OCR engine. The student runs document pipelines locally first, with DeepSeek used where it improves the local workflow.

## Local CLI validation snapshot

The following CLIs were tested locally and are available for execution:

- `git` - available and working
- `gh` - available and authenticated; current repo access is admin-level
- `node` - available and working
- `npm` / `npx` - available and working
- `python` - available and working
- `firebase` - available and authenticated; project listing works; App Hosting commands are present
- `gcloud` - available and authenticated; project listing works
- `gsutil` - available and working
- `docker` - available and working; daemon reachable

Not installed, but not required for phase 1:

- `pnpm`
- `yarn`
- `bun`
- `uv`

Important note:

- `Cloud Run` is not blocked by missing tooling. The current `prophet-ai-bootcamp` GCP project simply does not have the Cloud Run Admin API enabled. New `dev` and `prod` projects will need the required APIs enabled during setup.

## Access assumed for execution

- GitHub admin access for the new repo `ai-actuary-bootcamp`
- Firebase owner access
- GCP billing/admin access
- OAuth client access
- Supabase owner/admin access
- Supabase service-role access for export
- Supabase export access for users, progress, and submissions
- GA4 access or permission to create a new property

## What the new platform should and should not do

### The platform should do

- deliver the curriculum in a premium lesson workspace
- guide setup and tool usage
- provide downloadable assets and references
- save progress, notes, drafts, and submissions
- provide contextual AI coaching and review surfaces where justified
- support admin oversight and learner migration

### The platform should not do by default

- replace the student's local development environment
- become the default runtime for OCR or heavy document processing in phase 1
- duplicate all local CLI workflows in the browser
- absorb avoidable spend that belongs in the student local workflow

## Current and future cost surfaces

### Current cost surfaces already present in the repo

- `DeepSeek API` usage through the tutor in `lib/ai.py`
- student local `OpenCode` usage against `DeepSeek`
- `Supabase` auth and database traffic in `lib/auth.py` and `lib/db.py`
- `Streamlit` hosting and deployment overhead
- GitHub Actions runtime for CI and deployment workflows

### Cost surfaces in the rebuilt stack

- shared student `DeepSeek` usage
- shared student `Z.ai` usage
- Firebase Auth, Firestore, Storage, and App Hosting
- optional server-side AI usage if the webapp itself performs tutoring/review
- optional Cloud Run usage if heavy backend jobs are introduced

### Spend we should avoid in phase 1

- platform-native OCR as a core dependency
- always-on backend services
- BigQuery export unless product analytics truly require it
- Cloud Run services that do not materially improve the student experience
- lesson content stored in Firestore when static `MDX + JSON` is enough

## FinOps rules for phase 1

- Use `dev` and `prod` only.
- Use temp domains first.
- Use static lesson rendering where possible.
- Put budgets and alerts on both Firebase/GCP projects before deploying.
- If server-side AI is needed, keep it on a platform-specific budget instead of sharing the student key.
- Do not expose platform-only secrets to the client.
- Treat shared student keys as bootcamp infrastructure with a rotation plan.

## Phase order

### Phase 0 - project guardrails

Goal:

- lock cost, access, and operational boundaries before writing production code

Tasks:

- confirm project owners for `aifb-dev` and `aifb-prod`
- confirm repo owner for `ai-actuary-bootcamp`
- define shared-key policy and acceptable use language
- set project budget and alert thresholds
- decide whether platform tutoring uses the student key or a separate server-side key budget

Outputs:

- cost policy
- key policy
- environment ownership

Parallel work:

- infra budget setup
- key governance plan
- curriculum wording audit for local-first consistency

Serial gate:

- budget and ownership confirmed

### Phase 1 - foundation bootstrap

Goal:

- create the new repo and delivery skeleton

Tasks:

- create `ai-actuary-bootcamp`
- scaffold `Next.js + TypeScript`
- configure linting, formatting, testing, environment loading, and CI basics
- choose `npm` as the package manager

Outputs:

- clean app skeleton
- baseline CI

Parallel work:

- frontend shell bootstrap
- CI/bootstrap setup
- content export scripts start in parallel

Serial gate:

- main app boots locally and in CI

### Phase 2 - cloud project setup

Goal:

- create low-cost, clean infrastructure for `dev` and `prod`

Tasks:

- create `aifb-dev` and `aifb-prod`
- enable Firebase, Firestore, Storage, Auth, App Hosting, Monitoring, and Analytics
- enable only the GCP APIs required for phase 1
- set environment-specific secret storage

Outputs:

- working cloud environments
- environment config matrix

Parallel work:

- Firebase project setup
- GA4 setup
- secret strategy

Serial gate:

- both environments exist and can host the app

### Phase 3 - content extraction

Goal:

- preserve the strongest assets before UI work gets deep

Tasks:

- export `lib/course.py` into typed curriculum data
- export `lib/i18n.py` into locale files
- split `lib/ai.py` into tutor knowledge assets and prompt rules
- inventory actual datasets and docs
- distinguish `present`, `missing`, and `planned` assets

Outputs:

- portable content system
- asset inventory
- tutor knowledge base draft

Parallel work:

- curriculum extraction
- localization extraction
- tutor prompt extraction
- asset catalog audit

Serial gate:

- stable content schema approved

### Phase 4 - product redesign

Goal:

- define the new product structure without inheriting Streamlit layout constraints

Tasks:

- define `Mission Hub`, `Day Workspace`, `Portfolio`, and `Admin`
- define the academic-premium design system
- define mobile and desktop patterns
- define lesson-state model and submission flow

Outputs:

- product IA
- UX flows
- design tokens and component list

Parallel work:

- IA and route design
- design system
- journey mapping
- analytics event planning

Serial gate:

- workspace architecture approved

### Phase 5 - core platform primitives

Goal:

- build the cross-cutting platform pieces once, before day-specific tools

Tasks:

- Firebase Auth integration
- roles and route protection
- Firestore models for progress and submissions
- Storage flows for uploads and downloads
- notes/autosave
- admin shell

Outputs:

- reusable platform foundation

Parallel work:

- auth and roles
- progress and submissions
- storage and asset delivery
- admin shell

Serial gate:

- a test user can sign in, save progress, and submit an artifact

### Phase 6 - shared workspace engine

Goal:

- build the reusable lesson experience before custom day tools

Tasks:

- day workspace shell
- lesson content blocks
- task stepper
- resource rail
- notes panel
- submission panel
- embedded AI coach surface

Outputs:

- reusable lesson runtime

Parallel work:

- workspace layout
- lesson blocks
- submission UX
- AI coach shell

Serial gate:

- one sample day runs end to end in the new workspace

### Phase 7 - day-specific tools

Goal:

- build lesson interactions in grouped parallel clusters

Cluster 1:

- Day 0 setup wizard
- Day 1 reporting lab
- Day 2 spec editor

Cluster 2:

- Day 3 schema/API sandbox
- Day 4 model comparison board
- Day 5 architecture and scope canvas

Cluster 3:

- Day 6 local document workflow guide and evidence capture
- Day 7 wireflow, copy, and pricing tools
- Day 8 validation/run tooling
- Day 9 local app and document integration workspace
- Day 10 deploy and launch workspace

Outputs:

- day-specific learning tools

Parallel work:

- all three clusters can run in parallel after the workspace engine stabilizes

Serial gate:

- every day has a complete definition of done and working student path

### Phase 8 - AI layer

Goal:

- make AI useful without distorting the local-first learning model

Tasks:

- define where `DeepSeek` and `Z.ai` appear in the product
- implement prompt and context engineering
- build structured feedback and review outputs
- add observability and cost controls
- encode the Day 6 and Day 9 local-first guidance into the copy and workflows

Outputs:

- provider role map
- prompt library
- review schemas

Parallel work:

- prompt engineering
- review schema design
- UI integration
- evaluation harness

Serial gate:

- AI features are accurate enough, cheap enough, and clearly bounded in the curriculum

### Phase 9 - Supabase migration

Goal:

- move learner state without losing continuity

Tasks:

- export users, progress, and submissions
- preserve all exercise and challenge IDs
- map data into Firebase
- implement password-reset onboarding in the new auth flow
- verify migrated users and progress samples

Outputs:

- migration scripts
- mapped data
- onboarding path for existing learners

Parallel work:

- export tooling
- target schema mapping
- onboarding UX
- migration verification harness

Serial gate:

- migration dry run passes on sample users

### Phase 10 - test and harden

Goal:

- verify product quality before live traffic

Tasks:

- unit tests
- integration tests
- Firestore and Storage rules tests
- E2E tests
- manual UX review on Desktop Chrome and iPhone Safari
- AI review quality pass

Outputs:

- release candidate
- launch checklist status

Parallel work:

- test implementation
- responsive QA
- migration QA
- AI evaluation

Serial gate:

- release checklist passes

### Phase 11 - deploy and stabilize

Goal:

- deploy safely, then observe and tune

Tasks:

- deploy `dev`
- validate auth, content, progress, submissions, AI, and lesson tools
- deploy `prod` to a temp domain
- validate GA4 and monitoring
- watch costs, errors, and slow flows

Outputs:

- live application
- early stabilization backlog

Parallel work:

- deploy operations
- smoke testing
- analytics validation
- content QA

Serial gate:

- prod smoke test and migration verification complete

## Curriculum consistency rules to enforce during the rebuild

- Day 0 must clearly explain the role of the shared `DeepSeek` and `Z.ai` keys.
- Day 4 must compare model roles deliberately instead of treating AI as a single black box.
- Day 6 must teach a local document pipeline first, then position DeepSeek as a helper for structure, cleanup, reasoning, and review.
- Day 9 must keep the product build local-first and use the platform mainly for guidance, evidence, and review.
- Day 10 must celebrate shipping something the student built locally first, then deployed intentionally.

## Practical default

If no stronger need emerges during implementation, phase 1 should ship with:

- `Next.js + TypeScript`
- `Firebase Auth`
- `Firestore`
- `Firebase Storage`
- `Firebase App Hosting`
- static `MDX + JSON` content
- platform AI used sparingly and transparently
- no platform-native OCR dependency
