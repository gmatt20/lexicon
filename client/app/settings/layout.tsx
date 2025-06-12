import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SettingsSidebar } from "@/components/settings-sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SettingsSidebar />
      <main className="flex-1 flex flex-col relative">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
