"use client";

import ChatBubble from "@/components/ChatBubble";
import InputChat from "@/components/InputChat";
import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/types/ChatMessage";
import { User } from "@/types/User";
import { fetchUserInfo } from "@/lib/FetchUser";
import { useLexWebSocket } from "@/lib/hooks/useLexWebSocket";
import { useHandleTextMessage } from "@/lib/hooks/useHandleTextMessage";
import { fetchMessages } from "@/lib/FetchMessages";

export default function Chat() {
  const ws = useRef<WebSocket | null>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User>({
    id: 0,
    username: "",
    is_guest: true,
  });

  // Loads in the authenticated user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userInfo = await fetchUserInfo();
        setAuthenticated(true);
        setUserInfo({
          id: userInfo.id,
          username: userInfo.username,
          is_guest: true,
        });
        const allMessages = await fetchMessages(userInfo.id, 2);
        setMessages(allMessages);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  // Establishes a new web socket connection
  useLexWebSocket({ conversationId: 2, setMessages }, ws);
  // Handles messages sent by user
  const handleTextMessage = useHandleTextMessage(ws, setMessages);

  // Returns the user to the bottom of the page when a new message is sent
  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 relative h-full">
      <div className="flex-1 overflow-y-auto py-10 pb-32">
        {messages.map((msg, i) => (
          <ChatBubble msg={msg} key={i} />
        ))}
      </div>
      <div ref={latestMessageRef}></div>
      <form
        className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t z-10"
        method="post"
        id="form"
        onSubmit={handleTextMessage}>
        <InputChat />
      </form>
    </div>
  );
}
