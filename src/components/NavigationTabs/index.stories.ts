import type { Meta, StoryObj } from "@storybook/react";

import { StoryBookExample } from "./StoryBookExample";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof StoryBookExample> = {
  title: "Components/NavigationTabs",
  component: StoryBookExample,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof StoryBookExample>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    tabs: [
      { title: "Spy", href: "/", active: true },
      { title: "History", href: "/history" },
      { title: "Settings", href: "/settings" },
    ],
  },
};
