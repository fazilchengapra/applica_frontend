"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -100px 0px" }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      sectionObserver.observe(section);
    });

    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-8");
            entry.target.classList.add("opacity-100", "translate-y-0");
            animationObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      animationObserver.observe(el);
    });

    return () => {
      sectionObserver.disconnect();
      animationObserver.disconnect();
    };
  }, []);

 return (
 <div className="landing-page-theme flex flex-col flex-1 bg-background text-on-background font-sans">
 {/* TopNavBar */}
 <nav className="sticky top-0 w-full bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
 <div className="flex justify-between items-center h-16 px-[16px] md:px-[40px] max-w-[1280px] mx-auto border-b border-outline-variant/30 dark:border-outline/20">
 {/* Brand */}
 <Link
 href="/"
 className="text-[20px] leading-[28px] font-[600] font-bold text-primary dark:text-inverse-primary flex items-center gap-2 hover:opacity-90 transition-all duration-200 active:scale-95 transition-transform"
 >
 <Image
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc0YsM7yHb6b4frOAHLSOmSp1QhsR3vmo5JMPxRnJVKgpzxdYODvBXtOjYlHouU7P_YKeYg_GaFWUfOxgA80Z_t2uZTlwbtbeXzlHfiINA5j2TJDJ116yRUEDpB6ScUkY-mbV0VdXd-ZHrw2vhqXRLkCSB1WWs-uVaBwjmQXwWzf-eMkBfhA2jucxULS8zTs1BS9B9IULZ70jwtPm90OThLhvGPM1uw4a-xxzbdUA_DGxU2Fp4alQEELM6yuNfuQ1YLflWYWC2tQ"
 alt="applica Logo"
 width={32}
 height={32}
 className="w-8 h-8 rounded-md"
 unoptimized
 />
 applica
 </Link>
 {/* Desktop Navigation */}
 <ul className="hidden md:flex gap-[24px] items-center font-hanken-grotesk text-[16px] leading-[24px] font-[400]">
 <li>
 <Link
                href="#features"
                className={`py-4 px-2 font-bold transition-all duration-200 active:scale-95 hover:opacity-90 ${activeSection === "features" ? "text-primary dark:text-inverse-primary border-b-2 border-primary" : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary"}`}
 >
 Features
 </Link>
 </li>
 <li>
 <Link
                href="#pricing"
                className={`py-4 px-2 font-bold transition-all duration-200 active:scale-95 hover:opacity-90 ${activeSection === "pricing" ? "text-primary dark:text-inverse-primary border-b-2 border-primary" : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary"}`}
 >
 Pricing
 </Link>
 </li>
 <li>
 <Link
                href="#how-it-works"
                className={`py-4 px-2 font-bold transition-all duration-200 active:scale-95 hover:opacity-90 ${activeSection === "how-it-works" ? "text-primary dark:text-inverse-primary border-b-2 border-primary" : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary"}`}
 >
 How it Works
 </Link>
 </li>
 </ul>
 {/* Actions */}
 <div className="hidden md:flex items-center gap-[16px]">
 <Link
 href="/login"
 className="text-on-surface hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-surface-variant/50"
 >
 Log In
 </Link>
 <Link
 href="/register"
 className="bg-primary hover:bg-primary-container text-on-primary py-2 px-4 rounded-lg transition-colors shadow-sm min-h-[44px] flex items-center"
 >
 Get Started
 </Link>
 </div>
 {/* Mobile Menu Button */}
 <button className="md:hidden p-2 text-on-surface">
 <span className="material-symbols-outlined">menu</span>
 </button>
 </div>
 </nav>
 <main>
 {/* Hero Section */}
 <section className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out relative pt-[64px] pb-[48px] px-[16px] md:px-[40px] max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[48px] items-center overflow-hidden">
 {/* Decorative bg elements */}
 <div className="absolute top-0 right-0 -z-10 w-3/4 h-3/4 bg-primary-fixed/30 rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/4"></div>
 <div className="flex flex-col gap-[24px] z-10">
 <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full w-fit">
 <span className="material-symbols-outlined text-[16px]">bolt</span>
 <span>AI-Powered Job Applications</span>
 </div>
 <h1 className="text-[48px] leading-[56px] tracking-[-0.02em] font-[700] text-on-surface">
 Land more interviews, with <span className="text-primary">less effort</span>.
 </h1>
 <p className="text-[18px] leading-[28px] font-[400] text-on-surface-variant max-w-[512px]">
 AI-tailored resumes, cover letters, and mock interviews to help you land your dream job faster. Stop guessing and start applying with precision.
 </p>
 <div className="flex flex-wrap gap-[16px] mt-[8px]">
 <Link
 href="/register"
 className="bg-primary hover:bg-primary-container text-on-primary py-3 px-6 rounded-lg transition-colors shadow-md min-h-[44px] flex items-center justify-center gap-2 w-full md:w-auto"
 >
 Get Started Free
 <span className="material-symbols-outlined">arrow_forward</span>
 </Link>
 <Link
                href="#how-it-works"
                className={`py-4 px-2 font-bold transition-all duration-200 active:scale-95 hover:opacity-90 ${activeSection === "how-it-works" ? "text-primary dark:text-inverse-primary border-b-2 border-primary" : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary"}`}
 >
 See How It Works
 </Link>
 </div>
 <div className="flex items-center gap-[16px] mt-[8px] text-[12px] leading-[16px] tracking-[0.02em] font-[600] text-on-surface-variant">
 <div className="flex -space-x-2">
 <img
 className="w-8 h-8 rounded-full border-2 border-surface object-cover"
 alt="A small circular avatar showing a smiling young professional woman in a bright modern office setting, professional lighting, corporate modern SaaS aesthetic."
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPC9VHwHD1uHY12xP9q8Xj7PpWKOYtwSUOJsNpSkIfEiiL1TlpOwww-lSw34gnXsQDTFKMcMss9H3DMrA_n0XS0j7BlZxn3RKG7_aI68jgn_M-7fyIWR1-pIAtnYiNJR_v8k7tcRxlhpNdhvtfzNs5QmZNzD3twiBOxK29a0pL3arqdlsi0zRXFQ9_5zjk0aqurlBUlwm9vWHZCIWo5I7KL2uZFx0pA8k2v5ziUUIT1TKMeiXHBdrWPGt1oAZPeGEtBwH28EVQVg"
 />
 <img
 className="w-8 h-8 rounded-full border-2 border-surface object-cover"
 alt="A small circular avatar showing a confident male software engineer in a minimal workspace, professional lighting, corporate modern SaaS aesthetic."
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr8OaCvtFnI_w8PiYcr2BOBkyUfqdkFlbJnMEDLgkiy0zE8keQMtWpNsHPf3DvQ7M89UUUyCOSUf1kTOgylRU8Jegf_twDCSNF7rVD27UCdaLm_eUJTlxKGpoumDetdOvPwehx9myJgxen6yaOkO81TqeGdT22jPnXj2i7CEcfQb_uS5-IgMDF5CFT7Nb7_8nhKySIbCAu7ThZ7ELfN7jXwsM-oHpHpBUIv0FvQqtd4reyGyg7li1wuqL_f_ViuBAZJ1JbcJpyeQ"
 />
 <img
 className="w-8 h-8 rounded-full border-2 border-surface object-cover"
 alt="A small circular avatar showing a diverse professional looking thoughtfully at a screen, clean background, corporate modern SaaS aesthetic."
 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOQGi5VCIvDQyWiQL-Eq4HVRprBvl97jKwvIrhE6xyM09gWtBqHM9mqlHwdobny39D9xujRUkIxaET6F5PdJbkj2HU4KBf3LCMqfQaTFDH_OZvK8Wo5mhA504uApNZ2uVVwbaL-EEI_bSa4XULDVicGBovjKlmzM86HZ4M4EfC7E_mWX1mnKpVhSgA-yQ5iP6MS4VIW8CaIbkSvDxl967axH38rKz_kWmc7nVlSTRG6A3HEbqwefc6hlR-fXHZo9-iP8zFsI9dLQ"
 />
 </div>
 <span>Join 10,000+ applicants accelerating their careers.</span>
 </div>
 </div>
 <div className="relative z-10 rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-outline-variant/50 bg-surface-container-lowest">
 {/* Abstract dashboard UI representation */}
 <div className="h-12 border-b border-outline-variant/30 bg-surface flex items-center px-4 gap-2">
 <div className="w-3 h-3 rounded-full bg-error-container"></div>
 <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
 <div className="w-3 h-3 rounded-full bg-surface-container-highest"></div>
 </div>
 <div className="p-[24px] bg-surface-container-lowest h-[400px] flex flex-col gap-[16px] relative">
 <div
 className="absolute inset-0 bg-cover bg-center opacity-90 rounded-b-xl"
 title="A stylized, clean, minimalist 3D rendering of floating UI cards depicting a resume parsing process, glowing teal accents, deep blue background, corporate modern SaaS aesthetic, high resolution."
 style={{ backgroundImage: "url('https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg')" }}
 ></div>
 </div>
 </div>
 </section>
 {/* Logos / Social Proof */}

 {/* How it Works */}
 <section className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out py-[64px] px-[16px] md:px-[40px] max-w-[1280px] mx-auto" id="how-it-works">
 <div className="text-center max-w-[672px] mx-auto mb-[48px]">
 <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-[700] text-on-surface mb-[8px]">Your fast track to the interview</h2>
 <p className="text-[18px] leading-[28px] font-[400] text-on-surface-variant">Applica streamlines the entire application process in four simple steps.</p>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-4 gap-[24px] relative">
 {/* Connecting line for desktop */}
 <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-surface-variant z-0"></div>
 {/* Step 1 */}
 <div className="relative z-10 flex flex-col items-center text-center gap-[16px]">
 <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center border-4 border-surface-container-lowest shadow-sm">
 <span className="material-symbols-outlined text-primary text-3xl">person_add</span>
 </div>
 <div>
 <h3 className="text-[20px] leading-[28px] font-[600] text-on-surface mb-[4px]">1. Sign Up</h3>
 <p className="text-on-surface-variant text-sm">Create your free account in seconds to access the Applica dashboard.</p>
 </div>
 </div>
 {/* Step 2 */}
 <div className="relative z-10 flex flex-col items-center text-center gap-[16px]">
 <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center border-4 border-surface-container-lowest shadow-sm">
 <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
 </div>
 <div>
 <h3 className="text-[20px] leading-[28px] font-[600] text-on-surface mb-[4px]">2. Upload Resume</h3>
 <p className="text-on-surface-variant text-sm">Provide your current resume and a link to your target job description.</p>
 </div>
 </div>
 {/* Step 3 */}
 <div className="relative z-10 flex flex-col items-center text-center gap-[16px]">
 <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center border-4 border-surface-container-lowest shadow-sm">
 <span className="material-symbols-outlined text-secondary text-3xl filled-icon">psychology</span>
 </div>
 <div>
 <h3 className="text-[20px] leading-[28px] font-[600] text-on-surface mb-[4px]">3. AI Tailors</h3>
 <p className="text-on-surface-variant text-sm">Our AI optimizes your resume and drafts a perfect cover letter.</p>
 </div>
 </div>
 {/* Step 4 */}
 <div className="relative z-10 flex flex-col items-center text-center gap-[16px]">
 <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center border-4 border-surface-container-lowest shadow-sm">
 <span className="material-symbols-outlined text-primary text-3xl">record_voice_over</span>
 </div>
 <div>
 <h3 className="text-[20px] leading-[28px] font-[600] text-on-surface mb-[4px]">4. Practice Mock</h3>
 <p className="text-on-surface-variant text-sm">Ace the interview with AI-simulated questions based on the role.</p>
 </div>
 </div>
 </div>
 </section>
 {/* Features (Bento Grid) */}
 <section className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out py-[64px] px-[16px] md:px-[40px] max-w-[1280px] mx-auto bg-surface-container-low rounded-3xl mb-[48px]" id="features">
 <div className="text-center max-w-[672px] mx-auto mb-[48px]">
 <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-[700] text-on-surface mb-[8px]">Tools to elevate your application</h2>
 <p className="text-[18px] leading-[28px] font-[400] text-on-surface-variant">Everything you need to stand out in a crowded job market, powered by advanced AI.</p>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] auto-rows-[300px]">
 {/* Feature 1: Large Card */}
 <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-[24px] shadow-[0_2px_4px_rgb(0,0,0,0.04)] border border-outline-variant/30 flex flex-col justify-between overflow-hidden relative group hover:-translate-y-1 transition-transform duration-300">
 <div className="z-10">
 <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-[16px]">
 <span className="material-symbols-outlined text-primary">document_scanner</span>
 </div>
 <h3 className="text-[20px] leading-[28px] font-[600] text-on-surface mb-[8px]">AI Resume Optimization</h3>
 <p className="text-on-surface-variant max-w-[448px]">Our engine aligns your experience with the job description, injecting optimal keywords and restructuring for maximum impact.</p>
 </div>
 <div className="absolute bottom-0 right-0 w-2/3 h-1/2 opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none">
 <div className="w-full h-full bg-gradient-to-tl from-primary to-transparent rounded-tl-full blur-2xl"></div>
 </div>
 </div>
 {/* Feature 2: Small Card */}
 <div className="bg-surface-container-lowest rounded-xl p-[24px] shadow-[0_2px_4px_rgb(0,0,0,0.04)] border border-outline-variant/30 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
 <div>
 <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-[16px]">
 <span className="material-symbols-outlined text-secondary">edit_document</span>
 </div>
 <h3 className="text-[20px] leading-[28px] font-[600] text-on-surface mb-[8px]">Personalized Cover Letters</h3>
 <p className="text-on-surface-variant">Generate compelling, highly tailored cover letters in seconds, matching the tone of the company.</p>
 </div>
 </div>
 {/* Feature 3: Small Card */}
 <div className="bg-surface-container-lowest rounded-xl p-[24px] shadow-[0_2px_4px_rgb(0,0,0,0.04)] border border-outline-variant/30 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
 <div>
 <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center mb-[16px]">
 <span className="material-symbols-outlined text-tertiary">co_present</span>
 </div>
 <h3 className="text-[20px] leading-[28px] font-[600] text-on-surface mb-[8px]">AI Mock Interviews</h3>
 <p className="text-on-surface-variant">Practice with dynamic AI that asks role-specific questions and provides real-time feedback on your answers.</p>
 </div>
 </div>
 {/* Feature 4: Large Card */}
 <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-[24px] shadow-[0_2px_4px_rgb(0,0,0,0.04)] border border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-[24px] hover:-translate-y-1 transition-transform duration-300">
 <div className="flex-1">
 <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center mb-[16px]">
 <span className="material-symbols-outlined text-primary-container">query_stats</span>
 </div>
 <h3 className="text-[20px] leading-[28px] font-[600] text-on-surface mb-[8px]">Application Tracking Dashboard</h3>
 <p className="text-on-surface-variant">Manage all your tailored assets and track application statuses in one clean, centralized workspace.</p>
 </div>
 <div className="flex-1 w-full h-full min-h-[150px] bg-surface-container rounded-lg border border-outline-variant/20 flex items-center justify-center relative overflow-hidden">
 <div
 className="absolute inset-0 opacity-10"
 style={{
 backgroundImage: "repeating-linear-gradient(45deg, #0059b8 25%, transparent 25%, transparent 75%, #0059b8 75%, #0059b8), repeating-linear-gradient(45deg, #0059b8 25%, transparent 25%, transparent 75%, #0059b8 75%, #0059b8)",
 backgroundPosition: "0 0, 10px 10px",
 backgroundSize: "20px 20px"
 }}
 ></div>
 <span className="material-symbols-outlined text-outline text-4xl relative z-10">monitoring</span>
 </div>
 </div>
 </div>
 </section>
 {/* Pricing Section */}
 <section className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out py-[64px] px-[16px] md:px-[40px] max-w-[1280px] mx-auto" id="pricing">
 <div className="text-center max-w-[672px] mx-auto mb-[48px]">
 <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-[700] text-on-surface mb-[8px]">Simple, transparent pricing</h2>
 <p className="text-[18px] leading-[28px] font-[400] text-on-surface-variant">Invest in your career with a plan that fits your job search velocity.</p>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] max-w-[896px] mx-auto">
 {/* Free Tier */}
 <div className="bg-surface-container-lowest rounded-xl p-[32px] shadow-[0_2px_4px_rgb(0,0,0,0.04)] border border-outline-variant/30 flex flex-col">
 <div className="mb-[24px]">
 <h3 className="text-[20px] leading-[28px] font-[600] text-on-surface mb-[4px]">Free Tier</h3>
 <p className="text-on-surface-variant">For the casual job seeker.</p>
 </div>
 <div className="mb-[24px]">
 <span className="text-[48px] leading-[56px] tracking-[-0.02em] font-[700] text-on-surface">$0</span>
 <span className="text-on-surface-variant">/mo</span>
 </div>
 <ul className="flex flex-col gap-[8px] mb-[32px] flex-grow">
 <li className="flex items-center gap-2 text-on-surface">
 <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
 Basic resume optimization
 </li>
 <li className="flex items-center gap-2 text-on-surface">
 <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
 5 applications per month
 </li>
 <li className="flex items-center gap-2 text-on-surface">
 <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
 Standard cover letter generation
 </li>
 <li className="flex items-center gap-2 text-outline-variant">
 <span className="material-symbols-outlined text-sm">remove</span>
 No mock interviews
 </li>
 </ul>
 <Link className="w-full bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface py-3 rounded-lg transition-colors text-center min-h-[44px]" href="#">
 Get Started Free
 </Link>
 </div>
 {/* Pro Tier */}
 <div className="bg-primary-fixed/20 rounded-xl p-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-primary flex flex-col relative overflow-hidden">
 <div className="absolute top-0 right-0 bg-primary text-on-primary px-4 py-1 rounded-bl-lg">Most Popular</div>
 <div className="mb-[24px]">
 <h3 className="text-[20px] leading-[28px] font-[600] text-on-surface mb-[4px]">Pro Tier</h3>
 <p className="text-on-surface-variant">Accelerate your career search.</p>
 </div>
 <div className="mb-[24px]">
 <span className="text-[48px] leading-[56px] tracking-[-0.02em] font-[700] text-on-surface">$19</span>
 <span className="text-on-surface-variant">/mo</span>
 </div>
 <ul className="flex flex-col gap-[8px] mb-[32px] flex-grow">
 <li className="flex items-center gap-2 text-on-surface">
 <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
 Advanced resume optimization
 </li>
 <li className="flex items-center gap-2 text-on-surface font-semibold">
 <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
 Unlimited applications
 </li>
 <li className="flex items-center gap-2 text-on-surface">
 <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
 Highly tailored cover letters
 </li>
 <li className="flex items-center gap-2 text-on-surface">
 <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
 Video mock interviews & feedback
 </li>
 <li className="flex items-center gap-2 text-on-surface">
 <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
 Priority support
 </li>
 </ul>
 <Link className="w-full bg-primary hover:bg-primary-container text-on-primary py-3 rounded-lg transition-colors text-center min-h-[44px] shadow-sm" href="#">
 Upgrade to Pro
 </Link>
 </div>
 </div>
 </section>
 {/* CTA Banner */}
 <section className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out py-[64px] px-[16px] md:px-[40px]">
 <div className="max-w-[1280px] mx-auto bg-primary rounded-2xl p-[32px] md:p-[64px] flex flex-col md:flex-row items-center justify-between gap-[32px] relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
 {/* abstract graphic */}
 <div className="absolute right-0 top-0 w-64 h-64 bg-primary-container rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
 <div className="absolute left-0 bottom-0 w-48 h-48 bg-secondary-container rounded-full blur-2xl opacity-20 transform -translate-x-1/4 translate-y-1/4"></div>
 <div className="relative z-10 max-w-[576px] text-center md:text-left">
 <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-[700] text-on-primary mb-[8px]">Ready to land that dream job?</h2>
 <p className="text-[18px] leading-[28px] font-[400] text-primary-fixed-dim">Join thousands of job seekers who are getting more interviews with less stress.</p>
 </div>
 <div className="relative z-10 flex flex-col sm:flex-row gap-[16px] w-full md:w-auto">
 <Link
 className="bg-surface-container-lowest hover:bg-surface text-primary py-4 px-8 rounded-lg transition-colors shadow-sm text-center min-h-[44px] whitespace-nowrap"
 href="/register"
 >
 Get Started for Free
 </Link>
 </div>
 </div>
 </section>
 </main>
 <Footer />
 </div>
 );
}
