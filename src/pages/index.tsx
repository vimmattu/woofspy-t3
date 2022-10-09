import type { NextPage } from "next";
import Head from "next/head";
import Navigation from "../components/Navigation";
import { useUnauthenticatedRedirect } from "../hooks/auth";
import { useActiveSession, useCreateSession } from "../hooks/sessions";

// TODO: If an ongoing session exists, redirect to the ongoing session.
// otherwise stay in this page
const Home: NextPage = () => {
  const { mutate: createSession, isLoading } = useCreateSession();
  const { data, isLoading: isFetchingActiveSession } = useActiveSession(true);
  const shouldRender = useUnauthenticatedRedirect("/auth/signin");

  if (!shouldRender || isFetchingActiveSession || !!data) return null;

  return (
    <>
      <Head>
        <title>Woofspy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen w-screen flex-col items-center bg-gray-50">
        <Navigation />
        <main className="flex h-full items-center">
          <button
            disabled={isLoading}
            className="h-56 w-56 rounded-full bg-red-600 text-2xl text-white shadow-lg transition-colors hover:bg-red-700 focus:bg-red-700"
            onClick={() => createSession()}
          >
            Start session
          </button>
        </main>
      </div>
    </>
  );
};

export default Home;
