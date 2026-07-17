import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";

export default function DashboardPage() {
  return (
    <main className="flex-grow p-container-padding">
      <div className="max-w-7xl mx-auto">
        <WelcomeHeader />
        <StatsGrid />
        {/* Complex Layout Section */}
      </div>
    </main>
  );
}
