# AI Tutor Knowledge Migration

## Purpose

Define how the current tutor's knowledge base, rules, and interaction model should be preserved and reimplemented on Firebase/GCloud.

## Key sections

- Tutor jobs and boundaries
- Knowledge domains to preserve
- System prompt decomposition
- Retrieval vs static prompt strategy
- Safe use cases and blocked use cases
- Prompt/version traceability requirements
- Evaluation criteria for tutor quality
- Proposed backend services and data flow

## How to use the current repo as source material

- Use `lib/ai.py` as the canonical source for the current tutor's system prompt, course context, actuarial rules, product framing, and cost-control patterns.
- Preserve the substance of `COURSE_CONTEXT`, but split it into durable knowledge documents rather than one oversized hardcoded prompt.
- Use `docs/deepseek-v3.2-assessment.md` to carry forward realistic AI limitations, review-loop patterns, and evidence-based feedback requirements.
- Preserve current student-context ideas such as progress-aware tutoring, but redesign session handling for Firebase Auth and server-side orchestration.
- Do not preserve provider coupling to DeepSeek as a hard requirement; preserve the behavior contract and safety rules instead.
