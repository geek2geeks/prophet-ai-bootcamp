# API and Secret Setup

Do not commit real secrets to GitHub. Use this file as a deployment reference only.

## Deployed App

**Live URL:** https://ai-actuary.streamlit.app/

**Pages:**
- Dashboard: https://ai-actuary.streamlit.app/1_Dashboard
- Programa: https://ai-actuary.streamlit.app/2_Programa
- Exercícios: https://ai-actuary.streamlit.app/3_Exercicios
- Recursos: https://ai-actuary.streamlit.app/5_Recursos
- AI Tutor: https://ai-actuary.streamlit.app/6_AI_Tutor

## Streamlit Secrets

Add these in Streamlit Community Cloud under App settings -> Secrets:

```toml
[supabase]
url = "https://naecdtkxxlawxlkljtkt.supabase.co"
key = "<your-supabase-anon-key>"
service_key = "<your-supabase-service-role-key>"

[deepseek]
api_key = "<your-deepseek-api-key>"

[app]
url = "https://ai-actuary.streamlit.app"
```

## Optional Local Tooling

If you also use Z.ai outside the deployed app, keep it local and do not commit it:

```text
zai api = <your-zai-api-key>
```

## Supabase Auth Settings

- Set the Supabase project Site URL to your Streamlit app URL.
- Add your deployed Streamlit URL to Redirect URLs.
- Keep `http://localhost:8501` in Redirect URLs for local development.

## Current App Entrypoint

- Main file: `app.py`
- Dependencies: `requirements.txt`
- Theme config: `.streamlit/config.toml`
