import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function IconButton({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn("grid size-10 place-items-center rounded-[var(--radius-sm)] border border-line bg-white text-slate transition-colors hover:border-cobalt hover:text-cobalt disabled:opacity-50", className)} {...props} />;
}
