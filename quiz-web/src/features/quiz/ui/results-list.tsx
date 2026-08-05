"use client";

import { EmptyState } from "@/ui/components/empty-state";
import { Spinner } from "@/ui/components/spinner";
import { Surface } from "@/ui/components/surface";
import { PageHeader } from "@/ui/patterns/page-header";
import { useAuth } from "@/features/auth/model/auth-provider";
import { useResults } from "../model/use-quiz";

export function ResultsList() {
  const { user } = useAuth();
  const { data, isLoading } = useResults(user?.id);
  return <div className="p-5 sm:p-8"><PageHeader eyebrow="Lịch sử làm bài" title="Kết quả của bạn" description="Theo dõi điểm số qua từng phiên để chọn nội dung cần luyện tiếp."/><Surface className="mt-8 overflow-hidden" padding="none">{isLoading ? <Spinner className="p-6" label="Đang tải kết quả…"/> : data?.length ? <div className="divide-y divide-line">{data.map((result) => <article key={result.id} className="flex items-center justify-between gap-4 p-5"><div><h2 className="font-semibold">{result.testName}</h2><p className="mt-1 text-sm text-slate">{result.correctAnswers}/{result.totalQuestions} câu đúng</p></div><strong className="font-mono text-xl text-teal" aria-label={`${Math.round(result.percentage)} phần trăm`}>{Math.round(result.percentage)}%</strong></article>)}</div> : <EmptyState title="Chưa có kết quả" description="Hoàn thành bài kiểm tra đầu tiên để bắt đầu theo dõi tiến bộ."/>}</Surface></div>;
}
