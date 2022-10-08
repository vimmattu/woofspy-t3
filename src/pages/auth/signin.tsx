import type { GetServerSideProps, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SignIn: NextPage = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") return <p>loading...</p>;

  if (session.status === "authenticated") {
    router.push("/");
    return null;
  }

  return (
    <div>
      <button
        className="rounded border-2 border-gray-500"
        onClick={() => signIn("github")}
      >
        Sign in with Github
      </button>
    </div>
  );
};

export default SignIn;
