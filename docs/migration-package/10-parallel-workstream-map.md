# Parallel Workstream Map

## Purpose

Show how the rebuild can progress with maximum parallelism, which workstreams can begin immediately, where handoffs happen, and which gates remain truly serial.

## Guiding rule

Do not let one discipline wait for another unless there is a real dependency. The rebuild should move on multiple fronts at once: content, UX, platform, AI, migration, and QA.

## Workstream index

### WS-A - Platform and repo bootstrap

Scope:

- new repo creation
- app scaffold
- linting, formatting, CI, environments
- Firebase and GCP bootstrap

Can start:

- immediately after naming and ownership are confirmed

Depends on:

- repo owner
- project owner

Produces:

- working Next.js skeleton
- `dev` and `prod` cloud environments

### WS-B - Content extraction and modeling

Scope:

- export `lib/course.py`
- export `lib/i18n.py`
- normalize `lib/ai.py`
- build content schema and asset manifest

Can start:

- immediately

Depends on:

- none beyond access to the current repo

Produces:

- content schema
- portable curriculum data
- locale files
- tutor knowledge docs

### WS-C - UX, IA, and design system

Scope:

- route map
- Mission Hub / Day Workspace / Portfolio / Admin
- academic-premium design system
- responsive behavior

Can start:

- immediately after the high-level product shape is accepted

Depends on:

- content themes and lesson goals from WS-B

Produces:

- wireflows
- screen specs
- component inventory

### WS-D - Core app primitives

Scope:

- auth
- roles
- progress
- submissions
- notes/autosave
- storage and asset delivery

Can start:

- after WS-A produces the app and environment skeleton

Depends on:

- platform bootstrap from WS-A
- basic data model direction from WS-B

Produces:

- reusable application backbone

### WS-E - Day workspace engine

Scope:

- shared lesson shell
- task stepper
- resource rail
- notes pane
- AI panel shell
- submission shell

Can start:

- after WS-C defines the UX shell and WS-D starts the underlying primitives

Depends on:

- WS-C for structure
- WS-D for state and persistence hooks

Produces:

- reusable lesson runtime for every day

### WS-F - Day-specific tools

Scope:

- day interactions and labs by cluster

Clusters:

- `Cluster 1` - Days 0-2
- `Cluster 2` - Days 3-5
- `Cluster 3` - Days 6-10

Can start:

- once WS-E stabilizes the shared day shell

Depends on:

- WS-B for content schema
- WS-E for workspace runtime

Produces:

- real day experiences

### WS-G - AI and provider integration

Scope:

- DeepSeek and Z.ai role map
- prompt/context engineering
- review schemas
- evaluation harness
- cost controls and transparency

Can start:

- immediately for design work; implementation starts once WS-A and WS-D expose server/runtime hooks

Depends on:

- WS-B for tutor knowledge
- WS-C for UX placement
- WS-D for integration points

Produces:

- AI integration layer
- quality and cost guardrails

### WS-H - Supabase migration and onboarding

Scope:

- export users, progress, submissions
- map into Firebase
- password-reset onboarding
- migration verification

Can start:

- schema and dry-run planning immediately; full implementation after WS-D data model settles

Depends on:

- source data access
- target schema from WS-D

Produces:

- migration scripts
- onboarding flow

### WS-I - QA, analytics, and release readiness

Scope:

- test strategy
- E2E automation
- responsive QA
- event instrumentation
- release checklist

Can start:

- immediately for test planning and event taxonomy; implementation deepens as features land

Depends on:

- WS-A for tooling
- WS-C for journeys
- WS-D/E/F/G for feature coverage

Produces:

- launch readiness signal

## Maximum-parallel execution by stage

### Stage 0 - alignment

Run in parallel:

- WS-A ownership and environment decisions
- WS-B content inventory
- WS-C product and IA framing
- WS-G provider role design

Serial output:

- final operating assumptions

### Stage 1 - extraction and foundation

Run in parallel:

- WS-A app scaffold and Firebase/GCP setup
- WS-B curriculum, i18n, and tutor extraction
- WS-C design system and route map
- WS-I test and analytics planning

Serial output:

- approved content schema and app skeleton

### Stage 2 - backbone and workspace

Run in parallel:

- WS-D auth, roles, progress, submissions
- WS-E shared day shell
- WS-G prompt and review schema prototyping
- WS-I test harness setup

Serial output:

- one complete sample day path

### Stage 3 - lesson cluster buildout

Run in parallel:

- WS-F Cluster 1 (Days 0-2)
- WS-F Cluster 2 (Days 3-5)
- WS-F Cluster 3 (Days 6-10)
- WS-G AI integration into lesson tools
- WS-I regression and responsive QA as each cluster lands

Serial output:

- all day workspaces functional

### Stage 4 - migration and hardening

Run in parallel:

- WS-H migration scripts and dry runs
- WS-I end-to-end testing and release checklist
- WS-G AI evaluation and tuning
- WS-C final polish fixes

Serial output:

- release candidate

### Stage 5 - deploy and stabilize

Run in parallel:

- WS-A deploy operations
- WS-I smoke tests and analytics checks
- WS-H migration verification
- WS-C/WS-F final UX bug fixes

Serial output:

- production go-live

## Highest-value parallel development opportunities

### Opportunity 1 - content and frontend should not block each other

- content extraction can proceed while the new app shell is scaffolded
- the frontend can consume mock content schemas before the final export is finished

### Opportunity 2 - lesson clusters can be built independently

- once the shared workspace engine exists, three teams or agent groups can own different day ranges
- this is the single largest acceleration lever in the project

### Opportunity 3 - AI work can run beside product work

- prompt engineering, evaluation, and provider design should not wait for final UI polish
- AI schemas can be built against mock lesson payloads early

### Opportunity 4 - migration work can start before feature completion

- source audit, field mapping, and dry-run scripts can start before the UI is feature-complete

### Opportunity 5 - QA should start before the app is "done"

- test harnesses, event taxonomy, and journey specs should begin early
- this prevents a long late-stage testing crunch

## Serial gates that cannot be parallelized away

- project ownership and billing
- repo creation and environment bootstrap
- content schema approval
- core auth and persistence model lock
- migration dry-run signoff
- final production go/no-go

## Recommended agent or team split

If parallel subagents or parallel dev roles are used, the clean split is:

- `Agent 1 / Team 1` - WS-A platform bootstrap
- `Agent 2 / Team 2` - WS-B content extraction and schema
- `Agent 3 / Team 3` - WS-C UX, IA, and design system
- `Agent 4 / Team 4` - WS-D core app primitives
- `Agent 5 / Team 5` - WS-F Cluster 1 (Days 0-2)
- `Agent 6 / Team 6` - WS-F Cluster 2 (Days 3-5)
- `Agent 7 / Team 7` - WS-F Cluster 3 (Days 6-10)
- `Agent 8 / Team 8` - WS-G AI integration and evaluation
- `Agent 9 / Team 9` - WS-H migration and onboarding
- `Agent 10 / Team 10` - WS-I QA and analytics

## Handoff map

- WS-B -> WS-C: lesson structure and content semantics
- WS-B -> WS-D: content and progress IDs
- WS-C -> WS-E: workspace layout rules and component contracts
- WS-D -> WS-E: persistence hooks and auth state
- WS-E -> WS-F: shared lesson runtime
- WS-B + WS-G -> WS-F: AI-enabled lesson behaviors
- WS-D -> WS-H: target user/progress/submission model
- WS-F + WS-G -> WS-I: feature coverage for QA

## Coordination cadence

- keep one shared canonical content schema
- keep one shared component contract for the day workspace
- review integration points twice per week during active build
- require every workstream to declare:
  - what it owns
  - what it consumes
  - what it publishes for others

## Critical path

The true critical path is:

- bootstrap -> content schema -> core primitives -> shared workspace engine -> lesson clusters -> migration dry run -> launch QA -> prod deploy

Everything else should be pushed off the critical path where possible.
