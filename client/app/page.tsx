"use client";

import ChatBubble from "@/components/ChatBubble";
import InputChat from "@/components/InputChat";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");
    ws.current.onmessage = (e) => {
      setMessages((prev) => [...prev, e.data]);
    };
    ws.current.close = () => {
      console.log("WebsSocker closed");
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleTextMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      "messageText"
    ) as HTMLInputElement;
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(input.value);
      input.value = "";
    }
  }

  const handleLexResponse = (response) => {
    setMessages((prev) => [...prev, response]);
  };
  
  return (
    <div className="h-screen w-screen">
      <div className="pt-10 pb-32">
        {messages.map((lexMsg, i) => (
          <ChatBubble lex={lexMsg} key={i} />
        ))}
      </div>
      <InputChat onLexResponse={handleLexResponse} />
      <h1>WebSocket Chat</h1>
      <form action="" onSubmit={handleTextMessage}>
        <input type="text" id="messageText" autoComplete="off" />
        <button>Send</button>
      </form>
      <ul id="messages"></ul>
    </div>
  );
}
