import { Box, VStack } from "@chakra-ui/react";
import { Head } from "../../components/Head";
import { Register } from "../../components/sections/Register";

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
