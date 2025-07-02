"use client";

import { Button } from "../ui/button";
import { useConversations } from "@/hooks/useConversations";

const Landing = () => {
  const { newConvo } = useConversations();

  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-5">
      <p className="font-bold text-4xl font-montserrat">Welcome to Lexicon</p>
      <Button onClick={newConvo}>Start a New Chat</Button>
    </div>
  );
};

export default Landing;
