from datetime import datetime
from sqlalchemy.orm import Session
from ..models.progress import ProgressRecord, AssessmentRecord, CourseProgress


class TrackerAgent:
    """Tracks user progress by persisting analysis and assessment results to the database."""

    def save_analysis(self, db: Session, user_id: int, analysis_data: dict, learning_path: list):
        """Save a skill-gap analysis snapshot to the database."""
        analysis = analysis_data.get("analysis", analysis_data)
        record = ProgressRecord(
            user_id=user_id,
            desired_role=analysis.get("resolved_role", ""),
            industry=analysis.get("industry_context", ""),
            experience_level=analysis.get("experience_level", ""),
            career_fit_pct=analysis.get("career_fit_pct", 0),
            total_hard_gaps=analysis.get("total_hard_gaps", 0),
            total_soft_gaps=analysis.get("total_soft_gaps", 0),
            hard_gaps=analysis.get("hard_gaps", []),
            soft_gaps=analysis.get("soft_gaps", []),
            hard_matches=analysis.get("hard_matches", []),
            soft_matches=analysis.get("soft_matches", []),
            learning_path=learning_path,
            created_at=datetime.utcnow(),
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record.id

    def save_assessment(self, db: Session, user_id: int, result: dict):
        """Save an assessment result to the database."""
        record = AssessmentRecord(
            user_id=user_id,
            score=result.get("score", 0),
            passed=1 if result.get("passed") else 0,
            total_questions=result.get("total_questions", 0),
            correct_count=result.get("correct_count", 0),
            per_skill=result.get("per_skill", {}),
            feedback=result.get("feedback", ""),
            created_at=datetime.utcnow(),
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return record.id

    def save_course_progress(self, db: Session, user_id: int, course_data: dict):
        """Save or update course completion progress."""
        course_id = course_data.get("course_id")
        record = db.query(CourseProgress).filter(
            CourseProgress.user_id == user_id, 
            CourseProgress.course_id == course_id
        ).first()

        if not record:
            record = CourseProgress(
                user_id=user_id,
                course_id=course_id,
                course_name=course_data.get("course_name"),
                platform=course_data.get("platform", "Internal"),
                total_modules=course_data.get("total_modules", 5)
            )
            db.add(record)
            
        record.completed_modules = min(record.total_modules, course_data.get("completed_modules", record.completed_modules + 1))
        record.completion_pct = round((record.completed_modules / record.total_modules) * 100)
        
        if record.completion_pct >= 100:
            record.status = "Completed"
        elif record.completion_pct > 0:
            record.status = "In Progress"
            
        record.last_accessed = datetime.utcnow()
        db.commit()
        db.refresh(record)
        return record.id

    def get_progress_history(self, db: Session, user_id: int, limit: int = 10):
        """Return the user's analysis history sorted by most recent."""
        records = (
            db.query(ProgressRecord)
            .filter(ProgressRecord.user_id == user_id)
            .order_by(ProgressRecord.created_at.desc())
            .limit(limit)
            .all()
        )
        return [
            {
                "id": r.id,
                "desired_role": r.desired_role,
                "industry": r.industry,
                "experience_level": r.experience_level,
                "career_fit_pct": r.career_fit_pct,
                "total_hard_gaps": r.total_hard_gaps,
                "total_soft_gaps": r.total_soft_gaps,
                "hard_gaps": r.hard_gaps or [],
                "soft_gaps": r.soft_gaps or [],
                "hard_matches": r.hard_matches or [],
                "soft_matches": r.soft_matches or [],
                "learning_path": r.learning_path or [],
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in records
        ]

    def get_assessment_history(self, db: Session, user_id: int, limit: int = 10):
        """Return the user's assessment history."""
        records = (
            db.query(AssessmentRecord)
            .filter(AssessmentRecord.user_id == user_id)
            .order_by(AssessmentRecord.created_at.desc())
            .limit(limit)
            .all()
        )
        return [
            {
                "id": r.id,
                "score": r.score,
                "passed": bool(r.passed),
                "total_questions": r.total_questions,
                "correct_count": r.correct_count,
                "per_skill": r.per_skill or {},
                "feedback": r.feedback,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in records
        ]

    def get_course_history(self, db: Session, user_id: int):
        """Return the user's enrolled and completed courses."""
        records = (
            db.query(CourseProgress)
            .filter(CourseProgress.user_id == user_id)
            .order_by(CourseProgress.last_accessed.desc())
            .all()
        )
        return [
            {
                "id": r.id,
                "course_id": r.course_id,
                "course_name": r.course_name,
                "platform": r.platform,
                "total_modules": r.total_modules,
                "completed_modules": r.completed_modules,
                "completion_pct": r.completion_pct,
                "status": r.status,
                "last_accessed": r.last_accessed.isoformat() if r.last_accessed else None,
            }
            for r in records
        ]

    def generate_performance_insights(self, assessments: list):
        """Analyze assessment history to generate AI-driven insights."""
        if len(assessments) < 1:
            return ["No assessment data yet. Start your first assessment to see insights!"]

        insights = []
        latest = assessments[0]
        
        # Trend analysis
        if len(assessments) >= 2:
            previous = assessments[1]
            diff = latest["score"] - previous["score"]
            if diff > 5:
                insights.append(f"📈 Your overall performance is improving! Score increased by {diff}% since your last attempt.")
            elif diff < -5:
                insights.append(f"📉 Your score dropped by {abs(diff)}%. We recommend revisiting the core concepts.")
            else:
                insights.append("⚖️ Your performance is steady. Consistency is key to mastery!")

        # Skill-specific analysis
        per_skill_latest = latest.get("per_skill", {})
        strengths = [s for s, d in per_skill_latest.items() if d["score"] >= 80]
        weaknesses = [s for s, d in per_skill_latest.items() if d["score"] < 50]

        if strengths:
            insights.append(f"🌟 You're demonstrating mastery in: {', '.join(strengths)}.")
        if weaknesses:
            insights.append(f"🔍 Focus area identified: You need significant practice in {', '.join(weaknesses)}.")

        return insights

    def get_recommendations(self, latest_analysis: dict, latest_assessment: dict):
        """Generate actionable recommendations based on the latest performance and skill gaps."""
        recs = []
        
        if not latest_assessment:
            recs.append("Take your first assessment to identify your current proficiency levels.")
            return recs

        per_skill = latest_assessment.get("per_skill", {})
        weak_skills = [s for s, d in per_skill.items() if d["score"] < 60]
        
        if weak_skills:
            for skill in weak_skills[0:2]: # Limit to 2 targeted recs
                recs.append(f"Focus on {skill}: Your score is low. Re-watch introductory modules in your learning path.")
        
        if latest_assessment["score"] >= 90:
            recs.append("Excellent performance! Consider exploring more advanced roles or certifications.")
        elif latest_assessment["score"] < 60:
            recs.append("Strengthen your foundations. Spend more time on the 'Working Knowledge' sections of your path.")

        return recs

    def get_dashboard_summary(self, db: Session, user_id: int):
        """Aggregate summary for the learner dashboard with AI insights and Unified Tracker Status."""
        analyses = self.get_progress_history(db, user_id, limit=50)
        assessments = self.get_assessment_history(db, user_id, limit=50)
        courses = self.get_course_history(db, user_id)

        latest_analysis = analyses[0] if analyses else None
        latest_assessment = assessments[0] if assessments else None

        # Generate AI working insights
        insights = self.generate_performance_insights(assessments)
        recommendations = self.get_recommendations(latest_analysis, latest_assessment)

        # Career fit trend and Assessment score trend
        fit_trend = [{"date": a["created_at"], "fit": a["career_fit_pct"]} for a in reversed(analyses)]
        score_trend = [{"date": a["created_at"], "score": a["score"]} for a in reversed(assessments)]

        # --- Unified Tracker Status Calculation ---
        # Logic: Combine Course % and Assessment Score
        unified_status = "Not Started"
        avg_course_pct = sum(c["completion_pct"] for c in courses) / len(courses) if courses else 0
        latest_score = latest_assessment["score"] if latest_assessment else 0

        if avg_course_pct == 100 and latest_score >= 75:
            unified_status = "Course Completed \U0001F389"
        elif avg_course_pct >= 80 and latest_score >= 50:
            unified_status = "Almost Completed"
        elif avg_course_pct > 0 or latest_score > 0:
            unified_status = "In Progress"

        return {
            "total_analyses": len(analyses),
            "total_assessments": len(assessments),
            "total_courses": len(courses),
            "latest_career_fit": latest_analysis["career_fit_pct"] if latest_analysis else None,
            "latest_assessment_score": latest_score if latest_assessment else None,
            "unified_tracker_status": unified_status,
            "courses": courses,
            "fit_trend": fit_trend,
            "score_trend": score_trend,
            "latest_analysis": latest_analysis,
            "latest_assessment": latest_assessment,
            "ai_insights": insights,
            "ai_recommendations": recommendations
        }


tracker_agent = TrackerAgent()
