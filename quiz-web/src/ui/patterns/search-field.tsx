import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function SearchField({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <label className={cn("relative block", className)}><span className="sr-only">Tìm kiếm</span><Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" size={18} aria-hidden="true"/><input type="search" className="min-h-11 w-full rounded-[var(--radius-sm)] border border-line bg-white pl-10 pr-3.5 text-sm outline-none transition placeholder:text-slate/70 focus:border-cobalt focus:ring-4 focus:ring-cobalt/10" {...props}/></label>;
}
