from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

class User(SQLModel, table=True):
  # Marks the user ID as required in the database
  # and the database will generate a unique ID
  id: int | None = Field(default=None, primary_key=True)
  supabase_user_id: str = Field(index=True, unique=True)
  username: str | None = Field(default=None)
  profile_picture: str | None = Field(default=None)
  is_guest: bool = Field(default=False)
  # Relationships
  messages: list["Message"] = Relationship(back_populates="user")
  conversations: list["Conversation"] = Relationship(back_populates="user")

class Conversation(SQLModel, table=True):
  id: int | None = Field(default=None, primary_key=True)
  user_id: int = Field(foreign_key="user.id")
  title: str | None = Field(default="New Chat")
  time_created: datetime = Field(default_factory=datetime.utcnow)
  # Relationships
  user: User | None = Relationship(back_populates="conversations")
  messages: list["Message"] = Relationship(back_populates="conversation")

class Message(SQLModel, table=True):
  id: int | None = Field(default=None, primary_key=True)
  user_id: int | None = Field(foreign_key="user.id")
  conversation_id: int | None = Field(foreign_key="conversation.id")
  role: str
  content: str
  time_created: datetime = Field(default_factory=datetime.utcnow)
  # Relationships
  user: User | None = Relationship(back_populates="messages")
  conversation: Conversation = Relationship(back_populates="messages")