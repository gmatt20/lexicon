import { ChatMessage } from "@/types/ChatMessage";

export type UseLexWebSocketProps = {
  conversationId: number;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};
