import { useEffect, useState, useCallback } from "react";
import { Conversation } from "@/types/Conversation";
import { toast } from "sonner";

export function useConversations() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConvos = useCallback(async () => {
    setLoading(true);
    try {
      // Makes a get request to fetch user conversations
      const response = await fetch("http://localhost:8000/conversations/", {
        method: "GET",
        // Includes the cookies
        credentials: "include",
      });
      // Throws a HTTP error
      if (!response.ok) throw new Error("Not authenticated");
      // Parses into JSON
      // Returns a list of all conversations by user
      const data = await response.json();
      setConvos(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteConvos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/conversations/", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Not authenticated");
      toast("Successfully deleted all conversations");
      const result = await response.json();
      console.log("Successfully deleting all conversations", result);
      setConvos([]);
    } catch (error) {
      toast(
        "Error deleting all conversations on the server side, try again later."
      );
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConvos();
  }, [fetchConvos]);

  return { convos, loading, error, fetchConvos, deleteConvos };
}
