"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/lib/axios";
import ProfileSummary from "@/components/profile/ProfileSummary";
import ProfileIntro from "@/components/profile/ProfileIntro";
import ProfileAbout from "@/components/profile/ProfileAbout";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useAppSelector } from "@/store";
import { AlertCircle, Edit3, LoaderCircle, UserRound } from "lucide-react";

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
      <div className="flex min-h-[480px] flex-grow items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-[14px] font-semibold text-on-surface-variant">Loading your profile</p>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[480px] flex-grow items-center justify-center p-6">
        <div className="flex max-w-md flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-8 py-7 text-center text-red-800">
          <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
          <h3 className="text-lg font-semibold">Unable to load profile</h3>
          <p className="mt-1 text-[14px] leading-6">Could not fetch your profile details. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full flex-grow bg-surface-container-low p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Account</p>
              <h2 className="mt-1 text-[30px] font-[600] leading-9 tracking-tight text-on-surface">My profile</h2>
              <p className="mt-1 text-[14px] leading-6 text-on-surface-variant">Keep your personal details current and ready for every application.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-[14px] font-[600] text-on-primary shadow-sm transition-all hover:bg-primary-container hover:shadow-md sm:self-auto"
          >
            <Edit3 className="h-[18px] w-[18px]" />
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
