import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../server/trpc/router";
import { useRecordingFile, useSessions } from "../../hooks/sessions";
import dayjs from "dayjs";

const Sessions: NextPage = () => {
  const { data, isLoading } = useSessions();
  const [selectedSession, setSelectedSession] = useState<string>();

  if (isLoading || !data) return <p>loading...</p>;

  return (
    <>
      <Head>
        <title>Woof history</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full px-4 md:w-1/2 xl:w-1/3">
        <h1 className="mb-2 text-center text-3xl">Woof history</h1>
        <ul>
          {Object.entries(data).map(([date, sessions]) => (
            <div key={date}>
              <h2 className="font-bold">{dayjs(date).format("DD.MM.YYYY")}</h2>
              <ul className="mt-1 mb-2 ml-8 bg-white p-1 shadow ">
                {sessions.map((s) => (
                  <SessionItem
                    session={s}
                    key={s.id}
                    onSelect={() => setSelectedSession(s.id)}
                    onHide={() => setSelectedSession(undefined)}
                    isSelected={selectedSession === s.id}
                  />
                ))}
              </ul>
            </div>
          ))}
        </ul>
      </main>
    </>
  );
};

type InferredSessionType = inferProcedureOutput<
  AppRouter["sessions"]["getSessions"]
>[""][0];

interface Selectable {
  onHide: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

interface SessionItemProps extends Selectable {
  session: InferredSessionType;
}

const SessionItem: React.FC<SessionItemProps> = ({
  session,
  onSelect,
  onHide,
  isSelected,
}) => {
  const [selectedRecording, setSelectedRecording] = useState<string>();

  const timeDisplay = !session.endTime
    ? `${formatTime(session.startTime)} - still spying`
    : `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`;

  return (
    <li>
      <div className="mb-1 flex items-center justify-between px-2 transition-colors hover:bg-gray-200">
        <div>
          <p>{timeDisplay}</p>
          <p className="text-sm italic">{session.recordings.length} events</p>
        </div>
        <button
          className="text-blue-500"
          onClick={isSelected ? onHide : onSelect}
        >
          {isSelected ? "Hide" : "View"}
        </button>
      </div>
      {isSelected && (
        <ul className="border-2 border-gray-100 p-2">
          {session.recordings
            .slice()
            .reverse()
            .map((r) => (
              <RecordingItem
                key={r.id}
                recording={r}
                onSelect={() => setSelectedRecording(r.id)}
                onHide={() => setSelectedRecording(undefined)}
                isSelected={selectedRecording === r.id}
              />
            ))}
        </ul>
      )}
    </li>
  );
};

interface RecordingItemProps extends Selectable {
  recording: InferredSessionType["recordings"][0];
}

const RecordingItem: React.FC<RecordingItemProps> = ({
  recording,
  isSelected,
  onSelect,
  onHide,
}) => {
  return (
    <li>
      <div className="mb-1 ml-4 flex items-center justify-between px-2 transition-colors hover:bg-gray-200">
        <p>{formatTime(recording.startTime)}</p>
        <button
          onClick={isSelected ? onHide : onSelect}
          className="text-blue-500"
        >
          {isSelected ? "Hide" : "View"}
        </button>
      </div>
      {isSelected && <RecordingVideo id={recording.id} />}
    </li>
  );
};

const RecordingVideo: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = useRecordingFile(id);
  if (isLoading) return <p>Loading</p>;
  return <video src={data} controls autoPlay />;
};

const formatTime = (date: Date) => dayjs(date).format("HH:mm:ss");

export default Sessions;
