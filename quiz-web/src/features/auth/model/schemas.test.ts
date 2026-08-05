import { describe, expect, it } from "vitest";
import { authResponseSchema, loginSchema, registerSchema, userSchema } from "./schemas";

describe("auth schemas", () => {
  it("parse đúng contract UserDTO và loại field dư", () => {
    expect(userSchema.parse({ id: 1, name: "An", email: "an@example.com", role: "USER" })).toEqual({ id: 1, name: "An", email: "an@example.com" });
  });

  it("từ chối auth response thiếu token", () => {
    expect(() => authResponseSchema.parse({ refreshToken: "refresh", user: { id: 1, name: "An", email: "an@example.com" } })).toThrow();
  });

  it("validate login và password đăng ký theo contract backend", () => {
    expect(loginSchema.safeParse({ email: "sai", password: "secret" }).success).toBe(false);
    expect(registerSchema.safeParse({ name: "An", email: "an@example.com", password: "1234567", confirmPassword: "1234567" }).success).toBe(false);
    expect(registerSchema.safeParse({ name: "An", email: "an@example.com", password: "12345678", confirmPassword: "khacmatkhau" }).success).toBe(false);
  });
});
