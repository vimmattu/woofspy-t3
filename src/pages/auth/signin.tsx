import { Box } from "@chakra-ui/react";
import { Head } from "../../components/Head";
import { MainContentContainer } from "../../components/MainContentContainer";
import { Login } from "../../components/sections/Login";

const SignIn = () => {
  return (
    <MainContentContainer variant="auth">
      <Head title="Sign in" />
      <Box
        w="full"
        shadow="md"
        borderStyle="solid"
        borderRadius="md"
        borderColor="gray.200"
        borderWidth="thin"
        p={4}
      >
        <Login />
      </Box>
    </MainContentContainer>
  );
};

export default SignIn;
