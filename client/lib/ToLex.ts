export const ToLex = async (userInput) => {
  const ToLex = await fetch("http://127.0.0.1:8000/lexercise", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: userInput,
  });

  const LexResponse = await ToLex.json();

  return LexResponse.Lex;
};
