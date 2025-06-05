from fastapi import APIRouter, Depends, HTTPException
from datetime import timedelta, datetime
from typing import Annotated
from pydantic import BaseModel
from db.engine import SessionDep
from starlette import status
from models.models import User
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
from sqlmodel import select
from models.models import User

router = APIRouter(
  prefix="/auth",
  tags=["auth"]
)

load_dotenv()

secret_key = os.getenv("SECRET_KEY")
algorithm = os.getenv("ALGORITHM")

# Password enconder and decoder
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

class CreateUserRequest(BaseModel):
  username: str
  password: str

class Token(BaseModel):
  access_token: str
  token_type: str

@router.post("/create-user/", status_code=status.HTTP_201_CREATED)
def create_user(session: SessionDep, create_user_req: CreateUserRequest):
  create_user = User(
    username=create_user_req.username,
    hashed_password=pwd_context.hash(create_user_req.password)
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
  token = create_access_token(user.username, user.id, timedelta(minutes=20))

  return {"access_token": token, "token_type": "bearer"}

def authenticate_user(username: str, password: str, session):
  user = session.exec(select(User).where(User.username == username)).first()
  if not user:
    return False
  if not pwd_context.verify(password, user.hashed_password):
    return False
  return user

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
  encode = {"sub": username, "id": user_id}
  expires = datetime.utcnow() + expires_delta
  encode.update({"exp": expires})
  return jwt.encode(encode, secret_key, algorithm=algorithm)

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
  try:
    payload = jwt.decode(token, secret_key, algorithms=[algorithm])
    username: str = payload.get("sub")
    user_id: int = payload.get("id")
    if username is None or user_id is None:
      raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user.")
    return {"username": username, "id": user_id}
  except JWTError:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user.")