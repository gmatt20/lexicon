"use client";

import {
  Home,
  Settings,
  SquarePen,
  MessageSquare,
  User2,
  ChevronUp,
  ChevronRight,
  OctagonX,
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
import { toast } from "sonner";
import { Conversation } from "@/types/Conversation";

export function AppSidebar() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [convo, setConvo] = useState<Conversation>({
    conversation_id: 0,
    conversation_title: "",
  });
  const [allConvos, setConvos] = useState<Conversation[]>([]);
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
        const trimmedConvos = convos.map((convo: any) => ({
          conversation_id: convo.id,
          conversation_title: convo.title
        }));
        setConvos(trimmedConvos);
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
      console.log(newConvo);
      setConvo({
        conversation_id: newConvo.conversation_id,
        conversation_title: newConvo.conversation_title,
      });
      console.log(convo);
      setConvos((prevConvos) => [...prevConvos, newConvo]);
      router.push(`/dashboard/${newConvo.conversation_id}`);
    } catch (error) {
      console.error("Error making a new conversation:", error);
    }
  };
  const handleHome = async () => {
    router.push("/dashboard");
  };

  const signOut = async () => {
    const url = "http://localhost:8000/auth/sign-out/";

    try {
      // Signs out an existing user
      // We need credentials include to include the cookies
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      // If sign out fails, throw toast
      if (!response.ok) {
        const error = await response.json();
        toast("Sign out failed, please try again later.");
        console.error("Sign out failed: ", error);
      } else {
        // If sign out is successful, redirect user to home
        toast("Successfully signed out");
        const result = await response.json();
        console.log("Sign out successful", result);
        setAuthenticated(false);
        router.push("/");
      }
    } catch (error) {
      // Catches any server side errors
      toast("Sign out failed on the server side, please try again later.", {});
      console.error(error);
    }
  };

  const deleteAllConvos = async () => {
    const url = "http://localhost:8000/conversations/";

    try {
      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        toast("Error deleting all conversations, try again later");
        console.error("Error deleting all conversations: ", error);
      } else {
        toast("Successfully deleted all conversations");
        const result = await response.json();
        console.log("Successfully deleting all conversations", result);
        setConvos([]);
        setConvo({ conversation_id: 0, conversation_title: "" });
      }
    } catch (error) {
      // Catches any server side errors
      toast(
        "Error deleting all conversations on the server side, try again later.",
        {}
      );
      console.error(error);
    }
  };

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
                    {allConvos.map((convo, i) => (
                      <SidebarMenuSubItem key={i}>
                        <Link href={`/dashboard/${convo.conversation_id}`}>
                          {convo.conversation_title}
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
                  <User2 /> {authenticated && userInfo.username}
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
                <DropdownMenuItem onClick={deleteAllConvos}>
                  <OctagonX />
                  <span>Delete all conversations</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
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
