# Content Preservation Inventory

## Purpose

Create the master inventory of durable content assets that need export, normalization, and migration before any frontend redesign begins.

## Key sections

- Asset categories and preservation priority
- Structured curriculum inventory
- Translation inventory
- Tutor knowledge inventory
- Dataset and downloadable asset inventory
- Reference docs and long-form notes
- Content quality issues and gaps
- Canonical source-of-truth recommendations

## How to use the current repo as source material

- Treat `lib/course.py` as the source of truth for program structure: days, modules, exercises, challenges, objectives, points, badges, and narrative sequencing.
- Treat `lib/i18n.py` as the source of truth for copy keys, language coverage, UI labels, and resource descriptions.
- Treat `lib/ai.py` as the source of truth for tutor behavior, bootcamp context, actuarial glossary, technical glossary, and mathematical rules.
- Inventory `data/day0` and `data/day1` as already-shippable data assets, then note the additional planned datasets referenced in `lib/ai.py` and `pages/5_Recursos.py`.
- Include root docs like `prophet_reference_vida.md`, `api.md`, `DEPLOYMENT.md`, `DEPLOYMENT_AUTO_REPORT.md`, and `docs/deepseek-v3.2-assessment.md` as migration inputs, not incidental notes.
