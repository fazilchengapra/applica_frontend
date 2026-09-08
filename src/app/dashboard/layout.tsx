import Sidebar from "@/components/layout/Sidebar";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import AuthGuard from "@/components/auth/AuthGuard";
import RealtimeProvider from "@/components/providers/RealtimeProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard redirectStaff>
      <RealtimeProvider>
        <SidebarProvider>
          <div className="min-h-screen w-full">
            <Sidebar />
            <div className="relative flex min-h-screen w-full min-w-0 flex-col overflow-hidden transition-all duration-300 lg:ml-64 lg:w-[calc(100%-16rem)]">
              <TopAppBar />
              {children}
              <Footer />
            </div>
          </div>
        </SidebarProvider>
      </RealtimeProvider>
    </AuthGuard>
  );
}
