import type { NextPage } from "next";
import Head from "next/head";
import Navigation from "../components/Navigation";
import { useUnauthenticatedRedirect } from "../hooks/auth";

const Home: NextPage = () => {
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
          <button className="h-64 w-64 rounded-full bg-gray-500 text-2xl text-white transition-colors hover:bg-gray-400">
            Start session
          </button>
        </main>
      </div>
    </>
  );
};

export default Home;
