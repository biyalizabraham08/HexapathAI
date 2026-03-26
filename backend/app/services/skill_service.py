class SkillService:
    @staticmethod
    def get_all_skills(db):
        # Fetch skills from DB placeholder
        return [{"id": 1, "name": "Python"}, {"id": 2, "name": "React"}]

    @staticmethod
    def add_skill(db, skill_data: dict):
        # Add skill to DB placeholder
        return {"id": 3, "name": skill_data.get("name")}
