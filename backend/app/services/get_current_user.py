from fastapi import Depends, HTTPException
from typing import Annotated
from starlette import status
from jose import jwt, JWTError
from dotenv import load_dotenv
from services.auth_config import oauth2_bearer
import os
from db.engine import supabase

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
  try:
    user = supabase.auth.get_user(token)
    if user is None:
      raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user.")
    return {"user": user}
  except JWTError:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user.")