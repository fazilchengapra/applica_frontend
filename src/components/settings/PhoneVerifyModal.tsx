"use client";

import React, { useRef, useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";

function OtpInputGroup({ otp, onChange }: { otp: string[], onChange: (newOtp: string[]) => void }) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    onChange(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-10 h-12 sm:w-12 sm:h-14 bg-surface-bright border border-surface-variant rounded-lg text-center font-headline-md text-headline-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          maxLength={1}
          type="number"
        />
      ))}
    </div>
  );
}

export default function PhoneVerifyModal({ 
  onClose,
  currentPhone,
  newPhone
}: { 
  onClose: () => void;
  currentPhone: string;
  newPhone: string;
}) {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 seconds
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  
  const [oldCode, setOldCode] = useState<string[]>(Array(6).fill(""));
  const [newCode, setNewCode] = useState<string[]>(Array(6).fill(""));

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}min`;
  };

  const resendMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("v1/auth/phone/change/request/", { new_phone_number: newPhone });
      return response.data;
    },
    onSuccess: (data) => {
      setTimeLeft(180); // Reset timer
      setResendMessage(data.message || "OTP resent successfully.");
      setResendError("");
      setTimeout(() => setResendMessage(""), 5000);
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      setResendError(error.response?.data?.detail || "Failed to resend OTP.");
      setResendMessage("");
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        old_code: oldCode.join(""),
        new_code: newCode.join("")
      };
      const response = await api.post("v1/auth/phone/change/verify/", payload);
      return response.data;
    },
    onSuccess: () => {
      // Typically we'd invalidate the user query or redux state here to refresh the phone number
      // For now, closing the modal is the standard action
      window.location.reload(); // Quick way to refresh profile data
    }
  });

  const handleResend = () => {
    if (timeLeft > 0 || resendMutation.isPending) return;
    resendMutation.mutate();
  };

  const handleVerify = () => {
    if (oldCode.join("").length !== 6 || newCode.join("").length !== 6) return;
    verifyMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/60 backdrop-blur-sm p-4 animate-modal-backdrop">
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-outline-variant w-full max-w-[420px] overflow-hidden flex flex-col animate-modal-content">
        {/* Modal Header */}
        <div className="px-container-padding pt-container-padding pb-stack-gap text-center relative border-b border-surface-variant">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-secondary hover:text-on-surface transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
            Verify Phone Numbers
          </h2>
          <p className="font-body-md text-body-md text-secondary mt-2">
            We sent verification codes to both numbers.
          </p>
        </div>
        {/* Modal Body */}
        <div className="p-container-padding flex flex-col gap-stack-gap overflow-y-auto">
          {verifyMutation.isError && (
             <div className="p-3 bg-error-container text-on-error-container rounded-lg text-sm font-medium text-center">
               {(verifyMutation.error as AxiosError<{detail?: string}>).response?.data?.detail || "Verification failed. Please check your codes."}
             </div>
          )}
          
          {/* Section 1: Current Phone */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-baseline">
              <label className="font-title-sm text-title-sm text-on-surface font-bold">
                Current Phone
              </label>
              <span className="font-body-sm text-body-sm text-secondary tracking-wide">
                {currentPhone}
              </span>
            </div>
            <OtpInputGroup otp={oldCode} onChange={setOldCode} />
          </div>
          {/* Divider */}
          <div className="h-px w-full bg-surface-variant"></div>
          {/* Section 2: New Phone */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-baseline">
              <label className="font-title-sm text-title-sm text-on-surface font-bold">
                New Phone
              </label>
              <span className="font-body-sm text-body-sm text-secondary tracking-wide">
                {newPhone}
              </span>
            </div>
            <OtpInputGroup otp={newCode} onChange={setNewCode} />
          </div>
          
          {/* Resend Option */}
          <div className="text-center mt-2 flex flex-col items-center gap-1">
            {resendMessage && <span className="text-[13px] text-[#006e73]">{resendMessage}</span>}
            {resendError && <span className="text-[13px] text-error">{resendError}</span>}
            <button 
              onClick={handleResend}
              disabled={timeLeft > 0 || resendMutation.isPending}
              className={`font-body-sm text-body-sm transition-colors focus:outline-none ${
                timeLeft > 0 
                  ? 'text-secondary cursor-not-allowed opacity-70' 
                  : 'text-primary hover:text-on-primary-fixed-variant cursor-pointer'
              }`}
            >
              {resendMutation.isPending ? 'Resending...' : 'Resend OTP'} 
              {timeLeft > 0 && <span className="text-secondary ml-1">({formatTime(timeLeft)})</span>}
            </button>
          </div>
        </div>
        {/* Modal Footer */}
        <div className="p-container-padding border-t border-surface-variant bg-surface-bright">
          <button
            onClick={handleVerify}
            disabled={verifyMutation.isPending || oldCode.join("").length !== 6 || newCode.join("").length !== 6}
            className="w-full py-3 bg-primary text-on-primary rounded-lg font-title-sm text-title-sm hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {verifyMutation.isPending && (
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            )}
            {verifyMutation.isPending ? 'Verifying...' : 'Verify & Update'}
          </button>
        </div>
      </div>
    </div>
  );
}
