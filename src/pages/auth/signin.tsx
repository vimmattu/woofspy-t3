import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useAuthenticatedRedirect } from "../../hooks/auth";

const SignIn: NextPage = () => {
  const shouldRender = useAuthenticatedRedirect("/");

  if (!shouldRender) return null;

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
