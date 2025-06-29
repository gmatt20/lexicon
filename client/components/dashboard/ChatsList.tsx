import { MessageSquare, ChevronRight, Ellipsis } from "lucide-react";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConversations } from "@/hooks/useConversations";
import Link from "next/link";
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

const ChatsList = () => {
  const { convos, loading, renameConvoById, deleteConvoById } =
    useConversations();
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
              <SidebarMenuSubItem className="flex justify-between" key={i}>
                <Link href={`/dashboard/${convo.id}`}>{convo.title}</Link>
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
                          <DialogTitle>Rename current chat</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => FormAction(e, convo.id)}>
                          <div className="grid gap-4">
                            <div className="grid gap-3">
                              <Label htmlFor="name">New chat name</Label>
                              <Input
                                id="name"
                                name="name"
                                defaultValue={convo.title}
                              />
                            </div>
                          </div>
                          <DialogFooter className="mt-5">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button type="submit">Save changes</Button>
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
                              onClick={() => deleteConvoById(convo.id)}
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
  );
};

export default ChatsList;
