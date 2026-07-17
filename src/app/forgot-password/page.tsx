"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset state after 3 seconds for demo purposes
      setTimeout(() => {
        setIsSuccess(false);
        setEmail("");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="landing-page-theme bg-surface-container font-sans text-on-background min-h-screen flex items-center justify-center p-[16px] md:p-[40px] antialiased">
      {/* Ambient background element for modern SaaS feel */}
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
          <h2 className="text-[24px] md:text-[30px] leading-[32px] md:leading-[38px] font-[600] text-on-surface mb-[4px]">Forgot Password</h2>
          <p className="text-[16px] leading-[24px] font-[400] text-on-surface-variant">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </header>

        {/* Form Container */}
        <div className="relative w-full">
          <form className="flex flex-col gap-[24px] w-full" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] leading-[20px] tracking-[0.01em] font-[500] text-on-surface" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-[16px] top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
                <input 
                  className="w-full pl-[48px] pr-[16px] py-[8px] h-[44px] bg-surface-container-lowest border border-outline-variant rounded-lg text-[16px] leading-[24px] font-[400] text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline" 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || isSuccess} 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              className={`w-full h-[44px] text-on-primary text-[14px] leading-[20px] tracking-[0.01em] font-[500] rounded-lg flex items-center justify-center gap-[8px] transition-all shadow-[0_2px_4px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-container-lowest ${
                isSuccess 
                  ? 'bg-secondary hover:bg-secondary' 
                  : 'bg-primary hover:bg-primary-container focus:ring-primary'
              } ${
                isSubmitting 
                  ? 'opacity-75 cursor-not-allowed hover:-translate-y-0' 
                  : 'hover:-translate-y-[1px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
              }`} 
              type="submit"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  Sending...
                </>
              ) : isSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">check</span>
                  Link Sent
                </>
              ) : (
                <>
                  Send Reset Link
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-[-8px]">
          <Link 
            href="/login" 
            className="text-[14px] leading-[20px] tracking-[0.01em] font-[500] text-primary hover:text-on-primary-fixed-variant transition-colors flex items-center justify-center gap-[4px]"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Login
          </Link>
        </div>
      </main>
    </div>
  );
}
