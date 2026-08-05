import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnswerOption } from "./answer-option";

const meta = {
  title: "Quiz/AnswerOption",
  component: AnswerOption,
  args: { checked: false, label: "A", name: "answer", option: "Kiến trúc hướng sự kiện", onChange: () => undefined },
} satisfies Meta<typeof AnswerOption>;
export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveExample() {
  const [answer, setAnswer] = useState("A");
  return <div className="w-[min(560px,90vw)] space-y-3"><AnswerOption name="demo" label="A" option="Kiến trúc hướng sự kiện" checked={answer === "A"} onChange={() => setAnswer("A")}/><AnswerOption name="demo" label="B" option="Kiến trúc phân lớp" checked={answer === "B"} onChange={() => setAnswer("B")}/></div>;
}

export const Interactive: Story = {
  render: () => <InteractiveExample/>,
};
