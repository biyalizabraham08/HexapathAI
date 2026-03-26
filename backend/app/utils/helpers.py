def format_response(data: dict, status: str = "success") -> dict:
    return {"status": status, "data": data}
