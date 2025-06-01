"use client";

import { Input } from "@/components/ui/input";
import { ToLex } from "@/lib/ToLex";

export default function InputChat({ onLexResponse }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    form.reset();

    const Lex = await ToLex(JSON.stringify(formJson));

    onLexResponse(Lex);
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
