from app.models.models import User
from app.db.engine import SessionDep
from sqlmodel import select
from fastapi import HTTPException

def query_user(supabase_user_id: str, session: SessionDep) -> User:
    user = session.exec(select(User).where(User.supabase_user_id == supabase_user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user