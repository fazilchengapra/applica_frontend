"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword || password !== confirmPassword) return;

    setIsSubmitting(true);
    
    // Simulate network request using token
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Redirect to login after success
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="landing-page-theme bg-surface-container font-sans text-on-background min-h-screen flex items-center justify-center p-[16px] md:p-[40px] antialiased">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary-fixed-dim/30 blur-[100px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-secondary-fixed-dim/20 blur-[120px]"></div>
      </div>
      
      {/* Main Card */}
      <main className="w-full max-w-[420px] bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-surface-container-highest p-[32px] md:p-[48px] relative z-10 flex flex-col gap-[32px]">
        {/* Header */}
        <header className="text-center flex flex-col items-center gap-[4px]">
          <Link href="/" className="flex items-center justify-center gap-[8px] mb-[8px] hover:opacity-90 transition-opacity">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc0YsM7yHb6b4frOAHLSOmSp1QhsR3vmo5JMPxRnJVKgpzxdYODvBXtOjYlHouU7P_YKeYg_GaFWUfOxgA80Z_t2uZTlwbtbeXzlHfiINA5j2TJDJ116yRUEDpB6ScUkY-mbV0VdXd-ZHrw2vhqXRLkCSB1WWs-uVaBwjmQXwWzf-eMkBfhA2jucxULS8zTs1BS9B9IULZ70jwtPm90OThLhvGPM1uw4a-xxzbdUA_DGxU2Fp4alQEELM6yuNfuQ1YLflWYWC2tQ"
              alt="applica Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-md"
              unoptimized
            />
            <h1 className="text-[30px] leading-[38px] tracking-[-0.01em] font-[600] text-primary tracking-tight">applica</h1>
          </Link>
          <h2 className="text-[24px] md:text-[30px] leading-[32px] md:leading-[38px] font-[600] text-on-surface mb-[4px]">Reset Password</h2>
          <p className="text-[16px] leading-[24px] font-[400] text-on-surface-variant">Enter your new password below to regain access to your account.</p>
        </header>

        {/* Form Container */}
        <div className="relative w-full">
          {!token ? (
             <div className="text-center py-[24px]">
               <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mb-[24px] mx-auto shadow-sm">
                 <span className="material-symbols-outlined text-[36px]">error</span>
               </div>
               <p className="text-error font-[500] mb-[16px]">Invalid or missing reset token.</p>
               <Link href="/forgot-password" className="text-primary hover:underline font-[600]">Request a new link</Link>
             </div>
          ) : (
            <form className="flex flex-col gap-[24px] w-full" onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] leading-[20px] tracking-[0.01em] font-[500] text-on-surface" htmlFor="new-password">New Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-[16px] top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
                  <input className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface text-[16px] leading-[24px] font-[400] rounded-lg pl-[48px] pr-[40px] py-[8px] focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline h-[44px]" id="new-password" name="new-password" placeholder="••••••••" required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={isSubmitting || isSuccess} />
                  <button className="absolute inset-y-0 right-0 px-[8px] flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none" onClick={() => setShowPassword(!showPassword)} type="button" disabled={isSubmitting || isSuccess}>
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              
              {/* Confirm Password */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] leading-[20px] tracking-[0.01em] font-[500] text-on-surface" htmlFor="confirm-password">Confirm New Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-[16px] top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
                  <input className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface text-[16px] leading-[24px] font-[400] rounded-lg pl-[48px] pr-[40px] py-[8px] focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-outline h-[44px]" id="confirm-password" name="confirm-password" placeholder="••••••••" required type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isSubmitting || isSuccess} />
                  <button className="absolute inset-y-0 right-0 px-[8px] flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none" onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button" disabled={isSubmitting || isSuccess}>
                    <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-error text-[12px] font-[500] mt-[4px]">Passwords do not match</p>
                )}
              </div>
              
              {/* Submit Button */}
              <button 
                className={`w-full h-[44px] text-on-primary text-[14px] leading-[20px] tracking-[0.01em] font-[500] rounded-lg flex items-center justify-center gap-[8px] transition-all shadow-[0_2px_4px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-container-lowest mt-[8px] ${
                  isSuccess 
                    ? 'bg-secondary hover:bg-secondary' 
                    : 'bg-primary hover:bg-primary-container focus:ring-primary'
                } ${
                  isSubmitting || (password && confirmPassword && password !== confirmPassword)
                    ? 'opacity-75 cursor-not-allowed hover:-translate-y-0' 
                    : 'hover:-translate-y-[1px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
                }`} 
                type="submit"
                disabled={isSubmitting || isSuccess || (password !== '' && confirmPassword !== '' && password !== confirmPassword)}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                    Resetting...
                  </>
                ) : isSuccess ? (
                  <>
                    <span className="material-symbols-outlined text-[20px]">check</span>
                    Password Reset!
                  </>
                ) : (
                  <>
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="landing-page-theme bg-background min-h-screen flex items-center justify-center text-on-background">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
