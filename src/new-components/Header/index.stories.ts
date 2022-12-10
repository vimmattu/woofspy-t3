import type { Meta, StoryObj } from "@storybook/react";

import { Header } from "./";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Header> = {
  title: "Woofspy/Header",
  component: Header,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof Header>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const WithoutUserImage: Story = {
  args: {
    userName: "John Doe",
  },
};

export const WithUserImage: Story = {
  args: {
    userName: "John Doe",
    userImage: "https://github.com/joelkur.png",
  },
};
