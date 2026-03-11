# Constitution - Day 3 AI Feedback Webapp

## Purpose
Build a beginner-first webapp for Day 3 of the bootcamp. The app helps a student with no software background understand actuarial files, prepare better AI context, and use DeepSeek 3.2 to get initial actuarial feedback on synthetic files.

## Permanent Principles

### 1. Beginner-first explanation
- Explain every step in plain Portuguese.
- Assume the student has never built software before.
- Define technical words immediately in one short sentence.

### 2. Synthetic data only
- Use only bootcamp files or synthetic examples.
- Never ask for or send real customer data to an LLM.
- Show a visible warning whenever AI is used on files.

### 3. Context before AI
- DeepSeek 3.2 must never analyse a file with zero context.
- Before every AI run, the app must collect or show four blocks: role, objective, limits, response format.
- The UI must make this sequence obvious to the student.

### 4. No invented actuarial claims
- The model cannot invent metrics, assumptions, reserves, projections, or business facts that are not present.
- Every AI answer must separate observations, possible concerns, and human checks.

### 5. Useful actuarial feedback
- AI output must aim for alerts, validation checks, open questions, and possible business implications.
- Prefer short actionable bullets over long essays.

### 6. Calm single-page UX
- Keep the experience single-page, smooth, and low-clutter.
- One primary action per block.
- Avoid dense dashboards, nested tabs, or too many decisions at once.

### 7. Local-first and lightweight
- Prefer browser parsing or simple local logic before backend complexity.
- The app should still teach the concept even if the AI call is unavailable.

### 8. Verifiable learning outcome
- The student must leave with a reusable context pack, a clearer understanding of the files, and a draft contract pack.
- Each important section should end with what was learned or what to do next.
