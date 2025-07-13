from app.db import create_db_and_tables
from app.routers import auth, conversations, messages, websocket

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette import status

# Automated tests indicate that "on_event is deprecated,
# use lifespan event handlers instead."
# Read more about it in the
# [FastAPI docs for Lifespan Events]
# (https://#fastapi.tiangolo.com/advanced/events/).
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversations.router)
app.include_router(messages.router)
app.include_router(auth.router)
app.include_router(websocket.router)


@app.get("/", status_code=status.HTTP_200_OK, response_model=dict)
def root() -> dict:
    return {"message": "Welcome to the Lexicon App!"}
