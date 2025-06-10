"use client";

import { useEffect, useRef, useState } from "react";
import ChatBubble from "@/components/ChatBubble";
import InputChat from "@/components/InputChat";
import { ChatMessage } from "@/types/ChatMessage";
import { User } from "@/types/User";
import { fetchUserInfo } from "@/lib/FetchUser";
import { useLexWebSocket } from "@/lib/hooks/useLexWebSocket";
import { useHandleTextMessage } from "@/lib/hooks/useHandleTextMessage";
import { fetchMessages } from "@/lib/FetchMessages";
import { useParams } from "next/navigation";

export default function Chat() {
  const params = useParams();

  const conversationID = Number(params.conversationId);
  const ws = useRef<WebSocket | null>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInfo, setUserInfo] = useState<User>({
    id: 0,
    username: "",
    is_guest: true,
  });

  // Load authenticated user and their messages
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchUserInfo();
        setUserInfo(user);
        const allMessages = await fetchMessages(
          user.id,
          Number(conversationID)
        );
        if (allMessages.length === 0) {
          return;
        }
        setMessages(allMessages);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, [conversationID]);

  // Set up websocket
  useLexWebSocket({ conversationId: Number(conversationID), setMessages }, ws);
  const handleTextMessage = useHandleTextMessage(ws, setMessages);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 relative h-full">
      <div className="flex-1 overflow-y-auto py-10 pb-32">
        {messages.map((msg, i) => (
          <ChatBubble msg={msg} key={i} />
        ))}
        <div ref={latestMessageRef} />
      </div>
      <form
        className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t z-10"
        onSubmit={handleTextMessage}>
        <InputChat />
      </form>
    </div>
  );
}
