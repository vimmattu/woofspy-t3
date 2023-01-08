import type { Meta, StoryObj } from "@storybook/react";

import { SessionList } from "./";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof SessionList> = {
  title: "Components/SessionList",
  component: SessionList,
  tags: ["docsPage"],
};

export default meta;
type Story = StoryObj<typeof SessionList>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    sessions: {
      "2022-10-11": [
        {
          id: "session-4",
          startTime: new Date("2022-10-11 13:41:51"),
          endTime: new Date("2022-10-11 17:20:21"),
          _count: {
            recordings: 0,
          },
        },
        {
          id: "session-3",
          startTime: new Date("2022-10-11 08:30:03"),
          endTime: new Date("2022-10-11 10:13:42"),
          _count: {
            recordings: 0,
          },
        },
      ],
      "2022-10-10": [
        {
          id: "session-2",
          startTime: new Date("2022-10-11 13:41:51"),
          endTime: new Date("2022-10-11 17:20:21"),
          _count: {
            recordings: 0,
          },
        },
        {
          id: "session-1",
          startTime: new Date("2022-10-11 08:30:03"),
          endTime: new Date("2022-10-11 10:13:42"),
          _count: {
            recordings: 0,
          },
        },
      ],
    },
  },
};
