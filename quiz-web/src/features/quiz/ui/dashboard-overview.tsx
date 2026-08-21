"use client";

import { BarChart3, CircleCheck, ClipboardList } from "lucide-react";
import { ButtonLink } from "@/ui/components/button";
import { Surface } from "@/ui/components/surface";
import { AssessmentRail } from "@/ui/patterns/assessment-rail";
import { MetricCard } from "@/ui/patterns/metric-card";
import { PageHeader } from "@/ui/patterns/page-header";
import { useAuth } from "@/features/auth/model/auth-provider";
import { useQuizzes, useResults } from "../model/use-quiz";

export function DashboardOverview() {
  const { user } = useAuth();
  const { data: quizzes } = useQuizzes();
  const { data: results } = useResults(user?.id);
  const completed = results?.length ?? 0;
  const average = completed ? Math.round(results!.reduce((sum, item) => sum + item.percentage, 0) / completed) : 0;
  return <div className="workspace-page"><PageHeader eyebrow="Tổng quan học tập" title={`Chào, ${user?.name?.split(" ")[0] ?? "bạn"}.`} description="Đây là nhịp độ luyện tập của bạn hôm nay."/><section aria-label="Chỉ số học tập" className="mt-8 grid gap-4 lg:grid-cols-3"><MetricCard icon={<ClipboardList size={18} aria-hidden="true"/>} label="Đề có thể luyện" value={quizzes?.totalElements ?? "—"}/><MetricCard icon={<CircleCheck size={18} aria-hidden="true"/>} label="Phiên hoàn thành" value={completed}/><MetricCard icon={<BarChart3 size={18} aria-hidden="true"/>} label="Điểm trung bình" value={`${average}%`}/></section><Surface className="relative mt-7 overflow-hidden" padding="lg"><div className="absolute inset-y-0 left-0 w-1.5 bg-cobalt" aria-hidden="true"/><div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.7fr)] xl:items-end"><div><p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-cobalt">Bước tiếp theo</p><div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="font-display text-2xl font-bold tracking-[-0.035em]">Chọn một đề để duy trì đà học.</h2><p className="mt-2 text-sm leading-6 text-slate">Mỗi phiên hoàn thành giúp dữ liệu kết quả của bạn chính xác hơn.</p></div><ButtonLink className="shrink-0" href="/tests">Vào kho đề</ButtonLink></div></div><AssessmentRail className="w-full" active={Math.min(3, completed % 4)}/></div></Surface></div>;
}
