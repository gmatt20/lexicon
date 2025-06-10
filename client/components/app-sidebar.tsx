"use client";

import {
  Home,
  Settings,
  SquarePen,
  MessageSquare,
  User2,
  ChevronUp,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchUserInfo } from "@/lib/FetchUser";
import { useState, useEffect } from "react";
import { User } from "@/types/User";
import { FetchConvos } from "@/lib/FetchConvos";
import { NewConvo } from "@/lib/NewConvo";
import Link from "next/link";
import { useRouter } from "next/navigation";


export function AppSidebar() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [convos, setConvos] = useState([]);
  const [userInfo, setUserInfo] = useState<User>({
    id: 0,
    username: "",
    is_guest: true,
  });
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userInfo = await fetchUserInfo();
        setAuthenticated(true);
        setUserInfo({
          id: userInfo.id,
          username: userInfo.username,
          is_guest: true,
        });
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    const loadConvos = async () => {
      try {
        const convos = await FetchConvos();
        setConvos(convos);
      } catch (error) {
        console.error("Error loading conversations:", error);
      }
    };
    loadUser();
    loadConvos();
  }, []);

  const handleNewConvo = async () => {
    try {
      const newConvo = await NewConvo("New Chat");
    } catch (error) {
      console.error("Error making a new conversation:", error);
    }
  };
  const handleHome = async () => {
    router.push("/dashboard")
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Lexicon</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div onClick={handleNewConvo}>
                    <SquarePen />
                    <span>New Chat</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div onClick={handleHome}>
                    <Home />
                    <span>Home</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible defaultOpen className="group/collapsible">
                {/* Trigger: Click this to toggle */}
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <MessageSquare />
                      <span>Chats</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>

                {/* Content: Revealed when open */}
                <CollapsibleContent className="pl-4">
                  <SidebarMenuSub>
                    {convos.map((convo) => (
                      <SidebarMenuSubItem key={convo.id}>
                        <Link href={`/dashboard/${convo.id}`}>
                          {convo.title}
                        </Link>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {userInfo.username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <Settings />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
