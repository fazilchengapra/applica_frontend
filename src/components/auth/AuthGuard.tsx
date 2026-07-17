"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { setUser, clearUser, setLoading } from "@/store/slices/authSlice";
import api from "@/lib/axios";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await api.get("v1/users/me/");
        if (isMounted) {
          dispatch(setUser(response.data));
        }
      } catch (error: any) {
        if (isMounted) {
          dispatch(clearUser());
          router.push("/login");
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[40px] text-primary animate-spin">progress_activity</span>
          <p className="text-on-surface-variant font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Once loading is false, if not authenticated, we just return null because router.push is handling the redirect.
  // We only render children if authenticated.
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
