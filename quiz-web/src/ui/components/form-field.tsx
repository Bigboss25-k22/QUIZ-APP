import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  hint?: string;
  error?: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField({ className, error, hint, id, label, ...props }, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  return <div>
    <label htmlFor={inputId} className="block text-sm font-semibold text-ink">{label}</label>
    <input ref={ref} id={inputId} aria-invalid={Boolean(error)} aria-describedby={error || hint ? descriptionId : undefined} className={cn("mt-1.5 min-h-11 w-full rounded-[var(--radius-sm)] border border-line bg-white px-3.5 text-ink outline-none transition placeholder:text-slate/70 focus:border-cobalt focus:ring-4 focus:ring-cobalt/10", error && "border-signal focus:border-signal focus:ring-signal/10", className)} {...props} />
    {(error || hint) && <p id={descriptionId} className={cn("mt-1.5 text-xs leading-5 text-slate", error && "text-signal")}>{error ?? hint}</p>}
  </div>;
});
