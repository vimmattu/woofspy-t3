import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

enum Action {
  LOADING,
  REDIRECT_UNAUTHENTICATED,
  REDIRECT_AUTHENTICATED,
  RENDER,
}

function getAuthStateAction(
  status: "loading" | "unauthenticated" | "authenticated",
  currentPath: string
) {
  if (status === "loading") return Action.LOADING;

  if (status === "unauthenticated" && !currentPath.startsWith("/auth"))
    return Action.REDIRECT_UNAUTHENTICATED;

  if (status === "authenticated" && currentPath.startsWith("/auth"))
    return Action.REDIRECT_AUTHENTICATED;

  return Action.RENDER;
}

export function AuthGuard({ children }: { children: JSX.Element }) {
  const session = useSession();
  const router = useRouter();

  const action = useMemo(
    () => getAuthStateAction(session.status, router.pathname),
    [session, router]
  );

  useEffect(() => {
    if (action === Action.REDIRECT_AUTHENTICATED) router.push("/");
    else if (action === Action.REDIRECT_UNAUTHENTICATED)
      router.push("/auth/signin");
  }, [action]);

  if (action === Action.RENDER) return <>{children}</>;

  return <p>Loading spinner</p>;
}
