"""
Recommender Agent — Real course/resource recommendation engine.
Maps skill gaps to actual courses, books, podcasts, and projects
from real platforms with estimated durations and difficulty levels.
"""

COURSE_DATABASE = {
    # ── Programming Languages ────────────────
    "python": [
        {"title": "Python for Everybody Specialization", "platform": "Coursera", "type": "Course", "duration": "8 weeks", "difficulty": "Beginner", "url": "https://coursera.org/specializations/python"},
        {"title": "Automate the Boring Stuff with Python", "platform": "Book", "type": "Book", "duration": "3 weeks", "difficulty": "Beginner", "url": "https://automatetheboringstuff.com/"},
        {"title": "Python Data Structures & Algorithms", "platform": "Udemy", "type": "Course", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
    ],
    "javascript": [
        {"title": "The Complete JavaScript Course", "platform": "Udemy", "type": "Course", "duration": "6 weeks", "difficulty": "Beginner", "url": "https://udemy.com"},
        {"title": "JavaScript: The Good Parts", "platform": "Book", "type": "Book", "duration": "2 weeks", "difficulty": "Intermediate", "url": "https://oreilly.com"},
        {"title": "JavaScript30 — 30 Day Challenge", "platform": "Free", "type": "Project", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://javascript30.com/"},
    ],
    "typescript": [
        {"title": "Understanding TypeScript", "platform": "Udemy", "type": "Course", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
        {"title": "TypeScript Handbook", "platform": "Official Docs", "type": "Documentation", "duration": "1 week", "difficulty": "Intermediate", "url": "https://typescriptlang.org/docs/handbook"},
    ],

    # ── Frontend ─────────────────────────────
    "react": [
        {"title": "React — The Complete Guide", "platform": "Udemy", "type": "Course", "duration": "6 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
        {"title": "Full Stack Open (React Section)", "platform": "University of Helsinki", "type": "Course", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://fullstackopen.com/"},
        {"title": "Build a Real-World React App", "platform": "Project", "type": "Project", "duration": "3 weeks", "difficulty": "Intermediate", "url": "#"},
    ],
    "html": [
        {"title": "HTML & CSS: Design and Build Websites", "platform": "Book", "type": "Book", "duration": "2 weeks", "difficulty": "Beginner", "url": "#"},
        {"title": "freeCodeCamp Responsive Web Design", "platform": "freeCodeCamp", "type": "Course", "duration": "3 weeks", "difficulty": "Beginner", "url": "https://freecodecamp.org"},
    ],
    "css": [
        {"title": "Advanced CSS and Sass", "platform": "Udemy", "type": "Course", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
        {"title": "CSS for JavaScript Developers", "platform": "Josh Comeau", "type": "Course", "duration": "5 weeks", "difficulty": "Intermediate", "url": "https://css-for-js.dev/"},
    ],
    "responsive design": [
        {"title": "Responsive Web Design Principles", "platform": "freeCodeCamp", "type": "Course", "duration": "2 weeks", "difficulty": "Beginner", "url": "https://freecodecamp.org"},
    ],

    # ── Backend & Infrastructure ─────────────
    "sql": [
        {"title": "The Complete SQL Bootcamp", "platform": "Udemy", "type": "Course", "duration": "4 weeks", "difficulty": "Beginner", "url": "https://udemy.com"},
        {"title": "SQL Murder Mystery", "platform": "Free", "type": "Project", "duration": "1 day", "difficulty": "Beginner", "url": "https://mystery.knightlab.com/"},
        {"title": "Mode SQL Tutorial", "platform": "Mode Analytics", "type": "Course", "duration": "2 weeks", "difficulty": "Intermediate", "url": "https://mode.com/sql-tutorial"},
    ],
    "rest apis": [
        {"title": "RESTful Web Services with Python & Flask", "platform": "Udemy", "type": "Course", "duration": "3 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
        {"title": "Build a REST API from Scratch", "platform": "Project", "type": "Project", "duration": "2 weeks", "difficulty": "Intermediate", "url": "#"},
    ],
    "docker": [
        {"title": "Docker Mastery", "platform": "Udemy", "type": "Course", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
        {"title": "Docker Deep Dive", "platform": "Book", "type": "Book", "duration": "2 weeks", "difficulty": "Intermediate", "url": "#"},
    ],
    "kubernetes": [
        {"title": "Kubernetes for the Absolute Beginners", "platform": "KodeKloud", "type": "Course", "duration": "3 weeks", "difficulty": "Intermediate", "url": "https://kodekloud.com"},
        {"title": "CKA Certification Prep", "platform": "Udemy", "type": "Course", "duration": "6 weeks", "difficulty": "Advanced", "url": "https://udemy.com"},
    ],
    "git": [
        {"title": "Git & GitHub Crash Course", "platform": "YouTube", "type": "Course", "duration": "1 week", "difficulty": "Beginner", "url": "https://youtube.com"},
        {"title": "Pro Git Book", "platform": "Book", "type": "Book", "duration": "2 weeks", "difficulty": "Intermediate", "url": "https://git-scm.com/book"},
    ],
    "system design": [
        {"title": "System Design Interview by Alex Xu", "platform": "Book", "type": "Book", "duration": "4 weeks", "difficulty": "Advanced", "url": "#"},
        {"title": "Grokking System Design", "platform": "Educative", "type": "Course", "duration": "6 weeks", "difficulty": "Advanced", "url": "https://educative.io"},
    ],
    "linux": [
        {"title": "Linux Command Line Basics", "platform": "Udemy", "type": "Course", "duration": "2 weeks", "difficulty": "Beginner", "url": "https://udemy.com"},
        {"title": "The Linux Command Line (Book)", "platform": "Book", "type": "Book", "duration": "3 weeks", "difficulty": "Intermediate", "url": "#"},
    ],
    "ci/cd": [
        {"title": "GitHub Actions — The Complete Guide", "platform": "Udemy", "type": "Course", "duration": "3 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
    ],
    "aws": [
        {"title": "AWS Cloud Practitioner Essentials", "platform": "AWS", "type": "Course", "duration": "2 weeks", "difficulty": "Beginner", "url": "https://aws.amazon.com/training"},
        {"title": "AWS Solutions Architect Associate", "platform": "Udemy", "type": "Course", "duration": "6 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
    ],
    "terraform": [
        {"title": "HashiCorp Terraform Associate Prep", "platform": "Udemy", "type": "Course", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
    ],
    "node.js": [
        {"title": "The Complete Node.js Developer Course", "platform": "Udemy", "type": "Course", "duration": "5 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
    ],
    "database design": [
        {"title": "Database Design for Mere Mortals", "platform": "Book", "type": "Book", "duration": "3 weeks", "difficulty": "Intermediate", "url": "#"},
    ],
    "testing": [
        {"title": "Test-Driven Development with Python", "platform": "Book", "type": "Book", "duration": "4 weeks", "difficulty": "Intermediate", "url": "#"},
    ],
    "security": [
        {"title": "Web Security Fundamentals", "platform": "EdX", "type": "Course", "duration": "3 weeks", "difficulty": "Intermediate", "url": "https://edx.org"},
    ],

    # ── Data Science & ML ────────────────────
    "machine learning": [
        {"title": "Machine Learning Specialization (Andrew Ng)", "platform": "Coursera", "type": "Course", "duration": "10 weeks", "difficulty": "Intermediate", "url": "https://coursera.org/specializations/machine-learning-introduction"},
        {"title": "Hands-On Machine Learning (Aurélien Géron)", "platform": "Book", "type": "Book", "duration": "8 weeks", "difficulty": "Intermediate", "url": "#"},
        {"title": "Kaggle Micro-Courses", "platform": "Kaggle", "type": "Course", "duration": "2 weeks", "difficulty": "Beginner", "url": "https://kaggle.com/learn"},
    ],
    "deep learning": [
        {"title": "Deep Learning Specialization (Andrew Ng)", "platform": "Coursera", "type": "Course", "duration": "12 weeks", "difficulty": "Advanced", "url": "https://coursera.org/specializations/deep-learning"},
        {"title": "Fast.ai Practical Deep Learning", "platform": "Fast.ai", "type": "Course", "duration": "7 weeks", "difficulty": "Intermediate", "url": "https://fast.ai"},
    ],
    "statistics": [
        {"title": "Statistics with Python Specialization", "platform": "Coursera", "type": "Course", "duration": "6 weeks", "difficulty": "Intermediate", "url": "https://coursera.org"},
        {"title": "Think Stats", "platform": "Book", "type": "Book", "duration": "3 weeks", "difficulty": "Intermediate", "url": "https://greenteapress.com/thinkstats/"},
    ],
    "pandas": [
        {"title": "Data Analysis with Pandas and Python", "platform": "Udemy", "type": "Course", "duration": "3 weeks", "difficulty": "Beginner", "url": "https://udemy.com"},
    ],
    "numpy": [
        {"title": "NumPy for Data Science", "platform": "YouTube", "type": "Course", "duration": "1 week", "difficulty": "Beginner", "url": "https://youtube.com"},
    ],
    "scikit-learn": [
        {"title": "Scikit-learn Official Tutorial", "platform": "Documentation", "type": "Documentation", "duration": "2 weeks", "difficulty": "Intermediate", "url": "https://scikit-learn.org/stable/tutorial"},
    ],
    "data visualization": [
        {"title": "Data Visualization with Python", "platform": "Coursera", "type": "Course", "duration": "3 weeks", "difficulty": "Intermediate", "url": "https://coursera.org"},
        {"title": "Storytelling with Data (Book)", "platform": "Book", "type": "Book", "duration": "2 weeks", "difficulty": "All Levels", "url": "#"},
    ],
    "feature engineering": [
        {"title": "Feature Engineering for Machine Learning", "platform": "Coursera", "type": "Course", "duration": "3 weeks", "difficulty": "Intermediate", "url": "https://coursera.org"},
    ],
    "tensorflow": [
        {"title": "TensorFlow Developer Certificate Prep", "platform": "Coursera", "type": "Course", "duration": "8 weeks", "difficulty": "Intermediate", "url": "https://coursera.org"},
    ],
    "pytorch": [
        {"title": "PyTorch for Deep Learning", "platform": "Udemy", "type": "Course", "duration": "5 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
    ],
    "nlp": [
        {"title": "NLP Specialization", "platform": "Coursera", "type": "Course", "duration": "8 weeks", "difficulty": "Advanced", "url": "https://coursera.org"},
        {"title": "Hugging Face NLP Course", "platform": "Hugging Face", "type": "Course", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://huggingface.co/course"},
    ],
    "computer vision": [
        {"title": "CS231n — CNNs for Visual Recognition", "platform": "Stanford (Free)", "type": "Course", "duration": "10 weeks", "difficulty": "Advanced", "url": "http://cs231n.stanford.edu/"},
    ],
    "llms": [
        {"title": "ChatGPT Prompt Engineering for Developers", "platform": "DeepLearning.AI", "type": "Course", "duration": "1 week", "difficulty": "Intermediate", "url": "https://deeplearning.ai"},
        {"title": "LangChain for LLM Application Development", "platform": "DeepLearning.AI", "type": "Course", "duration": "2 weeks", "difficulty": "Intermediate", "url": "https://deeplearning.ai"},
    ],
    "mlops": [
        {"title": "Machine Learning Engineering for Production", "platform": "Coursera", "type": "Course", "duration": "8 weeks", "difficulty": "Advanced", "url": "https://coursera.org"},
    ],
    "model deployment": [
        {"title": "Deploy ML Models with Flask & Docker", "platform": "YouTube", "type": "Project", "duration": "2 weeks", "difficulty": "Intermediate", "url": "https://youtube.com"},
    ],
    "tableau": [
        {"title": "Tableau A-Z: Hands-On Training", "platform": "Udemy", "type": "Course", "duration": "4 weeks", "difficulty": "Beginner", "url": "https://udemy.com"},
    ],
    "power bi": [
        {"title": "Microsoft Power BI Desktop", "platform": "Udemy", "type": "Course", "duration": "3 weeks", "difficulty": "Beginner", "url": "https://udemy.com"},
    ],
    "excel": [
        {"title": "Excel Skills for Business Specialization", "platform": "Coursera", "type": "Course", "duration": "6 weeks", "difficulty": "Beginner", "url": "https://coursera.org"},
    ],
    "etl": [
        {"title": "ETL and Data Pipelines with Shell, Airflow and Kafka", "platform": "Coursera", "type": "Course", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://coursera.org"},
    ],
    "apache spark": [
        {"title": "Apache Spark with Python", "platform": "Udemy", "type": "Course", "duration": "5 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
    ],
    "airflow": [
        {"title": "Apache Airflow: The Hands-On Guide", "platform": "Udemy", "type": "Course", "duration": "3 weeks", "difficulty": "Intermediate", "url": "https://udemy.com"},
    ],
    "a/b testing": [
        {"title": "A/B Testing by Google", "platform": "Udacity", "type": "Course", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://udacity.com"},
    ],

    # ── Product & Design ─────────────────────
    "figma": [
        {"title": "Figma UI/UX Design Essentials", "platform": "Udemy", "type": "Course", "duration": "4 weeks", "difficulty": "Beginner", "url": "https://udemy.com"},
    ],
    "user research": [
        {"title": "UX Research and Design Specialization", "platform": "Coursera", "type": "Course", "duration": "6 weeks", "difficulty": "Intermediate", "url": "https://coursera.org"},
    ],
    "wireframing": [
        {"title": "Wireframing and Prototyping", "platform": "Coursera", "type": "Course", "duration": "2 weeks", "difficulty": "Beginner", "url": "https://coursera.org"},
    ],
    "prototyping": [
        {"title": "Rapid Prototyping with Figma", "platform": "YouTube", "type": "Course", "duration": "1 week", "difficulty": "Beginner", "url": "https://youtube.com"},
    ],
    "product strategy": [
        {"title": "Product Management by University of Virginia", "platform": "Coursera", "type": "Course", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://coursera.org"},
        {"title": "Inspired: How to Create Products Customers Love", "platform": "Book", "type": "Book", "duration": "2 weeks", "difficulty": "Intermediate", "url": "#"},
    ],
    "roadmapping": [
        {"title": "Product Roadmaps Relaunched", "platform": "Book", "type": "Book", "duration": "2 weeks", "difficulty": "Intermediate", "url": "#"},
    ],
    "agile/scrum": [
        {"title": "Agile with Atlassian Jira", "platform": "Coursera", "type": "Course", "duration": "2 weeks", "difficulty": "Beginner", "url": "https://coursera.org"},
    ],
    "data analysis": [
        {"title": "Google Data Analytics Professional Certificate", "platform": "Coursera", "type": "Course", "duration": "8 weeks", "difficulty": "Beginner", "url": "https://coursera.org"},
    ],

    # ── Soft Skills ──────────────────────────
    "communication": [
        {"title": "Improving Communication Skills", "platform": "Coursera", "type": "Course", "duration": "3 weeks", "difficulty": "All Levels", "url": "https://coursera.org"},
        {"title": "Crucial Conversations", "platform": "Book", "type": "Book", "duration": "2 weeks", "difficulty": "All Levels", "url": "#"},
        {"title": "The Art of Communication (Podcast)", "platform": "Podcast", "type": "Podcast", "duration": "Ongoing", "difficulty": "All Levels", "url": "#"},
    ],
    "leadership": [
        {"title": "Foundations of Leadership", "platform": "Coursera", "type": "Course", "duration": "4 weeks", "difficulty": "All Levels", "url": "https://coursera.org"},
        {"title": "Leaders Eat Last by Simon Sinek", "platform": "Book", "type": "Book", "duration": "2 weeks", "difficulty": "All Levels", "url": "#"},
    ],
    "problem solving": [
        {"title": "Creative Problem Solving", "platform": "Coursera", "type": "Course", "duration": "3 weeks", "difficulty": "All Levels", "url": "https://coursera.org"},
    ],
    "teamwork": [
        {"title": "Teamwork Skills: Communicating Effectively", "platform": "Coursera", "type": "Course", "duration": "2 weeks", "difficulty": "All Levels", "url": "https://coursera.org"},
    ],
    "analytical thinking": [
        {"title": "Critical Thinking & Problem Solving", "platform": "EdX", "type": "Course", "duration": "3 weeks", "difficulty": "All Levels", "url": "https://edx.org"},
    ],
    "time management": [
        {"title": "Work Smarter, Not Harder", "platform": "Coursera", "type": "Course", "duration": "2 weeks", "difficulty": "All Levels", "url": "https://coursera.org"},
    ],
    "creativity": [
        {"title": "Creative Thinking: Techniques and Tools", "platform": "Coursera", "type": "Course", "duration": "3 weeks", "difficulty": "All Levels", "url": "https://coursera.org"},
    ],
    "attention to detail": [
        {"title": "Attention Management (Podcast)", "platform": "Podcast", "type": "Podcast", "duration": "Ongoing", "difficulty": "All Levels", "url": "#"},
    ],
    "adaptability": [
        {"title": "Adaptability and Resiliency", "platform": "Coursera", "type": "Course", "duration": "2 weeks", "difficulty": "All Levels", "url": "https://coursera.org"},
    ],
    "empathy": [
        {"title": "Empathy and Emotional Intelligence at Work", "platform": "EdX", "type": "Course", "duration": "2 weeks", "difficulty": "All Levels", "url": "https://edx.org"},
    ],
    "strategic thinking": [
        {"title": "Strategic Thinking and Planning", "platform": "Coursera", "type": "Course", "duration": "3 weeks", "difficulty": "Intermediate", "url": "https://coursera.org"},
    ],
    "stakeholder management": [
        {"title": "Stakeholder Management (Book)", "platform": "Book", "type": "Book", "duration": "2 weeks", "difficulty": "Intermediate", "url": "#"},
    ],
    "storytelling": [
        {"title": "Business Storytelling", "platform": "Coursera", "type": "Course", "duration": "2 weeks", "difficulty": "All Levels", "url": "https://coursera.org"},
    ],
    "curiosity": [
        {"title": "Learning How to Learn", "platform": "Coursera", "type": "Course", "duration": "4 weeks", "difficulty": "All Levels", "url": "https://coursera.org"},
    ],
    "research skills": [
        {"title": "Research Methods", "platform": "Coursera", "type": "Course", "duration": "4 weeks", "difficulty": "Intermediate", "url": "https://coursera.org"},
    ],
    "collaboration": [
        {"title": "Collaborative Working in a Remote Team", "platform": "Coursera", "type": "Course", "duration": "2 weeks", "difficulty": "All Levels", "url": "https://coursera.org"},
    ],
    "user empathy": [
        {"title": "Design Thinking for Innovation", "platform": "Coursera", "type": "Course", "duration": "3 weeks", "difficulty": "All Levels", "url": "https://coursera.org"},
    ],
    "ethical judgment": [
        {"title": "Ethics in Technology", "platform": "EdX", "type": "Course", "duration": "3 weeks", "difficulty": "Intermediate", "url": "https://edx.org"},
    ],
}


def _normalize(text: str) -> str:
    return text.strip().lower()


class RecommenderAgent:
    def __init__(self):
        pass

    def generate_learning_path(
        self, hard_gaps: list, soft_gaps: list, experience_level: str = "Intermediate"
    ) -> list:
        """
        Generates a personalized learning plan with real courses, books, and
        projects matched to each skill gap, prioritized by severity.
        """
        path = []
        priority = 1

        # Process hard gaps first (usually more critical)
        for gap_info in hard_gaps:
            skill = gap_info["skill"] if isinstance(gap_info, dict) else gap_info
            severity = gap_info.get("severity", "Medium") if isinstance(gap_info, dict) else "Medium"
            gap_val = gap_info.get("gap", 5) if isinstance(gap_info, dict) else 5
            skill_key = _normalize(skill)

            resources = COURSE_DATABASE.get(skill_key, [])
            if not resources:
                # Generate a sensible fallback
                resources = [
                    {
                        "title": f"Learn {skill} — Comprehensive Guide",
                        "platform": "Udemy",
                        "type": "Course",
                        "duration": "4 weeks",
                        "difficulty": "Intermediate",
                        "url": "https://udemy.com",
                    }
                ]

            # Filter by difficulty preference based on experience
            exp_lower = _normalize(experience_level)
            if exp_lower == "beginner":
                preferred = [r for r in resources if r["difficulty"] in ("Beginner", "All Levels")]
                resources = preferred if preferred else resources[:2]
            elif exp_lower == "advanced":
                preferred = [r for r in resources if r["difficulty"] in ("Advanced", "Intermediate")]
                resources = preferred if preferred else resources[:2]
            else:
                resources = resources[:2]

            for resource in resources:
                path.append({
                    "priority": priority,
                    "topic": skill,
                    "type": "Hard Skill",
                    "severity": severity,
                    "gap_score": gap_val,
                    "recommendation": resource["title"],
                    "platform": resource["platform"],
                    "resource_type": resource["type"],
                    "duration": resource["duration"],
                    "difficulty": resource["difficulty"],
                    "url": resource.get("url", "#"),
                })
            priority += 1

        # Process soft gaps
        for gap_info in soft_gaps:
            skill = gap_info["skill"] if isinstance(gap_info, dict) else gap_info
            severity = gap_info.get("severity", "Medium") if isinstance(gap_info, dict) else "Medium"
            gap_val = gap_info.get("gap", 3) if isinstance(gap_info, dict) else 3
            skill_key = _normalize(skill)

            resources = COURSE_DATABASE.get(skill_key, [])
            if not resources:
                resources = [
                    {
                        "title": f"{skill} in the Modern Workplace",
                        "platform": "Coursera",
                        "type": "Course",
                        "duration": "3 weeks",
                        "difficulty": "All Levels",
                        "url": "https://coursera.org",
                    }
                ]

            for resource in resources[:2]:
                path.append({
                    "priority": priority,
                    "topic": skill,
                    "type": "Soft Skill",
                    "severity": severity,
                    "gap_score": gap_val,
                    "recommendation": resource["title"],
                    "platform": resource["platform"],
                    "resource_type": resource["type"],
                    "duration": resource["duration"],
                    "difficulty": resource["difficulty"],
                    "url": resource.get("url", "#"),
                })
            priority += 1

        return path


recommender_agent = RecommenderAgent()
