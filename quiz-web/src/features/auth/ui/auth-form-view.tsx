"use client";

import Link from "next/link";
import type { FormEventHandler, ReactNode } from "react";
import { Button } from "@/ui/components/button";
import { StatusMessage } from "@/ui/components/status-message";
import { Surface } from "@/ui/components/surface";
import { Eyebrow, PageTitle } from "@/ui/components/typography";

export function AuthFormView({ children, error, mode, pending, onSubmit }: {
  children: ReactNode;
  error?: string;
  mode: "login" | "register";
  pending: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const login = mode === "login";
  return <div className="assessment-grid flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-12"><Surface className="w-full max-w-md" padding="lg"><Eyebrow>Tài khoản học viên</Eyebrow><PageTitle className="mt-2 text-3xl">{login ? "Chào mừng trở lại" : "Bắt đầu luyện tập"}</PageTitle><p className="mt-2 text-sm leading-6 text-slate">{login ? "Đăng nhập để tiếp tục tiến độ của bạn." : "Tạo tài khoản để lưu điểm và lịch sử làm bài."}</p><Button disabled intent="secondary" className="mt-7 w-full" aria-label="Đăng nhập Google, sắp được hỗ trợ">Tiếp tục với Google · Sắp ra mắt</Button><div className="my-6 flex items-center gap-3 text-xs text-slate before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">hoặc</div><form onSubmit={onSubmit} noValidate aria-busy={pending}><div className="space-y-4">{children}</div>{error && <StatusMessage className="mt-4" tone="error">{error}</StatusMessage>}<Button type="submit" disabled={pending} className="mt-7 w-full">{pending ? "Đang xử lý…" : login ? "Đăng nhập" : "Tạo tài khoản"}</Button></form><p className="mt-5 text-center text-sm text-slate">{login ? <>Chưa có tài khoản? <Link className="font-semibold text-cobalt hover:underline" href="/register">Đăng ký</Link></> : <>Đã có tài khoản? <Link className="font-semibold text-cobalt hover:underline" href="/login">Đăng nhập</Link></>}</p>{login && <p className="mt-4 text-center text-xs text-slate">Khôi phục mật khẩu sẽ sớm được hỗ trợ.</p>}</Surface></div>;
}
