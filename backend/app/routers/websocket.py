from app.lexAI.lex import Lexercise
from app.db import SessionDep
from app.models import *

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, WebSocketException, Query, status
from sqlmodel import Session, select
from jose import jwt
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = os.getenv("ALGORITHM")

router = APIRouter()

async def get_cookie(
      websocket: WebSocket,
      session: Session
):
   token = websocket.cookies.get("access_token")
   if not token:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
   try:
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=[ALGORITHM], audience="authenticated")
        user_id = payload["sub"]
        user = session.exec(select(User).where(User.supabase_user_id == user_id)).first()
        if not user:
            raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
        return user
   except WebSocketException:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)

@router.websocket("/ws/")
async def ws_endpoint(
    websocket: WebSocket,
    session: SessionDep,
    conversation_id: int = Query(...),
):
    await websocket.accept()

    try:
        user = await get_cookie(websocket, session)

        conversation = session.exec(
            select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user.id
            )
        ).first()

        if not conversation:
            await websocket.send_text("Invalid conversation ID.")
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

    except WebSocketException:
        await websocket.send_text("Authentication failed.")
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    try:
        while True:
            data = await websocket.receive_text()

            user_message = Message(
                user_id=user.id,
                conversation_id=conversation_id,
                role="user",
                content=data
            )
            session.add(user_message)
            session.commit()
            session.refresh(user_message)

            try:
                response = Lexercise(data)
                LexResponse = response["Lex"]
            except Exception:
                await websocket.send_text("Error processing message.")
                break

            lex_message = Message(
                user_id=user.id,
                conversation_id=conversation_id,
                role="lex",
                content=LexResponse
            )
            session.add(lex_message)
            session.commit()
            session.refresh(lex_message)

            await websocket.send_text(LexResponse)

    except WebSocketDisconnect:
        print(f"WebSocket disconnected for user {user.supabase_user_id}")