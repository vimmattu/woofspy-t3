import type { NextPage } from "next";
import { useRouter } from "next/router";

const SessionPage: NextPage = () => {
  const router = useRouter();

  return <div>{router.query.id}</div>;
};

export default SessionPage;
