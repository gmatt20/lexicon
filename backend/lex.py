import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

def Lexercise(prompt):
  userPrompt = prompt

  load_dotenv()

  LexPersonality = """"""

  with open("LexPersonality.txt", "r", encoding="utf-8") as f:
    LexPersonality = f.read()

  client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY")
  )

  response = client.models.generate_content(
    model="gemini-2.0-flash",
    config=types.GenerateContentConfig(
        system_instruction=LexPersonality,
          max_output_tokens=300,
          temperature=1
          ),
          contents=[
            types.Content(
              role="user",
              parts=[
                types.Part.from_text(text=userPrompt)
              ]
            )
          ]
        )
  
  return {"Lex": response.text}