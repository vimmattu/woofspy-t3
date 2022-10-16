import { signIn } from "next-auth/react";
import Head from "next/head";
import { FormEventHandler, useRef } from "react";

const SignIn = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    signIn("credentials", {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    });
  };

  return (
    <>
      <Head>
        <title>Sign in</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full items-center justify-center">
        <div className="w-96 rounded border-2 border-gray-100 bg-white p-4 shadow-md">
          <h1 className="mb-2 text-center text-2xl">Sign in</h1>
          <form
            className="mb-4  border-b-2 border-b-gray-200"
            onSubmit={onSubmit}
          >
            <label htmlFor="email">Email</label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              className="mb-2 block w-full border-2 border-gray-200"
              placeholder="user@example.com"
            />
            <label htmlFor="password">Password</label>
            <input
              ref={passwordRef}
              id="password"
              type="password"
              className="mb-2 block w-full border-2 border-gray-200"
              placeholder="********"
            />
            <button
              type="submit"
              className="mb-4 w-full rounded bg-gray-500 p-2 text-center text-white transition-colors hover:bg-gray-600 focus:bg-gray-600"
            >
              Sign in
            </button>
          </form>
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
