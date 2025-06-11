import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuthenticateUser } from "./useAuthenticateUser";
import { ChatMessage } from "@/types/ChatMessage";
import { toast } from "sonner";
import { useLexWebSocket } from "@/lib/hooks/useLexWebSocket";
import { useHandleTextMessage } from "@/lib/hooks/useHandleTextMessage";

export function useMessages() {
  const params = useParams();
  const conversationID = Number(params.conversationId);

  const { user, loading: userLoading } = useAuthenticateUser();

  const ws = useRef<WebSocket | null>(null);

  const latestMessageRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      // Loads authenticated user's messages
      try {
        // Makes a get request to fetch user messages based on conversation
        const response = await fetch(
          `http://localhost:8000/messages/${user?.id}/${conversationID}`,
          {
            method: "GET",
            // Includes the cookies
            credentials: "include",
          }
        );

        // Throws a HTTP error
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        // Parses into JSON
        const data = await response.json();
        // Returns a JSON:
        // list of all messages
        setMessages(data ?? []);
      } catch (error) {
        // Catches a fetch error
        toast("Failed to load messages");
        console.error("Error fetching messages:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [user, userLoading, conversationID]);

  // Set up websocket
  useLexWebSocket({ conversationId: Number(conversationID), setMessages }, ws);
  const handleTextMessage = useHandleTextMessage(ws, setMessages);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView();
  }, [messages]);

  return {
    messages,
    error,
    loading: loading || userLoading,
    handleTextMessage,
    latestMessageRef,
  };
}
