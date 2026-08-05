import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../model/auth-provider";
import { AuthForm } from "./auth-form";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  logout: vi.fn(),
  profile: vi.fn(),
  refresh: vi.fn(),
  register: vi.fn(),
  replace: vi.fn(),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mocks.replace, push: mocks.push }) }));
vi.mock("../api/auth-api", () => ({ authApi: { login: mocks.login, logout: mocks.logout, profile: mocks.profile, refresh: mocks.refresh, register: mocks.register } }));

function renderForm(mode: "login" | "register") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}><AuthProvider><AuthForm mode={mode}/></AuthProvider></QueryClientProvider>);
}

describe("AuthForm", () => {
  afterEach(cleanup);

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("không gọi API khi xác nhận mật khẩu không khớp", async () => {
    const user = userEvent.setup();
    renderForm("register");
    await user.type(screen.getByLabelText("Họ và tên"), "Nguyễn An");
    await user.type(screen.getByLabelText("Email"), "an@example.com");
    await user.type(screen.getByLabelText("Mật khẩu"), "matkhau1");
    await user.type(screen.getByLabelText("Xác nhận mật khẩu"), "matkhau2");
    await user.click(screen.getByRole("button", { name: "Tạo tài khoản" }));
    expect(await screen.findByText("Mật khẩu xác nhận chưa trùng khớp.")).toBeInTheDocument();
    expect(mocks.register).not.toHaveBeenCalled();
  });

  it("gọi login mutation với dữ liệu đã validate", async () => {
    mocks.login.mockResolvedValue({ accessToken: "access", refreshToken: "refresh", user: { id: 1, name: "Nguyễn An", email: "an@example.com" } });
    const user = userEvent.setup();
    renderForm("login");
    await user.type(screen.getByLabelText("Email"), "an@example.com");
    await user.type(screen.getByLabelText("Mật khẩu"), "secret");
    await user.click(screen.getByRole("button", { name: "Đăng nhập" }));
    await waitFor(() => expect(mocks.login).toHaveBeenCalledOnce());
    expect(mocks.login.mock.calls[0]?.[0]).toEqual({ email: "an@example.com", password: "secret" });
    expect(mocks.replace).toHaveBeenCalledWith("/dashboard");
  });
});
