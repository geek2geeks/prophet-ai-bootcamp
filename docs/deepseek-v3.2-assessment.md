# DeepSeek V3.2 Assessment for Prophet Lite Bootcamp

Reviewed: 2026-03-08

## Purpose

This note assesses what DeepSeek V3.2 can realistically do inside this Streamlit bootcamp app, especially for Day 1 exercises, AI tutor workflows, and review of student submissions.

The goal is to separate verified platform capabilities from product ideas that are merely possible in theory.

## What "DeepSeek 3.2" actually means

- DeepSeek's stable public API does not primarily expose a model ID called `deepseek-v3.2`.
- The stable public API currently exposes `deepseek-chat` and `deepseek-reasoner`.
- Official DeepSeek docs state both map to the `DeepSeek-V3.2` model family with a 128K context window.
- In practice:
  - `deepseek-chat` = non-thinking mode, faster, cheaper, simpler
  - `deepseek-reasoner` = thinking mode, better for hard cases, less controllable

Conclusion: in this app, "use DeepSeek 3.2" should usually mean "use `deepseek-chat` by default, and reserve `deepseek-reasoner` for deeper review flows."

## Verified capabilities relevant to this app

### 1. Long context

- Public docs describe a 128K context window.
- This is enough for:
  - rubric + student submission + brief course context
  - document question answering over extracted text
  - multi-part review prompts
- It is still not a reason to dump everything into one prompt. Good chunking and prompt structure still matter.

### 2. Structured output / JSON mode

- DeepSeek documents a JSON mode via `response_format={"type": "json_object"}`.
- This is useful for returning review objects like score, strengths, gaps, required fixes, and pass recommendation.
- Docs also warn JSON mode can occasionally fail or return empty content.

Implication: JSON is usable, but only with schema validation, retry logic, and safe fallbacks.

### 3. Reasoning / thinking mode

- DeepSeek supports a reasoning mode through `deepseek-reasoner`.
- The API exposes reasoning output separately as `reasoning_content`.
- Thinking mode is helpful for harder judgment calls, but it is less deterministic and can generate larger outputs.
- Some tuning controls such as `temperature` do not apply in the same way in reasoning mode.

Implication: use thinking mode for deep review or borderline submissions, not for every student interaction.

### 4. Tool calling

- DeepSeek supports tool calling.
- Tool calls are useful if the app wants the model to trigger internal helpers such as:
  - rubric scoring helpers
  - retrieval over course docs
  - submission parsing
  - admin review workflows
- Official docs warn tool arguments can still be malformed or hallucinated.

Implication: tool calling is useful, but every tool call must be validated in app code.

### 5. Streaming

- DeepSeek supports streaming responses.
- The current app already uses streaming in `lib/ai.py:292` and non-streaming calls in `lib/ai.py:268`.

Implication: streaming is a strong fit for tutor UX, draft review, and progressive feedback in Streamlit.

### 6. Context caching

- DeepSeek documents automatic context caching for repeated prompt prefixes.
- The current app already exploits this pattern by keeping a stable system prompt prefix in `lib/ai.py:251`.

Implication: rubric-based tutoring and repeated review prompts are cost-efficient if the fixed review prompt is kept stable.

### 7. Multilingual support

- Official model information indicates broad multilingual capability.
- For this app, the practical concern is Portuguese and English.
- The current tutor is already PT/EN-oriented, so this is a good fit.

Implication: bilingual tutoring and bilingual feedback are realistic features.

## Important limitations

### 1. No trustworthy autonomous grading

- DeepSeek can give useful first-pass review.
- It should not be the final authority for pass/fail or formal grading.
- Subjective scoring will drift across runs.

Implication: AI should recommend, not decide.

### 2. Hallucination risk remains real

- The model can invent evidence, overstate confidence, or describe things not present in a submission.
- This is especially risky in educational review and actuarial analysis.

Implication: every review prompt should force the model to cite explicit evidence from the student submission.

### 3. Weak repeatability

- Public docs do not offer a strong deterministic guarantee suitable for academic audit.
- Even with stable prompts, exact scoring may vary.

Implication: if we store AI reviews, we should also store prompt version, model used, timestamp, rubric version, and raw output.

### 4. No assumption of native file understanding

- The public chat API is text-message oriented.
- We should not assume robust native understanding of PDFs, images, or complex Office documents.

Implication: the app should extract text first, then send the extracted text to DeepSeek.

### 5. Privacy and compliance concerns

- Public DeepSeek legal documents indicate prompts/uploads may be processed and retained under DeepSeek's policies.
- Public policy materials also indicate data handling may involve China-based processing.

Implication: do not send sensitive personal data, real customer data, or uncontrolled student records without explicit data policy, consent, and minimization.

## What DeepSeek is good for in this app

- low-cost bilingual tutor chat
- first-pass rubric feedback
- finding missing sections in a submission
- suggesting clearer rewrites
- generating short executive summaries
- extracting evidence per criterion into JSON
- comparing two drafts and showing what improved
- document Q&A over extracted text

## What DeepSeek should not be trusted to do

- final autonomous grading
- unsupervised pass/fail decisions
- handling raw confidential student uploads casually
- grading highly subjective work without human review
- reliable citation unless the app constrains evidence extraction carefully

## Recommended implementation pattern

### Safe pattern: AI review as recommendation

For each substantial deliverable, the app should ask DeepSeek for:

- `score_recommended`
- `pass_recommended`
- `strengths`
- `gaps`
- `required_fixes`
- `evidence_used`
- `confidence`

The app should then:

- show the recommendation to the student
- allow revision
- save the review trace for admins
- keep final grading or override in human hands

### Unsafe pattern: AI as final grader

Avoid workflows where DeepSeek alone:

- decides a final pass/fail
- blocks progression permanently
- assigns official scores without review

## What this means for Day 1

Day 1 should become more interactive, but not by turning the tutor into a black-box grader.

The strongest use of DeepSeek V3.2 in Day 1 is:

1. guided exploration inside Streamlit
2. structured student draft input
3. AI first-pass review against a rubric
4. revision loop
5. optional human/admin confirmation

## Best Day 1 features to build now

### 1. AI pre-submission checker

Before a student marks an exercise complete, the tutor checks:

- did the student answer the required questions?
- did they use Day 0 evidence where required?
- is the wedge too broad?
- is the customer specific enough?

This is low-risk and high-value.

### 2. Rubric evidence extractor for ex1.4, ex1.5, and des1

The model should return structured JSON such as:

```json
{
  "score_recommended": 7,
  "max_score": 10,
  "pass_recommended": false,
  "strengths": ["Customer is specific"],
  "gaps": ["Pain point is vague", "No Day 0 evidence used"],
  "required_fixes": ["Add one real number from the dataset"],
  "evidence_used": ["Mentions 30 policies and smoker split"],
  "confidence": "medium"
}
```

### 3. Draft -> review -> revise workflow

The student should be able to:

- paste or upload a draft
- get AI feedback
- revise in place
- run review again

This turns the tutor into a coach instead of a passive sidebar chatbot.

### 4. Bilingual feedback mode

Let the student choose:

- feedback in Portuguese
- feedback in English
- both

This fits the actual strengths of the model and the app.

### 5. Deep review only for hard cases

Use:

- `deepseek-chat` for standard tutor use and first-pass checks
- `deepseek-reasoner` only for complex submissions, challenge review, or admin deep review

This keeps costs lower and UX faster.

## Features to avoid for now

- automatic final pass/fail by AI alone
- grading based on uploaded PDFs without robust text extraction
- scoring students on style-only criteria without human review
- any workflow that accepts sensitive real-world actuarial data uploads

## Product recommendation

Do not redesign the tutor as an autonomous examiner.

Instead, redesign it as an `AI review layer` embedded into the deliverables.

That means:

- every major Day 1 deliverable should have a structured submission surface in Streamlit
- every major Day 1 deliverable should have a `Review with AI` button
- the tutor should evaluate with rubric + evidence extraction
- the result should be a recommendation, not a final academic judgment

## Source notes

This assessment is based on:

- official DeepSeek API documentation and model references
- official DeepSeek pricing / caching / streaming / tool-calling documentation
- official DeepSeek legal and privacy documentation
- current app implementation in `lib/ai.py:268` and `lib/ai.py:292`

Some practical recommendations in this note are inferred from those documented capabilities plus the current architecture of this Streamlit app.
