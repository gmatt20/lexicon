from fastapi import APIRouter, Query, HTTPException
from db.engine import SessionDep
from models.models import Message, User
from models.models import Conversation
from sqlmodel import select
from typing import Annotated

router = APIRouter()

@router.post("/message/")
def post_message(message: Message, session: SessionDep) -> Message:
  session.add(message)
  session.commit()
  session.refresh(message)
  return message

@router.get("/messages/")
def get_all_messages(session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100, ) -> list[Message]:
  messages = session.exec(select(Message).offset(offset).limit(limit)).all()
  return messages

@router.get("/messages/{user_id}/{conversation_id}")
def get_convo_messages(user_id: int, conversation_id: int, session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100, ) -> list[Message]:
  user = session.get(User, user_id)
  if not user:
        raise HTTPException(status_code=404, detail="User not found")
  conversationExists = session.get(Conversation, conversation_id)
  if not conversationExists:
    raise HTTPException(status_code=404, detail="Conversation not found")

  messages = session.exec(select(Message).where(Message.user_id == user_id, Message.conversation_id == conversation_id).offset(offset).limit(limit).order_by(Message.id)).all()
  return messages

@router.delete("/messages/{user_id}")
def clear_conversation(user_id: int, session: SessionDep):
  user = session.get(User, user_id)
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  messages = session.exec(select(Message).where(Message.user_id == user_id)).all()
  for message in messages:
    session.delete(message)
  session.commit()
  return{"ok": True}