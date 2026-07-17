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

        <div className="relative w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 rounded-full transition-all hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search or ask AI..."
            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-body-sm focus:bg-white transition-all outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold border border-outline-variant px-1 rounded text-secondary pointer-events-none">
            ⌘ K
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
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0t8RasIiKQtRhKiKDNqJpBqFXa29QHlUJpiFJXs6gWwqq2z0Tih1tO3BoEWRz0E0z6X-M-8QdQSaB5O6n8jzpaXCXrM-VT1kiI4k3tuhRiXuycaZWPLpRIE1XSlSzZr5nC0PZsWeAeI3rWpliMoLUCzYrGDArYs4VlD7gQb7rx3xncKf08T9ERkgA1mNZ2N9Ns0FveWdbZPoWU1Eaep5PeMSdxTIyJiaw4ooqSDxaxqrCVjtV1CnRtnLHm-2-654sNREfDXosjQ"
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
