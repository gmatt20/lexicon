"use client";

import ChatBubble from "@/components/ChatBubble";
import InputChat from "@/components/InputChat";
import { useMessages } from "@/hooks/useMessages";

export default function Chat() {
  const { messages, error, loading, handleTextMessage, latestMessageRef } =
    useMessages();

  return (
    <>
      <div className=" overflow-y-auto py-10 pb-32">
        {error && (
          <div className="text-center text-red-500">
            {error.message || "Something went wrong"}
          </div>
        )}
        {!loading && messages.map((msg, i) => <ChatBubble msg={msg} key={i} />)}
        <div ref={latestMessageRef} />
      </div>
      <form
        className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t z-10"
        onSubmit={handleTextMessage}>
        <InputChat />
      </form>
    </>
  );
}
