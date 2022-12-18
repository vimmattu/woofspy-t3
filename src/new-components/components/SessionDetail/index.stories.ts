import type { Meta, StoryObj } from "@storybook/react";

import { SessionDetail } from "./";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof SessionDetail> = {
  title: "Components/SessionDetail",
  component: SessionDetail,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof SessionDetail>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    session: {
      startTime: new Date("2022-10-11 10:01:04"),
      endTime: new Date("2022-10-11 13:32:42"),
      userId: "#",
      recordings: [
        {
          startTime: new Date("2022-10-11 10:01:04"),
          endTime: new Date("2022-10-11 10:01:04"),
          id: "#",
          sessionId: "#",
        },
        {
          startTime: new Date("2022-10-11 10:01:04"),
          endTime: new Date("2022-10-11 10:01:04"),
          id: "#",
          sessionId: "#",
        },
        {
          startTime: new Date("2022-10-11 10:01:04"),
          endTime: new Date("2022-10-11 10:01:04"),
          id: "#",
          sessionId: "#",
        },
      ],
      id: "#",
    },
  },
};
