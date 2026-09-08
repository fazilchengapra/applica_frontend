"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { setUser, clearUser } from "@/store/slices/authSlice";
import api from "@/lib/axios";
import { LoaderCircle } from "lucide-react";

export default function AuthGuard({
  children,
  staffOnly = false,
  redirectStaff = false,
}: {
  children: React.ReactNode;
  staffOnly?: boolean;
  redirectStaff?: boolean;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await api.get("v1/users/me/");
        const user = { ...response.data, is_staff: Boolean(response.data?.is_staff) };

        if (isMounted) {
          dispatch(setUser(user));

          if (staffOnly && !user.is_staff) {
            router.replace("/dashboard");
          } else if (redirectStaff && user.is_staff) {
            router.replace("/admin");
          }
        }
      } catch {
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
  }, [dispatch, redirectStaff, router, staffOnly]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
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
