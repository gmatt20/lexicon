"use client";

import ChatBubble from "@/components/chat/ChatBubble";
import InputChat from "@/components/chat/InputChat";
import { useMessages } from "@/hooks/useMessages";
import { useState } from "react";

export default function Chat() {
  const {
    messages,
    error,
    loading,
    handleTextMessage,
    latestMessageRef,
    deleteMessageById,
    editMessageById,
  } = useMessages();
  const [editContent, setEditContent] = useState<string>("");

  return (
    <>
      <div className="bg-background overflow-y-auto py-10 pb-32 font-light">
        {error && (
          <div className="text-center text-red-500">
            {error.message || "Something went wrong"}
          </div>
        )}
        {!loading &&
          messages.map((msg, i) => (
            <ChatBubble
              msg={msg}
              key={i}
              onDelete={() => deleteMessageById(msg.id, msg.conversation_id)}
              onEdit={() => {
                setEditContent(msg.content);
                editMessageById(msg.id, msg.conversation_id, editContent);
              }}
            />
          ))}
        <div ref={latestMessageRef} />
      </div>
      <form
        className="absolute bottom-0 left-0 right-0 p-4 border-t z-10"
        onSubmit={handleTextMessage}>
        <InputChat editContent={editContent} />
      </form>
    </>
  );
}
