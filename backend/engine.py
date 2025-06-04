from sqlmodel import create_engine, SQLModel, Session
from fastapi import Depends
from typing import Annotated
from dotenv import load_dotenv
import os

load_dotenv()

psql_url = os.getenv("PSQL_URL")
engine = create_engine(psql_url,)

def create_db_and_tables():
  SQLModel.metadata.create_all(engine)

def get_session():
  with Session(engine) as session:
    yield session

SessionDep = Annotated[Session, Depends(get_session)]