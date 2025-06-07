from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from lexAI.lex import Lexercise
from db.engine import supabase
from models.models import Message
from sqlmodel import Session
import asyncio
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

router = APIRouter()

@router.websocket("/ws/")
async def ws_endpoint(websocket: WebSocket, token: str):
  try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    user_id = payload.get("sub")
    if not user_id:
            await websocket.close()
            return
    await websocket.accept()

  except JWTError:
        await websocket.close()
        return
  try:
    while True:
      data = await websocket.receive_text()
      supabase.table("messages").insert({
         "user_id": user_id,
         "role": "user",
         "content": data
      }).execute()

      try:
        response = Lexercise(data)
        LexResponse = response["Lex"]
      except Exception as e:
                await websocket.send_text("Error processing message.")
                break

      supabase.table("messages").insert({
                "user_id": user_id,
                "role": "lex",
                "content": LexResponse
            }).execute()

      for word in LexResponse.split():
        await websocket.send_text(word + " ")
        await asyncio.sleep(0.1)
  except WebSocketDisconnect:
    print(f"WebSocket disconnected for user {user_id}")