from fastapi import APIRouter, Query, HTTPException
from db.engine import SessionDep
from models.models import Message
from sqlmodel import select
from typing import Annotated
from services.userExists import user_exists
from services.conversationExists import conversation_exists

# TURD: Complete the CRUD
# TODO:
# - Update message
# - Delete a single message

router = APIRouter()

# Posts a message
@router.post("/message/")
def post_message(message: Message, session: SessionDep) -> Message:
  session.add(message)
  session.commit()
  session.refresh(message)
  return message

# Gets every single message
@router.get("/messages/")
def get_all_messages(session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100, ) -> list[Message]:
  messages = session.exec(select(Message).offset(offset).limit(limit)).all()
  return messages

# Gets messages from a particular user and conversation
@router.get("/messages/{user_id}/{conversation_id}")
def get_convo_messages(user_id: int, conversation_id: int, session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100, ) -> list[Message]:
  if not user_exists(user_id, session):
    raise HTTPException(status_code=404, detail="User not found")

  if not conversation_exists(conversation_id, session):
    raise HTTPException(status_code=404, detail="Conversation not found")
  
  messages = session.exec(select(Message).where(Message.user_id == user_id, Message.conversation_id == conversation_id).offset(offset).limit(limit).order_by(Message.id)).all()
  
  return messages

# Mass deletes messages based on user id
@router.delete("/messages/{user_id}")
def clear_conversation(user_id: int, session: SessionDep):
  if not user_exists(user_id, session):
    raise HTTPException(status_code=404, detail="User not found")
  
  messages = session.exec(select(Message).where(Message.user_id == user_id)).all()
  for message in messages:
    session.delete(message)
  session.commit()
  return{"ok": True}