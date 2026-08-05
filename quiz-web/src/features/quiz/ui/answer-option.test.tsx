import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AnswerOption } from "./answer-option";

describe("AnswerOption", () => {
  it("giữ radio semantics và phát sự kiện khi người dùng chọn", async () => {
    const onChange = vi.fn();
    render(<AnswerOption name="question-1" label="A" option="Đáp án thứ nhất" checked={false} onChange={onChange}/>);
    const radio = screen.getByRole("radio", { name: /Đáp án thứ nhất/ });
    await userEvent.click(radio);
    expect(onChange).toHaveBeenCalledOnce();
  });
});
