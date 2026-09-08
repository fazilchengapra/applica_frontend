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
import { useGoogleLogin } from '@react-oauth/google';
import { LoaderCircle } from "lucide-react";
import PublicOnlyGuard from "@/components/auth/PublicOnlyGuard";

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

  const redirectAfterLogin = async () => {
    const response = await api.get("v1/users/me/");
    router.replace(response.data?.is_staff ? "/admin" : "/dashboard");
  };

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
      redirectAfterLogin();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, messages]) => {
          setEmailError(key as keyof LoginFormValues, { type: "server", message: messages[0] });
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
          setPhoneError(key as keyof PhoneFormValues, { type: "server", message: messages[0] });
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
      redirectAfterLogin();
    }
  });

  const onEmailSubmit = (data: LoginFormValues) => {
    emailMutation.mutate(data);
  };

  const onPhoneSubmit = (data: PhoneFormValues) => {
    phoneMutation.mutate(data);
  };

  const googleMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await api.post("v1/auth/google/", { code });
      return response.data;
    },
    onSuccess: () => {
      redirectAfterLogin();
    }
  });

  const login = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'popup',
    onSuccess: (response) => {
      googleMutation.mutate(response.code);
    },
    onError: () => {
      // Handle popup closed or error silently
    },
  });

  return (
    <PublicOnlyGuard>
    <div className="landing-page-theme relative min-h-dvh overflow-y-auto bg-[#f4f7fb] font-sans text-on-background antialiased lg:h-dvh lg:overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: "linear-gradient(rgba(0, 89, 184, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 89, 184, 0.045) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="pointer-events-none absolute -left-[14%] -top-[18%] h-[460px] w-[460px] rounded-full bg-primary-fixed-dim/30 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-[18%] -right-[8%] h-[420px] w-[420px] rounded-full bg-secondary-fixed-dim/30 blur-[100px]" />

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[1100px] items-center justify-center p-3 sm:p-5 lg:h-full lg:p-6">
        <div className="grid w-full overflow-hidden rounded-[24px] border border-white/80 bg-surface-container-lowest shadow-[0_24px_70px_rgba(28,53,82,0.14)] lg:max-h-full lg:grid-cols-[0.86fr_1.14fr]">
          <aside className="hidden flex-col justify-between bg-primary p-8 text-white lg:flex">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc0YsM7yHb6b4frOAHLSOmSp1QhsR3vmo5JMPxRnJVKgpzxdYODvBXtOjYlHouU7P_YKeYg_GaFWUfOxgA80Z_t2uZTlwbtbeXzlHfiINA5j2TJDJ116yRUEDpB6ScUkY-mbV0VdXd-ZHrw2vhqXRLkCSB1WWs-uVaBwjmQXwWzf-eMkBfhA2jucxULS8zTs1BS9B9IULZ70jwtPm90OThLhvGPM1uw4a-xxzbdUA_DGxU2Fp4alQEELM6yuNfuQ1YLflWYWC2tQ"
                alt="applica Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-md bg-white/10"
                unoptimized
              />
              <span className="text-[26px] font-[600] tracking-tight">applica</span>
            </Link>
            <div className="max-w-[280px] pb-4">
              <p className="mb-4 text-[12px] font-[600] uppercase tracking-[0.16em] text-primary-fixed">Job search, simplified</p>
              <h2 className="text-[36px] font-[600] leading-[1.08] tracking-[-0.025em]">Move your career forward.</h2>
              <p className="mt-5 text-[16px] leading-7 text-primary-fixed">Keep your applications organized and spend more time on the opportunities that matter.</p>
            </div>
          </aside>

          <main className="w-full p-5 sm:p-7 lg:p-8">
        {/* Header */}
        <header className="flex flex-col items-center gap-1 text-center">
          <Link href="/" className="mb-1 flex items-center justify-center gap-2 transition-opacity hover:opacity-90 lg:hidden">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc0YsM7yHb6b4frOAHLSOmSp1QhsR3vmo5JMPxRnJVKgpzxdYODvBXtOjYlHouU7P_YKeYg_GaFWUfOxgA80Z_t2uZTlwbtbeXzlHfiINA5j2TJDJ116yRUEDpB6ScUkY-mbV0VdXd-ZHrw2vhqXRLkCSB1WWs-uVaBwjmQXwWzf-eMkBfhA2jucxULS8zTs1BS9B9IULZ70jwtPm90OThLhvGPM1uw4a-xxzbdUA_DGxU2Fp4alQEELM6yuNfuQ1YLflWYWC2tQ"
              alt="applica Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-md"
              unoptimized
            />
            <h1 className="text-[30px] font-[600] leading-[38px] tracking-tight text-primary">applica</h1>
          </Link>
          <h2 className="text-[28px] font-[600] leading-9 tracking-[-0.02em] text-on-surface">Welcome back</h2>
          <p className="text-[15px] leading-6 text-on-surface-variant">Sign in to continue to your workspace.</p>
        </header>

        {/* Tabbed Interface */}
        <div className="mt-5 flex w-full rounded-xl bg-surface-container-low p-1">
          <button
            className={`flex-1 rounded-lg px-3 py-2 text-[14px] font-[600] transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${activeTab === 'email' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            onClick={() => setActiveTab('email')}
          >
            Email
          </button>
          <button
            className={`flex-1 rounded-lg px-3 py-2 text-[14px] font-[600] transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${activeTab === 'phone' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
            onClick={() => setActiveTab('phone')}
          >
            Phone
          </button>
        </div>

        {/* Form Container */}
        <div className="relative mt-5 w-full">
          {/* Email Form */}
          {activeTab === 'email' && (
            <form className="flex w-full flex-col gap-4 transition-opacity duration-300" onSubmit={handleEmailSubmit(onEmailSubmit)}>

              {/* Global Error Banner */}
              {emailMutation.isError && !emailMutation.error?.response?.data?.errors && (
                <div className="p-[12px] bg-error-container text-on-error-container rounded-lg text-[14px] font-[500] mb-[-8px]">
                  {emailMutation.error?.response?.data?.detail || emailMutation.error?.response?.data?.message || "Invalid credentials. Please try again."}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-[4px]">
                  <label className="text-[13px] font-[600] text-on-surface" htmlFor="login-email">Email address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-[16px] top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
                    <input
                      className={`h-[42px] w-full rounded-lg border bg-surface-container-lowest py-[8px] pl-[48px] pr-[16px] text-[16px] font-[400] leading-[24px] text-on-surface transition-all placeholder:text-outline focus:outline-none focus:ring-2 ${emailErrors.email ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-primary/20'}`}
                      id="login-email"
                      placeholder="name@company.com"
                      type="email"
                      {...registerEmail("email")}
                    />
                  </div>
                  {emailErrors.email && <span className="text-[12px] text-error">{emailErrors.email.message}</span>}
                </div>

                <div className="flex flex-col gap-[4px]">
                  <label className="text-[13px] font-[600] text-on-surface" htmlFor="login-password">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-[16px] top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
                    <input
                      className={`h-[42px] w-full rounded-lg border bg-surface-container-lowest py-[8px] pl-[48px] pr-[40px] text-[16px] font-[400] leading-[24px] text-on-surface transition-all placeholder:text-outline focus:outline-none focus:ring-2 ${emailErrors.password ? 'border-error focus:ring-error/20' : 'border-outline-variant focus:border-primary focus:ring-primary/20'}`}
                      id="login-password"
                      placeholder="Enter your password"
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

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-[8px] cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest cursor-pointer" type="checkbox" />
                  <span className="text-[12px] leading-[16px] tracking-[0.02em] font-[600] text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
                </label>
                <Link className="text-[12px] leading-[16px] tracking-[0.02em] font-[600] text-primary hover:text-primary-container transition-colors" href="/forgot-password">Forgot password?</Link>
              </div>

              <button
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg text-[14px] font-[600] tracking-[0.01em] text-on-primary shadow-[0_8px_18px_rgba(0,89,184,0.2)] transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest ${emailMutation.isPending ? 'cursor-wait bg-primary/80' : 'bg-primary hover:bg-primary-container hover:shadow-[0_10px_22px_rgba(0,89,184,0.28)]'}`}
                type="submit"
                disabled={emailMutation.isPending}
              >
                {emailMutation.isPending ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin" strokeWidth={2.5} aria-hidden="true" />
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
                          <LoaderCircle className="h-5 w-5 animate-spin" strokeWidth={2.5} aria-hidden="true" />
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
                        <LoaderCircle className="h-5 w-5 animate-spin" strokeWidth={2.5} aria-hidden="true" />
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
        <div className="flex flex-col gap-[8px]">
          {googleMutation.isError && (
            <div className="p-[12px] bg-error-container text-on-error-container rounded-lg text-[14px] font-[500]">
              {(googleMutation.error as AxiosError<ApiErrorResponse>)?.response?.data?.detail || "Google authentication failed. Please try again."}
            </div>
          )}
          <button onClick={() => login()} disabled={googleMutation.isPending} className={`w-full h-[44px] bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low hover:border-outline text-on-surface text-[14px] leading-[20px] tracking-[0.01em] font-[500] rounded-lg flex items-center justify-center gap-[8px] transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${googleMutation.isPending ? 'opacity-80 cursor-wait' : ''}`} type="button">
            {googleMutation.isPending ? (
              <LoaderCircle className="h-5 w-5 animate-spin text-primary" strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
            )}
            {googleMutation.isPending ? "Connecting..." : "Continue with Google"}
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-[5px]">
          <p className="text-[16px] leading-[24px] font-[400] text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link className="text-primary font-[700] hover:underline" href="/register">Sign up</Link>
          </p>
        </div>
          </main>
        </div>
      </div>
    </div>
    </PublicOnlyGuard>
  );
}
