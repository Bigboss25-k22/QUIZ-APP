"use client";

import { useDeferredValue, useState } from "react";
import { EmptyState } from "@/ui/components/empty-state";
import { Spinner } from "@/ui/components/spinner";
import { StatusMessage } from "@/ui/components/status-message";
import { PageHeader } from "@/ui/patterns/page-header";
import { SearchField } from "@/ui/patterns/search-field";
import { useQuizzes } from "../model/use-quiz";
import { QuizCard } from "./quiz-card";

export function QuizCatalog() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const { data, isError, isLoading } = useQuizzes(deferredSearch);
  return <div className="p-5 sm:p-8"><PageHeader eyebrow="Kho đề" title="Chọn đúng đề để luyện." description="Tìm theo chủ đề hoặc tên bài kiểm tra." action={<SearchField className="w-full sm:w-72" placeholder="Tìm đề…" value={search} onChange={(event) => setSearch(event.target.value)}/>}/>{isLoading && <Spinner className="mt-10" label="Đang tải kho đề…"/>}{isError && <StatusMessage className="mt-8" tone="error">Không thể tải kho đề. Kiểm tra kết nối rồi thử lại.</StatusMessage>}{data?.content.length ? <section aria-label="Danh sách đề" className="mt-8 grid gap-4 md:grid-cols-2">{data.content.map((quiz) => <QuizCard key={quiz.id} quiz={quiz}/>)}</section> : data && <EmptyState title="Chưa tìm thấy đề" description={search ? "Thử từ khóa ngắn hơn hoặc xóa bộ lọc tìm kiếm." : "Kho đề chưa có nội dung. Hãy quay lại sau."}/>}</div>;
}
