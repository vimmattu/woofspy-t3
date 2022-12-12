import { Box, Link, Button, Divider, Flex, FormControl, FormLabel, Heading, Input, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

export const Login = () => {
  return (
    <>
      <Box as="form">
        <VStack spacing={4}>
        <Heading as='h2' fontSize='xl'>Sign in with credentials</Heading>
          <FormControl isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type='email' />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type='password' />
          </FormControl>
          <Flex wrap='wrap' justifyContent='space-between' w='full' align='center'>
            <Button w={['full', 'unset']} type='submit' mb={[2, 0]}>Sign in</Button>
            <Link w={['full', 'unset']} textAlign='center' as={NextLink} href='#'>No account? Create account</Link>
          </Flex>

          <Flex align='center' w='full'>
            <Divider/>
            <Text fontWeight='semibold' padding={2}>OR</Text>
            <Divider/>
          </Flex>

          <Button w={['full', 'unset']} colorScheme='green'>Sign in with Google</Button>
        </VStack>
      </Box>
    </>
  );
};

