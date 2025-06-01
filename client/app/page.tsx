import { Input } from "@/components/ui/input";
import ChatBubble from "@/components/ChatBubble";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <div className="p-5 pb-32">
        {[...Array(20)].map((_, i) => (
          <ChatBubble key={i} />
        ))}
      </div>
      <div className="fixed bottom-0 w-full bg-white p-5">
        <Input type="email" placeholder="Type your message..." />
      </div>
    </div>
  );
}
