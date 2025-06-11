import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignIn } from "@/types/SignIn";

export function useAuthentication() {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const signIn = (formData: SignIn) => {
    return async (e: React.FormEvent<HTMLFormElement>) => {
      // Prevents the HTML form from refreshing the page
      e.preventDefault();
      try {
        // Posts a sign in for existing user
        // We need credentials include to include the cookies
        const response = await fetch("http://localhost:8000/auth/sign-in/", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        // If sign up fails, throw toast
        if (!response.ok) {
          const error = await response.json();
          toast("Signin failed, please try again later.", {
            action: {
              label: "Go Home",
              onClick: () => router.push("/"),
            },
          });
          console.error("Signin failed: ", error);
        } else {
          // If sign up is successful, redirect user to chat
          toast(`Welcome ${formData.email}!`);
          const result = await response.json();
          console.log("Signin successful", result);
          router.push("/dashboard");
        }
      } catch (error) {
        // Catches any server side errors
        toast("Signin failed on the server side, please try again later.", {
          action: {
            label: "Go Home",
            onClick: () => router.push("/"),
          },
        });
        console.error(error);
      }
    };
  };

  const signOut = useCallback(async () => {
    try {
      // Signs out an existing user
      // We need credentials include to include the cookies
      const response = await fetch("http://localhost:8000/auth/sign-out/", {
        method: "POST",
        credentials: "include",
      });
      // If sign out fails, throw toast
      if (!response.ok) {
        const error = await response.json();
        toast("Sign out failed, please try again later.");
        console.error("Sign out failed: ", error);
      } else {
        // If sign out is successful, redirect user to home
        toast("Successfully signed out");
        const result = await response.json();
        console.log("Sign out successful", result);
        router.push("/");
      }
    } catch (error) {
      // Catches any server side errors
      toast("Sign out failed on the server side, please try again later.", {});
      console.error(error);
    }
  }, []);

  return { user, signIn, signOut, loading, error };
}
