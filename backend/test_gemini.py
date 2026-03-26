import sys
import os
import traceback
sys.path.insert(0, '.')
from app.config import settings
from app.agents.assessment_agent import assessment_agent

print(f"CWD: {os.getcwd()}")
print(f"GEMINI_API_KEY from settings: {settings.GEMINI_API_KEY[:10]}..." if settings.GEMINI_API_KEY else "GEMINI_API_KEY is None")

try:
    print("Testing get_questions with ['Python']")
    # Force direct call to see if config is working
    res = assessment_agent.get_questions(['Python'])
    if res and len(res) > 0 and 'How would you rate' in res[0]['question']:
        print("\n[!] Still getting Fallback questions.")
    else:
        print(f"\n[+] Success! Got {len(res)} questions.")
        print(f"Sample: {res[0]['question'] if res else 'None'}")
except Exception as e:
    print(f"\nOuter Error Caught: {e}")
    traceback.print_exc()

