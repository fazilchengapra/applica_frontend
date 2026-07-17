"use client";

import React, { useRef, useState, KeyboardEvent, ChangeEvent } from "react";

function OtpInputGroup() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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

export default function PhoneVerifyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/60 backdrop-blur-sm p-4 animate-modal-backdrop">
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-outline-variant w-full max-w-md overflow-hidden flex flex-col animate-modal-content">
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
          {/* Section 1: Current Phone */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-baseline">
              <label className="font-title-sm text-title-sm text-on-surface font-bold">
                Current Phone
              </label>
              <span className="font-body-sm text-body-sm text-secondary tracking-wide">
                +91 98765 XXXXX
              </span>
            </div>
            <OtpInputGroup />
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
                +91 91234 XXXXX
              </span>
            </div>
            <OtpInputGroup />
          </div>
          {/* Resend Option */}
          <div className="text-center mt-2">
            <button className="font-body-sm text-body-sm text-primary hover:text-on-primary-fixed-variant transition-colors focus:outline-none cursor-pointer">
              Resend OTP <span className="text-secondary ml-1">(3:00min)</span>
            </button>
          </div>
        </div>
        {/* Modal Footer */}
        <div className="p-container-padding border-t border-surface-variant bg-surface-bright">
          <button
            className="w-full py-3 bg-primary text-on-primary rounded-lg font-title-sm text-title-sm hover:bg-on-primary-fixed-variant hover:shadow-[0_4px_12px_rgba(0,113,230,0.2)] transition-all active:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
            onClick={onClose}
          >
            Verify &amp; Update
          </button>
        </div>
      </div>
    </div>
  );
}
