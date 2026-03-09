# UX Replatform Brief

## Purpose

Describe the target experience for the rebuilt product while explicitly avoiding a page-for-page recreation of the current Streamlit app.

## Key sections

- UX vision and product posture
- Core user journeys
- Information architecture for the rebuilt app
- New interaction model for curriculum, resources, and tutor
- Mobile-first and desktop behavior
- Progress, submission, and feedback loops
- Content presentation patterns
- Design principles, accessibility, and instrumentation

## How to use the current repo as source material

- Use `app.py`, `pages/3_Exercicios.py`, and `pages/5_Recursos.py` only to understand user intent, flows, and content dependencies.
- Use `lib/course.py` to derive the learning journey, not the current page hierarchy.
- Use `lib/i18n.py` to identify high-value copy moments, labels, and states that users need, even if the UI pattern changes completely.
- Use `lib/ai.py` to preserve the tutor's role in the user journey: guidance, review, recap, and next-step support.
- Explicitly redesign around modern web patterns such as workspace dashboards, lesson readers, structured submissions, document workspaces, and persistent tutor panels.
