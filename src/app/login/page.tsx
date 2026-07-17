"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const phoneSchema = z.object({
  phone_number: z.string().min(10, "Valid phone number is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type PhoneFormValues = z.infer<typeof phoneSchema>;

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const router = useRouter();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    setError: setEmailError,
    formState: { errors: emailErrors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    setError: setPhoneError,
    formState: { errors: phoneErrors }
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
  });

  const emailMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await api.post("v1/auth/email/login/", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, messages]) => {
          setEmailError(key as any, { type: "server", message: messages[0] });
        });
      }
    }
  });

  const phoneMutation = useMutation({
    mutationFn: async (data: PhoneFormValues) => {
      const response = await api.post("v1/auth/phone/login/request/", data);
      return response.data;
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, messages]) => {
          setPhoneError(key as any, { type: "server", message: messages[0] });
        });
      }
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: { phone_number: string; code: string }) => {
      const response = await api.post("v1/auth/phone/login/verify/", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/dashboard");
    }
  });

  const onEmailSubmit = (data: LoginFormValues) => {
    emailMutation.mutate(data);
  };

  const onPhoneSubmit = (data: PhoneFormValues) => {
    phoneMutation.mutate(data);
  };

  return (
    <div className="landing-page-theme bg-surface-container font-sans text-on-background min-h-screen flex items-center justify-center p-[16px] md:p-[40px] antialiased">
      {/* Ambient background element for modern SaaS feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary-fixed-dim/30 blur-[100px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-secondary-fixed-dim/20 blur-[120px]"></div>
      </div>
      
      {/* Main Login Card */}
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
          <p className="text-[16px] leading-[24px] font-[400] text-on-surface-variant">Welcome back. Please sign in to continue.</p>
        </header>

        {/* Tabbed Interface */}
        <div className="flex w-full border-b border-surface-variant">
          <button 
            className={`flex-1 pb-[8px] text-[14px] leading-[20px] tracking-[0.01em] font-[500] border-b-2 transition-colors focus:outline-none ${activeTab === 'email' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}
            onClick={() => setActiveTab('email')}
          >
            Email
          </button>
          <button 
            className={`flex-1 pb-[8px] text-[14px] leading-[20px] tracking-[0.01em] font-[500] border-b-2 transition-colors focus:outline-none ${activeTab === 'phone' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary'}`}
            onClick={() => setActiveTab('phone')}
          >
            Phone
          </button>
        </div>

        {/* Form Container */}
        <div className="relative w-full">
          {/* Email Form */}
          {activeTab === 'email' && (
            <form className="flex-col gap-[24px] w-full transition-opacity duration-300 flex" onSubmit={handleEmailSubmit(onEmailSubmit)}>
              
              {/* Global Error Banner */}
              {emailMutation.isError && !emailMutation.error?.response?.data?.errors && (
                 <div className="p-[12px] bg-error-container text-on-error-container rounded-lg text-[14px] font-[500] mb-[-8px]">
                    {emailMutation.error?.response?.data?.detail || emailMutation.error?.response?.data?.message || "Invalid credentials. Please try again."}
                 </div>
              )}

              <div className="flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[4px]">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-[16px] top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
                    <input 
                      className={`w-full pl-[48px] pr-[16px] py-[8px] h-[44px] bg-surface-container-lowest border ${emailErrors.email ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-primary/20'} rounded-lg text-[16px] leading-[24px] font-[400] text-on-surface focus:outline-none focus:ring-2 transition-all placeholder:text-outline`} 
                      placeholder="name@company.com" 
                      type="email" 
                      {...registerEmail("email")}
                    />
                  </div>
                  {emailErrors.email && <span className="text-[12px] text-error">{emailErrors.email.message}</span>}
                </div>
                
                <div className="flex flex-col gap-[4px]">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-[16px] top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
                    <input 
                      className={`w-full pl-[48px] pr-[40px] py-[8px] h-[44px] bg-surface-container-lowest border ${emailErrors.password ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-primary/20'} rounded-lg text-[16px] leading-[24px] font-[400] text-on-surface focus:outline-none focus:ring-2 transition-all placeholder:text-outline`} 
                      placeholder="Password" 
                      type={showPassword ? "text" : "password"} 
                      {...registerEmail("password")}
                    />
                    <button className="absolute right-[16px] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none flex items-center justify-center" onClick={() => setShowPassword(!showPassword)} type="button">
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {emailErrors.password && <span className="text-[12px] text-error">{emailErrors.password.message}</span>}
                </div>
              </div>

              <div className="flex items-center justify-between mt-[-8px]">
                <label className="flex items-center gap-[8px] cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest cursor-pointer" type="checkbox" />
                  <span className="text-[12px] leading-[16px] tracking-[0.02em] font-[600] text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
                </label>
                <Link className="text-[12px] leading-[16px] tracking-[0.02em] font-[600] text-primary hover:text-primary-container transition-colors" href="/forgot-password">Forgot password?</Link>
              </div>

              <button 
                className={`w-full h-[44px] text-on-primary text-[14px] leading-[20px] tracking-[0.01em] font-[500] rounded-lg flex items-center justify-center gap-[8px] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest ${emailMutation.isPending ? 'bg-primary/80 cursor-wait' : 'bg-primary hover:bg-primary-container hover:shadow-md'}`} 
                type="submit"
                disabled={emailMutation.isPending}
              >
                {emailMutation.isPending ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    Login
                  </>
                )}
              </button>
            </form>
          )}

          {/* Phone Form */}
          {activeTab === 'phone' && (
            <div className="flex-col gap-[24px] w-full transition-opacity duration-300 flex">
              {phoneMutation.isSuccess ? (
                <div className="flex flex-col items-center justify-center py-[16px] text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-[#006e73]/10 text-[#006e73] rounded-full flex items-center justify-center mb-[16px] mx-auto shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">sms</span>
                  </div>
                  <h3 className="text-[20px] font-[600] text-on-surface mb-[4px]">Enter Verification Code</h3>
                  <p className="text-[14px] font-[400] text-on-surface-variant mb-[24px]">
                    {phoneMutation.data?.message || "If this number is registered, a code has been sent."}
                  </p>
                  
                  <form className="w-full flex flex-col gap-[16px]" onSubmit={(e) => {
                    e.preventDefault();
                    verifyMutation.mutate({
                      phone_number: phoneMutation.variables?.phone_number || "",
                      code: otpCode
                    });
                  }}>
                    
                    {/* Global Error Banner for OTP Verification */}
                    {verifyMutation.isError && (
                      <div className="p-[12px] bg-error-container text-on-error-container rounded-lg text-[14px] font-[500] mb-[-8px]">
                          {(verifyMutation.error as AxiosError<ApiErrorResponse>)?.response?.data?.detail || "Invalid code. Please try again."}
                      </div>
                    )}

                    <div className="flex justify-center">
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="••••••"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full max-w-[200px] text-center tracking-[0.5em] text-[24px] leading-[32px] font-[600] bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-primary/20 rounded-lg px-[16px] py-[12px] focus:outline-none focus:ring-2 transition-all placeholder:text-outline-variant" 
                        required 
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={verifyMutation.isPending || otpCode.length < 4}
                      className={`w-full h-[44px] text-on-primary text-[14px] leading-[20px] tracking-[0.01em] font-[500] rounded-lg flex items-center justify-center gap-[8px] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest ${verifyMutation.isPending ? 'bg-primary/80 cursor-wait' : 'bg-primary hover:bg-primary-container hover:shadow-md'}`}
                    >
                      {verifyMutation.isPending ? (
                        <>
                          <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">check_circle</span>
                          Verify Code
                        </>
                      )}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => {
                        phoneMutation.reset();
                        verifyMutation.reset();
                        setOtpCode("");
                      }}
                      className="text-[14px] font-[500] text-primary hover:underline mt-[8px]"
                    >
                      Use a different number
                    </button>
                  </form>
                </div>
              ) : (
                <form className="flex-col gap-[24px] w-full flex" onSubmit={handlePhoneSubmit(onPhoneSubmit)}>
                  
                  {/* Global Error Banner */}
                  {phoneMutation.isError && !phoneMutation.error?.response?.data?.errors && (
                    <div className="p-[12px] bg-error-container text-on-error-container rounded-lg text-[14px] font-[500] mb-[-8px]">
                        {phoneMutation.error?.response?.data?.detail || phoneMutation.error?.response?.data?.message || "An error occurred. Please try again."}
                    </div>
                  )}

                  <div className="flex flex-col gap-[4px]">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-[16px] top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">phone</span>
                      <input 
                        className={`w-full pl-[48px] pr-[16px] py-[8px] h-[44px] bg-surface-container-lowest border ${phoneErrors.phone_number ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-primary/20'} rounded-lg text-[16px] leading-[24px] font-[400] text-on-surface focus:outline-none focus:ring-2 transition-all placeholder:text-outline`} 
                        placeholder="+1 (555) 000-0000" 
                        type="tel" 
                        {...registerPhone("phone_number")}
                      />
                    </div>
                    {phoneErrors.phone_number && <span className="text-[12px] text-error">{phoneErrors.phone_number.message}</span>}
                  </div>
                  
                  <button 
                    className={`w-full h-[44px] text-on-primary text-[14px] leading-[20px] tracking-[0.01em] font-[500] rounded-lg flex items-center justify-center gap-[8px] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest ${phoneMutation.isPending ? 'bg-primary/80 cursor-wait' : 'bg-primary hover:bg-primary-container hover:shadow-md'}`} 
                    type="submit"
                    disabled={phoneMutation.isPending}
                  >
                    {phoneMutation.isPending ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        Send OTP
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-[16px]">
          <div className="h-px bg-surface-variant flex-1"></div>
          <span className="text-[12px] leading-[16px] tracking-[0.02em] font-[600] text-outline">OR</span>
          <div className="h-px bg-surface-variant flex-1"></div>
        </div>

        {/* Social Login */}
        <button className="w-full h-[44px] bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low hover:border-outline text-on-surface text-[14px] leading-[20px] tracking-[0.01em] font-[500] rounded-lg flex items-center justify-center gap-[8px] transition-all focus:outline-none focus:ring-2 focus:ring-primary/20" type="button">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Continue with Google
        </button>

        {/* Footer Link */}
        <div className="text-center mt-[-8px]">
          <p className="text-[16px] leading-[24px] font-[400] text-on-surface-variant">
            Don't have an account?{" "}
            <Link className="text-primary font-[700] hover:underline" href="/register">Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
