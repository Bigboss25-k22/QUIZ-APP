"use client";

import { Button } from "@/ui/components/button";
import { Surface } from "@/ui/components/surface";
import { PageHeader } from "@/ui/patterns/page-header";
import { useAuth } from "../model/auth-provider";

export function AccountSettings() {
  const { user } = useAuth();
  return <div className="p-5 sm:p-8"><PageHeader eyebrow="Cài đặt" title="Tài khoản và tùy chọn" description="Kiểm tra thông tin được dùng cho hồ sơ học tập của bạn."/><Surface className="mt-8 max-w-2xl"><h2 className="font-display text-lg font-bold">Thông tin tài khoản</h2><dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2"><div><dt className="font-mono text-[0.68rem] uppercase tracking-wider text-slate">Họ tên</dt><dd className="mt-1 font-semibold">{user?.name}</dd></div><div><dt className="font-mono text-[0.68rem] uppercase tracking-wider text-slate">Email</dt><dd className="mt-1 break-all font-semibold">{user?.email}</dd></div></dl></Surface><Surface className="mt-5 max-w-2xl"><h2 className="font-display text-lg font-bold">Gói học tập</h2><p className="mt-2 text-sm leading-6 text-slate">Thông tin gói và thanh toán sẽ hiển thị khi backend hỗ trợ chức năng này.</p><Button disabled intent="secondary" className="mt-5">Xem gói học tập · Sắp ra mắt</Button></Surface></div>;
}
