import AuthGuard from "@/components/auth/AuthGuard";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import TopAppBar from "@/components/layout/TopAppBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard staffOnly>
      <SidebarProvider>
        <div className="min-h-screen w-full">
          <AdminSidebar />
          <div className="relative flex min-h-screen w-full min-w-0 flex-col overflow-hidden transition-all duration-300 lg:ml-64 lg:w-[calc(100%-16rem)]">
            <TopAppBar />
            {children}
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}