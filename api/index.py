import sys
import os

# Add the root project directory to the Python path
# so that Vercel can resolve 'backend.app' as a proper module package
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from backend.app.main import app
