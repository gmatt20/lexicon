import { Card, CardContent } from "@/components/ui/card";

export default function ChatBubble() {
  return (
    <div className="flex flex-col justify-between mx-10">
      <div className="flex justify-start my-5">
        <Card className="bg-primary text-white w-fit">
          <CardContent>
            <p>Hello there, I am Lex</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end my-5">
        <Card className="bg-primary-foreground text-black w-fit">
          <CardContent>
            <p>Hello Lex, I am Matthew!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
