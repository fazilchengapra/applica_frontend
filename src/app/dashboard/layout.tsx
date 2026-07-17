import Sidebar from "@/components/layout/Sidebar";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import { SidebarProvider } from "@/components/layout/SidebarProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar />
      <div className="ml-0 lg:ml-64 flex flex-col min-h-screen relative transition-all duration-300">
        <TopAppBar />
        {children}
        <Footer />
      </div>
    </SidebarProvider>
  );
}
