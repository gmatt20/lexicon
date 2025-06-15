import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Lexicon from "@/public/lexicon.webp";
import { ChatMessage } from "@/types/ChatMessage";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type Props = {
  msg: ChatMessage;
};

export default function ChatBubble({ msg }: Props) {
  const UserRound: string =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItcm91bmQtaWNvbiBsdWNpZGUtdXNlci1yb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI1Ii8+PHBhdGggZD0iTTIwIDIxYTggOCAwIDAgMC0xNiAwIi8+PC9zdmc+";

  return (
    <div className="flex flex-col justify-between">
      {msg.role === "user" ? (
        <div className="flex justify-end items-end my-5">
          <Card
            className="bg-primary-foreground text-black max-w-[60%] inline">
            <CardContent>
              <ContextMenu>
                <ContextMenuTrigger>
                  <p className="leading-6 text-sm">{msg.content}</p>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Edit</ContextMenuItem>
                  <ContextMenuItem>Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
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
          <Card className="bg-primary text-white max-w-[60%]">
            <CardContent>
              <p className="leading-6 text-sm">{msg.content}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
