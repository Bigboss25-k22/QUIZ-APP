import type { ReactNode } from "react";
import { Eyebrow, PageTitle } from "../components/typography";

export function PageHeader({ action, description, eyebrow, title }: { action?: ReactNode; description?: string; eyebrow: string; title: string }) {
  return <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><Eyebrow>{eyebrow}</Eyebrow><PageTitle className="mt-2 text-3xl leading-tight sm:text-4xl">{title}</PageTitle>{description && <p className="mt-2 max-w-2xl leading-7 text-slate">{description}</p>}</div>{action && <div className="shrink-0">{action}</div>}</header>;
}
