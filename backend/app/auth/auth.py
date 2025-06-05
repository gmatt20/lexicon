from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
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
import requests

router = APIRouter(
  prefix="/auth",
  tags=["auth"]
)

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

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
  if user.auth_provider != "local":
    raise HTTPException(403, "Please log in using Google.")
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
  return jwt.encode(encode, SECRET_KEY, ALGORITHM=ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
  try:
    payload = jwt.decode(token, SECRET_KEY, ALGORITHMs=[ALGORITHM])
    username: str = payload.get("sub")
    user_id: int = payload.get("id")
    if username is None or user_id is None:
      raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user.")
    return {"username": username, "id": user_id}
  except JWTError:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user.")
  
@router.get("/login/google")
async def login_google():
  google_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"response_type=code&client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        f"&scope=openid%20profile%20email&access_type=offline"
    )
  return RedirectResponse(url=google_url)

router.get("/auth/google")
async def auth_google(code: str, session: SessionDep):
  token_resp = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )

  if token_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get token from Google")

  token_data = token_resp.json()
  id_token = token_data.get("id_token")
  access_token = token_data.get("access_token")

  if not id_token or not access_token:
      raise HTTPException(status_code=400, detail="Missing tokens in Google response")

  user_info_resp = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        params={"access_token": access_token}
    )

  if user_info_resp.status_code != 200:
      raise HTTPException(status_code=400, detail="Failed to fetch user info")

  user_info = user_info_resp.json()
  email = user_info.get("email")

  if not email:
      raise HTTPException(status_code=400, detail="Google account has no email")

  # Step 3: Check or create user
  user = session.exec(select(User).where(User.username == email)).first()
  if not user:
      user = User(username=email, hashed_password=None, auth_provider="google")  # Dummy value
      session.add(user)
      session.commit()
      session.refresh(user)

  # Step 4: Create JWT
  jwt_token = create_access_token(user.username, user.id, timedelta(minutes=30))
  return {"access_token": jwt_token, "token_type": "bearer"}