from fastapi import FastAPI, WebSocket, Query, HTTPException, Depends, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from lex import Lexercise
from pydantic import BaseModel
import asyncio
from engine import create_db_and_tables, SessionDep, get_session
from model import User, Message, Conversation
from sqlmodel import select, Session
from typing import Annotated

class Prompt(BaseModel):
  prompt: str

class ConversationData(BaseModel):
  user_id: int
  title: str | None = "New Chat"

app = FastAPI()

origins = [
  "http://localhost:3000",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=False,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
  create_db_and_tables()

@app.post("/user/")
def create_user(user: User, session: SessionDep) -> User:
  session.add(user)
  session.commit()
  session.refresh(user)
  return user

@app.get("/users/")
def read_users(session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100, ) -> list[User]:
  users = session.exec(select(User).offset(offset).limit(limit)).all()
  return users

@app.delete("/users/{user_id}")
def delete_user(user_id: int, session: SessionDep):
  user = session.get(User, user_id)
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  session.delete(user)
  session.commit()
  return{"ok": True}

@app.post("/conversation/")
def new_conversation(conversation: ConversationData, session: SessionDep) -> Conversation:
  user = session.get(User, conversation.user_id)
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  conversation = Conversation(user_id=conversation.user_id, title=conversation.title)
  session.add(conversation)
  session.commit()
  session.refresh(conversation)
  return conversation

@app.get("/conversations/")
def get_conversations(session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100, ) -> list[Conversation]:
  conversations = session.exec(select(Conversation).offset(offset).limit(limit)).all()
  return conversations

@app.post("/message/")
def post_message(message: Message, session: SessionDep) -> Message:
  session.add(message)
  session.commit()
  session.refresh(message)
  return message

@app.get("/messages/")
def get_all_messages(session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100, ) -> list[Message]:
  messages = session.exec(select(Message).offset(offset).limit(limit)).all()
  return messages

@app.get("/messages/{user_id}/{conversation_id}")
def get_convo_messages(user_id: int, conversation_id: int, session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100, ) -> list[Message]:
  user = session.get(User, user_id)
  if not user:
        raise HTTPException(status_code=404, detail="User not found")
  conversationExists = session.get(Conversation, conversation_id)
  if not conversationExists:
    raise HTTPException(status_code=404, detail="Conversation not found")

  messages = session.exec(select(Message).where(Message.user_id == user_id, Message.conversation_id == conversation_id).offset(offset).limit(limit).order_by(Message.id)).all()
  return messages

@app.delete("/messages/{user_id}")
def clear_conversation(user_id: int, session: SessionDep):
  user = session.get(User, user_id)
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  messages = session.exec(select(Message).where(Message.user_id == user_id)).all()
  for message in messages:
    session.delete(message)
  session.commit()
  return{"ok": True}

@app.websocket("/ws/{user_id}")
async def ws_endpoint(websocket: WebSocket, user_id: int, session: Session = Depends(get_session)):
  try:
    await websocket.accept()
    while True:
      data = await websocket.receive_text()
      user_msg = Message(user_id=user_id, role="user", content=data)
      session.add(user_msg)
      session.commit()
      session.refresh(user_msg)

      response = Lexercise(data)
      LexResponse = response["Lex"]

      lex_msg = Message(user_id=user_id, role="lex", content=LexResponse)
      session.add(lex_msg)
      session.commit()
      session.refresh(lex_msg)

      for word in LexResponse.split():
        await websocket.send_text(word + " ")
        await asyncio.sleep(0.1)
  except WebSocketDisconnect:
    print(f"WebSocket disconnected for user {user_id}")