import { Card, CardContent } from "@/components/ui/card";

export default function ChatBubble() {
  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-start">
        <Card className="bg-primary text-white w-fit">
          <CardContent>
            <p>Hello there, I am Lex</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Card className="bg-primary-foreground text-black w-fit">
          <CardContent>
            <p>Hello Lex, I am Matthew!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
