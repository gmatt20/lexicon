from fastapi import FastAPI, WebSocket, Query, HTTPException, Depends, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from lex import Lexercise
from pydantic import BaseModel
import asyncio
from engine import create_db_and_tables, SessionDep, get_session
from model import User, Message
from sqlmodel import select, Session
from typing import Annotated

class Prompt(BaseModel):
  prompt: str

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

@app.post("/users/")
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

@app.get("/")
def read_root():
  return{"Hello": "World"}

@app.post("/lexercise")
def to_lex(prompt: Prompt):
  response = Lexercise(prompt)
  return response

@app.websocket("/ws/{user_id}")
async def ws_endpoint(websocket: WebSocket, user_id: int, session: Session = Depends(get_session)):
  try:
    await websocket.accept()
    while True:
      data = await websocket.receive_text()
      user_msg = Message(user_id=user_id, role="user", content=data)
      session.add(user_msg)

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