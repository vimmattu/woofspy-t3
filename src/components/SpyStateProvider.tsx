import { useRouter } from "next/router";
import React from "react";
import { Provider as JotaiProvider } from "jotai";

export const SpyStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const isSpyRoute = router.asPath.startsWith("/spy");
  if (isSpyRoute) return <JotaiProvider>{children}</JotaiProvider>;
  console.log("not spy route");
  return <>{children}</>;
};
