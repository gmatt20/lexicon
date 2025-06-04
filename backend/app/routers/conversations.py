from fastapi import APIRouter, Query, HTTPException
from db.engine import SessionDep
from models.models import Conversation, User
from sqlmodel import select
from typing import Annotated
from pydantic import BaseModel
from services.userExists import user_exists

router = APIRouter()

class ConversationData(BaseModel):
  user_id: int
  title: str | None = "New Chat"

@router.post("/conversation/")
def new_conversation(conversation: ConversationData, session: SessionDep) -> Conversation:
  if not user_exists(session.get(User, conversation.user_id), session):
    raise HTTPException(status_code=404, detail="User not found")
  
  conversation = Conversation(user_id=conversation.user_id, title=conversation.title)
  session.add(conversation)
  session.commit()
  session.refresh(conversation)
  return conversation

@router.get("/conversations/")
def get_conversations(session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100, ) -> list[Conversation]:
  conversations = session.exec(select(Conversation).offset(offset).limit(limit)).all()
  return conversations