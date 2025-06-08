"use client";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";

export default function Navbar() {
  const upRedirect = () => {
    redirect("/signup");
  };
  const inRedirect = () => {
    redirect("/signin");
  };
  const goHome = () => {
    redirect("/");
  };

  const UserRound: string =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItcm91bmQtaWNvbiBsdWNpZGUtdXNlci1yb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI1Ii8+PHBhdGggZD0iTTIwIDIxYTggOCAwIDAgMC0xNiAwIi8+PC9zdmc+";

  return (
    <div className="w-screen flex justify-between items-center px-5 py-3 fixed top-0">
      <p onClick={goHome} className="text-3xl">
        Lexicon
      </p>
      <div className="flex">
        <Button onClick={upRedirect} className="mr-2">
          Sign up
        </Button>
        <Button onClick={inRedirect}>Sign in</Button>
        <Avatar>
          <AvatarImage src={UserRound} />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
