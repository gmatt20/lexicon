from fastapi import APIRouter, Query, HTTPException, Depends
from db.engine import SessionDep, supabase
from models.models import Message, User
from sqlmodel import select
from typing import Annotated
from services.userExists import user_exists
from services.conversationExists import conversation_exists
from services.get_current_user import get_current_user
from services.jwt_bearer import verify_token
from pydantic import BaseModel
from starlette import status

class MessageCreate(BaseModel):
    conversation_id: int
    role: str
    content: str

UserDep = Annotated[dict, Depends(get_current_user)]

# TURD: Complete the CRUD
# TODO:
# - Update message
# - Delete a single message

router = APIRouter(
   prefix="/messages",
   tags=["Messages"]
)

# Posts a new message to a conversation for a user
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=Message)
def post_message(message_data: MessageCreate, session: SessionDep, user_data=Depends(verify_token)) -> Message:
    user_id = user_data["sub"]

    user = session.exec(select(User).where(User.supabase_user_id == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    message = Message(
      user_id=user.id,
      conversation_id=message_data.conversation_id,
      role=message_data.role,
      content=message_data.content,
    )
    session.add(message)
    session.commit()
    session.refresh(message)
    return message

# Gets every single message
@router.get("/messages/")
def get_all_messages(user: UserDep, session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100) -> list[Message]:
  messages = session.exec(select(Message.user_id == user.id).offset(offset).limit(limit)).all()
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