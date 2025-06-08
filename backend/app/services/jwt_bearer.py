from fastapi import HTTPException, Request, status, Depends
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

load_dotenv()

ALGORITHM = os.getenv("ALGORITHM")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")


def verify_token(
    request: Request
):
  token = request.cookies.get("access_token")
  try:
    payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=[ALGORITHM], audience="authenticated")
    return payload
  except JWTError as e:
    print(e)
    raise HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid token"
    )