import ChatBubble from "@/components/ChatBubble";
import InputChat from "@/components/InputChat";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <div className="pb-32">
        {[...Array(20)].map((_, i) => (
          <ChatBubble key={i} />
        ))}
      </div>
      <InputChat />
    </div>
  );
}
