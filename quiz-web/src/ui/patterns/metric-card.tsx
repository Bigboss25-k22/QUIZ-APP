import type { ReactNode } from "react";
import { Surface } from "../components/surface";

export function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return <Surface className="min-h-36" padding="sm"><div className="flex items-center gap-2 text-cobalt">{icon}<span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-slate">{label}</span></div><p className="mt-5 font-display text-4xl font-bold tracking-[-0.04em] text-ink">{value}</p></Surface>;
}
