import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return <Link href="/" className={cn("inline-flex items-center gap-3 font-display font-bold tracking-[-0.025em] text-ink", className)}><span className="grid size-9 place-items-center rounded-[var(--radius-sm)] bg-cobalt font-mono text-sm text-white shadow-[0_8px_20px_-10px_var(--cobalt)]">Q</span><span>Quizboard</span></Link>;
}
