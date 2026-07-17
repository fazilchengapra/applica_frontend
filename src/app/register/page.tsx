"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AxiosError } from "axios";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phone,
        password: data.password,
        confirm_password: data.confirmPassword
      };
      const response = await api.post("v1/users/", payload);
      return response.data;
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, messages]) => {
          let fieldName = key;
          if (key === "first_name") fieldName = "firstName";
          if (key === "last_name") fieldName = "lastName";
          if (key === "phone_number") fieldName = "phone";
          
          setError(fieldName as any, { type: "server", message: messages[0] });
        });
      }
    }
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="landing-page-theme bg-surface-container font-sans text-on-background min-h-screen flex items-center justify-center p-[16px] md:p-[40px] antialiased">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary-fixed-dim/30 blur-[100px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-secondary-fixed-dim/20 blur-[120px]"></div>
      </div>
      
      {/* Main Register Card */}
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
          <h2 className="text-[24px] md:text-[30px] leading-[32px] md:leading-[38px] font-[600] text-on-surface mb-[4px]">Create Account</h2>
          <p className="text-[16px] leading-[24px] font-[400] text-on-surface-variant">Automate your job search today.</p>
        </header>

        {/* Form Container */}
        <div className="relative w-full">
          {mutation.isSuccess ? (
            <div className="flex flex-col items-center justify-center py-[24px] text-center animate-in fade-in zoom-in duration-300">
               <div className="w-16 h-16 bg-[#006e73]/10 text-[#006e73] rounded-full flex items-center justify-center mb-[24px] mx-auto shadow-sm">
                 <span className="material-symbols-outlined text-[36px]">mark_email_read</span>
               </div>
               <h3 className="text-[20px] font-[600] text-on-surface mb-[8px]">Check Your Email</h3>
               <p className="text-[16px] font-[400] text-on-surface-variant">
                 {mutation.data?.detail || "Verification link sent to your email."}
               </p>
               <Link href="/login" className="mt-[24px] w-full bg-primary hover:bg-primary-container text-on-primary text-[14px] leading-[20px] tracking-[0.01em] font-[700] rounded-lg h-[44px] flex items-center justify-center transition-all">
                 Return to Login
               </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-[16px] w-full" onSubmit={handleSubmit(onSubmit)}>
              
              {/* Global Error Banner */}
              {mutation.isError && !mutation.error?.response?.data?.errors && (
                 <div className="p-[12px] bg-error-container text-on-error-container rounded-lg text-[14px] font-[500]">
                    {mutation.error?.response?.data?.message || "An unexpected error occurred. Please try again."}
                 </div>
              )}

              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[4px]">
                  <label className="text-[14px] leading-[20px] tracking-[0.01em] font-[500] text-on-surface" htmlFor="firstName">First Name</label>
                  <input 
                    className={`w-full bg-surface-container-lowest border ${errors.firstName ? 'border-error focus:ring-error/20' : 'border-outline focus:border-primary focus:ring-primary/20'} text-on-surface text-[16px] leading-[24px] font-[400] rounded-lg px-[16px] py-[8px] focus:ring-2 focus:outline-none transition-all placeholder:text-outline-variant h-[44px]`} 
                    id="firstName" 
                    placeholder="Jane" 
                    {...register("firstName")}
                  />
                  {errors.firstName && <span className="text-[12px] text-error mt-[2px]">{errors.firstName.message}</span>}
                </div>
                <div className="flex flex-col gap-[4px]">
                  <label className="text-[14px] leading-[20px] tracking-[0.01em] font-[500] text-on-surface" htmlFor="lastName">Last Name</label>
                  <input 
                    className={`w-full bg-surface-container-lowest border ${errors.lastName ? 'border-error focus:ring-error/20' : 'border-outline focus:border-primary focus:ring-primary/20'} text-on-surface text-[16px] leading-[24px] font-[400] rounded-lg px-[16px] py-[8px] focus:ring-2 focus:outline-none transition-all placeholder:text-outline-variant h-[44px]`} 
                    id="lastName" 
                    placeholder="Doe" 
                    {...register("lastName")}
                  />
                  {errors.lastName && <span className="text-[12px] text-error mt-[2px]">{errors.lastName.message}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-[4px]">
                <label className="text-[14px] leading-[20px] tracking-[0.01em] font-[500] text-on-surface" htmlFor="email">Email Address</label>
                <div className="relative">
                   <span className="material-symbols-outlined absolute left-[16px] top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
                   <input 
                     className={`w-full bg-surface-container-lowest border ${errors.email ? 'border-error focus:ring-error/20' : 'border-outline focus:border-primary focus:ring-primary/20'} text-on-surface text-[16px] leading-[24px] font-[400] rounded-lg pl-[48px] pr-[16px] py-[8px] focus:ring-2 focus:outline-none transition-all placeholder:text-outline-variant h-[44px]`} 
                     id="email" 
                     placeholder="you@example.com" 
                     type="email"
                     {...register("email")}
                   />
                </div>
                {errors.email && <span className="text-[12px] text-error mt-[2px]">{errors.email.message}</span>}
              </div>
              
              {/* Phone Number */}
              <div className="flex flex-col gap-[4px]">
                <label className="text-[14px] leading-[20px] tracking-[0.01em] font-[500] text-on-surface" htmlFor="phone">Phone Number</label>
                <input 
                  className={`w-full bg-surface-container-lowest border ${errors.phone ? 'border-error focus:ring-error/20' : 'border-outline focus:border-primary focus:ring-primary/20'} text-on-surface text-[16px] leading-[24px] font-[400] rounded-lg px-[16px] py-[8px] focus:ring-2 focus:outline-none transition-all placeholder:text-outline-variant h-[44px]`} 
                  id="phone" 
                  placeholder="+1 (555) 000-0000" 
                  type="tel"
                  {...register("phone")}
                />
                {errors.phone && <span className="text-[12px] text-error mt-[2px]">{errors.phone.message}</span>}
              </div>
              
              {/* Password */}
              <div className="flex flex-col gap-[4px]">
                <label className="text-[14px] leading-[20px] tracking-[0.01em] font-[500] text-on-surface" htmlFor="password">Password</label>
                <div className="relative">
                  <input 
                    className={`w-full bg-surface-container-lowest border ${errors.password ? 'border-error focus:ring-error/20' : 'border-outline focus:border-primary focus:ring-primary/20'} text-on-surface text-[16px] leading-[24px] font-[400] rounded-lg pl-[16px] pr-[40px] py-[8px] focus:ring-2 focus:outline-none transition-all placeholder:text-outline-variant h-[44px]`} 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <button className="absolute inset-y-0 right-0 px-[8px] flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none" onClick={() => setShowPassword(!showPassword)} type="button">
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {errors.password && <span className="text-[12px] text-error mt-[2px]">{errors.password.message}</span>}
              </div>
              
              {/* Confirm Password */}
              <div className="flex flex-col gap-[4px]">
                <label className="text-[14px] leading-[20px] tracking-[0.01em] font-[500] text-on-surface" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative">
                  <input 
                    className={`w-full bg-surface-container-lowest border ${errors.confirmPassword ? 'border-error focus:ring-error/20' : 'border-outline focus:border-primary focus:ring-primary/20'} text-on-surface text-[16px] leading-[24px] font-[400] rounded-lg pl-[16px] pr-[40px] py-[8px] focus:ring-2 focus:outline-none transition-all placeholder:text-outline-variant h-[44px]`} 
                    id="confirmPassword" 
                    placeholder="••••••••" 
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                  />
                  <button className="absolute inset-y-0 right-0 px-[8px] flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none" onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button">
                    <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {errors.confirmPassword && <span className="text-[12px] text-error mt-[2px]">{errors.confirmPassword.message}</span>}
              </div>
              
              {/* Primary CTA */}
              <div className="pt-[8px]">
                <button 
                  className={`w-full text-on-primary text-[14px] leading-[20px] tracking-[0.01em] font-[700] rounded-lg h-[44px] flex items-center justify-center gap-[4px] transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest ${mutation.isPending ? 'bg-primary/80 cursor-wait' : 'bg-primary hover:bg-[#1d82ff] shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] hover:-translate-y-[1px]'}`} 
                  type="submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                     <>
                       <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                       Registering...
                     </>
                  ) : (
                     <>
                       Register
                       <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                     </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Divider */}
        {!mutation.isSuccess && (
          <>
            <div className="flex items-center gap-[16px]">
              <div className="h-px bg-surface-variant flex-1"></div>
              <span className="text-[12px] leading-[16px] tracking-[0.02em] font-[600] text-outline uppercase">OR</span>
              <div className="h-px bg-surface-variant flex-1"></div>
            </div>

            {/* Social Login */}
            <button className="w-full h-[44px] bg-surface-container-lowest border border-outline hover:border-outline-variant hover:bg-surface-container text-on-surface text-[14px] leading-[20px] tracking-[0.01em] font-[500] rounded-lg flex items-center justify-center gap-[8px] transition-all shadow-[0_2px_4px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-primary/20" type="button">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        {/* Footer Link */}
        <div className="text-center mt-[-8px]">
          <p className="text-[16px] leading-[24px] font-[400] text-on-surface-variant">
            Already have an account?{" "}
            <Link className="text-primary font-[700] hover:underline" href="/login">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
