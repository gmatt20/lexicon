import { useEffect, useState } from "react";
import { User } from "@/types/User";

export function useAuthenticateUser() {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/auth/me/", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Not authenticated");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading, error };
}
