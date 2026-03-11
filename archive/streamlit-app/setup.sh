#!/bin/bash
# Interactive setup script to configure Streamlit Cloud secrets
# This guides you through getting secrets from GitHub and setting them in Streamlit Cloud

set -e

clear
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Prophet AI Bootcamp - Streamlit Cloud Setup              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: GitHub Secrets
echo "📍 Step 1: Get secrets from GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "You need to copy secrets from:"
echo "   https://github.com/geek2geeks/prophet-ai-bootcamp/settings/secrets/actions"
echo ""
echo "Secrets to copy:"
echo "   1. SUPABASE_ANON_KEY"
echo "   2. SUPABASE_SERVICE_ROLE_KEY"
echo "   3. DEEPSEEK_API_KEY"
echo ""
echo "⚠️  GitHub hides secret values for security. You can only see length."
echo "   Copy each one by clicking on it."
echo ""

read -p "Press ENTER once you have copied the secrets to clipboard..."
echo ""

# Step 2: Streamlit Cloud
echo "📍 Step 2: Add secrets to Streamlit Cloud"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: https://share.streamlit.io/apps"
echo "2. Click on the 'ai-actuary' app"
echo "3. Click menu (⋮) in top-right → Settings"
echo "4. Click 'Secrets'"
echo ""
echo "5. Paste THIS into the secrets editor:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat << 'EOF'
[supabase]
url = "https://naecdtkxxlawxlkljtkt.supabase.co"
key = "PASTE_SUPABASE_ANON_KEY_HERE"
service_key = "PASTE_SUPABASE_SERVICE_ROLE_KEY_HERE"

[deepseek]
api_key = "PASTE_DEEPSEEK_API_KEY_HERE"

[app]
url = "https://ai-actuary.streamlit.app"
EOF
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 3: Supabase Configuration
echo "📍 Step 3: Configure Supabase OAuth redirect URLs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: Supabase Dashboard → Authentication → Providers → Google"
echo "2. Add these Redirect URLs:"
echo ""
cat << 'EOF'
https://ai-actuary.streamlit.app
https://ai-actuary.streamlit.app/1_Dashboard
https://ai-actuary.streamlit.app/2_Programa
https://ai-actuary.streamlit.app/3_Exercicios
https://ai-actuary.streamlit.app/5_Recursos
https://ai-actuary.streamlit.app/6_AI_Tutor
http://localhost:8501
http://localhost:8501/?auth_state=*
EOF
echo ""

read -p "Press ENTER once you've completed all steps..."
echo ""

# Final verification
echo "🎉 Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Your app is live at: https://ai-actuary.streamlit.app"
echo ""
echo "🔍 Verify it's working:"
echo "   1. Visit https://ai-actuary.streamlit.app"
echo "   2. Click 'Continuar com Google' (Continue with Google)"
echo "   3. You should be redirected to Google login"
echo ""
echo "📱 Available pages:"
echo "   • Dashboard: /1_Dashboard"
echo "   • Programa: /2_Programa"
echo "   • Exercícios: /3_Exercicios"
echo "   • Recursos: /5_Recursos"
echo "   • AI Tutor: /6_AI_Tutor"
echo ""
echo "💡 Pro tip: If you make changes locally, just push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Update app'"
echo "   git push origin main"
echo ""
echo "The app will auto-update! 🚀"
echo ""
