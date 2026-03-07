# API and Secret Setup

⚠️ **Do not commit real secrets to GitHub.** Use this file as a deployment reference only.

## Deployed App

**Live URL:** https://ai-actuary.streamlit.app/

**Pages:**
- Dashboard: https://ai-actuary.streamlit.app/1_Dashboard
- Programa: https://ai-actuary.streamlit.app/2_Programa
- Exercícios: https://ai-actuary.streamlit.app/3_Exercicios
- Recursos: https://ai-actuary.streamlit.app/5_Recursos
- AI Tutor: https://ai-actuary.streamlit.app/6_AI_Tutor

---

## Secrets Reference

### GitHub Actions Secrets
**Location:** https://github.com/geek2geeks/prophet-ai-bootcamp/settings/secrets/actions

GitHub stores these secrets securely (values are hidden):

| Secret Name | Description | Used For |
|---|---|---|
| `SUPABASE_ANON_KEY` | Public Supabase key | Client-side auth & database queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin Supabase key | Server-side operations & RLS bypass |
| `SUPABASE_PUBLISHABLE_KEY` | Alternative public key | Optional alternative to ANON_KEY |
| `DEEPSEEK_API_KEY` | DeepSeek AI API key | AI Tutor features |
| `ZAI_API_KEY` | Z.ai API key | Additional AI features |

**How to get them:**
1. Visit: https://github.com/geek2geeks/prophet-ai-bootcamp/settings/secrets/actions
2. Click on each secret name to view (GitHub shows last few chars)
3. Copy the full value

### Streamlit Cloud Secrets
**Location:** https://share.streamlit.io/apps → ai-actuary → Settings → Secrets

Add these values from GitHub secrets:

```toml
[supabase]
url = "https://naecdtkxxlawxlkljtkt.supabase.co"
key = "COPY_SUPABASE_ANON_KEY_FROM_GITHUB"
service_key = "COPY_SUPABASE_SERVICE_ROLE_KEY_FROM_GITHUB"

[deepseek]
api_key = "COPY_DEEPSEEK_API_KEY_FROM_GITHUB"

[app]
url = "https://ai-actuary.streamlit.app"
```

**Steps:**
1. Go to: https://share.streamlit.io/apps
2. Click on **ai-actuary**
3. Click menu (⋮) → **Settings**
4. Click **Secrets**
5. Paste the template above
6. Replace each placeholder with value from GitHub
7. Click **Save**

### Supabase Configuration

**Supabase Project URL:**
```
https://naecdtkxxlawxlkljtkt.supabase.co
```

**OAuth Redirect URLs:**
Add these in: Supabase Dashboard → Authentication → Providers → Google

```
https://ai-actuary.streamlit.app
https://ai-actuary.streamlit.app/1_Dashboard
https://ai-actuary.streamlit.app/2_Programa
https://ai-actuary.streamlit.app/3_Exercicios
https://ai-actuary.streamlit.app/5_Recursos
https://ai-actuary.streamlit.app/6_AI_Tutor
http://localhost:8501
http://localhost:8501/?auth_state=*
```

---

## Local Development

### Create Local Secrets File

To test locally with secrets:

```bash
export SUPABASE_ANON_KEY="your-key-from-github"
export SUPABASE_SERVICE_ROLE_KEY="your-key-from-github"
export DEEPSEEK_API_KEY="your-key-from-github"

./deploy.sh
```

Or manually create `.streamlit/secrets.toml`:
```toml
[supabase]
url = "https://naecdtkxxlawxlkljtkt.supabase.co"
key = "your-key-here"
service_key = "your-service-key-here"

[deepseek]
api_key = "your-key-here"

[app]
url = "http://localhost:8501"
```

⚠️ **Note:** `.streamlit/secrets.toml` is in `.gitignore` and won't be committed.

---

## Deployment Checklist

- [ ] **Step 1:** Copy secrets from GitHub Actions Secrets
- [ ] **Step 2:** Add secrets to Streamlit Cloud dashboard
- [ ] **Step 3:** Configure Supabase OAuth redirect URLs
- [ ] **Step 4:** Test Google OAuth at https://ai-actuary.streamlit.app
- [ ] **Step 5:** Verify all 5 pages are accessible

For detailed instructions, run: `./setup.sh`

---

## Application Configuration

**Main Entrypoint:**
- Main file: `app.py`
- Dependencies: `requirements.txt`

**Theme:**
- Config: `.streamlit/config.toml`
- Theme: `lib/theme.py`

**Internationalization:**
- Translations: `lib/i18n.py`
- Languages: Portuguese (pt), English (en), French (fr)

**Authentication:**
- Google OAuth: `lib/auth.py`
- Supabase Integration: `lib/db.py`

**AI Features:**
- AI Tutor: `lib/ai.py`
- Course Management: `lib/course.py`
