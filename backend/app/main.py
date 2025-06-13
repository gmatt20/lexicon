from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db.engine import create_db_and_tables, SessionDep
from routers import messages, conversations, websocket, auth
from services.get_current_user import get_current_user
from typing import Annotated
from starlette import status

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
  create_db_and_tables()

app.include_router(conversations.router)
app.include_router(messages.router)
app.include_router(auth.router)
app.include_router(websocket.router)

user_dependency = Annotated[dict, Depends(get_current_user)]

@app.get("/")
def root():
  return{"message": "Welcome to the Lexicon App!"}

@app.get("/current-user", status_code=status.HTTP_200_OK)
async def user(user: user_dependency, session: SessionDep):
  if user is None:
    raise HTTPException(status_code=401, detail="Authentication Failed")
  return {"User": user}