# Localization and Copy Export Plan

## Purpose

Plan the extraction and restructuring of multilingual UX copy so the new app can use a maintainable localization system without carrying over Streamlit-era coupling.

## Key sections

- Localization goals
- Current language coverage and gaps
- Key naming audit
- Copy domains: marketing, auth, dashboard, exercises, resources, tutor
- Translation storage strategy
- Fallback and missing-key policy
- Tone and terminology guide
- Migration QA for PT, EN, and FR

## How to use the current repo as source material

- Use `lib/i18n.py` as the raw source for all current translatable strings.
- Group existing keys by product surface instead of keeping one monolithic translation file.
- Preserve domain-specific wording around actuarial education, Prophet Lite, and AI builder workflows.
- Note where current keys encode layout-era assumptions such as sidebar labels or Streamlit-specific UI text; preserve the meaning, not the old component structure.
- Cross-check resource descriptions in `pages/5_Recursos.py` with matching entries in `lib/i18n.py` so the rebuilt content library stays consistent.
