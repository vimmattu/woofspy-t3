import { VStack } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  variant?: "main" | "auth" | "spy";
}

export const MainContentContainer: React.FC<Props> = ({
  variant = "main",
  ...rest
}) => {
  return (
    <VStack
      as="main"
      mt={4}
      mb={variant === "main" ? 8 : undefined}
      px={[4, 0]}
      alignItems={variant === "spy" ? "start" : undefined}
      w="full"
      {...rest}
    />
  );
};
