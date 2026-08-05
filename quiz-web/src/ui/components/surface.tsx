import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const surfaceVariants = cva("rounded-[var(--radius-lg)] border border-line bg-white shadow-[var(--shadow-surface)]", {
  variants: {
    padding: { none: "", sm: "p-4", md: "p-6", lg: "p-7 sm:p-9" },
    tone: { default: "", soft: "bg-cobalt-soft/40", flat: "shadow-none" },
  },
  defaultVariants: { padding: "md", tone: "default" },
});

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof surfaceVariants>;

export function Surface({ className, padding, tone, ...props }: SurfaceProps) {
  return <div className={cn(surfaceVariants({ padding, tone }), className)} {...props} />;
}
