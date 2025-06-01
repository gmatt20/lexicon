"use client";

import { Input } from "@/components/ui/input";

export default function InputChat() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    // const formJson = Object.fromEntries(formData.entries());
    // console.log(formJson);
  };

  return (
    <div className="fixed bottom-0 w-full bg-white p-5">
      <form method="post" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="prompt"
          id="prompt"
          placeholder="Type your message..."
        />
      </form>
    </div>
  );
}
