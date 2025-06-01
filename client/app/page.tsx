"use client";

import ChatBubble from "@/components/ChatBubble";
import InputChat from "@/components/InputChat";
import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/types/ChatMessage";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");
    ws.current.onmessage = (e) => {
      const word = e.data;

      setMessages((prev) => {
        const last = prev[prev.length - 1];

        if (last?.role === "lex") {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...last,
            content: last.content + word,
          };
          return updated;
        }

        return [...prev, { role: "lex", content: word }];
      });
    };
    ws.current.close = () => {
      console.log("WebsSocker closed");
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleTextMessage = (e: React.FormEvent<HTMLFormElement>) => {
    const form = document.getElementById("form") as HTMLFormElement;
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      "messageText",
    ) as HTMLInputElement;
    const value = input.value.trim();
    if (ws.current?.readyState === WebSocket.OPEN) {
      setMessages((prev) => [...prev, { role: "user", content: value }]);
      ws.current.send(value);
    }
    form.reset();
  };

  return (
    <div className="h-screen w-screen">
      <div className="pt-10 pb-32">
        {messages.map((msg, i) => (
          <ChatBubble msg={msg} key={i} />
        ))}
      </div>
      <form method="post" id="form" onSubmit={handleTextMessage}>
        <InputChat />
      </form>
    </div>
  );
}
