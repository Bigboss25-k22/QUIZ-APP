import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuestionNavigator } from "./question-navigator";

const question = { id: 7, questionText: "Câu hỏi", optionA: "A", optionB: "B", optionC: "C", optionD: "D" };

describe("QuestionNavigator", () => {
  it("mô tả đầy đủ trạng thái câu hỏi cho công nghệ hỗ trợ", () => {
    render(<QuestionNavigator active={0} questions={[question]} answers={{ 7: "A" }} flagged={[7]} onSelect={() => undefined}/>);
    expect(screen.getByRole("button", { name: "Câu 1, đã trả lời, đã đánh dấu" })).toHaveAttribute("aria-current", "step");
  });
});
