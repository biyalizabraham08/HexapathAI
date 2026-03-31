import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.utils.ai_provider import ai_client

print("✅ OpenRouter API key found. Testing ai_provider fallback loop...")

response = ai_client.generate(prompt="Say: OPENROUTER FALLBACK LOOP IS WORKING in capital letters.")

print(f"\n✅ AI Provider Response:\n{response}")

