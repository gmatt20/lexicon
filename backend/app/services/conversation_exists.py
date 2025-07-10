from db import SessionDep
from models import Conversation

from sqlmodel import select

def conversation_exists(conversation_id: int, user_id: int, session: SessionDep) -> bool:
  conversationExists = session.exec(select(Conversation).where(Conversation.id == conversation_id, Conversation.user_id == user_id)).first()
  if not conversationExists:
    return False
  return True