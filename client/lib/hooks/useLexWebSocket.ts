import { useEffect } from "react";
import { UseLexWebSocketProps } from "@/types/UseLexWebSocket";

export const useLexWebSocket = (
  { conversationId, setMessages }: UseLexWebSocketProps,
  wsRef: React.MutableRefObject<WebSocket | null>,
) => {
  useEffect(() => {
    // Establishes a new WebSocket connection
    // We use useRef to store the WebSocket instance so it persists
    // across component re-renders without triggering re-renders itself.
    // Note: This does NOT persist across page refreshes.
    wsRef.current = new WebSocket(
      `ws://localhost:8000/ws/?conversation_id=${conversationId}`,
    );

    // When Lex sends a message, set it to messages
    wsRef.current.onmessage = (e) => {
      const word = e.data;

      setMessages((prev) => [...prev, { id: 1, conversation_id: 1, user_id: 1, role: "lex", content: word }]);
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
