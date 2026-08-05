import Link, { type LinkProps } from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      intent: {
        primary: "bg-cobalt text-white hover:bg-cobalt-strong",
        secondary: "border border-line bg-white text-ink hover:border-cobalt hover:text-cobalt",
        quiet: "text-slate hover:bg-cobalt-soft hover:text-cobalt",
        danger: "bg-signal text-white hover:bg-[#9f3424]",
      },
      size: {
        sm: "min-h-9 px-3 text-xs",
        md: "min-h-11 px-5 text-sm",
        lg: "min-h-12 px-6 text-base",
      },
    },
    defaultVariants: { intent: "primary", size: "md" },
  },
);

type ButtonStyleProps = VariantProps<typeof buttonVariants> & { className?: string };
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps;

export function Button({ className, intent, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ intent, size }), className)} {...props} />;
}

export type ButtonLinkProps = LinkProps & ButtonStyleProps & { children: ReactNode };

export function ButtonLink({ className, intent, size, children, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ intent, size }), className)} {...props}>{children}</Link>;
}
