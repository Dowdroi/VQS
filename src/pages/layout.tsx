import Loader from "@/components/common/Loader";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/layout/Sidebar";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <SidebarProvider>
    <AppSidebar />
    <main className="relative min-h-screen w-full overflow-auto flex flex-col bg-[#fbfbfb]">
      <SidebarTrigger className="absolute" />
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </main>
  </SidebarProvider>
);

export default Layout;
