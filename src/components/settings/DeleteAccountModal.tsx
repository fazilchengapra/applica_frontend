"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (password: string) => void;
}

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const deleteAccountMutation = useMutation({
    mutationFn: async (password: string) => {
      // Axios requires the body of a DELETE request to be in the "data" config property
      const response = await api.delete("v1/users/me/", {
        data: { password }
      });
      return response.data;
    },
    onSuccess: () => {
      setSuccessMsg("Account deleted successfully.");
      setErrorMsg(null);
      // Optional: Call parent onConfirm
      if (onConfirm) onConfirm(password);
      
      // Redirect to login or home after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    },
    onError: (err: any) => {
      setSuccessMsg(null);
      setErrorMsg(err?.response?.data?.detail || err?.response?.data?.message || "Failed to delete account.");
    }
  });

  if (!isOpen) return null;

  const handleConfirm = () => {
    deleteAccountMutation.mutate(password);
  };

  const handleClose = () => {
    setPassword("");
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
      {/* Modal Content Container */}
      <div className="bg-surface-container-lowest w-full max-w-[420px] rounded-xl shadow-sm overflow-hidden border border-outline-variant flex flex-col">
        <div className="p-6 flex flex-col gap-4">
          {/* Modal Header */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
            </div>
            <h2 className="font-headline-lg-mobile text-[24px] font-semibold text-on-surface">Delete Account</h2>
          </div>
        
          {/* Modal Body */}
          <div className="space-y-4 mb-6">
            <p className="font-body-md text-[16px] text-on-surface-variant leading-relaxed">
              Are you sure you want to delete your account? This action is permanent and cannot be undone. 
            </p>
            <div className="p-4 bg-surface-container-low rounded-lg border-l-4 border-error">
              <p className="text-[14px] font-medium text-error">
                All your data, including job applications and profile information, will be wiped from our servers.
              </p>
            </div>
            
            {errorMsg && (
              <div className="p-3 bg-error-container text-on-error-container rounded-lg font-body-sm text-[14px]">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-primary-fixed text-on-primary-fixed rounded-lg font-body-sm text-[14px] text-center">
                <span className="material-symbols-outlined align-middle mr-2 text-[18px]">check_circle</span>
                {successMsg}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <label className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">lock</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={deleteAccountMutation.isPending || !!successMsg}
                  className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-outline-variant rounded-lg focus:ring-1 focus:ring-error focus:border-error font-body-md outline-none transition-shadow disabled:opacity-50" 
                />
              </div>
            </div>
          </div>
        
          {/* Modal Actions */}
          <div className="flex flex-col sm:flex-row-reverse gap-4 mt-2">
            <button 
              onClick={handleConfirm}
              disabled={!password || deleteAccountMutation.isPending || !!successMsg}
              className="flex-1 py-3 px-6 bg-error text-on-error rounded-lg font-medium text-[14px] hover:bg-error/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleteAccountMutation.isPending && (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              )}
              Delete My Account
            </button>
            <button 
              onClick={handleClose}
              disabled={deleteAccountMutation.isPending || !!successMsg}
              className="flex-1 py-3 px-6 border border-outline text-on-surface-variant rounded-lg font-medium text-[14px] hover:bg-surface-container-high transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
