"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "./SidebarProvider";
import { useAppDispatch } from "@/store";
import { clearUser } from "@/store/slices/authSlice";
import api from "@/lib/axios";

export default function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      // Hit the backend to clear HTTP-only cookies
      await api.post("v1/auth/logout/");
    } catch (error) {
      console.error("Logout failed on server", error);
    } finally {
      // Always clear client state and redirect, even if server request fails
      dispatch(clearUser());
      router.push("/login");
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col justify-between py-section-margin px-inline-gap z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc0YsM7yHb6b4frOAHLSOmSp1QhsR3vmo5JMPxRnJVKgpzxdYODvBXtOjYlHouU7P_YKeYg_GaFWUfOxgA80Z_t2uZTlwbtbeXzlHfiINA5j2TJDJ116yRUEDpB6ScUkY-mbV0VdXd-ZHrw2vhqXRLkCSB1WWs-uVaBwjmQXwWzf-eMkBfhA2jucxULS8zTs1BS9B9IULZ70jwtPm90OThLhvGPM1uw4a-xxzbdUA_DGxU2Fp4alQEELM6yuNfuQ1YLflWYWC2tQ"
              alt="applica Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-md"
              unoptimized
            />
            <div>
              <h1 className="font-display-lg text-display-lg text-primary tracking-tighter leading-none">
                applica
              </h1>
              <p className="font-label-caps text-label-caps text-secondary opacity-60">
                Job Automation
              </p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {/* Dashboard Tab */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 transition-transform duration-200 rounded-lg ${pathname === "/dashboard"
                  ? "text-primary font-bold bg-surface-container-low translate-x-1"
                  : "text-secondary hover:text-primary hover:translate-x-1"
                }`}
            >
              <span
                className={`material-symbols-outlined ${pathname === "/dashboard" ? "icon-fill" : ""
                  }`}
                data-icon="dashboard"
              >
                dashboard
              </span>
              <span className="font-label-caps text-label-caps">Dashboard</span>
            </Link>
            {/* Profile Tab */}
            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-3 px-4 py-3 transition-transform duration-200 rounded-lg ${pathname === "/dashboard/profile"
                  ? "text-primary font-bold bg-surface-container-low translate-x-1"
                  : "text-secondary hover:text-primary hover:translate-x-1"
                }`}
            >
              <span
                className={`material-symbols-outlined ${pathname === "/dashboard/profile" ? "icon-fill" : ""
                  }`}
                data-icon="person"
              >
                person
              </span>
              <span className="font-label-caps text-label-caps">Profile</span>
            </Link>
          </nav>
        </div>
        <nav className="flex flex-col gap-1">
          {/* Settings */}
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-4 py-3 transition-transform duration-200 rounded-lg ${pathname === "/dashboard/settings"
                ? "text-primary font-bold bg-surface-container-low translate-x-1"
                : "text-secondary hover:text-primary hover:translate-x-1"
              }`}
          >
            <span
              className={`material-symbols-outlined ${pathname === "/dashboard/settings" ? "icon-fill" : ""
                }`}
              data-icon="settings"
            >
              settings
            </span>
            <span className="font-label-caps text-label-caps">Settings</span>
          </Link>
          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-secondary transition-transform duration-200 hover:text-primary hover:translate-x-1 w-full text-left cursor-pointer"
          >
            <span className="material-symbols-outlined" data-icon="logout">
              logout
            </span>
            <span className="font-label-caps text-label-caps">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
