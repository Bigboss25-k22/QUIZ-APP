import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { FormField } from "./form-field";

const meta = {
  title: "UI/Components/FormField",
  component: FormField,
  args: { label: "Email", placeholder: "ban@example.com", type: "email" },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Email" });
    await userEvent.type(input, "hocvien@example.com");
    await expect(input).toHaveValue("hocvien@example.com");
  },
};

export const WithHint: Story = { args: { label: "Mật khẩu", type: "password", hint: "Tối thiểu 6 ký tự" } };
export const Invalid: Story = { args: { error: "Email chưa đúng định dạng." } };
