import type { Meta, StoryObj } from "@storybook/react";

import { Register } from "./";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Register> = {
  title: "Sections/Register",
  component: Register,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof Register>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {},
};
