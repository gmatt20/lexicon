from app.main import app

from fastapi.testclient import TestClient

client = TestClient(app)

# Preliminary test for main API endpoint
def test_read_main():
  response = client.get("/")
  assert response.status_code == 200
  assert response.json() == {"message": "Welcome to the Lexicon App!"}

# Tests get conversations for the unauthenticated
def test_get_conversations_unauth():
    response = client.get("/conversations/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Access token is missing"}

# Tests get message by ID for the unauthenticated
def test_get_messages_unauth():
    response = client.get("/messages/17/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Access token is missing"}

# Tests get user info (me) for the unauthenticated
def test_get_user_unauth():
    response = client.get("/auth/me/")
    assert response.status_code == 401
    assert response.json() == {"detail": "Access token is missing"}
