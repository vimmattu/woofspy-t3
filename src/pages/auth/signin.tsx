import type { GetServerSideProps, NextPage } from "next";
import { getProviders } from "next-auth/react";

type Props = {
  providers: typeof getProviders
}

const SignIn: NextPage<Props> = ({ providers }) => {
  //console.log(providers)
  Object.entries(providers).forEach(console.log)
  return <div>Helloo!</div>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      providers: await getProviders()
    },
  };
}

export default SignIn;
