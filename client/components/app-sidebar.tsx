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
import { useAuthenticateUser } from "@/hooks/useAuthenticateUser";
import { useFetchConvos } from "@/hooks/useFetchConvos";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSignOut } from "@/hooks/useSignOut";

export function AppSidebar() {
  const router = useRouter();
  const { user } = useAuthenticateUser();
  const { convos } = useFetchConvos();
  const signOut = useSignOut();

  // const handleNewConvo = async () => {
  //   try {
  //     const newConvo = await NewConvo("New Chat");
  //     console.log(newConvo);
  //     setConvo({
  //       conversation_id: newConvo.conversation_id,
  //       conversation_title: newConvo.conversation_title,
  //     });
  //     console.log(convo);
  //     setConvos((prevConvos) => [...prevConvos, newConvo]);
  //     router.push(`/dashboard/${newConvo.conversation_id}`);
  //   } catch (error) {
  //     console.error("Error making a new conversation:", error);
  //   }
  // };
  const handleHome = async () => {
    router.push("/dashboard");
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
                  <div>
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
                    {convos.map((convo, i) => (
                      <SidebarMenuSubItem key={i}>
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
                  <User2 /> {user && user.username}
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
                <DropdownMenuItem onClick={() => signOut()}>
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
