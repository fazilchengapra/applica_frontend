"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { clearUser } from "@/store/slices/authSlice";
import api from "@/lib/axios";

const links = [
  { href: "/admin", label: "Overview", icon: "dashboard" },
  { href: "/admin/users", label: "Users", icon: "group" },
  { href: "/admin/activity", label: "Activity", icon: "monitoring" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await api.post("v1/auth/logout/");
    } finally {
      sessionStorage.removeItem("applica-role-landing-complete");
      dispatch(clearUser());
      router.push("/login");
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col justify-between border-r border-outline-variant bg-surface-container-lowest px-inline-gap py-section-margin max-lg:-translate-x-full">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc0YsM7yHb6b4frOAHLSOmSp1QhsR3vmo5JMPxRnJVKgpzxdYODvBXtOjYlHouU7P_YKeYg_GaFWUfOxgA80Z_t2uZTlwbtbeXzlHfiINA5j2TJDJ116yRUEDpB6ScUkY-mbV0VdXd-ZHrw2vhqXRLkCSB1WWs-uVaBwjmQXwWzf-eMkBfhA2jucxULS8zTs1BS9B9IULZ70jwtPm90OThLhvGPM1uw4a-xxzbdUA_DGxU2Fp4alQEELM6yuNfuQ1YLflWYWC2tQ"
            alt="applica logo"
            width={24}
            height={24}
            className="h-6 w-6 rounded-md"
            unoptimized
          />
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tighter text-primary">
              applica
            </h1>
            <p className="text-[10px] text-secondary opacity-60">
              Admin workspace
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-transform duration-200 ${isActive ? "translate-x-1 bg-surface-container-low font-bold text-primary" : "text-secondary hover:translate-x-1 hover:text-primary"}`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isActive ? "icon-fill" : ""}`}>
                  {link.icon}
                </span>
                <span className="text-[11px]">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-secondary transition-transform duration-200 hover:translate-x-1 hover:text-primary"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        <span className="text-[11px]">Logout</span>
      </button>
    </aside>
  );
}