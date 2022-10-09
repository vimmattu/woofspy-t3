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
      <div className="flex h-screen w-screen justify-center">
        <Navigation />
        <main></main>
      </div>
    </>
  );
};

export default Home;
