"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import api from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearUser, setUser } from "@/store/slices/authSlice";

export default function PublicOnlyGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const redirectAuthenticatedUser = (isStaff: boolean) => {
      router.replace(isStaff ? "/admin" : "/dashboard");
    };

    if (!isLoading && isAuthenticated && user) {
      redirectAuthenticatedUser(user.is_staff);
      return () => {
        isMounted = false;
      };
    }

    const checkAuth = async () => {
      try {
        const response = await api.get("v1/users/me/");
        const authenticatedUser = {
          ...response.data,
          is_staff: Boolean(response.data?.is_staff),
        };

        if (isMounted) {
          dispatch(setUser(authenticatedUser));
          redirectAuthenticatedUser(authenticatedUser.is_staff);
        }
      } catch {
        if (isMounted) {
          dispatch(clearUser());
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}