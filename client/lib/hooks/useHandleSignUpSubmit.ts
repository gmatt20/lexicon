import { SignUp } from "@/types/SignUp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useHandleSignUpSubmit = (formData: SignUp) => {
  // Used to redirect users after sign up
  const router = useRouter();

  return async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevents the HTML form from refreshing the page
    e.preventDefault();
    // API Endpoint
    const url = "http://localhost:8000/auth/sign-up/";

    try {
      // Posts a new user
      // We need credentials include to include the cookies
      const response = await fetch(url, {
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
        toast("Signup failed, please try again later.", {
          action: {
            label: "Go Home",
            onClick: () => router.push("/"),
          },
        });
        console.error("Signup failed: ", error);
      } else {
        // If sign up is successful, redirect user to chat
        toast(`Welcome ${formData.username}!`);
        const result = await response.json();
        console.log("Signup successful", result);
        router.push("/dashboard");
      }
    } catch (error) {
      // Catches any server side errors
      toast("Signup failed on the server side, please try again later.", {
        action: {
          label: "Go Home",
          onClick: () => router.push("/"),
        },
      });
      console.error(error);
    }
  };
};
