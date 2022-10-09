import type { NextPage } from "next";
import { useRouter } from "next/router";

// TODO: Check if the session has ended or not.
// If the session has not ended then select devices to start the session
// If the session has ended, display the details of the session
const SessionPage: NextPage = () => {
  const router = useRouter();

  return <div>{router.query.id}</div>;
};

export default SessionPage;
