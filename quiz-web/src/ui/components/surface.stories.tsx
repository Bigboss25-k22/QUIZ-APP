import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Surface } from "./surface";

const meta = {
  title: "UI/Components/Surface",
  component: Surface,
  args: { children: <div className="w-72"><h2 className="font-display text-xl font-bold">Phiên đánh giá</h2><p className="mt-2 text-sm text-slate">Nội dung được nhóm trên một bề mặt nhất quán.</p></div> },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Flat: Story = { args: { tone: "flat" } };
