from db import SessionDep
from models import Conversation
from services import query_user, verify_token

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import select
from starlette import status

router = APIRouter(prefix="/conversations", tags=["Conversations"])


class ConversationTitle(BaseModel):
    title: str


class ConversationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    time_created: datetime


# Creates a new conversation
@router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=ConversationResponse
)
def new_conversation(
    conversation: ConversationTitle,
    session: SessionDep,
    user_data=Depends(verify_token),
) -> ConversationResponse:
    user = query_user(user_data["sub"], session)

    conversation = Conversation(user_id=user.id, title=conversation.title)
    session.add(conversation)
    session.commit()
    session.refresh(conversation)

    return conversation


# Gets all conversations for a user
@router.get(
    "/", status_code=status.HTTP_200_OK, response_model=list[ConversationResponse]
)
def get_conversations(
    session: SessionDep, user_data=Depends(verify_token)
) -> list[ConversationResponse]:
    user = query_user(user_data["sub"], session)

    conversations = session.exec(
        select(Conversation).where(Conversation.user_id == user.id)
    ).all()
    return conversations


# Gets a specific conversation by ID
@router.get(
    "/{conversation_id}",
    status_code=status.HTTP_200_OK,
    response_model=ConversationResponse,
)
def get_conversation(
    conversation_id: int, session: SessionDep, user_data=Depends(verify_token)
) -> ConversationResponse:
    user = query_user(user_data["sub"], session)

    conversation = session.exec(
        select(Conversation).where(
            Conversation.id == conversation_id, Conversation.user_id == user.id
        )
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return conversation


# Updates a conversation's title
@router.put(
    "/{conversation_id}",
    status_code=status.HTTP_200_OK,
    response_model=ConversationResponse,
)
def update_conversation(
    conversation_id: int,
    conversation_title: ConversationTitle,
    session: SessionDep,
    user_data=Depends(verify_token),
) -> ConversationResponse:
    user = query_user(user_data["sub"], session)

    conversation = session.exec(
        select(Conversation).where(
            Conversation.id == conversation_id, Conversation.user_id == user.id
        )
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conversation.title = conversation_title.title
    session.add(conversation)
    session.commit()
    session.refresh(conversation)

    return conversation


# Deletes all conversations for a user
@router.delete("/", status_code=status.HTTP_200_OK, response_model=dict)
def delete_all_conversations(
    session: SessionDep, user_data=Depends(verify_token)
) -> dict:
    user = query_user(user_data["sub"], session)

    conversations = session.exec(
        select(Conversation).where(Conversation.user_id == user.id)
    ).all()
    if not conversations:
        return {"deleted": 0}

    for conversation in conversations:
        session.delete(conversation)
    session.commit()

    return {"deleted all conversations": True}


# Deletes a specific conversation by ID
@router.delete(
    "/{conversation_id}", status_code=status.HTTP_200_OK, response_model=dict
)
def delete_conversation(
    conversation_id: int, session: SessionDep, user_data=Depends(verify_token)
) -> dict:
    user = query_user(user_data["sub"], session)

    conversation = session.exec(
        select(Conversation).where(
            Conversation.id == conversation_id, Conversation.user_id == user.id
        )
    ).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    session.delete(conversation)
    session.commit()

    return {"message": "Conversation deleted successfully"}
