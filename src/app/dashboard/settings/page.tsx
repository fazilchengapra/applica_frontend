"use client";

import { useState } from "react";
import SettingItem from "@/components/settings/SettingItem";
import EmailChangeModal from "@/components/settings/EmailChangeModal";
import PhoneChangeModal from "@/components/settings/PhoneChangeModal";
import PhoneVerifyModal from "@/components/settings/PhoneVerifyModal";
import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import { useAppSelector } from "@/store";

export default function SettingsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isPhoneVerifyModalOpen, setIsPhoneVerifyModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingNewPhone, setPendingNewPhone] = useState("");

  const handlePhoneVerifyClick = (newPhone: string) => {
    setPendingNewPhone(newPhone);
    setIsPhoneModalOpen(false);
    setIsPhoneVerifyModalOpen(true);
  };

  return (
    <main className="flex-grow p-[16px] md:p-[24px] flex flex-col gap-[24px] w-full">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="font-display-lg text-[32px] font-[700] text-on-surface tracking-tight mb-8">
          Account & Security
        </h2>

        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-6 shadow-sm mb-8 flex flex-col">
          <SettingItem
            title="Email"
            value={user?.email || "Not provided"}
            buttonText="Update"
            onClick={() => setIsEmailModalOpen(true)}
          />
          <SettingItem
            title="Phone Number"
            value={user?.phone_number || "Not provided"}
            buttonText="Update"
            onClick={() => setIsPhoneModalOpen(true)}
          />
          <SettingItem
            title="Password"
            buttonText="Change"
            onClick={() => setIsPasswordModalOpen(true)}
          />
        </div>

        <div className="flex justify-start pt-4">
          <button className="px-6 py-2.5 bg-transparent text-error hover:bg-error-container hover:text-on-error-container font-title-sm text-title-sm rounded-lg transition-colors cursor-pointer border border-transparent hover:border-error/20">
            Delete Account
          </button>
        </div>
      </div>
      
      {isEmailModalOpen && (
        <EmailChangeModal onClose={() => setIsEmailModalOpen(false)} />
      )}

      {isPhoneModalOpen && (
        <PhoneChangeModal 
          onClose={() => setIsPhoneModalOpen(false)} 
          onVerify={handlePhoneVerifyClick}
        />
      )}

      {isPhoneVerifyModalOpen && (
        <PhoneVerifyModal 
          onClose={() => setIsPhoneVerifyModalOpen(false)} 
          newPhone={pendingNewPhone}
          currentPhone={user?.phone_number || ""}
        />
      )}

      {isPasswordModalOpen && (
        <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />
      )}
    </main>
  );
}
