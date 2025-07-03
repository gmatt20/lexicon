"use client";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function Navbar() {
  const { user, signOut, loading } = useAuthentication();

  const router = useRouter();

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
    router.push("/dashboard");
  };

  const UserRound: string =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItcm91bmQtaWNvbiBsdWNpZGUtdXNlci1yb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI1Ii8+PHBhdGggZD0iTTIwIDIxYTggOCAwIDAgMC0xNiAwIi8+PC9zdmc+";

  return (
    <div className="z-10 w-screen flex justify-between items-center px-5 py-3 fixed top-0">
      <p
        onClick={goHome}
        className="text-3xl cursor-pointer transition ease hover:drop-shadow-[0px_0px_18px_rgba(255,255,255,0.8)]">
        Lexicon
      </p>
      <div className="flex">
        {!loading && user && (
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
        {!user && (
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
