from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.engine import create_db_and_tables
from app.routers import messages, conversations, websocket, auth
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

@app.get("/", status_code=status.HTTP_200_OK, response_model=dict)
def root() -> dict:
  return {"message": "Welcome to the Lexicon App!"}