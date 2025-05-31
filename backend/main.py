from fastapi import FastAPI
from lex import Lexercise
from pydantic import BaseModel

class Prompt(BaseModel):
  prompt: str

app = FastAPI()

@app.get("/")
def read_root():
  return{"Hello": "World"}

@app.post("/lexercise")
def to_lex(prompt: Prompt):
  response = Lexercise(prompt)
  return response