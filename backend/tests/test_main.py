from app.main import app

from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_main():
  response = client.get("/")
  assert response.status_code == 200
  assert response.json() == {"message": "Welcome to the Lexicon App!"}

def test_get_conversations():
  response = client.get("/conversations/")
  assert response.status_code == 401
  assert response.json() == {"detail": "Access token is missing"}
