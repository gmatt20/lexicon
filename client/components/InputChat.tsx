"use client";

import { Input } from "@/components/ui/input";
import { ToLex } from "@/lib/ToLex";


export default function InputChat() {
  return (
    <div className="fixed bottom-0 w-full bg-white p-5">
      <form method="post" onSubmit={ToLex}>
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
