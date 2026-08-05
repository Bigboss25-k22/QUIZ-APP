"use client";

import Link from "next/link";
import { BarChart3, ClipboardList, Settings, Trophy } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Eyebrow } from "../components/typography";

const links = [
  { href: "/dashboard", label: "Tổng quan", icon: BarChart3 },
  { href: "/tests", label: "Kho đề", icon: ClipboardList },
  { href: "/test-results", label: "Kết quả", icon: Trophy },
  { href: "/settings", label: "Cài đặt", icon: Settings },
] as const;

export function WorkspaceNavigation() {
  const pathname = usePathname();
  return <aside className="hidden w-60 shrink-0 border-r border-line bg-white lg:block"><div className="sticky top-16 p-4"><Eyebrow className="mb-4 px-3">Khu vực học tập</Eyebrow><nav aria-label="Khu vực học tập" className="space-y-1">{links.map(({ href, label, icon: Icon }) => { const active = pathname === href; return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-3 text-sm font-semibold transition-colors", active ? "bg-cobalt text-white" : "text-slate hover:bg-cobalt-soft hover:text-cobalt")}><Icon size={17} aria-hidden="true"/>{label}</Link>; })}</nav></div></aside>;
}
