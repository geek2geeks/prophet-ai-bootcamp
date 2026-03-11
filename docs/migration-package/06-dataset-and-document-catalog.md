# Dataset and Document Catalog

## Purpose

Create the migration plan for all datasets, downloadable files, and reference documents that support the learning product and future document workflows.

## Key sections

- Dataset inventory
- File provenance and status
- Proposed storage destination
- Public vs authenticated access rules
- Metadata schema for datasets and docs
- Download, preview, and versioning rules
- RAG/readiness assessment for long-form docs
- Data governance and privacy notes

## How to use the current repo as source material

- Inventory actual files in `data/day0` and `data/day1` first, since they are present and already linked into the app.
- Use `pages/5_Recursos.py` and `lib/ai.py` to list referenced future assets that are planned but not yet present in the repo.
- Include `prophet_reference_vida.md`, `api.md`, `DEPLOYMENT.md`, `DEPLOYMENT_AUTO_REPORT.md`, and `docs/deepseek-v3.2-assessment.md` as first-class knowledge assets.
- Separate three categories clearly: downloadable datasets, reference reading, and internal implementation notes.
- Mark which files should move to Firebase Storage, which should be embedded in a CMS/content repo, and which should become indexed documents for AI retrieval.
