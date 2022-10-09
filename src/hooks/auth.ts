import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type Opts = {
  path: string;
  authenticated: boolean;
};

function useAuthRedirect({ path, authenticated }: Opts) {
  const session = useSession();
  const router = useRouter();

  const expectedStatus = authenticated ? "authenticated" : "unauthenticated";

  if (session.status === expectedStatus) {
    router.push(path);
    return false;
  }

  return session.status !== "loading";
}

export const useAuthenticatedRedirect = (path: string) =>
  useAuthRedirect({ path, authenticated: true });

export const useUnauthenticatedRedirect = (path: string) =>
  useAuthRedirect({ path, authenticated: false });
