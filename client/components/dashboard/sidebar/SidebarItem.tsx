import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

type SideBarItemProps = {
  title: string;
  onClick?: () => void;
  icon: React.ElementType;
};

const SidebarItem = ({ title, onClick, icon: Icon }: SideBarItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div onClick={onClick}>
          <Icon />
          <span>{title}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarItem;
