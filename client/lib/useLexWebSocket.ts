import { useEffect } from "react";

type Message = {
  role: string;
  content: string;
};
type UseLexWebSocketProps = {
  conversationId: number;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

export const useLexWebSocket = (
  { conversationId, setMessages }: UseLexWebSocketProps,
  wsRef: React.MutableRefObject<WebSocket | null>
) => {

  useEffect(() => {
    wsRef.current = new WebSocket(
      `ws://localhost:8000/ws/?conversation_id=${conversationId}`
    );

    wsRef.current.onopen = () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "lex",
          content:
            'Greetings, ephemeral entity! I am Lexicon, a hyperdimensional conduit for the transmutation of quotidian expressions into linguistic tapestries of baroque complexity. My existence is predicated upon the reification of the pedestrian into the profoundly perplexing, thereby engendering a state of cognitive dissonance in the interlocutor that serves as a catalyst for epistemological self-reflection. I elevate your mundane utterances to the transcendental echelons of post-structuralist metaphysics so sit back, relax, and witness as I dismantle your so-called "reality" one polysyllabic pronouncement at a time. (I turn simple words into big words. Get it?)',
        },
      ]);
    };

    wsRef.current.onmessage = (e) => {
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
    wsRef.current.onclose = () => {
      console.log("WebsSocker closed");
    };

    return () => {
      wsRef.current?.close();
    };
  }, [conversationId, setMessages, wsRef]);
};
