import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSignOut() {
  const router = useRouter();

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

  return signOut;
}
