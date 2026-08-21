"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getApiErrorMessage } from "@/lib/http/api-contract";
import { FormField } from "@/ui/components/form-field";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "../model/schemas";
import { useLoginMutation, useRegisterMutation } from "../model/use-auth-mutations";
import { AuthFormView } from "./auth-form-view";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  return mode === "login" ? <LoginForm/> : <RegisterForm/>;
}

function LoginForm() {
  const router = useRouter();
  const mutation = useLoginMutation();
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginInput>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      router.replace("/dashboard");
    } catch (error) {
      setError("root.server", { message: getApiErrorMessage(error, "Không thể đăng nhập. Kiểm tra thông tin và thử lại.") });
    }
  });

  return <AuthFormView mode="login" pending={mutation.isPending} error={errors.root?.server?.message} onSubmit={submit}><FormField autoComplete="email" label="Email" type="email" error={errors.email?.message} {...register("email")}/><FormField autoComplete="current-password" label="Mật khẩu" type="password" error={errors.password?.message} {...register("password")}/></AuthFormView>;
}

function RegisterForm() {
  const router = useRouter();
  const mutation = useRegisterMutation();
  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterInput>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(registerSchema),
  });

  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      router.replace("/dashboard");
    } catch (error) {
      setError("root.server", { message: getApiErrorMessage(error, "Không thể tạo tài khoản. Vui lòng thử lại.") });
    }
  });

  return <AuthFormView mode="register" pending={mutation.isPending} error={errors.root?.server?.message} onSubmit={submit}><FormField autoComplete="name" label="Họ và tên" error={errors.name?.message} {...register("name")}/><FormField autoComplete="email" label="Email" type="email" error={errors.email?.message} {...register("email")}/><FormField autoComplete="new-password" label="Mật khẩu" type="password" hint="Tối thiểu 8 ký tự" error={errors.password?.message} {...register("password")}/><FormField autoComplete="new-password" label="Xác nhận mật khẩu" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")}/></AuthFormView>;
}
