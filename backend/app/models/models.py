from sqlmodel import Field, SQLModel, Relationship

# TURD: Need to add time created, Google ID from oauth, email, password
# TURD: and profile picture
class User(SQLModel, table=True):
  # Marks the user ID as required in the database
  # and the database will generate a unique ID
  id: int | None = Field(default=None, primary_key=True)
  name: str = Field(index=True)
  messages: list["Message"] = Relationship(back_populates="user")
  conversations: list["Conversation"] = Relationship(back_populates="user")

# TURD: Need to add time created
class Conversation(SQLModel, table=True):
  id: int | None = Field(default=None, primary_key=True)
  user_id: int | None = Field(foreign_key="user.id")
  title: str | None = Field(default="New Chat")
  user: User | None = Relationship(back_populates="conversations")
  messages: list["Message"] = Relationship(back_populates="conversation")

# TURD: Need to add time created
class Message(SQLModel, table=True):
  id: int | None = Field(default=None, primary_key=True)
  user_id: int | None = Field(foreign_key="user.id")
  user: User | None = Relationship(back_populates="messages")
  conversation_id: int | None = Field(foreign_key="conversation.id")
  conversation: Conversation = Relationship(back_populates="messages")
  role: str
  content: str