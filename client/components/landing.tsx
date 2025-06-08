import Lexicon from "@/public/lexicon.webp";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Landing() {
  return (
    <div className="w-screen flex items-center justify-center flex-col">
      <Image
        className="relative flex size-[30%] shrink-0 overflow-hidden rounded-3xl"
        src={Lexicon}
        alt="Lexicon"
      />
      <p>introducing lex!</p>
      <Button>Chat for free</Button>
    </div>
  );
}
