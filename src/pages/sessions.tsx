import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import React from "react";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../server/trpc/router";

const Sessions: NextPage = () => {
  const { data, isLoading } = trpc.sessions.getSessions.useQuery();
  const { mutate } = trpc.sessions.createSession.useMutation();

  if (isLoading) {
    return <p>loading...</p>;
  }

  const startSession = () => {
    mutate();
  };

  return (
    <>
      <Head>
        <title>Sessions list</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <button
          className="rounder border-2 border-gray-500 bg-gray-500 text-white"
          onClick={startSession}
        >
          Start session
        </button>
        <ul>
          {data?.map((session) => (
            <SessionItem session={session} key={session.id} />
          ))}
        </ul>
      </main>
    </>
  );
};

type InferredSessionType = inferProcedureOutput<
  AppRouter["sessions"]["getSessions"]
>[0];

const SessionItem: React.FC<{ session: InferredSessionType }> = ({
  session,
}) => {
  const { data } = trpc.sessions.getRecordings.useQuery({
    sessionId: session.id,
  });
  const { mutate } = trpc.sessions.createRecording.useMutation();

  const createRecording = () => {
    mutate({ sessionId: session.id });
  };

  return (
    <li>
      <p>{session.id}</p>
      <ul>
        {data &&
          data.map((recording) => <li key={recording.id}>- {recording.id}</li>)}
      </ul>
      <button
        className="rounder border-2 border-gray-500 bg-gray-500 text-white"
        onClick={createRecording}
      >
        Create recording for {session.id}
      </button>
    </li>
  );
};

export default Sessions;
