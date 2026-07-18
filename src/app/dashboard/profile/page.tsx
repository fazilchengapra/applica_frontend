"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/lib/axios";
import ProfileSummary from "@/components/profile/ProfileSummary";
import ProfileIntro from "@/components/profile/ProfileIntro";
import ProfileAbout from "@/components/profile/ProfileAbout";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useAppSelector } from "@/store";

interface UserProfileResponse {
  first_name: string;
  last_name: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  date_of_birth: string | null;
  gender: string;
  country: string;
  city: string;
  timezone: string;
  locale: string;
  email: string;
  phone_number: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
}

export default function ProfilePage() {
  const user = useAppSelector(state => state.auth.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: profile, isLoading, isError } = useQuery<UserProfileResponse>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("v1/profiles/me/");
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[40px] text-primary animate-spin">progress_activity</span>
          <p className="text-on-surface-variant font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[400px]">
        <div className="bg-error-container text-on-error-container px-6 py-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Error Loading Profile</h3>
          <p>Could not fetch your profile details. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow p-[16px] md:p-[24px] flex flex-col gap-[24px] w-full">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-[24px]">
        <div className="flex justify-between items-center w-full">
          <h2 className="font-display-lg text-[32px] font-[700] text-on-surface tracking-tight">My Profile</h2>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-[14px] font-[600] hover:bg-primary-container hover:shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
          <ProfileSummary 
            firstName={profile.first_name}
            lastName={profile.last_name}
            displayName={profile.display_name}
            avatarUrl={profile.avatar_url}
            dateOfBirth={profile.date_of_birth}
          />
          <ProfileIntro 
            email={profile.email}
            phoneNumber={profile.phone_number}
            isEmailVerified={profile.is_email_verified}
            isPhoneVerified={profile.is_phone_verified}
            dateJoined={user?.date_joined || null}
          />
        </div>
        <ProfileAbout bio={profile.bio} />
      </div>
      
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
      />
    </main>
  );
}
