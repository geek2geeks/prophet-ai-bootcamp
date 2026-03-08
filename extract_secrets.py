#!/usr/bin/env python3
"""
Extract and manage GitHub repository secrets programmatically.
This script queries GitHub API to list secrets and helps manage them.
"""

import os
import json
import subprocess
from typing import Dict, List, Optional
import sys

class GitHubSecretsManager:
    def __init__(self, token: str, repo: str = "geek2geeks/prophet-ai-bootcamp"):
        self.token = token
        self.repo = repo
        self.github_api = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
    
    def list_secrets(self) -> List[Dict]:
        """List all secrets in the repository"""
        url = f"{self.github_api}/repos/{self.repo}/actions/secrets"
        try:
            import subprocess
            result = subprocess.run(
                ["curl", "-s", "-H", f"Authorization: token {self.token}",
                 "-H", "Accept: application/vnd.github+json",
                 url],
                capture_output=True,
                text=True
            )
            data = json.loads(result.stdout)
            return data.get("secrets", [])
        except Exception as e:
            print(f"❌ Error listing secrets: {e}")
            return []
    
    def get_secret_info(self) -> Dict:
        """Get information about secrets (not values - GitHub hides them)"""
        secrets = self.list_secrets()
        info = {}
        
        for secret in secrets:
            info[secret["name"]] = {
                "created_at": secret.get("created_at"),
                "updated_at": secret.get("updated_at"),
                "visibility": secret.get("visibility", "private")
            }
        
        return info
    
    def print_secrets_table(self):
        """Print secrets information in a table format"""
        secrets = self.list_secrets()
        
        if not secrets:
            print("❌ No secrets found or unable to retrieve them")
            return
        
        print("\n📋 GitHub Repository Secrets")
        print("=" * 80)
        print(f"Repository: {self.repo}")
        print(f"Total Secrets: {len(secrets)}\n")
        
        # Table header
        print(f"{'Secret Name':<35} {'Created':<20} {'Updated':<20}")
        print("-" * 80)
        
        # Table rows
        for secret in secrets:
            name = secret["name"]
            created = secret["created_at"][:10] if secret.get("created_at") else "N/A"
            updated = secret["updated_at"][:10] if secret.get("updated_at") else "N/A"
            print(f"{name:<35} {created:<20} {updated:<20}")
        
        print("\n⚠️  GitHub hides secret VALUES for security.")
        print("   To view values, visit: https://github.com/{}/settings/secrets/actions".format(self.repo))
        print("\n✅ Secrets are copied from GitHub → Streamlit Cloud manually")
        print("   Run: ./setup.sh  (interactive guide)")


class StreamlitSecretsManager:
    """Helper class for Streamlit Cloud secret management"""
    
    def __init__(self, workspace: str = "geek2geeks"):
        self.workspace = workspace
        self.app_name = "ai-actuary"
    
    def generate_secrets_template(self) -> str:
        """Generate the TOML template for Streamlit secrets"""
        template = """[supabase]
url = "https://naecdtkxxlawxlkljtkt.supabase.co"
key = "PASTE_SUPABASE_ANON_KEY_HERE"
service_key = "PASTE_SUPABASE_SERVICE_ROLE_KEY_HERE"

[deepseek]
api_key = "PASTE_DEEPSEEK_API_KEY_HERE"

[app]
url = "https://ai-actuary.streamlit.app"
"""
        return template
    
    def print_deployment_guide(self):
        """Print step-by-step deployment guide"""
        print("\n🚀 Streamlit Cloud Deployment Guide")
        print("=" * 80)
        print("\n1️⃣  GET SECRETS FROM GITHUB")
        print("   URL: https://github.com/geek2geeks/prophet-ai-bootcamp/settings/secrets/actions")
        print("   Required secrets:")
        print("      • SUPABASE_ANON_KEY")
        print("      • SUPABASE_SERVICE_ROLE_KEY")
        print("      • DEEPSEEK_API_KEY")
        
        print("\n2️⃣  ADD SECRETS TO STREAMLIT CLOUD")
        print("   URL: https://share.streamlit.io/apps")
        print("   Steps:")
        print("      1. Click 'ai-actuary' app")
        print("      2. Click menu (⋮) → Settings")
        print("      3. Click 'Secrets'")
        print("      4. Paste this template:")
        print()
        for line in self.generate_secrets_template().split("\n"):
            print(f"      {line}")
        
        print("\n3️⃣  CONFIGURE SUPABASE OAUTH")
        print("   URL: Supabase Dashboard → Authentication → Providers → Google")
        print("   Add redirect URLs:")
        redirect_urls = [
            "https://ai-actuary.streamlit.app",
            "https://ai-actuary.streamlit.app/1_Dashboard",
            "https://ai-actuary.streamlit.app/2_Programa",
            "https://ai-actuary.streamlit.app/3_Exercicios",
            "https://ai-actuary.streamlit.app/5_Recursos",
            "https://ai-actuary.streamlit.app/6_AI_Tutor",
            "http://localhost:8501",
            "http://localhost:8501/?auth_state=*"
        ]
        for url in redirect_urls:
            print(f"      • {url}")
        
        print("\n✅ VERIFY DEPLOYMENT")
        print("   1. Visit: https://ai-actuary.streamlit.app")
        print("   2. Click 'Continuar com Google'")
        print("   3. Complete Google login")
        print("   4. Check all pages load")


def main():
    token = os.getenv("GITHUB_TOKEN")
    
    if not token:
        print("❌ Error: GITHUB_TOKEN environment variable not set")
        print("\nUsage:")
        print("  export GITHUB_TOKEN='ghp_...'")
        print("  python3 extract_secrets.py")
        sys.exit(1)
    
    # Initialize managers
    gh_manager = GitHubSecretsManager(token)
    st_manager = StreamlitSecretsManager()
    
    print("\n" + "=" * 80)
    print("AI Founder Bootcamp - Secrets & Deployment Manager")
    print("=" * 80)
    
    # List GitHub secrets
    print("\n1️⃣  GitHub Actions Secrets Status")
    print("-" * 80)
    gh_manager.print_secrets_table()
    
    # Show Streamlit deployment guide
    print("\n2️⃣  Streamlit Cloud Setup")
    print("-" * 80)
    st_manager.print_deployment_guide()
    
    # Generate secrets file for reference
    print("\n3️⃣  For Local Development")
    print("-" * 80)
    print("\nCreate ~/.streamlit/secrets.toml with:")
    print("-" * 40)
    print(st_manager.generate_secrets_template())
    print("-" * 40)
    
    print("\n✅ Programmatic extraction complete!")
    print("\n📝 Next steps:")
    print("   1. Run: ./setup.sh  (for interactive guide)")
    print("   2. Or follow the deployment guide above")
    print()


if __name__ == "__main__":
    main()
