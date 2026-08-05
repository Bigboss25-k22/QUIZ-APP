import { Timer } from "lucide-react";
import { ButtonLink } from "@/ui/components/button";
import { Surface } from "@/ui/components/surface";
import { Eyebrow } from "@/ui/components/typography";
import type { QuizSummary } from "../model/types";

export function QuizCard({ quiz }: { quiz: QuizSummary }) {
  return <Surface className="flex h-full flex-col" padding="md"><div className="flex items-start justify-between gap-4"><div><Eyebrow>{quiz.category || "Tổng hợp"}</Eyebrow><h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.035em] text-ink">{quiz.title}</h2></div><span className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-slate"><Timer size={15} aria-hidden="true"/>{quiz.time} phút</span></div><p className="mt-4 flex-1 leading-7 text-slate">{quiz.description}</p><ButtonLink className="mt-6" href={`/test/${quiz.id}`}>Bắt đầu làm bài</ButtonLink></Surface>;
}
