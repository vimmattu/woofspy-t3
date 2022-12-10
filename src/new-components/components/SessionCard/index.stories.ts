import type { Meta, StoryObj } from "@storybook/react";

import { SessionCard } from "./";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof SessionCard> = {
  title: "Components/SessionCard",
  component: SessionCard,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof SessionCard>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    startTime: new Date("2022-10-11 10:01:04"),
    endTime: new Date("2022-10-11 13:32:42"),
    eventCount: 65,
  },
};
