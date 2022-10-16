import Head from "next/head";
import { FormEventHandler, useRef } from "react";
import { trpc } from "../../utils/trpc";

const SignIn = () => {
  const { mutateAsync: signUp, isLoading } = trpc.auth.createUser.useMutation();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!emailRef.current?.value) return;
    if (!passwordRef.current?.value) return;
    if (!passwordConfirmRef.current?.value) return;

    signUp({
      email: emailRef.current.value,
      password: passwordRef.current.value,
      passwordConfirm: passwordConfirmRef.current.value,
    });
  };

  return (
    <>
      <Head>
        <title>Sign up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full items-center justify-center">
        <div className="w-96 rounded border-2 border-gray-100 bg-white p-4 shadow-md">
          <h1 className="mb-2 text-center text-2xl">Sign up</h1>
          <form onSubmit={onSubmit}>
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
            <label htmlFor="password">Password confirm</label>
            <input
              ref={passwordConfirmRef}
              id="password"
              type="password"
              className="mb-2 block w-full border-2 border-gray-200"
              placeholder="********"
            />
            <button
              type="submit"
              className=" w-full rounded bg-gray-500 p-2 text-center text-white transition-colors hover:bg-gray-600 focus:bg-gray-600"
            >
              Sign up
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default SignIn;
