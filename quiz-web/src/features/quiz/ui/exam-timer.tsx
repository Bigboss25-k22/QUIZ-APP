import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExamTimer({ seconds }: { seconds: number }) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remaining = String(seconds % 60).padStart(2, "0");
  const urgent = seconds <= 60;
  return <div role="timer" aria-label={`Còn ${minutes} phút ${remaining} giây`} className={cn("flex items-center gap-2 rounded-full bg-cobalt-soft px-3 py-1.5 font-mono text-sm font-medium text-cobalt", urgent && "bg-signal-soft text-signal")}><Timer size={17} aria-hidden="true"/>{minutes}:{remaining}</div>;
}
