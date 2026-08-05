import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QuizCard } from "./quiz-card";

const meta = {
  title: "Quiz/QuizCard",
  component: QuizCard,
  args: { quiz: { id: 1, title: "Kiến trúc phần mềm", description: "Đánh giá khả năng phân tích các kiểu kiến trúc và lựa chọn trade-off phù hợp.", category: "Kỹ thuật phần mềm", time: 30 } },
  decorators: [(Story) => <div className="w-[min(520px,90vw)]"><Story/></div>],
} satisfies Meta<typeof QuizCard>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
