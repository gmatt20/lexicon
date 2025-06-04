from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from lexAI.lex import Lexercise
from db.engine import get_session
from models.models import Message
from sqlmodel import Session
import asyncio

router = APIRouter()

@router.websocket("/ws/{user_id}")
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