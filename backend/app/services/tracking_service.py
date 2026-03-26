from ..agents.tracker_agent import tracker_agent

class TrackingService:
    @staticmethod
    def log_activity(user_id: int, activity_data: dict):
        # Log activity to DB
        return {"status": "logged", "activity": activity_data}

    @staticmethod
    def get_progress(user_id: int, completed_modules: list):
        return tracker_agent.track_progress(user_id, completed_modules)
