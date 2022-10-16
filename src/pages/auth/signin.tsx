import { signIn } from "next-auth/react";
import Head from "next/head";

const SignIn = () => {
  return (
    <>
      <Head>
        <title>Sign in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full items-center justify-center">
        <div className="w-96 rounded border-2 border-gray-100 bg-white p-4 shadow-md">
          <h1 className="mb-2 text-center text-2xl">Sign in</h1>
          <button
            className="mb-2 w-full rounded bg-gray-500 p-2 text-center text-white transition-colors hover:bg-gray-600 focus:bg-gray-600"
            onClick={() => signIn("github")}
          >
            Github
          </button>
          <button
            className="w-full rounded bg-gray-500 p-2 text-center text-white transition-colors hover:bg-gray-600 focus:bg-gray-600"
            onClick={() => signIn("google")}
          >
            Google
          </button>
        </div>
      </main>
    </>
  );
};

export default SignIn;
