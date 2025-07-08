import { SidebarMenuSubItem } from "@/components/ui/sidebar";
import { useConversations } from "@/hooks/useConversations";
import Link from "next/link";
import { Spinner } from "@heroui/spinner";
import ChatOptions from "./ChatOptions";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Chats = () => {
  const { convos, loading } = useConversations();
  const pathname = usePathname();

  return loading ? (
    <Spinner />
  ) : (
    convos.map((convo) => {
      const isActive = pathname === `/dashboard/${convo.id}`;
      return (
        <SidebarMenuSubItem
          key={convo.id}
          className={cn(
            "flex justify-between items-center p-2 rounded-md transition-colors",
            isActive && "bg-muted"
          )}>
          <Link href={`/dashboard/${convo.id}`}>{convo.title}</Link>
          <ChatOptions convo={convo} />
        </SidebarMenuSubItem>
      );
    })
  );
};

export default Chats;
