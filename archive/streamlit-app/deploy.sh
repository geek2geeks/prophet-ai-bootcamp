#!/bin/bash
# Deploy Prophet AI Bootcamp locally with secrets from environment

set -e

echo "🚀 Prophet AI Bootcamp Local Deployment"
echo "========================================"

# Check if required environment variables are set
check_env() {
    if [ -z "${!1}" ]; then
        echo "❌ Error: $1 is not set"
        return 1
    fi
}

# Optional: Use GitHub token to test connectivity
if [ ! -z "$GITHUB_TOKEN" ]; then
    echo "✅ GitHub token found"
    USER=$(curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user | grep -o '"login": "[^"]*' | cut -d'"' -f4)
    echo "   Authenticated as: $USER"
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.9+"
    exit 1
fi

echo "✅ Python version: $(python3 --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
python3 -m pip install -q -r requirements.txt

# Create secrets file if environment variables are provided
if [ ! -z "$SUPABASE_ANON_KEY" ] && [ ! -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo ""
    echo "🔐 Setting up secrets..."
    mkdir -p .streamlit
    cat > .streamlit/secrets.toml << EOF
[supabase]
url = "https://naecdtkxxlawxlkljtkt.supabase.co"
key = "$SUPABASE_ANON_KEY"
service_key = "$SUPABASE_SERVICE_ROLE_KEY"

[deepseek]
api_key = "$DEEPSEEK_API_KEY"

[app]
url = "http://localhost:8501"
EOF
    echo "✅ Secrets configured"
    echo ""
    echo "⚠️  WARNING: Secrets stored locally in .streamlit/secrets.toml"
    echo "           This file is in .gitignore and won't be committed"
else
    echo ""
    echo "⚠️  No secrets provided. App will run in demo mode."
    echo ""
    echo "To use actual secrets, set environment variables:"
    echo "  export SUPABASE_ANON_KEY='...'"
    echo "  export SUPABASE_SERVICE_ROLE_KEY='...'"
    echo "  export DEEPSEEK_API_KEY='...'"
fi

# Run the app
echo ""
echo "🎯 Starting Streamlit app..."
echo "   Local: http://localhost:8501"
echo "   Deployed: https://ai-actuary.streamlit.app"
echo ""
echo "Press Ctrl+C to stop"
echo ""

python3 -m streamlit run app.py
