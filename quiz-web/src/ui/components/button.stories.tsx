import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "UI/Components/Button",
  component: Button,
  args: { children: "Bắt đầu làm bài" },
  parameters: { layout: "centered" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { intent: "secondary" } };
export const WithIcon: Story = { args: { children: <>Tiếp tục <ArrowRight size={17}/></> } };
export const Disabled: Story = { args: { disabled: true, children: "Đang xử lý…" } };
