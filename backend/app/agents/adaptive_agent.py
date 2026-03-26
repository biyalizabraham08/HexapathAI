import os
import json
import urllib.request
import urllib.error
import logging
from typing import List, Dict
from ..config import settings

logger = logging.getLogger(__name__)

class AdaptiveAgent:
    def __init__(self):
        self.model_candidates = [
            "gemini-2.0-flash",
            "gemini-pro-latest",
            "gemini-flash-latest",
        ]
        
    def generate_next_question(self, domain: str, role: str, skill: str, history: List[Dict]) -> Dict:
        """
        Dynamically generates the *next* assessment question for a specific skill based on the user's history.
        Uses raw urllib HTTP requests to bypass SDK limitations.
        """
        # Filter history for just this skill
        skill_history = [h for h in history if h.get('skill') == skill]
        
        history_text = "No previous questions for this skill. Start at 'Medium' difficulty."
        if skill_history:
            history_text = "User Performance History for this skill:\n"
            for i, h in enumerate(skill_history):
                result = "Correct" if h.get("is_correct") else "Incorrect"
                time_taken = h.get("time_taken_seconds", "Unknown")
                diff = h.get("difficulty", "Medium")
                history_text += f"- Q{i+1} ({diff} difficulty): {result} in {time_taken} seconds.\n"
                
            history_text += "\nInstructions for Difficulty Calbration:\n"
            history_text += "- If they consistently get questions Correct quickly, INCREASE difficulty.\n"
            history_text += "- If they get questions Incorrect or take too long, DECREASE difficulty.\n"
            history_text += "- Available difficulties: Beginner, Intermediate, Advanced, Expert, Master.\n"

        prompt = f"""
        You are an elite technical interviewer and strict assessor for a {role} in the {domain} industry.
        You are conducting a generative adaptive assessment (IRT model).
        
        The current skill being evaluated is: {skill}.
        
        {history_text}
        
        Generate EXACTLY ONE multiple-choice question testing the '{skill}' skill. 
        Determine the appropriate difficulty based on their history. If they have no history, default to Intermediate.
        Ensure the question is highly relevant to their role as a {role}.
        
        You must output ONLY raw, valid JSON with no markdown blocks or backticks.
        Your response must perfectly match this schema:
        {{
            "question": "The question text, code snippet, or scenario.",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 0,
            "explanation": "Why this is correct.",
            "difficulty": "Intermediate",
            "skill": "{skill}",
            "reference_query": "Specific 3-5 word technical search query"
        }}
        Note: correct_answer MUST be an integer from 0 to 3 representing the correct index in the options array.
        """
        
        api_key = settings.GEMINI_API_KEY
        if api_key:
            api_key = api_key.strip()
            payload_bytes = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode('utf-8')
            
            for model_id in self.model_candidates:
                url = f"https://generativelanguage.googleapis.com/v1/models/{model_id}:generateContent?key={api_key}"
                try:
                    req = urllib.request.Request(url, data=payload_bytes, headers={'Content-Type': 'application/json'})
                    with urllib.request.urlopen(req, timeout=30) as resp:
                        body = json.loads(resp.read().decode())
                        txt = body['candidates'][0]['content']['parts'][0]['text'].strip()
                        if txt.startswith("```json"):
                            txt = txt[7:-3].strip()
                        elif txt.startswith("```"):
                            txt = txt[3:-3].strip()
                            
                        q_data = json.loads(txt)
                        # Ensure correct_answer is an integer
                        if isinstance(q_data.get('correct_answer'), str) and q_data['correct_answer'].isdigit():
                            q_data['correct_answer'] = int(q_data['correct_answer'])
                        elif isinstance(q_data.get('correct_answer'), str): # They returned "Option B", map to 1
                            if q_data['correct_answer'] in q_data['options']:
                                q_data['correct_answer'] = q_data['options'].index(q_data['correct_answer'])
                            else:
                                q_data['correct_answer'] = 0
                                
                        return q_data
                except Exception as e:
                    logger.warning(f"⚠️ Adaptive model {model_id} failed: {str(e)[:150]}")
                    continue
                    
        # Fallback if API fails completely
        return {
             "question": f"[FALLBACK MODE] What is a core concept of {skill}?",
             "options": ["Syntax", "Variables", "Functions", "All of the above"],
             "correct_answer": 3,
             "explanation": "Fallback question provided because AI generation failed.",
             "difficulty": "Beginner",
             "skill": skill,
             "reference_query": f"{skill} core concepts tutorial"
        }
            
    def calculate_current_proficiency(self, skill: str, history: List[Dict]) -> str:
        """
        Calculate current proficiency level based on the difficulty of questions they got correct.
        """
        skill_history = [h for h in history if h.get('skill') == skill]
        if not skill_history:
            return "Untested"
            
        correct_difficulties = [h.get("difficulty", "Beginner") for h in skill_history if h.get("is_correct")]
        
        if "Master" in correct_difficulties:
            return "Expert" # Map UI to Expert
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
