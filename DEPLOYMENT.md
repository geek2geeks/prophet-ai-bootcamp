# Deployment Guide - Prophet AI Bootcamp

## Current Status

✅ **App is live:** https://ai-actuary.streamlit.app/  
✅ **GitHub:** geek2geeks/prophet-ai-bootcamp  
✅ **Google OAuth:** Enabled in code  
⏳ **Streamlit Secrets:** Ready to configure  

## Quick Start

Run the interactive setup script:

```bash
./setup.sh
```

This will guide you through:
1. Getting secrets from GitHub
2. Adding them to Streamlit Cloud
3. Configuring Supabase redirects

---

## Manual Setup Steps

### Step 1: Copy Secrets from GitHub

**Go to:**
```
https://github.com/geek2geeks/prophet-ai-bootcamp/settings/secrets/actions
```

**You'll see these secrets:**
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PUBLISHABLE_KEY`
- `DEEPSEEK_API_KEY`
- `ZAI_API_KEY`

⚠️ GitHub hides values for security. You can only see the length. **Click each secret to view its value**, then copy it.

### Step 2: Add Secrets to Streamlit Cloud

**Go to:**
```
https://share.streamlit.io/apps
```

1. Click on **ai-actuary** app
2. Click menu (⋮) → **Settings**
3. Click **Secrets**
4. Paste this template:

```toml
[supabase]
url = "https://naecdtkxxlawxlkljtkt.supabase.co"
key = "PASTE_SUPABASE_ANON_KEY_HERE"
service_key = "PASTE_SUPABASE_SERVICE_ROLE_KEY_HERE"

[deepseek]
api_key = "PASTE_DEEPSEEK_API_KEY_HERE"

[app]
url = "https://ai-actuary.streamlit.app"
```

5. Replace placeholders with actual values from GitHub
6. Click **Save**

### Step 3: Configure Supabase OAuth Redirects

**Go to:** Supabase Dashboard → Authentication → Providers → Google

**Add Redirect URLs:**
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

## Verify Deployment

1. **Visit the app:**
   ```
   https://ai-actuary.streamlit.app
   ```

2. **Test Google OAuth:**
   - Click "Continuar com Google"
   - You should be redirected to Google login
   - After login, you should see the dashboard

3. **Check all pages:**
   - https://ai-actuary.streamlit.app/1_Dashboard
   - https://ai-actuary.streamlit.app/2_Programa
   - https://ai-actuary.streamlit.app/3_Exercicios
   - https://ai-actuary.streamlit.app/5_Recursos
   - https://ai-actuary.streamlit.app/6_AI_Tutor

---

## Local Development

### Run locally with secrets

Option 1: Using deploy script
```bash
export SUPABASE_ANON_KEY="your-key"
export SUPABASE_SERVICE_ROLE_KEY="your-service-key"
export DEEPSEEK_API_KEY="your-key"

./deploy.sh
```

Option 2: Using streamlit directly
```bash
streamlit run app.py
```

(App will run in demo mode if secrets not provided)

---

## GitHub Actions Automation

### Deployed Workflows

1. **`.github/workflows/deploy.yml`**
   - Runs on every push to `main`
   - Installs dependencies
   - Tests the app
   - Creates secrets.toml for verification

2. **`.github/workflows/sync-secrets.yml`**
   - Syncs GitHub Secrets
   - Verifies secret configuration
   - Future: Can auto-update Streamlit Cloud (requires token)

### To enable auto-sync to Streamlit Cloud

1. **Get Streamlit Cloud token:**
   - Go to https://share.streamlit.io/settings/tokens
   - Create new token
   - Copy it

2. **Add to GitHub Secrets:**
   - Go to https://github.com/geek2geeks/prophet-ai-bootcamp/settings/secrets/actions
   - Click "New repository secret"
   - Name: `STREAMLIT_CLOUD_TOKEN`
   - Value: paste the token
   - Click "Add secret"

---

## Troubleshooting

### "Secret not found" error
- Check that secrets are added to Streamlit Cloud (not just GitHub)
- Go to app Settings → Secrets → verify all values are there

### "Google OAuth error"
- Check Supabase OAuth redirects include your Streamlit app URL
- Verify Google OAuth credentials in Supabase dashboard
- Check browser console for error details

### "Demo mode" shows instead of login
- Means secrets aren't loaded
- Check Streamlit Cloud secrets are properly configured
- Look at app logs for error

---

## File Structure

```
prophet-ai-bootcamp/
├── app.py                          # Main app
├── requirements.txt                # Python dependencies
├── deploy.sh                       # Local deployment script
├── setup.sh                        # Interactive setup wizard
├── api.md                          # This file
├── .github/
│   └── workflows/
│       ├── deploy.yml              # Test & verify on push
│       └── sync-secrets.yml        # Secret syncing
├── .streamlit/
│   ├── config.toml                 # Theme config
│   └── secrets.toml (gitignored)   # Local secrets
├── lib/
│   ├── auth.py                     # Google OAuth logic
│   ├── db.py                       # Database functions  
│   ├── ai.py                       # AI features
│   ├── course.py                   # Course logic
│   ├── i18n.py                     # Translations
│   └── theme.py                    # UI theme
└── pages/
    ├── 1_Dashboard.py
    ├── 2_Programa.py
    ├── 3_Exercicios.py
    ├── 5_Recursos.py
    └── 6_AI_Tutor.py
```

---

## Support

**Streamlit Cloud Docs:**
- https://docs.streamlit.io/deploy

**Supabase Docs:**
- https://supabase.com/docs

**GitHub Actions:**
- https://docs.github.com/actions

---

**Deployed App:** https://ai-actuary.streamlit.app/
