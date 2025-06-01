import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Lexicon from "@/public/lexicon.webp";

export default function ChatBubble({ msg }) {
  const UserRound: string =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItcm91bmQtaWNvbiBsdWNpZGUtdXNlci1yb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI1Ii8+PHBhdGggZD0iTTIwIDIxYTggOCAwIDAgMC0xNiAwIi8+PC9zdmc+";

  return (
    <div className="flex flex-col justify-between mx-10">
      {msg.role === "user" ? (
        <div className="flex justify-end items-end my-5">
          <Card className="bg-primary-foreground text-black w-fit">
            <CardContent>
              <p>{msg.content}</p>
            </CardContent>
          </Card>
          <Avatar>
            <AvatarImage src={UserRound} />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div className="flex justify-start items-end my-1">
          <Avatar>
            <AvatarImage src={Lexicon.src} />
            <AvatarFallback>LX</AvatarFallback>
          </Avatar>
          <Card className="bg-primary text-white w-fit">
            <CardContent>
              <p>{msg.content}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
