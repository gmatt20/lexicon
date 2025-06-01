export const ToLex = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());

  const ToLex = await fetch("http://127.0.0.1:8000/lexercise", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formJson),
  });

  const LexResponse = await ToLex.json();

  console.log(LexResponse);
};
