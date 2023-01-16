import { Box } from "@chakra-ui/react";
import { Head } from "../../components/Head";
import { MainContentContainer } from "../../components/MainContentContainer";
import { Register } from "../../components/sections/Register";

const SignIn = () => {
  return (
    <MainContentContainer variant="auth">
      <Head title="Sign up" />
      <Box
        w="full"
        shadow="md"
        borderStyle="solid"
        borderRadius="md"
        borderColor="gray.200"
        borderWidth="thin"
        p={4}
      >
        <Register />
      </Box>
    </MainContentContainer>
  );
};

export default SignIn;
