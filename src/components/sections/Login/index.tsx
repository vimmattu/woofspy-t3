import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

export const Login = () => {
  const [email, setEmail] = useState<string>("");
  return (
    <>
      <Box>
        <VStack spacing={2}>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="email@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <Button
            colorScheme="green"
            w="full"
            onClick={() => signIn("email", { email })}
          >
            Sign in with email address
          </Button>

          <Flex align="center" w="full">
            <Divider />
            <Text fontWeight="semibold" padding={2}>
              OR
            </Text>
            <Divider />
          </Flex>

          <Button onClick={() => signIn("github")} w="full" colorScheme="gray">
            Sign in with Github
          </Button>

          <Flex align="center" w="full">
            <Divider />
            <Text fontWeight="semibold" padding={2}>
              OR
            </Text>
            <Divider />
          </Flex>

          <Button w="full" colorScheme="green">
            Sign in with Google
          </Button>
        </VStack>
      </Box>
    </>
  );
};
