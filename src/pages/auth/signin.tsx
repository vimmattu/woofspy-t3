import { Box, VStack } from "@chakra-ui/react";
import { Head } from "../../new-components/components/Head";
import { Login } from "../../new-components/sections/Login";

const SignIn = () => {
  return (
    <VStack w="full" as="main" mt={4}>
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
    </VStack>
  );
};

export default SignIn;
