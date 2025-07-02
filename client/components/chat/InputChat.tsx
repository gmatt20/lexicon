"use client";

import { Input } from "@/components/ui/inputMsg";

export default function InputChat() {
  return (
    <div className="w-full bg-background p-0">
        <Input
          type="text"
          name="messageText"
          id="messageText"
          autoComplete="off"
        />
    </div>
  );
}
