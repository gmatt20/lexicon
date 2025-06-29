"use client";

import {
  Home,
  SquarePen,
  MessageSquare,
  User2,
  ChevronUp,
  ChevronRight,
  Ellipsis,
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
import { useAuthentication } from "@/hooks/useAuthentication";
import { useConversations } from "@/hooks/useConversations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DashSidebar() {
  const router = useRouter();
  const { user, signOut } = useAuthentication();
  const {
    convos,
    loading,
    newConvo,
    renameConvoById,
    deleteConvoById,
    deleteConvos,
  } = useConversations();

  const handleHome = async () => {
    router.push("/dashboard");
  };
  const handleSettings = () => {
    router.push("/settings");
  };
  const FormAction = async (
    e: React.FormEvent<HTMLFormElement>,
    convoId: number,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData);
    const name = formData.get("name") as string;
    console.log(name);
    renameConvoById(convoId, name);
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
                  <div onClick={newConvo}>
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
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <MessageSquare />
                      <span>Chats</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent className="pl-4">
                  <SidebarMenuSub>
                    {loading ? (
                      <Spinner />
                    ) : (
                      convos.map((convo, i) => (
                        <SidebarMenuSubItem
                          className="flex justify-between"
                          key={i}
                        >
                          <Link href={`/dashboard/${convo.id}`}>
                            {convo.title}
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Ellipsis
                                className="text-zinc-600 cursor-pointer"
                                size={20}
                              />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <span className="hover:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none">
                                    Rename Chat
                                  </span>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Rename current chat
                                    </DialogTitle>
                                  </DialogHeader>
                                  <form
                                    onSubmit={(e) => FormAction(e, convo.id)}
                                  >
                                    <div className="grid gap-4">
                                      <div className="grid gap-3">
                                        <Label htmlFor="name">
                                          New chat name
                                        </Label>
                                        <Input
                                          id="name"
                                          name="name"
                                          defaultValue={convo.title}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter className="mt-5">
                                      <DialogClose asChild>
                                        <Button variant="outline">
                                          Cancel
                                        </Button>
                                      </DialogClose>
                                      <DialogClose asChild>
                                        <Button type="submit">
                                          Save changes
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </form>
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <span className="hover:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none">
                                    Delete Chat
                                  </span>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete this chat?</DialogTitle>
                                    <DialogDescription>
                                      This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button
                                        variant="destructive"
                                        onClick={() =>
                                          deleteConvoById(convo.id)
                                        }
                                      >
                                        Delete
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </SidebarMenuSubItem>
                      ))
                    )}
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
                className="w-[--radix-popper-anchor-width]"
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="hover:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none">
                      Delete all conversations
                    </span>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete all conversations?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button variant="destructive" onClick={deleteConvos}>
                          Delete
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <DropdownMenuItem onClick={handleSettings}>
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
