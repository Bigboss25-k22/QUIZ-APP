import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ label = "Đang tải", className }: { label?: string; className?: string }) {
  return <div role="status" className={cn("flex items-center gap-2 text-sm text-slate", className)}><LoaderCircle className="animate-spin text-cobalt" size={18} aria-hidden="true"/><span>{label}</span></div>;
}
