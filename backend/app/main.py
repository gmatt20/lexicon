from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.engine import create_db_and_tables
from routers import users, messages, conversations

app = FastAPI()

origins = [
  "http://localhost:3000",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=False,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
  create_db_and_tables()

app.include_router(users.router)
app.include_router(conversations.router)
app.include_router(messages.router)

@app.get("/")
def root():
  return{"message": "Welcome to the Lexicon App!"}