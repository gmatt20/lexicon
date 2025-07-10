from app.db import SessionDep
from app.models import Message
from app.services import *

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import select
from pydantic import BaseModel
from starlette import status

class MessageCreate(BaseModel):
    conversation_id: int
    role: str
    content: str

router = APIRouter(
   prefix="/messages",
   tags=["Messages"]
)

# Posts a new message to a conversation for a user
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=Message)
def post_message(message_data: MessageCreate, session: SessionDep, user_data=Depends(verify_token)) -> Message:
    user = query_user(user_data["sub"], session)

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

# Gets messages for a specific conversation for a user
@router.get("/{conversation_id}")
def get_convo_messages(conversation_id: int, session: SessionDep, user_data=Depends(verify_token)) -> list[Message]:
  user = query_user(user_data["sub"], session)

  if not conversation_exists(conversation_id, user.id, session):
    raise HTTPException(status_code=404, detail="Conversation not found with this ID")

  messages = session.exec(select(Message).where(Message.user_id == user.id, Message.conversation_id == conversation_id)).all()

  return messages

# Deletes a message by ID and conversation ID for a user
@router.delete("/{conversation_id}/{message_id}", status_code=status.HTTP_200_OK, response_model=dict)
def delete_message(conversation_id: int, message_id: int, session: SessionDep, user_data=Depends(verify_token)) -> dict:
    user = query_user(user_data["sub"], session)

    message = session.exec(select(Message).where(Message.id == message_id, Message.user_id == user.id, Message.conversation_id == conversation_id)).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    session.delete(message)
    session.commit()

    return {"message": "Message deleted successfully"}