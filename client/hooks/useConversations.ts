import { useEffect, useState, useCallback } from "react";
import { Conversation } from "@/types/Conversation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useConversations() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const newConvo = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/conversation/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Chat",
        }),
      });
      if (!response) throw new Error("Not Authenticated");
      const data = await response.json();
      fetchConvos();
      router.push(`/dashboard/${data.id}`);
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
      router.push("/dashboard");
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

  return { convos, loading, error, fetchConvos, newConvo, deleteConvos };
}
