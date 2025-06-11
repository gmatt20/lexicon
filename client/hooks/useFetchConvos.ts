import { useEffect, useState } from "react";
import { Conversation } from "@/types/Conversation";

export function useFetchConvos() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConvos = async () => {
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
    };
    fetchConvos();
  }, []);

  return { convos, error, loading };
}
