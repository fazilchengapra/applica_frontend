import ProfileSummary from "@/components/profile/ProfileSummary";
import ProfileIntro from "@/components/profile/ProfileIntro";
import ProfileAbout from "@/components/profile/ProfileAbout";

export default function ProfilePage() {
  return (
    <main className="flex-grow p-container-padding flex flex-col gap-stack-gap w-full">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-stack-gap">
        <div className="flex justify-between items-center w-full">
          <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight">My Profile</h2>
          <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-title-sm text-title-sm hover:bg-on-primary-fixed-variant transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit Profile
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter">
          <ProfileSummary />
          <ProfileIntro />
        </div>
        <ProfileAbout />
      </div>
    </main>
  );
}
