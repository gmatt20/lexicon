"use client";

import ChatBubble from "@/components/ChatBubble";
import InputChat from "@/components/InputChat";
import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/types/ChatMessage";
import { User } from "@/types/User";
import { fetchUserInfo } from "@/lib/FetchUser";
import { useLexWebSocket } from "@/lib/useLexWebSocket";
import { useHandleTextMessage } from "@/lib/useHandleTextMessage";

export default function Home() {
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
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  // Establishes a new web socket connection
  useLexWebSocket({ conversationId: 1, setMessages }, ws);
  // Handles messages sent by user
  const handleTextMessage = useHandleTextMessage(ws, setMessages);

  // Returns the user to the bottom of the page when a new message is sent
  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div className="h-screen w-screen">
      <div className="pt-10 pb-32">
        {messages.map((msg, i) => (
          <ChatBubble msg={msg} key={i} />
        ))}
      </div>
      <div ref={latestMessageRef}></div>
      <form method="post" id="form" onSubmit={handleTextMessage}>
        <InputChat />
      </form>
      {authenticated && <p>Welcome {userInfo.username}</p>}
      {/* <button onClick={handleClick}>CONTINUE WITH GOOGLE</button> */}
    </div>
  );
}
