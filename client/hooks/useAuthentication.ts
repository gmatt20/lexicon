"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignIn } from "@/types/SignIn";
import { SignUp } from "@/types/SignUp";
import { UpdateAccount } from "@/types/UpdateAccount";

export function useAuthentication() {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<Error | "">("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/auth/me/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Not authenticated");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setUser(undefined);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const signUp = (formData: SignUp) => {
    return async (e: React.FormEvent<HTMLFormElement>) => {
      // Prevents the HTML form from refreshing the page
      e.preventDefault();
      try {
        // Posts a new user
        // We need credentials include to include the cookies
        const response = await fetch("http://localhost:8000/auth/sign-up/", {
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
        headers: {
          "Content-Type": "application/json",
        },
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
  }, [router]);

  const deleteAccount = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/auth/delete-account/",
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) {
        const error = await response.json();
        toast("Deleting account failed, please try again later.");
        console.error("Deleting account failed: ", error);
      } else {
        signOut();
        toast("Successfully deleted account");
        const result = await response.json();
        console.log("Account delete successful", result);
      }
    } catch (error) {
      toast(
        "Deleting account failed on the server side, please try again later.",
        {},
      );
      console.error(error);
    }
  }, [signOut]);

  const updateAccount = async (formData: UpdateAccount) => {
    console.log(formData);
    try {
      const response = await fetch("http://localhost:8000/auth/update-me/", {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        toast("Email is already in use");
        console.error("Updating account failed: ", error);
        setError(error.detail);
      } else {
        const result = await response.json();
        toast(`Successfully update account. 
                 username: ${result.username}
                 email: ${result.email}`);
        console.log("Update successful", result);
      }
    } catch (error) {
      toast(
        "Updating account failed on the server side, please try again later.",
      );
      console.error(error);
    }
  };

  return {
    user,
    signIn,
    signUp,
    signOut,
    deleteAccount,
    updateAccount,
    loading,
    error,
  };
}
