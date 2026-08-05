import { cn } from "@/lib/utils";

export function Progress({ className, label, value }: { className?: string; label: string; value: number }) {
  const normalized = Math.min(100, Math.max(0, value));
  return <div className={cn(className)}><div className="mb-2 flex justify-between text-xs text-slate"><span>{label}</span><span className="font-mono">{Math.round(normalized)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(normalized)}><div className="h-full rounded-full bg-cobalt transition-[width]" style={{ width: `${normalized}%` }}/></div></div>;
}
