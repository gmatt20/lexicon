from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from lex import Lexercise
from pydantic import BaseModel

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
    print(data)
    response = Lexercise(data)
    await websocket.send_text(response["Lex"])