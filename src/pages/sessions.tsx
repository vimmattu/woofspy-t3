import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import React from "react";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../server/trpc/router";

const Sessions: NextPage = () => {
  const { data, isLoading } = trpc.sessions.getSessions.useQuery();

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

  return (
    <li>
      <p>{session.id}</p>
      <ul>
        {data &&
          data.map((recording) => <li key={recording.id}>- {recording.id}</li>)}
      </ul>
    </li>
  );
};

export default Sessions;
