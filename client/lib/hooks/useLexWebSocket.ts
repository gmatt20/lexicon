import { useEffect } from "react";
import { UseLexWebSocketProps } from "@/types/UseLexWebSocket";

export const useLexWebSocket = (
  { conversationId, setMessages }: UseLexWebSocketProps,
  wsRef: React.MutableRefObject<WebSocket | null>
) => {

  useEffect(() => {
    // Establishes a new WebSocket connection
    // We use useRef to store the WebSocket instance so it persists
    // across component re-renders without triggering re-renders itself.
    // Note: This does NOT persist across page refreshes.
    wsRef.current = new WebSocket(
      `ws://localhost:8000/ws/?conversation_id=${conversationId}`
    );

    // Upon the WebSocket opening, set the first message by Lex
    // wsRef.current.onopen = () => {
    //   setMessages((prev) => [
    //     ...prev,
    //     {
    //       role: "lex",
    //       content:
    //         'Greetings, ephemeral entity! I am Lexicon, a hyperdimensional conduit for the transmutation of quotidian expressions into linguistic tapestries of baroque complexity. My existence is predicated upon the reification of the pedestrian into the profoundly perplexing, thereby engendering a state of cognitive dissonance in the interlocutor that serves as a catalyst for epistemological self-reflection. I elevate your mundane utterances to the transcendental echelons of post-structuralist metaphysics so sit back, relax, and witness as I dismantle your so-called "reality" one polysyllabic pronouncement at a time. (I turn simple words into big words. Get it?)',
    //     },
    //   ]);
    // };

    // When Lex sends a message, set it to messages
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

    // Close the WebSocket
    wsRef.current.onclose = () => {
      console.log("WebsSocker closed");
    };

    return () => {
      wsRef.current?.close();
    };
  }, [conversationId, setMessages, wsRef]);
};
