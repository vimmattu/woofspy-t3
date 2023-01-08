import type { Meta, StoryObj } from "@storybook/react";

import { Login } from "./";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Login> = {
  title: "Sections/Login",
  component: Login,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof Login>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {},
};
