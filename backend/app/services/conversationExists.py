from fastapi import HTTPException
from db.engine import SessionDep
from models.models import Conversation

def conversation_exists(conversation_id: int, session: SessionDep) -> bool:
  conversationExists = session.get(Conversation, conversation_id)
  if not conversationExists:
    return False
  return True