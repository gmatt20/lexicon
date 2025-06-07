from fastapi import APIRouter, Query, HTTPException
from db.engine import SessionDep
from models.models import User
from sqlmodel import select
from typing import Annotated
from services.get_current_user import get_current_user

# TURD: Complete the CRUD
# TODO:
# - Update user
# - Get specific user

router = APIRouter()

# @router.post("/users/")
# def create_user(user: User, session: SessionDep) -> User:
#   session.add(user)
#   session.commit()
#   session.refresh(user)
#   return user

@router.get("/users/")
def read_users(session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100, ) -> list[User]:
  
  users = session.exec(select(User).offset(offset).limit(limit)).all()
  return users

# @router.delete("/users/{user_id}")
# def delete_user(user_id: int, session: SessionDep):
#   user = session.get(User, user_id)
#   if not user:
#     raise HTTPException(status_code=404, detail="User not found")
#   session.delete(user)
#   session.commit()
#   return{"ok": True}