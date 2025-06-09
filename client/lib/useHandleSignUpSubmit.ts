import { SignUp } from "@/types/SignUp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export const useHandleSignUpSubmit = (formData: SignUp) => {
  const router = useRouter();

  return async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = "http://localhost:8000/auth/sign-up/";
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
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
        toast(`Welcome ${formData.username}!`);
        const result = await response.json();
        console.log("Signup successful", result);
        router.push("/chat");
      }
    } catch (error) {
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
