import {
  Box,
  Link,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

export const Register = () => {
  return (
    <>
      <Box as="form">
        <VStack spacing={4}>
          <Heading as="h2" fontSize="xl">
            Create an account
          </Heading>
          <FormControl isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type="email" />
          </FormControl>
          <SimpleGrid columns={2} spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel>First name</FormLabel>
              <Input type="email" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Last name</FormLabel>
              <Input type="password" />
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={2} spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirm password</FormLabel>
              <Input type="password" />
            </FormControl>
          </SimpleGrid>
          <Flex
            wrap="wrap"
            justifyContent="space-between"
            w="full"
            align="center"
          >
            <Button w={["full", "unset"]} type="submit" mb={[2, 0]}>
              Sign up
            </Button>
            <Link
              color="blue.400"
              w={["full", "unset"]}
              textAlign="center"
              as={NextLink}
              href="/auth/signin"
            >
              Already have account? Sign in
            </Link>
          </Flex>
        </VStack>
      </Box>
    </>
  );
};
