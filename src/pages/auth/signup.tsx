import { Box, VStack } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { Head } from "../../new-components/components/Head";
import { Register } from "../../new-components/sections/Register";

const SignIn = () => {
  return (
    <VStack w="full" as="main" mt={4}>
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
    </VStack>
  );
};

export default SignIn;
