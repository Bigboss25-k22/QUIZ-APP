"use client";

import { Button } from "@/ui/components/button";
import { Surface } from "@/ui/components/surface";
import { Eyebrow, PageTitle } from "@/ui/components/typography";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <main className="grid min-h-[60vh] place-items-center p-6"><Surface className="max-w-md text-center" padding="lg"><Eyebrow>Đã có sự cố</Eyebrow><PageTitle className="mt-3 text-3xl">Không thể hiển thị trang này.</PageTitle><p className="mt-3 leading-7 text-slate">Hãy thử lại. Nếu sự cố lặp lại, vui lòng liên hệ hỗ trợ.</p><Button className="mt-6" onClick={reset}>Thử lại</Button></Surface></main>;
}
