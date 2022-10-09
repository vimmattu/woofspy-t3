import type { NextPage } from "next";
import Head from "next/head";
import Navigation from "../components/Navigation";
import { useUnauthenticatedRedirect } from "../hooks/auth";
import { useActiveSession, useCreateSession } from "../hooks/sessions";

const Home: NextPage = () => {
  const { mutate: createSession, isLoading } = useCreateSession();
  const { data: activeSession, isLoading: isFetchingActiveSession } =
    useActiveSession(true);
  const shouldRender = useUnauthenticatedRedirect("/auth/signin");

  // Display spinner if fetching user data or active session is in loading state,
  // or if an active session is found. (If active session is found, then useActiveSession redirects user to session details)
  // TODO: Replace null with spinner
  if (!shouldRender || isFetchingActiveSession || !!activeSession) return null;

  return (
    <>
      <Head>
        <title>Woofspy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full items-center">
        <button
          disabled={isLoading}
          className="h-56 w-56 rounded-full bg-red-600 text-2xl text-white shadow-lg transition-colors hover:bg-red-700 focus:bg-red-700"
          onClick={() => createSession()}
        >
          Start session
        </button>
      </main>
    </>
  );
};

export default Home;
