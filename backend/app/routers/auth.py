from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from db.engine import SessionDep
from pydantic import BaseModel
from models.models import User
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from passlib.context import CryptContext
from typing import Annotated
from datetime import timedelta
from services.authenticate_user import authenticate_user
from services.create_access_token import create_access_token
from db.engine import supabase

router = APIRouter(
  prefix="/auth",
  tags=["auth"]
)

class CreateUserRequest(BaseModel):
  username: str
  email: str
  password: str

class Token(BaseModel):
  access_token: str
  token_type: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

@router.post("/test", status_code=status.HTTP_201_CREATED)
def create_user(user: CreateUserRequest):
  supabase.auth.sign_up(
    {
      "email": user.email,
      "password": user.password,
    }
  )
  return {"message": "User created successfully!"}

@router.post("/create-user/", status_code=status.HTTP_201_CREATED)
def create_user(session: SessionDep, create_user_req: CreateUserRequest):
  response = supabase.auth.sign_up(
    {
      "email": "email@example.com",
      "password": "password",
    }
  )
  create_user = User(
    username=create_user_req.username,
    email=create_user_req.email,
    hashed_password=pwd_context.hash(create_user_req.password),
    auth_provider="local"
  )
  session.add(create_user)
  session.commit()
  session.refresh(create_user)
  
  return {"message": "User created successfully!", "user_id": create_user.id}

@router.post("/token/", response_model=Token)
async def login_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
  user = authenticate_user(form_data.username, form_data.password, session)
  if not user:
    raise HTTPException(status_code=404, detail="Could not validate user")
  if user.auth_provider != "local":
    raise HTTPException(403, "Please log in using Google.")
  token = create_access_token(user.username, user.id, timedelta(minutes=20))

  return {"access_token": token, "token_type": "bearer"}