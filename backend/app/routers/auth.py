from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import JSONResponse
from starlette import status
from db.engine import SessionDep
from pydantic import BaseModel
from models.models import User
from db.engine import supabase
from sqlmodel import select

router = APIRouter(
  prefix="/auth",
  tags=["auth"]
)
class UserReq(BaseModel):
  email: str
  password: str

class GuestReq(BaseModel):
  username: str

class DeleteAcc(BaseModel):
   id: int

@router.post("/sign-up", status_code=status.HTTP_201_CREATED)
def sign_up(user: UserReq, session: SessionDep, response: Response):
  responseSupabase = supabase.auth.sign_up(
    {
      "email": user.email,
      "password": user.password,
    }
  )

  supabase_user_id = responseSupabase.user.id
  username = user.email.split("@")[0]

  new_user = User(
    supabase_user_id=supabase_user_id,
    username=username,
    is_guest=False,
  )

  session.add(new_user)
  session.commit()
  session.refresh(new_user)

  access_token = responseSupabase.session.access_token

  response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True,path="/")

  return response

@router.post("/sign-in/", status_code=status.HTTP_200_OK)
def sign_in(user: UserReq):
  response = supabase.auth.sign_in_with_password(
    {
      "email": user.email,
      "password": user.password
    }
  )
  
  if not response:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
  
  return {
    "message": "Sign in successful", "access_token": response.session.access_token
  }

@router.post("/sign-in-as-guest", status_code=status.HTTP_201_CREATED)
def sign_in_as_guest(guest: GuestReq, session: SessionDep):
  response = supabase.auth.sign_in_anonymously({
        "options": {
            "data": {
                "username": guest.username
            }
        }
    })
  supabase_user_id = response.user.id

  new_user = User(
    supabase_user_id=supabase_user_id,
    username=guest.username,
    is_guest=True,
  )

  session.add(new_user)
  session.commit()
  session.refresh(new_user)
  
  return {"Signed in as guest": response.user.id}

@router.post("/sign-out", status_code=status.HTTP_200_OK)
def logout():
  supabase.auth.sign_out()
  response = JSONResponse(content={"message": "Signed out"})
  response.delete_cookie("access_token")

  return response

@router.delete("/delete-account", status_code=status.HTTP_200_OK)
def delete_account(userDelete: DeleteAcc, session: SessionDep):
  user =  session.exec(select(User).where(User.id == userDelete.id)).first()
  if not user:
        raise HTTPException(status_code=404, detail="User not found")

  if not user.supabase_user_id:
      raise HTTPException(status_code=400, detail="Supabase user ID missing")

  supabase.auth.admin.delete_user(user.supabase_user_id)

  session.delete(user)
  session.commit

  return {"message": "successfully deleted user"}