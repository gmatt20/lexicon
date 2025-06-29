import { SidebarMenuSubItem } from "@/components/ui/sidebar";
import { useConversations } from "@/hooks/useConversations";
import Link from "next/link";
import { Spinner } from "@heroui/spinner";
import ChatOptions from "./ChatOptions";

const Chats = () => {
  const { convos, loading } = useConversations();

  return loading ? (
    <Spinner />
  ) : (
    convos.map((convo, i) => (
      <SidebarMenuSubItem className="flex justify-between" key={i}>
        <Link href={`/dashboard/${convo.id}`}>{convo.title}</Link>
        <ChatOptions convo={convo} />
      </SidebarMenuSubItem>
    ))
  );
};

export default Chats;
