from app.db import SessionDep
from app.models import User

from fastapi import HTTPException
from sqlmodel import select


def query_user(supabase_user_id: str, session: SessionDep) -> User:
    user = session.exec(
        select(User).where(User.supabase_user_id == supabase_user_id)
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
