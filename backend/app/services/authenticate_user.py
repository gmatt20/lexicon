from sqlmodel import select
from models.models import User
from services.auth_config import pwd_context

def authenticate_user(username: str, password: str, session):
  user = session.exec(select(User).where(User.username == username)).first()
  if not user:
    return False
  if not pwd_context.verify(password, user.hashed_password):
    return False
  return user