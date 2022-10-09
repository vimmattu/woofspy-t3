import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import React from "react";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../server/trpc/router";
import { useCreateSession } from "../../hooks/sessions";

// TODO: Remove session creation & ending logic from here.
// This page should only list ended sessions and provide a way to navigate to session details

const Sessions: NextPage = () => {
  const { data, isLoading } = trpc.sessions.getSessions.useQuery();
  const { mutate: createSession } = useCreateSession();

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <>
      <Head>
        <title>Sessions list</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <button
          className="rounder border-2 border-gray-500 bg-gray-500 text-white"
          onClick={() => createSession()}
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
  const { mutate: createRecording } =
    trpc.sessions.createRecording.useMutation();
  const { mutate: endSession } = trpc.sessions.endSession.useMutation();

  return (
    <li>
      <p>
        {session.id} {session.endTime && "ENDED!"}
      </p>
      <ul>
        {data &&
          data.map((recording) => <li key={recording.id}>- {recording.id}</li>)}
      </ul>
      <button
        className="rounder border-2 border-gray-500 bg-gray-500 text-white"
        onClick={() => createRecording({ sessionId: session.id })}
      >
        Create recording for {session.id}
      </button>
      <br />
      {!session.endTime && (
        <button
          className="rounder border-2 border-gray-500 bg-gray-500 text-white"
          onClick={() => endSession({ id: session.id })}
        >
          End {session.id}
        </button>
      )}
    </li>
  );
};

export default Sessions;
