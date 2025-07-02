"use client";

import { Input } from "@/components/ui/inputMsg";

export default function InputChat(editContent?: string) {
  return (
    <div className="w-full bg-background p-0">
      {editContent ? (
        <Input
          type="text"
          name="messageText"
          id="messageText"
          autoComplete="off"
          value={editContent}
          placeholder="Edit your message..."
        />
      ) : (
        <Input
          type="text"
          name="messageText"
          id="messageText"
          autoComplete="off"
          placeholder={editContent}
        />
      )}
    </div>
  );
}
