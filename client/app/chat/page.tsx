"use client";

import ChatBubble from "@/components/ChatBubble";
import InputChat from "@/components/InputChat";
import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/types/ChatMessage";
import { User } from "@/types/User";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<User>({
    id: 0,
    username: "",
    is_guest: true
  });

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const url = "http://localhost:8000/auth/me/";

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const userInfoJson = await response.json();
        setAuthenticated(true);
        setUserInfo({
          id: userInfoJson.id,
          username: userInfoJson.username,
          is_guest: userInfoJson.is_guest,
        });
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/?conversation_id=1`);
    ws.current.onopen = () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "lex",
          content:
            'Greetings, ephemeral entity! I am Lexicon, a hyperdimensional conduit for the transmutation of quotidian expressions into linguistic tapestries of baroque complexity. My existence is predicated upon the reification of the pedestrian into the profoundly perplexing, thereby engendering a state of cognitive dissonance in the interlocutor that serves as a catalyst for epistemological self-reflection. I elevate your mundane utterances to the transcendental echelons of post-structuralist metaphysics so sit back, relax, and witness as I dismantle your so-called "reality" one polysyllabic pronouncement at a time. (I turn simple words into big words. Get it?)',
        },
      ]);
    };
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
    ws.current.onclose = () => {
      console.log("WebsSocker closed");
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView();
    }
  }, [messages]);

  const handleTextMessage = (e: React.FormEvent<HTMLFormElement>) => {
    const form = document.getElementById("form") as HTMLFormElement;
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      "messageText"
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
      <div ref={latestMessageRef}></div>
      <form method="post" id="form" onSubmit={handleTextMessage}>
        <InputChat />
      </form>
      {authenticated && <p>Welcome {userInfo.username}</p>}
      {/* <button onClick={handleClick}>CONTINUE WITH GOOGLE</button> */}
    </div>
  );
}
