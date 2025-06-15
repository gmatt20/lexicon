from fastapi import APIRouter, HTTPException, Response, Depends
from fastapi.responses import JSONResponse
from starlette import status
from db.engine import SessionDep
from pydantic import BaseModel
from models.models import User
from db.engine import supabase
from sqlmodel import select
from services.jwt_bearer import verify_token
from gotrue.errors import AuthApiError

router = APIRouter(
  prefix="/auth",
  tags=["Auth"]
)
class NewUserReq(BaseModel):
  email: str
  username: str | None
  password: str
class UserSignIn(BaseModel):
  email: str
  password: str

class UpdateUser(BaseModel):
   email: str | None
   username: str | None

class GuestReq(BaseModel):
  username: str

@router.post("/sign-up/", status_code=status.HTTP_201_CREATED)
def sign_up(user: NewUserReq, session: SessionDep, response: Response):
  try:
    responseSupabase = supabase.auth.sign_up(
      {
        "email": user.email,
        "password": user.password,
      }
    )
  except Exception as e:
    if "user already registered" in str(e).lower():
       raise HTTPException(status_code=409, detail="User already registered")
    raise HTTPException(status_code=500, detail=f"Internal server error {e}")

  supabase_user_id = responseSupabase.user.id
  username = user.email.split("@")[0]

  new_user = User(
    supabase_user_id=supabase_user_id,
    username=user.username or username,
    is_guest=False,
  )

  session.add(new_user)
  session.commit()
  session.refresh(new_user)

  access_token = responseSupabase.session.access_token

  response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True,path="/")

  return {"message": "User created successfully", "user_id": new_user.id}

@router.post("/sign-in/", status_code=status.HTTP_200_OK)
def sign_in(user: UserSignIn, response: Response):
    try:
        responseSupabase = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })

        if not responseSupabase or not responseSupabase.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access_token = responseSupabase.session.access_token

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            path="/"
        )

        return {"message": "Login successful"}
    
    except Exception as e:
        print("ERROR during sign-in:", e)
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/me/")
def get_current_user(session: SessionDep, user_data=Depends(verify_token)):
   supabase_user_id = user_data["sub"]

   try:
    user = session.exec(select(User).where(User.supabase_user_id == supabase_user_id)).first()
    user_supabase = supabase.auth.admin.get_user_by_id(supabase_user_id)
    email = user_supabase.user.email
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
   except AuthApiError as e:
    raise HTTPException(status_code=500, detail=f"Supabase error: {e}")
   
   return{
      "id": user.id,
      "username": user.username,
      "is_guest": user.is_guest,
      "email": email,
   }

@router.put("/update-me", status_code=status.HTTP_200_OK)
def update_me(update: UpdateUser, session: SessionDep, user_data=Depends(verify_token)):
  response = None
  supabase_user_id = user_data["sub"]

  user = session.exec(select(User).where(User.supabase_user_id == supabase_user_id)).first()
  if not user:
      raise HTTPException(status_code=404, detail="User not found")

  if update.email:
        try:
          response = supabase.auth.admin.update_user_by_id(supabase_user_id, {"email": update.email})
          print(response)
        except:
          raise HTTPException(status_code=409, detail="Email is already in use")
   
  user_supabase = supabase.auth.admin.get_user_by_id(supabase_user_id)
  email = user_supabase.user.email

  if update.username:
    user.username = update.username
    session.add(user)
    session.commit()
    
  return {
      "username": user.username,
      "email": email,
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
def logout(user_data=Depends(verify_token)):
  supabase.auth.sign_out()
  response = JSONResponse(content={"message": "Signed out"})
  response.delete_cookie("access_token")

  return response

@router.delete("/delete-account", status_code=status.HTTP_200_OK)
def delete_account(session: SessionDep, user_data=Depends(verify_token)):
  supabase_user_id = user_data["sub"]

  user = session.exec(select(User).where(User.supabase_user_id == supabase_user_id)).first()
  if not user:
    raise HTTPException(status_code=404, detail="User not found")

  supabase.auth.admin.delete_user(user.supabase_user_id)

  session.delete(user)
  session.commit()

  return {"message": "successfully deleted user"}