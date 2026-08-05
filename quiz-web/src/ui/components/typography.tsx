import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-cobalt", className)} {...props} />;
}

export function PageTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn("font-display font-bold tracking-[-0.04em] text-ink", className)} {...props} />;
}
