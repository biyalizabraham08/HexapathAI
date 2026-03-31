import json
import urllib.request
import urllib.error
import logging
from ..config import settings

logger = logging.getLogger(__name__)

class OpenRouterClient:
    def __init__(self):
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        # Confirmed free models available on this OpenRouter account (verified via tests)
        self.models = [
            "google/gemma-3-27b-it:free",       # High reliability & best quality
            "qwen/qwen3.6-plus-preview:free",    # Highly reliable
            "liquid/lfm-2.5-1.2b-instruct:free", # Fast fallback
            "meta-llama/llama-3.3-70b-instruct:free",  # Rate-limited but good when available
            "qwen/qwen3-coder:free",             # Rate-limited coder model
        ]
        self.model = self.models[0]

    def generate(self, prompt, system_instruction=None, history=None):
        """
        Generic method to generate text using OpenRouter Mistral 7B.
        """
        api_key = settings.OPENROUTER_API_KEY
        if not api_key or "your_openrouter_key" in api_key:
            logger.warning("🚨 OpenRouter API Key missing! Returning fallback mock response.")
            return self._get_fallback_response(prompt)

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        
        if history:
            for h in history:
                messages.append({"role": h["role"], "content": h["content"]})
        
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 1000
        }

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://hexapath.ai", # Site URL for OpenRouter
            "X-Title": "HexaPath SkillGap AI"
        }

        # Try each free model in sequence until one succeeds
        for model_id in self.models:
            payload["model"] = model_id
            try:
                req = urllib.request.Request(
                    self.api_url,
                    data=json.dumps(payload).encode('utf-8'),
                    headers=headers
                )
                with urllib.request.urlopen(req, timeout=30) as resp:
                    result = json.loads(resp.read().decode())
                    text = result['choices'][0]['message']['content'].strip()
                    logger.info(f"✅ OpenRouter response from {model_id}")
                    return text
            except urllib.error.HTTPError as e:
                logger.warning(f"⚠️ Model {model_id} failed ({e.code}): {e.reason}")
                continue
            except Exception as e:
                logger.warning(f"⚠️ Model {model_id} error: {str(e)[:80]}")
                continue

        logger.error("❌ All OpenRouter models failed. Using fallback.")
        return self._get_fallback_response(prompt)

    def generate_career_path(self, goal):
        """
        Specific requirement: generateCareerPath(prompt)
        Returns structured JSON roadmap.
        """
        prompt = f"""
        Goal: {goal}
        
        Act as a professional career roadmap generator. 
        Create a detailed, high-impact career path to achieve the goal: "{goal}".
        
        Return ONLY valid JSON including:
        - skills_required: (list of 5 key skills)
        - timeline: (e.g. "6 Months")
        - recommended_courses: (list of 3 platforms/topics)
        - summary: (2-sentence strategic summary)
        
        No extra text, no markdown backticks.
        """
        
        raw_response = self.generate(prompt)
        
        try:
            # Clean possible markdown formatting
            clean_json = raw_response.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json[7:-3].strip()
            elif clean_json.startswith("```"):
                clean_json = clean_json[3:-3].strip()
            
            return json.loads(clean_json)
        except Exception:
            # High-quality Mock Fallback as requested
            return {
                "skills_required": ["Foundational Theory", "Practical implementation", "Architecture Design", "Security Protocols", "Optimization"],
                "timeline": "6 - 8 Months",
                "recommended_courses": ["Coursera Professional Certificate", "Udemy Hands-on Bootcamp", "Official Vendor Documentation"],
                "summary": f"A strategic journey to becoming a expert in your field. This roadmap focuses on core mastery followed by specialized technical implementation."
            }

    def _get_fallback_response(self, prompt):
        """Generic fallback for missing API key or failure."""
        if "JSON" in prompt or "schema" in prompt:
            # Return a generic valid JSON if JSON was expected
            return json.dumps({
                "status": "fallback",
                "message": "AI is momentarily unavailable. Reverting to smart template."
            })
        return "I'm currently in high-speed fallback mode. To enable my advanced AI insights, please ensure your OpenRouter API key is correctly configured!"

ai_client = OpenRouterClient()
