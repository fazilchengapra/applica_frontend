"use client";

import React, { useState } from "react";

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-outline-variant overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-outline-variant flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md leading-none text-on-surface">
              Change password
            </h3>
            <p className="text-body-sm text-secondary mt-1">
              Update your account credentials
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-secondary hover:text-on-surface transition-colors p-1 flex items-center justify-center focus:outline-none cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Content (Form) */}
        <form className="p-6 space-y-stack-gap" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="font-label-caps text-label-caps text-secondary uppercase px-1">
                Current Password
              </label>
              <div className="relative flex items-center">
                <input
                  className="w-full h-11 bg-surface-container-low border-none rounded-lg px-4 text-body-md text-on-surface focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline-variant"
                  placeholder="••••••••"
                  type={showCurrentPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 text-secondary hover:text-primary transition-colors flex items-center justify-center focus:outline-none"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showCurrentPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="h-[1px] bg-outline-variant/30 w-full my-2"></div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="font-label-caps text-label-caps text-secondary uppercase px-1">
                New Password
              </label>
              <div className="relative flex items-center">
                <input
                  className="w-full h-11 bg-surface-container-low border-none rounded-lg px-4 text-body-md text-on-surface focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline-variant"
                  placeholder="••••••••"
                  type={showNewPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 text-secondary hover:text-primary transition-colors flex items-center justify-center focus:outline-none"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showNewPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-secondary px-1">
                Must be at least 8 characters long.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="font-label-caps text-label-caps text-secondary uppercase px-1">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <input
                  className="w-full h-11 bg-surface-container-low border-none rounded-lg px-4 text-body-md text-on-surface focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline-variant"
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-secondary hover:text-primary transition-colors flex items-center justify-center focus:outline-none"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              className="w-full h-12 bg-primary text-on-primary rounded-lg font-title-sm text-title-sm hover:bg-primary-container active:opacity-90 transition-all shadow-lg shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
              type="submit"
            >
              Submit New Password
            </button>
            <button
              className="w-full mt-3 text-center text-body-sm text-secondary hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
              type="button"
              onClick={onClose}
            >
              Cancel and return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
