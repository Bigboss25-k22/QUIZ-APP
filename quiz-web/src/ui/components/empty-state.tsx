import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ action, description, title }: { action?: ReactNode; description: string; title: string }) {
  return <div className="grid justify-items-center px-6 py-12 text-center"><span className="grid size-11 place-items-center rounded-full bg-cobalt-soft text-cobalt"><Inbox size={20} aria-hidden="true"/></span><h2 className="mt-4 font-display text-lg font-bold text-ink">{title}</h2><p className="mt-1 max-w-md text-sm leading-6 text-slate">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}
