import { ChatMessage } from "@/types/ChatMessage";

export const useHandleTextMessage = (
  wsRef: React.MutableRefObject<WebSocket | null>,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  return (e: React.FormEvent<HTMLFormElement>) => {
    // Handles the text message sent by the user

    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("messageText") as HTMLInputElement;
    const value = input.value.trim();
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      setMessages((prev) => [...prev, { id: 1, conversation_id: 1, user_id: 1, role: "user", content: value }]);
      wsRef.current.send(value);
    }
    form.reset();
  };
};
