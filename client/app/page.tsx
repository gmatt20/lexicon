import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";


export default function Home() {
  return (
    <div className="h-screen w-screen">
      <div className="p-5">
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
      </div>
      <div className="fixed bottom-20 w-full">
        <Input type="email" placeholder="Type your message..." />
      </div>
    </div>
  );
}
