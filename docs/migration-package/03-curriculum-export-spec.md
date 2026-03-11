# Curriculum Export Spec

## Purpose

Define how the course content in Python should be exported into durable, typed content models for a future TypeScript application.

## Key sections

- Export goals and assumptions
- Proposed content model
- Entity definitions: course, badge, day, module, topic, exercise, challenge, recap
- Required fields and optional fields
- IDs, slugs, ordering, and versioning rules
- Markdown vs rich-text strategy
- Validation rules and QA checklist
- Example JSON or Firestore document shapes

## How to use the current repo as source material

- Parse `lib/course.py` into a normalized schema rather than manually rewriting content.
- Preserve semantic structure from `DAYS`, `BADGES`, title/subtitle, and point thresholds.
- Split embedded prose in `descricao` and `conteudo` fields into content blocks suitable for web presentation and mobile consumption.
- Flag places where current content mixes pedagogy, instructions, and file references in one string; these should become separate typed fields in the rebuild.
- Use `CURRICULUM_REVIEW.md` to identify weak or inconsistent curriculum elements before export locks them in.
