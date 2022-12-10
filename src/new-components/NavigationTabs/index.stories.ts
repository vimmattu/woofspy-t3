import type { Meta, StoryObj } from "@storybook/react";

import { NavigationTabs } from "./";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof NavigationTabs> = {
  title: "Components/NavigationTabs",
  component: NavigationTabs,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof NavigationTabs>;

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
