export type ChatMessage = {
  id: number;
  conversationId: number;
  userId: number;
  role: string;
  content: string;
};
