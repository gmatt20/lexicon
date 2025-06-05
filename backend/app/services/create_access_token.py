from datetime import datetime, timedelta
from jose import jwt
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
  encode = {"sub": username, "id": user_id}
  expires = datetime.utcnow() + expires_delta
  encode.update({"exp": expires})
  return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)