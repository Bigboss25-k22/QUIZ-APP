import { AlertCircle, CircleCheck, Info } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const statusStyles = {
  info: { icon: Info, className: "bg-cobalt-soft text-cobalt" },
  success: { icon: CircleCheck, className: "bg-teal-soft text-teal" },
  error: { icon: AlertCircle, className: "bg-signal-soft text-signal" },
} as const;

export function StatusMessage({ className, tone = "info", children, ...props }: HTMLAttributes<HTMLDivElement> & { tone?: keyof typeof statusStyles }) {
  const config = statusStyles[tone];
  const Icon = config.icon;
  return <div role={tone === "error" ? "alert" : "status"} className={cn("flex items-start gap-2.5 rounded-[var(--radius-sm)] px-4 py-3 text-sm leading-6", config.className, className)} {...props}><Icon className="mt-0.5 shrink-0" size={17} aria-hidden="true"/><span>{children}</span></div>;
}
