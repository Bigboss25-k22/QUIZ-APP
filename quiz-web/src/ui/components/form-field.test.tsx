import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormField } from "./form-field";

describe("FormField", () => {
  it("kết nối label và thông báo lỗi bằng thuộc tính accessibility", () => {
    render(<FormField label="Email" error="Email chưa hợp lệ"/>);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Email chưa hợp lệ");
  });
});
