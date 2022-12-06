import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
const SocketTest = dynamic(() => import("../components/SocketHandler"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Socket test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full items-center">
        <SocketTest />
      </main>
    </>
  );
};

export default Home;
