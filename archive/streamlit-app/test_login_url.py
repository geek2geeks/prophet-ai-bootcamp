import os
import streamlit as st
from lib.auth import get_google_login_url, _decode_oauth_context

url = get_google_login_url()
print("Google Login URL:", url)
