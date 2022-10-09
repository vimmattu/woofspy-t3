import type { NextPage } from "next";
import Head from "next/head";
import Navigation from "../components/Navigation";
import { useUnauthenticatedRedirect } from "../hooks/auth";
import { useCreateSession } from "../hooks/sessions";

// TODO: If an ongoing session exists, redirect to the ongoing session.
// otherwise stay in this page
const Home: NextPage = () => {
  const { mutate: createSession, isLoading } = useCreateSession();
  const shouldRender = useUnauthenticatedRedirect("/auth/signin");

  if (!shouldRender) return null;

  return (
    <>
      <Head>
        <title>Woofspy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen w-screen flex-col items-center">
        <Navigation />
        <main className="flex h-full items-center">
          <button
            disabled={isLoading}
            className="h-64 w-64 rounded-full bg-gray-500 text-2xl text-white transition-colors hover:bg-gray-400 focus:bg-gray-400"
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
