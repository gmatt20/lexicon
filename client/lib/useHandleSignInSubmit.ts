import { SignIn } from "@/types/SignIn";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useHandleSignInSubmit = (formData: SignIn) => {
  const router = useRouter();

  return async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = "http://localhost:8000/auth/sign-in/";

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
        toast("Signin failed, please try again later.", {
          action: {
            label: "Go Home",
            onClick: () => router.push("/"),
          },
        });
        console.error("Signin failed: ", error);
      } else {
        toast(`Welcome ${formData.email}!`);
        const result = await response.json();
        console.log("Signin successful", result);
        router.push("/chat");
      }
    } catch (error) {
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
