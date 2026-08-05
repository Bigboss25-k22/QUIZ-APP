"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/ui/components/spinner";
import { useAuth } from "../model/auth-provider";

export function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  useEffect(() => { if (status === "anonymous") router.replace("/login"); }, [router, status]);
  if (status !== "authenticated") return <div className="grid min-h-[60vh] place-items-center"><Spinner label="Đang kiểm tra phiên đăng nhập…"/></div>;
  return <>{children}</>;
}
