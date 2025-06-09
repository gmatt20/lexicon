"use client";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { authenticateUser } from "@/lib/authenticateUser";
import { toast } from "sonner";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authenticateUser();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        if (pathname == "/chat") {
          router.push("/signin");
        }
      }
    };

    checkAuth();
  }, [pathname]);

  const upRedirect = () => {
    router.push("/signup");
  };
  const inRedirect = () => {
    router.push("/signin");
  };
  const goHome = () => {
    router.push("/");
  };
  const chatRedirect = () => {
    router.push("/chat");
  };
  const signOut = async () => {
    const url = "http://localhost:8000/auth/sign-out/";

    try {
      // Signs out an existing user
      // We need credentials include to include the cookies
      const response = await fetch(url, {
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
        setIsAuthenticated(false);
        router.push("/");
      }
    } catch (error) {
      // Catches any server side errors
      toast("Sign out failed on the server side, please try again later.", {});
      console.error(error);
    }
  };

  const UserRound: string =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItcm91bmQtaWNvbiBsdWNpZGUtdXNlci1yb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI1Ii8+PHBhdGggZD0iTTIwIDIxYTggOCAwIDAgMC0xNiAwIi8+PC9zdmc+";

  return (
    <div className="w-screen flex justify-between items-center px-5 py-3 fixed top-0 bg-white">
      <p onClick={goHome} className="text-3xl">
        Lexicon
      </p>
      <div className="flex">
        {isAuthenticated && (
          <>
            <Button onClick={chatRedirect} className="mr-2">
              Chat
            </Button>
            <Button onClick={signOut} className="mr-2">
              Sign Out
            </Button>
            <Avatar>
              <AvatarImage src={UserRound} />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </>
        )}
        {!isAuthenticated && (
          <>
            <Button onClick={upRedirect} className="mr-2">
              Sign up
            </Button>
            <Button onClick={inRedirect}>Sign in</Button>
          </>
        )}
      </div>
    </div>
  );
}
