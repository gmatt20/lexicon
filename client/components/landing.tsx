"use client";

import Lexicon from "@/public/lexicon.webp";
import Image from "next/image";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export default function Landing() {
  const handleRedirect = () => {
    redirect("/signup");
  };

  return (
    <div className="w-screen flex items-center justify-center flex-col">
      <Image
        className="relative flex size-[30%] shrink-0 overflow-hidden rounded-3xl"
        src={Lexicon}
        alt="Lexicon"
      />
      <p>introducing lex!</p>
      <Button onClick={handleRedirect}>Chat for free</Button>
    </div>
  );
}
