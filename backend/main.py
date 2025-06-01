from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from lex import Lexercise
from pydantic import BaseModel
import asyncio

class Prompt(BaseModel):
  prompt: str

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

@app.get("/")
def read_root():
  return{"Hello": "World"}

@app.post("/lexercise")
def to_lex(prompt: Prompt):
  response = Lexercise(prompt)
  return response

@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
  await websocket.accept()
  while True:
    data = await websocket.receive_text()
    response = Lexercise(data)
    LexResponse = response["Lex"]
    for word in LexResponse.split():
      await websocket.send_text(word + " ")
      await asyncio.sleep(0.1)