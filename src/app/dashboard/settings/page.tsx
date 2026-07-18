"use client";

import { useState } from "react";
import SettingItem from "@/components/settings/SettingItem";
import EmailChangeModal from "@/components/settings/EmailChangeModal";
import PhoneChangeModal from "@/components/settings/PhoneChangeModal";
import PhoneVerifyModal from "@/components/settings/PhoneVerifyModal";
import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import DeleteAccountModal from "@/components/settings/DeleteAccountModal";
import { useAppSelector } from "@/store";

export default function SettingsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isPhoneVerifyModalOpen, setIsPhoneVerifyModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

        <div className="bg-error-container/20 border border-error/20 p-6 rounded-lg shadow-[0_2px_4px_rgba(226,232,240,0.04)] mt-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-error">dangerous</span>
            <h3 className="font-title-lg text-[20px] font-semibold text-on-error-container">Danger Zone</h3>
          </div>
          <p className="text-body-md text-on-error-container mb-8">
            Permanently delete your account and all associated data. This action is irreversible.
          </p>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="py-3 px-8 border-2 border-error text-error rounded-lg font-medium text-[14px] hover:bg-error hover:text-white transition-all"
          >
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

      {isDeleteModalOpen && (
        <DeleteAccountModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </main>
  );
}
