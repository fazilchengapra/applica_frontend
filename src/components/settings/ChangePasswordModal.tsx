"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";

const changePasswordSchema = z.object({
  old_password: z.string().min(1, "Current password is required."),
  new_password: z.string().min(8, "Must be at least 8 characters long."),
  confirm_password: z.string().min(1, "Please confirm your new password."),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match.",
  path: ["confirm_password"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: ChangePasswordFormValues) => {
      const response = await api.post("v1/auth/password/change/", data);
      return response.data;
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const message = error.response?.data?.detail || "An unexpected error occurred.";
      setError("root", { type: "server", message });
    }
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-surface-container-lowest w-full max-w-[420px] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-outline-variant overflow-hidden animate-in fade-in zoom-in duration-200">
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
        {mutation.isSuccess ? (
          <div className="p-6 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-[#006e73]/10 text-[#006e73] rounded-full flex items-center justify-center mb-[24px] mx-auto shadow-sm">
                <span className="material-symbols-outlined text-[36px]">check_circle</span>
             </div>
             <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Password Updated</h2>
             <p className="font-body-md text-body-md text-secondary mb-6">Your password has been changed successfully.</p>
             <button 
                onClick={onClose}
                className="w-full h-12 bg-primary text-on-primary rounded-lg font-title-sm text-title-sm hover:bg-primary-container active:opacity-90 transition-all shadow-lg shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
             >
                Close
             </button>
          </div>
        ) : (
          <form className="p-6 space-y-stack-gap" onSubmit={handleSubmit(onSubmit)}>
            {errors.root && (
               <div className="p-3 bg-error-container text-on-error-container rounded-lg text-sm font-medium mb-4">
                 {errors.root.message}
               </div>
            )}
            
            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="font-label-caps text-label-caps text-secondary uppercase px-1">
                  Current Password
                </label>
                <div className="relative flex items-center">
                  <input
                    {...register("old_password")}
                    className="w-full h-11 bg-surface-container-low border border-transparent rounded-lg px-4 text-body-md text-on-surface focus:bg-white focus:border-outline-variant focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline-variant"
                    placeholder="••••••••"
                    type={showCurrentPassword ? "text" : "password"}
                    disabled={mutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 text-secondary hover:text-primary transition-colors flex items-center justify-center focus:outline-none"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showCurrentPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.old_password && <p className="text-error text-xs px-1 mt-1">{errors.old_password.message}</p>}
              </div>

              <div className="h-[1px] bg-outline-variant/30 w-full my-2"></div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="font-label-caps text-label-caps text-secondary uppercase px-1">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    {...register("new_password")}
                    className="w-full h-11 bg-surface-container-low border border-transparent rounded-lg px-4 text-body-md text-on-surface focus:bg-white focus:border-outline-variant focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline-variant"
                    placeholder="••••••••"
                    type={showNewPassword ? "text" : "password"}
                    disabled={mutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-secondary hover:text-primary transition-colors flex items-center justify-center focus:outline-none"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showNewPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.new_password ? (
                  <p className="text-error text-xs px-1 mt-1">{errors.new_password.message}</p>
                ) : (
                  <p className="text-[11px] text-secondary px-1">
                    Must be at least 8 characters long.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="font-label-caps text-label-caps text-secondary uppercase px-1">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    {...register("confirm_password")}
                    className="w-full h-11 bg-surface-container-low border border-transparent rounded-lg px-4 text-body-md text-on-surface focus:bg-white focus:border-outline-variant focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline-variant"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    disabled={mutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-secondary hover:text-primary transition-colors flex items-center justify-center focus:outline-none"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.confirm_password && <p className="text-error text-xs px-1 mt-1">{errors.confirm_password.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                className="w-full h-12 bg-primary text-on-primary rounded-lg font-title-sm text-title-sm hover:bg-primary-container active:opacity-90 transition-all shadow-lg shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-wait"
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending && (
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                )}
                {mutation.isPending ? 'Updating...' : 'Submit New Password'}
              </button>
              <button
                className="w-full mt-3 text-center text-body-sm text-secondary hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
                type="button"
                onClick={onClose}
                disabled={mutation.isPending}
              >
                Cancel and return
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
