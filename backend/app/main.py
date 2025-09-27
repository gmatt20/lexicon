from app.db import create_db_and_tables
from app.routers import auth, conversations, messages, websocket

from authlib.integrations.starlette_client import OAuth
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette import status
import os
from starlette.requests import Request

# Automated tests indicate that "on_event is deprecated,
# use lifespan event handlers instead."
# Read more about it in the
# [FastAPI docs for Lifespan Events]
# (https://#fastapi.tiangolo.com/advanced/events/).
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

oauth = OAuth()

oauth.register(
    name="google",
    client_id=os.environ["GOOGLE_CLIENT_ID"],
    client_secret=os.environ["GOOGLE_CLIENT_SECRET"],
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        'scope': 'openid email profile'
    }
)

app = FastAPI(lifespan=lifespan)

secret_key = os.environ["SECRET_KEY"]
if not secret_key:
    raise RuntimeError

app.add_middleware(SessionMiddleware, secret_key=secret_key)
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

@app.get("/login/google")
async def login_via_google(request: Request):
    redirect_uri = request.url_for("auth_via_google")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/google")
async def auth_via_google(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = token["userinfo"]
    return dict(user)