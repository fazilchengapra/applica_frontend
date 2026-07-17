"use client";

import Image from "next/image";
import { useSidebar } from "./SidebarProvider";

export default function TopAppBar() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex justify-between items-center px-4 lg:px-container-padding w-full h-16 sticky top-0 bg-surface z-40 border-b border-outline-variant">
      <div className="flex items-center flex-1 gap-2">
        <button
          onClick={toggleSidebar}
          className="p-2 lg:hidden rounded-md hover:bg-surface-container-low transition-colors text-secondary"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative w-full max-w-[400px] focus-within:ring-2 focus-within:ring-primary/20 rounded-full transition-all hidden sm:flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-secondary text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search or ask AI..."
            className="w-full bg-surface-container-low border border-transparent rounded-full py-[10px] pl-[36px] pr-[40px] text-[14px] focus:bg-surface-container-lowest focus:border-outline-variant transition-all outline-none"
          />
          <div className="absolute right-3 text-[10px] font-bold border border-outline-variant px-1.5 py-0.5 rounded text-secondary pointer-events-none bg-surface-container-lowest">
            ⌘K
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Mobile Search Icon (visible only when search bar is hidden) */}
        <button className="p-2 sm:hidden rounded-full hover:bg-surface-container-low transition-colors text-secondary">
          <span className="material-symbols-outlined text-sm">search</span>
        </button>
        
        <div className="relative cursor-pointer hover:bg-surface-container-low p-2 rounded-full transition-colors">
          <span className="material-symbols-outlined text-secondary" data-icon="notifications">
            notifications
          </span>
          <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></div>
        </div>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest cursor-pointer overflow-hidden border border-outline-variant shrink-0">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            alt="User Profile"
            width={32}
            height={32}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      </div>
    </header>
  );
}
