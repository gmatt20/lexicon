from fastapi import Depends, HTTPException
from typing import Annotated
from starlette import status
from jose import jwt, JWTError
from dotenv import load_dotenv
from services.auth_config import oauth2_bearer
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

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