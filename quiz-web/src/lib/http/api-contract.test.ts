import { describe, expect, it } from "vitest";
import { getApiErrorMessage } from "./api-contract";

describe("getApiErrorMessage", () => {
  it("không hiển thị message nội bộ của backend cho lỗi 5xx", () => {
    const error = {
      isAxiosError: true,
      response: {
        data: { status: 500, message: "duplicate key value violates unique constraint", timestamp: 1, path: "/api/auth/login" },
        status: 500,
      },
    };

    expect(getApiErrorMessage(error, "Fallback")).toBe("Hệ thống đang gặp sự cố. Vui lòng thử lại sau.");
  });

  it("giữ message nghiệp vụ cho lỗi 4xx", () => {
    const error = {
      isAxiosError: true,
      response: {
        data: { status: 401, message: "Invalid email or password", timestamp: 1, path: "/api/auth/login" },
        status: 401,
      },
    };

    expect(getApiErrorMessage(error, "Fallback")).toBe("Invalid email or password");
  });
});
