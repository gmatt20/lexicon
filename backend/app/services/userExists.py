from db.engine import SessionDep
from models.models import User

def user_exists(user_id: int, session: SessionDep) -> bool:
  user = session.get(User, user_id)
  if not user:
    return False
  return True