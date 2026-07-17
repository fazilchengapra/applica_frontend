"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // If no token is provided in the query string, show an error immediately
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided.");
      return;
    }

    let isMounted = true;

    // Call the verification API
    import("@/lib/axios").then(({ default: api }) => {
      api.post("v1/auth/email/verify/", { token })
        .then(() => {
          if (!isMounted) return;
          setStatus("success");
          
          // Auto-redirect to login after showing success for a short period
          setTimeout(() => {
            if (isMounted) router.push("/login");
          }, 2000);
        })
        .catch((err) => {
          if (!isMounted) return;
          setStatus("error");
          setErrorMessage(
            err?.response?.data?.detail || "Verification link is invalid or expired. Please request a new link."
          );
        });
    });

    return () => {
      isMounted = false;
    };
  }, [token, router]);

  return (
    <div className="landing-page-theme bg-background font-sans text-on-background min-h-screen flex flex-col items-center justify-center antialiased p-[16px] md:p-[40px]">
      <style dangerouslySetInnerHTML={{__html: `
        .pulse-ring {
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(2); opacity: 0; }
        }
      `}} />

      {/* Card Container */}
      <main className="w-full max-w-[420px] bg-surface-container-lowest rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.08)] border border-outline-variant/30 p-[32px] flex flex-col items-center text-center relative overflow-hidden min-h-[340px] justify-center">
        {/* Subtle gradient background effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-surface-container-low to-transparent opacity-50 pointer-events-none"></div>
        
        {/* Pending State */}
        {status === "pending" && (
          <div className="flex flex-col items-center w-full z-10">
            <div className="relative w-[64px] h-[64px] mb-[32px] flex items-center justify-center">
              {/* Pulse animation behind icon */}
              <div className="absolute inset-0 bg-primary/20 rounded-full pulse-ring"></div>
              <div className="relative z-10 w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[36px]">mail</span>
              </div>
            </div>
            <h1 className="text-[30px] leading-[38px] tracking-[-0.01em] font-[600] mb-[16px] text-on-surface">Verify Email</h1>
            <p className="text-[18px] leading-[28px] font-[400] text-on-surface-variant max-w-[280px] mx-auto">
              Verifying your email address. Please wait a moment...
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="flex flex-col items-center w-full z-10">
            <div className="w-16 h-16 bg-[#006e73]/10 text-[#006e73] rounded-full flex items-center justify-center mb-[24px] mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h1 className="text-[20px] leading-[28px] font-[600] mb-[8px] text-on-surface">Email Verified!</h1>
            <p className="text-[16px] leading-[24px] font-[400] text-on-surface-variant">
              Redirecting to login...
            </p>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="flex flex-col items-center w-full z-10">
            <div className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center mb-[24px] mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[36px]">error</span>
            </div>
            <h1 className="text-[20px] leading-[28px] font-[600] mb-[8px] text-error">Verification Failed</h1>
            <p className="text-[16px] leading-[24px] font-[400] text-on-surface-variant mb-[24px]">
              {errorMessage}
            </p>
            <button 
              className="bg-primary hover:bg-primary-container text-on-primary text-[14px] leading-[20px] tracking-[0.01em] font-[500] py-[12px] px-[24px] rounded-lg transition-colors shadow-sm flex items-center gap-[8px]"
              onClick={() => {
                // For demonstration: simulate re-sending link by resetting to pending
                // In a real app this would trigger an API call to re-send the email
                window.location.href = "/verify-email?token=dummy-token-for-testing";
              }}
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              Resend Link
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-[48px] text-center">
        <p className="text-[14px] leading-[20px] tracking-[0.01em] font-[500] text-on-surface-variant flex items-center justify-center gap-[4px]">
          <span className="font-bold text-primary">Applica</span> © 2024
        </p>
      </footer>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="landing-page-theme bg-background min-h-screen flex items-center justify-center text-on-background">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
