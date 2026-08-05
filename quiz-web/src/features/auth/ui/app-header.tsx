"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ButtonLink } from "@/ui/components/button";
import { IconButton } from "@/ui/components/icon-button";
import { BrandMark } from "@/ui/patterns/brand-mark";
import { useAuth } from "../model/auth-provider";
import { useLogoutMutation } from "../model/use-auth-mutations";

export function AppHeader() {
  const { user, status } = useAuth();
  const logout = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } finally {
      router.push("/");
    }
  };

  return <header className="sticky top-0 z-20 border-b border-line/90 bg-paper/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-5"><BrandMark/><nav aria-label="Điều hướng chính" className="hidden items-center gap-6 text-sm text-slate md:flex"><Link className="hover:text-cobalt" href="/tests">Kho đề</Link><Link className="hover:text-cobalt" href="/help">Trợ giúp</Link><Link className="hover:text-cobalt" href="/contact">Liên hệ</Link></nav>{status === "authenticated" && user ? <div className="flex items-center gap-3"><span className="hidden max-w-44 truncate text-sm font-medium sm:inline">{user.name}</span><IconButton aria-label="Đăng xuất" disabled={logout.isPending} onClick={handleLogout}><LogOut size={17} aria-hidden="true"/></IconButton></div> : <div className="flex items-center gap-2"><ButtonLink intent="quiet" size="sm" href="/login">Đăng nhập</ButtonLink><ButtonLink size="sm" href="/register">Tạo tài khoản</ButtonLink></div>}</div></header>;
}
