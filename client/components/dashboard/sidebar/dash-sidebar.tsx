"use client";

import { Home, SquarePen } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useConversations } from "@/hooks/useConversations";
import { useRouter } from "next/navigation";
import ChatsList from "../chats-sidebar/ChatsList";
import SidebarItem from "./SidebarItem";
import SidebarDashFooter from "./SidebarDashFooter";

export function DashSidebar() {
  const router = useRouter();

  const { newConvo } = useConversations();

  const handleHome = async () => {
    router.push("/dashboard");
  };

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Lexicon</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarItem
                title="New Convo"
                onClick={newConvo}
                icon={SquarePen}
              />
              <SidebarItem title="Home" onClick={handleHome} icon={Home} />
              <ChatsList />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarDashFooter />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
