import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthentication } from "./useAuthentication";
import { ChatMessage } from "@/types/ChatMessage";
import { useLexWebSocket } from "@/lib/hooks/useLexWebSocket";
import { useHandleTextMessage } from "@/lib/hooks/useHandleTextMessage";

export function useMessages() {
  const params = useParams();
  const conversationID = Number(params.conversationId);

  const { user, loading: userLoading } = useAuthentication();

  const ws = useRef<WebSocket | null>(null);

  const latestMessageRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      // Loads authenticated user's messages
      // Makes a get request to fetch user messages based on conversation
      const response = await fetch(
        `http://localhost:8000/messages/${conversationID}`,
        {
          method: "GET",
          // Includes the cookies
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data ?? []);
      } else {
        // Handles expected "empty" responses silently
        setMessages([]);
        if (response.status !== 404) {
          console.error("Unexpected error fetching messages:", response.status);
          setError(new Error(`Unexpected HTTP Error: ${response.status}`));
        }
      }
      setLoading(false);
    };
    if(!userLoading) {
      fetchMessages();
    }
  }, [user, userLoading, conversationID]);

  const deleteMessageById = useCallback(async (messageID: number, conversationId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/messages/${conversationId}/${messageID}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete message");
      
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageID)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
      setError(error as Error);
    }
  }, []);

  // Set up websocket
  useLexWebSocket({ conversationId: Number(conversationID), setMessages }, ws);
  const handleTextMessage = useHandleTextMessage(ws, setMessages);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView();
  }, [messages]);

  return {
    messages,
    deleteMessageById,
    error,
    loading: loading || userLoading,
    handleTextMessage,
    latestMessageRef,
  };
}
