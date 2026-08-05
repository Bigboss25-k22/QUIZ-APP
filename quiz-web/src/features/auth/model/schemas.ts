import { z } from "zod";
import { tokenPairSchema } from "@/lib/http/token-schema";

const requiredText = (label: string) => z.string().trim().min(1, { error: `${label} là bắt buộc.` });

export const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.email(),
});

export const authResponseSchema = tokenPairSchema.extend({ user: userSchema });

export const loginSchema = z.object({
  email: z.email({ error: "Email chưa đúng định dạng." }),
  password: requiredText("Mật khẩu"),
});

export const registerSchema = z.object({
  name: requiredText("Họ và tên"),
  email: z.email({ error: "Email chưa đúng định dạng." }),
  password: z.string().min(8, { error: "Mật khẩu phải có ít nhất 8 ký tự." }),
  confirmPassword: requiredText("Xác nhận mật khẩu"),
}).superRefine((values, context) => {
  if (values.password !== values.confirmPassword) {
    context.addIssue({ code: "custom", path: ["confirmPassword"], message: "Mật khẩu xác nhận chưa trùng khớp." });
  }
});

export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type LoginInput = z.input<typeof loginSchema>;
export type RegisterInput = z.input<typeof registerSchema>;
