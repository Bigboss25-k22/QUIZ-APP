import { cn } from "@/lib/utils";

export function AssessmentRail({ active = 0, count = 4, className }: { active?: number; count?: number; className?: string }) {
  return <div className={cn("flex gap-1.5", className)} aria-hidden="true">{Array.from({ length: count }, (_, index) => <span key={index} className={cn("h-1.5 flex-1 rounded-full bg-line", index < active && "bg-teal", index === active && "bg-cobalt")}/>)}</div>;
}
