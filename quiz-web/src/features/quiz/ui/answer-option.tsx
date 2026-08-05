import { cn } from "@/lib/utils";
import type { AnswerLabel } from "../model/types";

export function AnswerOption({ checked, label, name, option, onChange }: { checked: boolean; label: AnswerLabel; name: string; option: string; onChange: () => void }) {
  return <label className={cn("flex min-h-16 cursor-pointer items-center gap-4 rounded-[var(--radius-md)] border p-4 text-left transition-colors", checked ? "border-cobalt bg-cobalt-soft" : "border-line bg-white hover:border-cobalt/60")}><input className="sr-only" type="radio" name={name} value={label} checked={checked} onChange={onChange}/><span className={cn("grid size-8 shrink-0 place-items-center rounded-full font-mono text-sm", checked ? "bg-cobalt text-white" : "bg-slate-100 text-slate")}>{label}</span><span className="leading-6">{option}</span></label>;
}
