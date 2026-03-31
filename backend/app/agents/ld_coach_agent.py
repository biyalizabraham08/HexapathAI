import logging
from ..utils.ai_provider import ai_client

logger = logging.getLogger(__name__)

class LDCoachAgent:
    def get_chat_response(self, history, user_context):
        """
        Generates a conversational L&D coaching response using OpenRouter Mistral 7B.
        history: list of messages [{"role": "user"|"assistant", "content": "..."}]
        user_context: dict containing skill gaps, assessment scores, etc.
        """
        gaps_summary = ", ".join([g.get('skill', '') for g in user_context.get('hard_gaps', [])[:3]])
        last_score = user_context.get('latest_assessment_score') or user_context.get('last_assessment_score', 'N/A')

        system_instruction = f"""You are the HEXAPATH AI L&D Coach — a professional, warm, and highly knowledgeable career mentor.
Your role is to guide the user through their career development journey.

USER CONTEXT:
- Primary Skill Gaps: {gaps_summary if gaps_summary else "Not yet identified"}
- Last Assessment Score: {last_score}%
- Industry: {user_context.get('industry', 'Technology')}

INSTRUCTIONS:
1. Be conversational, empathetic, and specific. Reference the user's context in your advice.
2. Keep responses to 2-4 sentences for a natural chat flow.
3. Occasionally suggest a "Micro-Challenge" or a quick-win exercise.
4. If asked about a specific skill, give actionable, real-world advice.
5. Always be encouraging and forward-looking."""

        print(f"🚀 [OPENROUTER] L&D Coaching session for gaps: {gaps_summary}...")

        # Gemini used 'model' role but OpenRouter/Mistral use 'assistant'
        clean_history = []
        for msg in history:
            role = "user" if msg["role"] == "user" else "assistant"
            if msg.get("content", "").strip():
                clean_history.append({"role": role, "content": msg["content"]})

        # Must start with user
        if clean_history and clean_history[0]["role"] != "user":
            clean_history = clean_history[1:]

        if not clean_history:
            clean_history = [{"role": "user", "content": "Hello, I need career guidance."}]

        # The last item in history is already the user's message
        # We pass it via the history parameter to generate()
        # Extract the final user message
        last_user_msg = clean_history[-1]["content"]
        prior_history = clean_history[:-1]

        return ai_client.generate(
            prompt=last_user_msg,
            system_instruction=system_instruction,
            history=prior_history
        )

ld_coach_agent = LDCoachAgent()
