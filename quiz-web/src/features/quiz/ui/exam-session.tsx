"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ButtonLink } from "@/ui/components/button";
import { Progress } from "@/ui/components/progress";
import { Spinner } from "@/ui/components/spinner";
import { StatusMessage } from "@/ui/components/status-message";
import { Surface } from "@/ui/components/surface";
import { useAuth } from "@/features/auth/model/auth-provider";
import { ExamStoreProvider, useExamStore, useExamStoreApi } from "../model/exam-store-provider";
import { useQuiz, useSubmitQuiz } from "../model/use-quiz";
import type { QuizDetail } from "../model/types";
import { ExamTimer } from "./exam-timer";
import { QuestionNavigator } from "./question-navigator";
import { QuestionPanel } from "./question-panel";

export function ExamSession() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data, isError, isLoading } = useQuiz(params.id);

  if (isLoading) return <div className="grid min-h-screen place-items-center"><Spinner label="Đang chuẩn bị đề…"/></div>;
  if (isError || !data) return <div className="grid min-h-screen place-items-center px-5"><Surface className="max-w-md text-center"><StatusMessage tone="error">Không thể tải đề kiểm tra. Kiểm tra kết nối rồi thử lại.</StatusMessage><ButtonLink className="mt-5" href="/tests">Quay lại kho đề</ButtonLink></Surface></div>;
  if (!user) return <div className="grid min-h-screen place-items-center"><Spinner label="Đang tải phiên đăng nhập…"/></div>;
  if (!data.questions.length) return <div className="grid min-h-screen place-items-center px-5"><Surface className="max-w-md text-center"><StatusMessage tone="error">Đề kiểm tra chưa có câu hỏi.</StatusMessage><ButtonLink className="mt-5" href="/tests">Quay lại kho đề</ButtonLink></Surface></div>;

  return <ExamStoreProvider key={`${user.id}:${data.testDTO.id}`} quizId={data.testDTO.id} userId={user.id} questionIds={data.questions.map((question) => question.id)}><ExamSessionContent data={data} userId={user.id}/></ExamStoreProvider>;
}

function ExamSessionContent({ data, userId }: { data: QuizDetail; userId: number }) {
  const router = useRouter();
  const submit = useSubmitQuiz();
  const store = useExamStoreApi();
  const active = useExamStore((state) => state.activeQuestionIndex);
  const answers = useExamStore((state) => state.answers);
  const flagged = useExamStore((state) => state.flaggedQuestionIds);
  const startedAt = useExamStore((state) => state.startedAt);
  const hasHydrated = useExamStore((state) => state.hasHydrated);
  const selectAnswer = useExamStore((state) => state.selectAnswer);
  const toggleFlag = useExamStore((state) => state.toggleFlag);
  const goToQuestion = useExamStore((state) => state.goToQuestion);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!hasHydrated) return <div className="grid min-h-screen place-items-center"><Spinner label="Đang khôi phục bài làm…"/></div>;

  const question = data.questions[active];
  const seconds = Math.max(0, data.testDTO.time * 60 - Math.floor((now - startedAt) / 1000));
  const answeredCount = Object.keys(answers).length;
  const finish = () => {
    submit.mutate({
      testId: data.testDTO.id,
      userId,
      responses: Object.entries(answers).map(([questionId, selectedOption]) => ({ questionId: Number(questionId), selectedOption })),
    }, {
      onSuccess: () => {
        store.getState().resetDraft();
        store.persist.clearStorage();
        router.replace("/test-results");
      },
    });
  };

  return <main className="min-h-screen bg-paper"><header className="sticky top-0 z-20 border-b border-line bg-white"><div className="flex h-16 w-full items-center justify-between gap-3 px-5 sm:px-8"><ButtonLink intent="quiet" size="sm" href="/tests"><X size={17} aria-hidden="true"/>Thoát phiên</ButtonLink><p className="hidden truncate font-display text-sm font-bold sm:block">{data.testDTO.title}</p><ExamTimer seconds={seconds}/></div></header><div className="w-full p-5 sm:p-8"><Progress label={`Đã trả lời ${answeredCount}/${data.questions.length} câu`} value={(answeredCount / data.questions.length) * 100}/><div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]"><QuestionPanel active={active} total={data.questions.length} question={question} answer={answers[String(question.id)]} flagged={flagged.includes(question.id)} isLast={active === data.questions.length - 1} pending={submit.isPending} onAnswer={(value) => selectAnswer(question.id, value)} onFlag={() => toggleFlag(question.id)} onPrevious={() => goToQuestion(active - 1)} onNext={() => goToQuestion(active + 1)} onSubmit={finish}/><QuestionNavigator active={active} questions={data.questions} answers={answers} flagged={flagged} onSelect={goToQuestion}/></div>{submit.isError && <StatusMessage className="mt-5" tone="error">Không thể nộp bài. Câu trả lời vẫn được giữ; hãy thử lại.</StatusMessage>}</div></main>;
}
