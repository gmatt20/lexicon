from sqlmodel import create_engine, SQLModel, Session
from fastapi import Depends
from typing import Annotated
from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv()

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Connect with Supabase through client
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
url: str = os.environ.get("SUPABASE_URL")
supabase: Client = create_client(url, key)

DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as connection:
        print("Connection with Supabase successful!")
except Exception as e:
    print(f"Failed to connect to Supabase: {e}")

def create_db_and_tables():
  # SQLModel.metadata.drop_all(engine)
  SQLModel.metadata.create_all(engine)

def get_session():
  with Session(engine) as session:
    yield session

SessionDep = Annotated[Session, Depends(get_session)]