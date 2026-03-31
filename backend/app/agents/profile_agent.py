"""
Profile Agent — Comprehensive role-based skill-gap analysis engine.
Maps 15+ roles to required hard & soft skills with proficiency levels,
performs case-insensitive matching, and calculates career fit scores.
"""


# ──────────────────────────────────────────────
# Role → Required Skills Knowledge Base
# Each skill has a required proficiency (1-10)
# ──────────────────────────────────────────────
ROLE_SKILLS_DB = {
    # ── Engineering ──────────────────────────
    "frontend developer": {
        "hard_skills": {
            "HTML": 8, "CSS": 8, "JavaScript": 9, "React": 8, "TypeScript": 7,
            "Responsive Design": 7, "Git": 7, "REST APIs": 6, "Webpack": 5, "Testing": 6
        },
        "soft_skills": {
            "Communication": 7, "Attention to Detail": 8, "Teamwork": 7,
            "Time Management": 6, "Problem Solving": 7
        }
    },
    "backend developer": {
        "hard_skills": {
            "Python": 8, "SQL": 8, "REST APIs": 8, "Database Design": 7,
            "Git": 7, "Docker": 6, "System Design": 6, "Linux": 6, "Testing": 7, "Security": 6
        },
        "soft_skills": {
            "Problem Solving": 8, "Communication": 6, "Analytical Thinking": 7,
            "Teamwork": 6, "Time Management": 6
        }
    },
    "fullstack developer": {
        "hard_skills": {
            "JavaScript": 8, "React": 7, "Python": 7, "Node.js": 7, "SQL": 7,
            "REST APIs": 8, "HTML": 7, "CSS": 7, "Git": 7, "Docker": 5,
            "TypeScript": 6, "System Design": 5, "Testing": 6
        },
        "soft_skills": {
            "Communication": 7, "Problem Solving": 8, "Teamwork": 7,
            "Time Management": 7, "Adaptability": 7
        }
    },
    "devops engineer": {
        "hard_skills": {
            "Linux": 8, "Docker": 9, "Kubernetes": 8, "CI/CD": 8, "AWS": 7,
            "Terraform": 7, "Python": 6, "Bash Scripting": 7, "Monitoring": 7, "Networking": 6
        },
        "soft_skills": {
            "Problem Solving": 8, "Communication": 6, "Attention to Detail": 8,
            "Teamwork": 7, "Adaptability": 7
        }
    },
    "mobile developer": {
        "hard_skills": {
            "React Native": 8, "JavaScript": 8, "TypeScript": 7, "Swift": 6,
            "Kotlin": 6, "REST APIs": 7, "Git": 7, "UI/UX Design": 6, "Testing": 6, "Firebase": 5
        },
        "soft_skills": {
            "Creativity": 7, "Attention to Detail": 8, "Problem Solving": 7,
            "Communication": 6, "User Empathy": 7
        }
    },
    "software engineer": {
        "hard_skills": {
            "Python": 8, "Data Structures": 8, "Algorithms": 8, "System Design": 7,
            "SQL": 7, "Git": 7, "REST APIs": 7, "Testing": 7, "OOP": 7, "Docker": 5
        },
        "soft_skills": {
            "Problem Solving": 9, "Communication": 7, "Teamwork": 7,
            "Analytical Thinking": 8, "Time Management": 6
        }
    },

    # ── Data Science ─────────────────────────
    "data scientist": {
        "hard_skills": {
            "Python": 9, "Machine Learning": 8, "Statistics": 8, "SQL": 7,
            "Pandas": 8, "NumPy": 7, "Scikit-learn": 7, "Data Visualization": 7,
            "Deep Learning": 6, "Feature Engineering": 7
        },
        "soft_skills": {
            "Analytical Thinking": 9, "Communication": 7, "Problem Solving": 8,
            "Curiosity": 7, "Storytelling": 6
        }
    },
    "data analyst": {
        "hard_skills": {
            "SQL": 9, "Excel": 8, "Python": 7, "Data Visualization": 8,
            "Tableau": 7, "Statistics": 7, "Power BI": 6, "Pandas": 6,
            "ETL": 5, "A/B Testing": 5
        },
        "soft_skills": {
            "Analytical Thinking": 8, "Communication": 8, "Attention to Detail": 8,
            "Storytelling": 7, "Problem Solving": 7
        }
    },
    "data engineer": {
        "hard_skills": {
            "Python": 8, "SQL": 9, "Apache Spark": 7, "ETL": 8, "AWS": 7,
            "Airflow": 7, "Docker": 6, "Data Modeling": 7, "Kafka": 6, "Hadoop": 5
        },
        "soft_skills": {
            "Problem Solving": 8, "Analytical Thinking": 7, "Communication": 6,
            "Teamwork": 6, "Attention to Detail": 7
        }
    },
    "ml engineer": {
        "hard_skills": {
            "Python": 9, "Machine Learning": 9, "Deep Learning": 8, "TensorFlow": 7,
            "PyTorch": 7, "MLOps": 7, "Docker": 6, "SQL": 6, "Feature Engineering": 7,
            "Model Deployment": 7
        },
        "soft_skills": {
            "Problem Solving": 9, "Analytical Thinking": 8, "Communication": 6,
            "Research Skills": 7, "Adaptability": 7
        }
    },
    "ai engineer": {
        "hard_skills": {
            "Python": 9, "Deep Learning": 8, "NLP": 7, "Computer Vision": 7,
            "TensorFlow": 7, "PyTorch": 7, "LLMs": 7, "Machine Learning": 8,
            "Cloud Computing": 6, "REST APIs": 6
        },
        "soft_skills": {
            "Problem Solving": 9, "Research Skills": 8, "Communication": 6,
            "Creativity": 7, "Analytical Thinking": 8
        }
    },

    # ── Product ──────────────────────────────
    "product manager": {
        "hard_skills": {
            "Product Strategy": 9, "Data Analysis": 7, "User Research": 8,
            "Roadmapping": 8, "A/B Testing": 6, "SQL": 5, "Wireframing": 6,
            "Agile/Scrum": 7, "Market Analysis": 7, "Technical Writing": 6
        },
        "soft_skills": {
            "Leadership": 9, "Communication": 9, "Strategic Thinking": 8,
            "Stakeholder Management": 8, "Empathy": 7
        }
    },
    "business analyst": {
        "hard_skills": {
            "Data Analysis": 8, "SQL": 7, "Excel": 8, "Requirements Gathering": 8,
            "Process Modeling": 7, "Tableau": 6, "Agile/Scrum": 6,
            "Technical Writing": 7, "Wireframing": 5, "JIRA": 6
        },
        "soft_skills": {
            "Communication": 9, "Analytical Thinking": 8, "Problem Solving": 7,
            "Stakeholder Management": 7, "Attention to Detail": 7
        }
    },

    # ── Design ───────────────────────────────
    "ui/ux designer": {
        "hard_skills": {
            "Figma": 9, "User Research": 8, "Wireframing": 8, "Prototyping": 8,
            "Design Systems": 7, "HTML": 5, "CSS": 5, "Usability Testing": 7,
            "Interaction Design": 7, "Typography": 6
        },
        "soft_skills": {
            "Creativity": 9, "Empathy": 8, "Communication": 7,
            "Attention to Detail": 8, "Collaboration": 7
        }
    },
    "graphic designer": {
        "hard_skills": {
            "Adobe Photoshop": 9, "Adobe Illustrator": 8, "Typography": 8,
            "Color Theory": 7, "Branding": 7, "Layout Design": 7,
            "Figma": 6, "Motion Graphics": 5, "Print Design": 5, "Photography": 4
        },
        "soft_skills": {
            "Creativity": 9, "Attention to Detail": 8, "Communication": 7,
            "Time Management": 7, "Adaptability": 6
        }
    },

    # ── Cybersecurity ──────────────────────────
    "cybersecurity analyst": {
        "hard_skills": {
            "Network Security": 8, "Linux": 8, "SIEM Tools": 7, "Penetration Testing": 7,
            "Firewalls": 7, "Python": 6, "Encryption": 7, "Incident Response": 7,
            "Vulnerability Assessment": 8, "Compliance": 6
        },
        "soft_skills": {
            "Analytical Thinking": 9, "Attention to Detail": 9, "Problem Solving": 8,
            "Communication": 6, "Ethical Judgment": 8
        }
    },

    # ── Cloud ────────────────────────────────
    "cloud architect": {
        "hard_skills": {
            "AWS": 9, "Azure": 7, "Kubernetes": 7, "Terraform": 8,
            "Networking": 7, "Security": 7, "Docker": 7, "CI/CD": 6,
            "System Design": 8, "Cost Optimization": 6
        },
        "soft_skills": {
            "Strategic Thinking": 8, "Communication": 7, "Problem Solving": 8,
            "Leadership": 6, "Teamwork": 7
        }
    },
}

# Aliases map common variations to canonical role names
ROLE_ALIASES = {
    "front end developer": "frontend developer",
    "front-end developer": "frontend developer",
    "react developer": "frontend developer",
    "back end developer": "backend developer",
    "back-end developer": "backend developer",
    "full stack developer": "fullstack developer",
    "full-stack developer": "fullstack developer",
    "mern developer": "fullstack developer",
    "mean developer": "fullstack developer",
    "sde": "software engineer",
    "swe": "software engineer",
    "developer": "software engineer",
    "programmer": "software engineer",
    "machine learning engineer": "ml engineer",
    "deep learning engineer": "ml engineer",
    "artificial intelligence engineer": "ai engineer",
    "pm": "product manager",
    "ux designer": "ui/ux designer",
    "ui designer": "ui/ux designer",
    "product designer": "ui/ux designer",
    "security analyst": "cybersecurity analyst",
    "infosec analyst": "cybersecurity analyst",
    "cloud engineer": "cloud architect",
    "aws engineer": "cloud architect",
    "ios developer": "mobile developer",
    "android developer": "mobile developer",
    "flutter developer": "mobile developer",
}


from typing import Optional

def _normalize(text: str) -> str:
    return text.strip().lower()


def _find_role(desired_role: str) -> Optional[dict]:
    """Look up a role in the knowledge base (with alias support)."""
    key = _normalize(desired_role)
    if key in ROLE_SKILLS_DB:
        return ROLE_SKILLS_DB[key]
    if key in ROLE_ALIASES:
        return ROLE_SKILLS_DB[ROLE_ALIASES[key]]
    # Fuzzy partial match — pick the best match
    for role_key in ROLE_SKILLS_DB:
        if role_key in key or key in role_key:
            return ROLE_SKILLS_DB[role_key]
    return None


class ProfileAgent:
    def __init__(self):
        pass

    def analyze_profile(
        self,
        current_skills: list,
        desired_role: str,
        industry: str = "Technology",
        experience_level: str = "Intermediate",
    ) -> dict:
        """
        Analyzes a user's skills against a desired role to find hard & soft gaps,
        calculates proficiency gap scores, and evaluates career fit percentage.
        """
        role_data = _find_role(desired_role)

        if role_data is None:
            # Fallback: use Software Engineer as a reasonable default
            role_data = ROLE_SKILLS_DB["software engineer"]
            resolved_role = "software engineer"
        else:
            resolved_role = _normalize(desired_role)
            if resolved_role in ROLE_ALIASES:
                resolved_role = ROLE_ALIASES[resolved_role]

        # Normalize user skills for case-insensitive matching
        user_skills_lower = {_normalize(s) for s in current_skills}

        # ── Experience multiplier (adjusts required proficiency) ──
        exp_multiplier = {"beginner": 0.7, "intermediate": 1.0, "advanced": 1.2}
        multiplier = exp_multiplier.get(_normalize(experience_level), 1.0)

        # ── Analyze Hard Skill Gaps ──
        hard_gaps = []
        hard_matches = []
        total_hard_required = 0
        total_hard_met = 0

        for skill, base_proficiency in role_data["hard_skills"].items():
            required = min(10, round(base_proficiency * multiplier))
            total_hard_required += required
            skill_lower = _normalize(skill)

            if skill_lower in user_skills_lower:
                # User has the skill — estimate current level based on experience
                estimated_current = {"beginner": 4, "intermediate": 6, "advanced": 8}.get(
                    _normalize(experience_level), 5
                )
                gap = max(0, required - estimated_current)
                total_hard_met += min(required, estimated_current)

                if gap > 0:
                    hard_gaps.append({
                        "skill": skill,
                        "current_level": estimated_current,
                        "required_level": required,
                        "gap": gap,
                        "severity": "High" if gap >= 3 else "Medium" if gap >= 2 else "Low",
                    })
                else:
                    hard_matches.append(skill)
            else:
                # User doesn't have the skill at all
                hard_gaps.append({
                    "skill": skill,
                    "current_level": 0,
                    "required_level": required,
                    "gap": required,
                    "severity": "Critical" if required >= 7 else "High",
                })

        # ── Analyze Soft Skill Gaps ──
        soft_gaps = []
        soft_matches = []
        total_soft_required = 0
        total_soft_met = 0

        for skill, base_proficiency in role_data["soft_skills"].items():
            required = min(10, round(base_proficiency * multiplier))
            total_soft_required += required
            skill_lower = _normalize(skill)

            if skill_lower in user_skills_lower:
                estimated_current = {"beginner": 4, "intermediate": 6, "advanced": 7}.get(
                    _normalize(experience_level), 5
                )
                gap = max(0, required - estimated_current)
                total_soft_met += min(required, estimated_current)

                if gap > 0:
                    soft_gaps.append({
                        "skill": skill,
                        "current_level": estimated_current,
                        "required_level": required,
                        "gap": gap,
                        "severity": "Medium" if gap >= 2 else "Low",
                    })
                else:
                    soft_matches.append(skill)
            else:
                soft_gaps.append({
                    "skill": skill,
                    "current_level": 0,
                    "required_level": required,
                    "gap": required,
                    "severity": "High" if required >= 7 else "Medium",
                })

        # ── Career Fit Calculation ──
        total_required = total_hard_required + total_soft_required
        total_met = total_hard_met + total_soft_met
        career_fit_pct = round((total_met / total_required) * 100) if total_required > 0 else 0

        if career_fit_pct >= 80:
            career_fit = "Strong Fit"
        elif career_fit_pct >= 60:
            career_fit = "Good Fit — Some Gaps"
        elif career_fit_pct >= 40:
            career_fit = "Partial Fit — Significant Gaps"
        else:
            career_fit = "Needs Development"

        # Sort gaps by severity
        severity_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
        hard_gaps.sort(key=lambda g: severity_order.get(g["severity"], 4))
        soft_gaps.sort(key=lambda g: severity_order.get(g["severity"], 4))

        return {
            "resolved_role": resolved_role.title(),
            "hard_gaps": hard_gaps,
            "soft_gaps": soft_gaps,
            "hard_matches": hard_matches,
            "soft_matches": soft_matches,
            "career_fit": career_fit,
            "career_fit_pct": career_fit_pct,
            "industry_context": industry,
            "experience_level": experience_level,
            "total_hard_gaps": len(hard_gaps),
            "total_soft_gaps": len(soft_gaps),
            "total_skills_matched": len(hard_matches) + len(soft_matches),
        }


profile_agent = ProfileAgent()
