import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import NewSession from "../../components/sessions/NewSession";
import PastSession from "../../components/sessions/PastSession";
import { useSessionDetails } from "../../hooks/sessions";

const SessionPage: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = useSessionDetails(router.query.id as string);
  if (isLoading || !data) return null;
  return (
    <>
      <Head>
        <title>Session details</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!data.endTime ? (
        <NewSession session={data} />
      ) : (
        <PastSession session={data} />
      )}
    </>
  );
};

export default SessionPage;
