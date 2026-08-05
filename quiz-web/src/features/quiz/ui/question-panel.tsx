import { Flag } from "lucide-react";
import { Button } from "@/ui/components/button";
import { IconButton } from "@/ui/components/icon-button";
import { Surface } from "@/ui/components/surface";
import { Eyebrow } from "@/ui/components/typography";
import { cn } from "@/lib/utils";
import type { AnswerLabel, Question } from "../model/types";
import { AnswerOption } from "./answer-option";

const labels = ["A", "B", "C", "D"] as const;

export function QuestionPanel({ active, answer, flagged, isLast, pending, question, total, onAnswer, onFlag, onNext, onPrevious, onSubmit }: {
  active: number;
  answer?: AnswerLabel;
  flagged: boolean;
  isLast: boolean;
  pending: boolean;
  question: Question;
  total: number;
  onAnswer: (value: AnswerLabel) => void;
  onFlag: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}) {
  return <Surface padding="lg"><div className="flex items-center justify-between"><Eyebrow>Câu {active + 1} / {total}</Eyebrow><IconButton onClick={onFlag} aria-pressed={flagged} aria-label={flagged ? "Bỏ đánh dấu câu hỏi" : "Đánh dấu câu hỏi"} className={cn(flagged && "border-warning bg-warning-soft text-warning")}><Flag size={18} aria-hidden="true"/></IconButton></div><fieldset className="mt-7"><legend className="font-display text-2xl font-bold leading-snug tracking-[-0.03em] text-ink sm:text-3xl">{question.questionText}</legend><div className="mt-8 space-y-3">{labels.map((label) => <AnswerOption key={label} name={`question-${question.id}`} label={label} option={question[`option${label}`]} checked={answer === label} onChange={() => onAnswer(label)}/>)}</div></fieldset><div className="mt-9 flex justify-between gap-3 border-t border-line pt-6"><Button onClick={onPrevious} disabled={active === 0} intent="secondary">Câu trước</Button>{isLast ? <Button disabled={pending} onClick={onSubmit}>{pending ? "Đang nộp…" : "Nộp bài"}</Button> : <Button onClick={onNext}>Câu tiếp</Button>}</div></Surface>;
}
