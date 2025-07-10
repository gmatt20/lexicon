"use client";

import Lexicon from "@/public/lexicon.webp";
import Image from "next/image";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function Landing() {
  const { user } = useAuthentication();

  const handleRedirect = () => {
    if (user) {
      redirect("/dashboard");
    } else {
      redirect("/signup");
    }
  };

  return (
    <div className="w-screen flex items-center justify-center flex-col mt-30">
      <Image
        className="relative flex max-w-[20%] shrink-0 overflow-hidden rounded-full"
        src={Lexicon}
        alt="Lexicon"
      />
      <p className="text-center my-5 font-montserrat font-bold text-5xl">
        Introducing Lexicon!
      </p>
      <p className="my-5 font-montserrat font-bold text-3xl">
        Or Lex for short
      </p>
      {user ? (
        <Button onClick={handleRedirect}>Chat now</Button>
      ) : (
        <Button onClick={handleRedirect}>Chat for free</Button>
      )}
    </div>
  );
}
