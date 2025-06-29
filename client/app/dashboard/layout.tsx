import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashSidebar } from "@/components/dashboard/dash-sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashSidebar />
      <main className="flex-1 flex flex-col relative">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
