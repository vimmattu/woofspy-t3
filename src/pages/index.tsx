import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  // Display spinner if fetching user data or active session is in loading state,
  // or if an active session is found. (If active session is found, then useActiveSession redirects user to session details)
  // TODO: Replace null with spinner
  // if (!shouldRender || isFetchingActiveSession || !!activeSession) return null;

  return (
    <>
      <Head>
        <title>Woofspy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full items-center">
        <button
          className="h-56 w-56 rounded-full bg-red-600 text-2xl text-white shadow-lg transition-colors hover:bg-red-700 focus:bg-red-700"
          onClick={() => router.push("/spy")}
        >
          Start session
        </button>
      </main>
    </>
  );
};

export default Home;
