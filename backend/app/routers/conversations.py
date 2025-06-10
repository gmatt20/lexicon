from fastapi import APIRouter, Query, HTTPException, Depends
from db.engine import SessionDep
from models.models import Conversation, User
from sqlmodel import select
from typing import Annotated
from pydantic import BaseModel
from services.userExists import user_exists
from services.jwt_bearer import verify_token

# TURD: Complete the CRUD
# TODO:
# - Update conversation
# - Protected get specific conversation
# - Protected delete specific conversations including its messages

router = APIRouter()

class ConversationData(BaseModel):
  title: str | None = "New Chat"

@router.post("/conversation/")
def new_conversation(conversation: ConversationData, session: SessionDep, user_data=Depends(verify_token)):
  user_id = user_data["sub"]

  user = session.exec(select(User).where(User.supabase_user_id == user_id)).first()
  if not user:

    raise HTTPException(status_code=404, detail="User not found")
  
  conversation = Conversation(user_id=user.id, title=conversation.title)
  session.add(conversation)
  session.commit()
  session.refresh(conversation)

@router.get("/conversations/")
def get_conversations(session: SessionDep, user_data=Depends(verify_token)):
  user_id = user_data["sub"]
  user = session.exec(select(User).where(User.supabase_user_id == user_id)).first()
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  

  conversations = session.exec(select(Conversation).where(Conversation.user_id == user.id)).all()
  
  return conversations