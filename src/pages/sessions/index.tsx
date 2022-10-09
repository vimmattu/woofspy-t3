import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../server/trpc/router";
import { useSessions } from "../../hooks/sessions";
import Link from "next/link";
import dayjs from "dayjs";

const Sessions: NextPage = () => {
  const { data, isLoading } = useSessions();

  if (isLoading || !data) return <p>loading...</p>;

  return (
    <>
      <Head>
        <title>Sessions list</title>
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
                  <SessionItem session={s} key={s.id} />
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

const SessionItem: React.FC<{ session: InferredSessionType }> = ({
  session,
}) => {
  const timeDisplay = !session.endTime
    ? `${formatTime(session.startTime)} - still spying`
    : `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`;

  return (
    <li className="mb-1 flex items-center justify-between px-2 transition-colors hover:bg-gray-200">
      <div>
        <p>{timeDisplay}</p>
        <p className="text-sm italic">{session.recordings.length} events</p>
      </div>
      <Link href={`/sessions/${session.id}`}>
        <a className="text-blue-500">View</a>
      </Link>
    </li>
  );
};

const formatTime = (date: Date) => dayjs(date).format("HH:mm:ss");

export default Sessions;
