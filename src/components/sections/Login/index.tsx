import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { FaGithub, FaMagic } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const Login = () => {
  const [email, setEmail] = useState<string>("");
  return (
    <>
      <Box>
        <VStack spacing={2}>
          <Button w="full" colorScheme="gray" variant="outline">
            <Icon as={FcGoogle} mr={2} />
            Sign in with Google
          </Button>

          <Button
            onClick={() => signIn("github")}
            w="full"
            variant="outline"
            colorScheme="gray"
          >
            <Icon as={FaGithub} mr={2} />
            Sign in with Github
          </Button>

          <Flex align="center" w="full">
            <Divider />
            <Text fontWeight="semibold" padding={2}>
              OR
            </Text>
            <Divider />
          </Flex>

          <FormControl>
            <FormLabel fontWeight="bold">Sign in with magic link</FormLabel>
            <Input
              textAlign="center"
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
            <Icon as={FaMagic} mr={2} />
            Send magic link
          </Button>
        </VStack>
      </Box>
    </>
  );
};
