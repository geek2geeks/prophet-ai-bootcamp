# Migration Planning Package Outline

This package defines the planning and export documents for a future rebuild of this project as a `Next.js + TypeScript + Firebase + Google Cloud` product.

The package assumes two principles:

1. Preserve the current content system, learning assets, bilingual/trilingual copy, and AI tutor knowledge.
2. Rethink the user experience completely instead of reproducing the current Streamlit layout page by page.

## Package documents

1. `01-product-migration-charter.md`
2. `02-content-preservation-inventory.md`
3. `03-curriculum-export-spec.md`
4. `04-localization-copy-export-plan.md`
5. `05-ai-tutor-knowledge-migration.md`
6. `06-dataset-and-document-catalog.md`
7. `07-ux-replatform-brief.md`
8. `08-target-architecture-and-delivery-plan.md`
9. `09-execution-order-and-cost-plan.md`
10. `10-parallel-workstream-map.md`

## Priority source material in the current repo

- `lib/course.py` - primary curriculum and structured learning content source
- `lib/i18n.py` - translation keys, multilingual UX copy, resource labels, and app wording
- `lib/ai.py` - tutor prompt, course context, operating rules, and product framing
- `data/day0` and `data/day1` - downloadable CSV assets already wired into the app
- `prophet_reference_vida.md` - functional benchmark for Prophet vs Prophet Lite
- `api.md`, `DEPLOYMENT.md`, `DEPLOYMENT_AUTO_REPORT.md`, `CURRICULUM_REVIEW.md`, `docs/deepseek-v3.2-assessment.md` - supporting product, delivery, and AI capability notes

## Suggested use

- Start with `01` to align scope.
- Use `02` through `06` to extract durable content from the current repo.
- Use `07` to redesign the product experience without inheriting Streamlit constraints.
- Use `08` to convert the plan into a Firebase/GCloud build roadmap.
- Use `09` to sequence the work, confirm CLI/tooling readiness, and keep cost policy explicit.
- Use `10` to maximize parallel development and clarify handoffs, dependencies, and serial gates.
