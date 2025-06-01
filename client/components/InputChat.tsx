import { Input } from "@/components/ui/input";

export default function InputChat() {
  return (
    <div className="fixed bottom-0 w-full bg-white p-5">
      <Input type="email" placeholder="Type your message..." />
    </div>
  );
}
