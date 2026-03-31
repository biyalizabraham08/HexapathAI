import json
import logging
from typing import List, Dict
from ..utils.ai_provider import ai_client

logger = logging.getLogger(__name__)

class AdaptiveAgent:
    def generate_next_question(self, domain: str, role: str, skill: str, history: List[Dict]) -> Dict:
        """
        Dynamically generates the next assessment question using OpenRouter Mistral 7B.
        Falls back to a static question if the API is unavailable.
        """
        skill_history = [h for h in history if h.get('skill') == skill]

        history_text = "No previous questions for this skill. Start at 'Medium' difficulty."
        if skill_history:
            history_text = "User Performance History for this skill:\n"
            for i, h in enumerate(skill_history):
                result = "Correct" if h.get("is_correct") else "Incorrect"
                time_taken = h.get("time_taken_seconds", "Unknown")
                diff = h.get("difficulty", "Medium")
                history_text += f"- Q{i+1} ({diff} difficulty): {result} in {time_taken} seconds.\n"

            history_text += "\nInstructions for Difficulty Calibration:\n"
            history_text += "- If consistently Correct quickly, INCREASE difficulty.\n"
            history_text += "- If Incorrect or slow, DECREASE difficulty.\n"
            history_text += "- Available: Beginner, Intermediate, Advanced, Expert, Master.\n"

        prompt = f"""You are an elite technical interviewer for a {role} in the {domain} industry.
Skill being tested: {skill}
{history_text}

Generate EXACTLY ONE multiple-choice question. Output ONLY raw valid JSON with no markdown:
{{"question": "Question text", "options": ["A", "B", "C", "D"], "correct_answer": 0, "explanation": "Why correct", "difficulty": "Intermediate", "skill": "{skill}", "reference_query": "search query"}}
correct_answer MUST be an integer 0-3."""

        system = "You are a strict technical assessor. Output only valid JSON. No extra text."
        print(f"🚀 [OPENROUTER] Generating adaptive question for {skill}...")

        raw = ai_client.generate(prompt, system_instruction=system)

        try:
            clean = raw.strip()
            if clean.startswith("```json"):
                clean = clean[7:-3].strip()
            elif clean.startswith("```"):
                clean = clean[3:-3].strip()

            q_data = json.loads(clean)
            # Normalize correct_answer to int
            if isinstance(q_data.get('correct_answer'), str):
                if q_data['correct_answer'].isdigit():
                    q_data['correct_answer'] = int(q_data['correct_answer'])
                elif q_data['correct_answer'] in q_data.get('options', []):
                    q_data['correct_answer'] = q_data['options'].index(q_data['correct_answer'])
                else:
                    q_data['correct_answer'] = 0
            return q_data
        except Exception as e:
            logger.warning(f"⚠️ Adaptive Agent JSON parse failed: {str(e)[:100]}")

        # Fallback static question
        return {
            "question": f"[FALLBACK] What is a core concept of {skill}?",
            "options": ["Syntax", "Variables", "Functions", "All of the above"],
            "correct_answer": 3,
            "explanation": "Fallback question — AI generation unavailable.",
            "difficulty": "Beginner",
            "skill": skill,
            "reference_query": f"{skill} core concepts tutorial"
        }

    def calculate_current_proficiency(self, skill: str, history: List[Dict]) -> str:
        """Calculate proficiency based on difficulty of correctly answered questions."""
        skill_history = [h for h in history if h.get('skill') == skill]
        if not skill_history:
            return "Untested"

        correct_difficulties = [h.get("difficulty", "Beginner") for h in skill_history if h.get("is_correct")]

        if "Master" in correct_difficulties:
            return "Expert"
        if "Expert" in correct_difficulties:
            return "Expert"
        if "Advanced" in correct_difficulties:
            return "Advanced"
        if "Intermediate" in correct_difficulties:
            return "Intermediate"
        if "Beginner" in correct_difficulties:
            return "Beginner"
        return "Needs Improvement"

adaptive_agent = AdaptiveAgent()
