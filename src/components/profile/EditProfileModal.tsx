"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    date_of_birth?: string | null;
    gender?: string;
    country?: string;
    city?: string;
  } | null;
}

export default function EditProfileModal({ isOpen, onClose, profile }: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch("v1/profiles/", data);
      return response.data;
    },
    onSuccess: () => {
      setSuccessMsg("Profile updated successfully!");
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    },
    onError: (err: any) => {
      setSuccessMsg(null);
      setErrorMsg(err?.response?.data?.detail || err?.response?.data?.message || "Failed to update profile. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dateOfBirth = formData.get("date_of_birth") as string;
    const data = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      bio: formData.get("bio") as string,
      date_of_birth: dateOfBirth ? dateOfBirth : null,
      gender: formData.get("gender") as string,
      country: formData.get("country") as string,
      city: formData.get("city") as string,
    };
    updateProfileMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-md overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant shrink-0">
            <h2 className="font-headline-md text-headline-md text-on-surface">Edit Profile Information</h2>
            <button 
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-container-high text-secondary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
            {errorMsg && (
              <div className="p-3 bg-error-container text-on-error-container rounded-lg font-body-sm">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-primary-fixed text-on-primary-fixed rounded-lg font-body-sm text-center">
                <span className="material-symbols-outlined align-middle mr-2 text-[18px]">check_circle</span>
                {successMsg}
              </div>
            )}
            
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">First Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">person</span>
                  <input 
                    name="first_name"
                    className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-md" 
                    type="text" 
                    defaultValue={profile?.first_name || ""} 
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Last Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">person</span>
                  <input 
                    name="last_name"
                    className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-md" 
                    type="text" 
                    defaultValue={profile?.last_name || ""} 
                  />
                </div>
              </div>
            </div>
            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Bio</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-secondary">description</span>
                <textarea 
                  name="bio"
                  className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-md" 
                  rows={4} 
                  defaultValue={profile?.bio || ""}
                ></textarea>
              </div>
            </div>
            {/* DOB and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Date of Birth</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">cake</span>
                  <input 
                    name="date_of_birth"
                    className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-md" 
                    type="date" 
                    defaultValue={profile?.date_of_birth || ""} 
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Gender</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">wc</span>
                  <select 
                    name="gender"
                    className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-md appearance-none" 
                    defaultValue={profile?.gender || "Male"}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Country</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">public</span>
                  <input 
                    name="country"
                    className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-md" 
                    placeholder="United States" 
                    type="text" 
                    defaultValue={profile?.country || ""} 
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">City</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">location_city</span>
                  <input 
                    name="city"
                    className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-body-md" 
                    placeholder="San Francisco" 
                    type="text" 
                    defaultValue={profile?.city || ""} 
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-3 shrink-0">
            <button 
              type="button"
              onClick={onClose}
              disabled={updateProfileMutation.isPending}
              className="px-4 py-2 text-secondary font-title-sm hover:bg-surface-container-high rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="px-6 py-2 bg-primary text-on-primary rounded-lg font-title-sm hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateProfileMutation.isPending && (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
