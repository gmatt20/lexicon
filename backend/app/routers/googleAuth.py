from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from datetime import timedelta
from db.engine import SessionDep
from models.models import User
from dotenv import load_dotenv
import os
from sqlmodel import select
from models.models import User
import requests
from services.create_access_token import create_access_token

router = APIRouter(
  prefix="/google",
  tags=["google"]
)

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

@router.get("/login/")
async def login_google():
  google_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"response_type=code&client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        f"&scope=openid%20profile%20email&access_type=offline"
    )
  return RedirectResponse(url=google_url)

router.get("/auth/")
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

  user = session.exec(select(User).where(User.username == email)).first()
  if not user:
      user = User(username=email, hashed_password=None, auth_provider="google")
      session.add(user)
      session.commit()
      session.refresh(user)

  jwt_token = create_access_token(user.username, user.id, timedelta(minutes=30))
  return {"access_token": jwt_token, "token_type": "bearer"}