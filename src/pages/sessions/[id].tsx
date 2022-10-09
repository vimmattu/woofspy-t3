import type { NextPage } from "next";
import { useRouter } from "next/router";
import NewSession from "../../components/sessions/NewSession";
import PastSession from "../../components/sessions/PastSession";
import { useSessionDetails } from "../../hooks/sessions";

const SessionPage: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = useSessionDetails(router.query.id as string);
  if (isLoading || !data) return null;
  return !data.endTime ? <NewSession /> : <PastSession />;
};

export default SessionPage;
