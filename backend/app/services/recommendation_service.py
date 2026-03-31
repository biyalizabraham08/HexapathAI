from ..agents.profile_agent import profile_agent
from ..agents.recommender_agent import recommender_agent


class RecommendationService:
    @staticmethod
    def analyze_skill_gap(
        current_skills: list,
        desired_role: str,
        industry: str,
        experience_level: str = "Intermediate",
    ):
        # 1. Profile Agent — identify gaps with proficiency scoring
        profile_analysis = profile_agent.analyze_profile(
            current_skills, desired_role, industry, experience_level
        )

        # 2. Recommender Agent — build personalized plan from real resources
        learning_path = recommender_agent.generate_learning_path(
            hard_gaps=profile_analysis["hard_gaps"],
            soft_gaps=profile_analysis["soft_gaps"],
            experience_level=experience_level,
        )

        # 3. Summary statistics
        total_gaps = profile_analysis["total_hard_gaps"] + profile_analysis["total_soft_gaps"]
        critical_gaps = sum(
            1 for g in profile_analysis["hard_gaps"] if g.get("severity") == "Critical"
        )

        # 3. Summary statistics
        total_gaps = profile_analysis["total_hard_gaps"] + profile_analysis["total_soft_gaps"]
        critical_gaps = sum(
            1 for g in profile_analysis["hard_gaps"] if g.get("severity") == "Critical"
        )

        return {
            "analysis": profile_analysis,
            "learning_path": learning_path["path"], # Just return the list here for compatibility
            "ai_insight": learning_path.get("ai_insight"),
            "powered_by": learning_path.get("powered_by"),
            "summary": {
                "total_gaps": total_gaps,
                "critical_gaps": critical_gaps,
                "total_resources": len(learning_path["path"]),
                "career_fit_pct": profile_analysis["career_fit_pct"],
            },
        }
