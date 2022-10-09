import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useSessionDetails } from "../../hooks/sessions";

// TODO: Check if the session has ended or not.
// If the session has not ended then select devices to start the session
// If the session has ended, display the details of the session
const SessionPage: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = useSessionDetails(router.query.id as string);

  if (isLoading || !data) return null;

  return !data.endTime ? (
    <p>Starting the session!! How exciting</p>
  ) : (
    <p>Viewing ended session details. How boring.</p>
  );
};

export default SessionPage;
