import {
  defineStyleConfig,
  SystemStyleInterpolation,
  useStyleConfig,
  VStack,
} from "@chakra-ui/react";

const styleDefs = {
  variants: {
    main: {
      mt: 4,
      px: 4,
      mb: 8,
    },
    auth: {
      mt: 4,
    },
    spy: {},
  },
} satisfies Record<string, Record<string, SystemStyleInterpolation>>;

export const styleConfig = defineStyleConfig(styleDefs);

interface Props {
  children: React.ReactNode;
  variant?: keyof typeof styleDefs.variants;
}

export const MainContentContainer: React.FC<Props> = ({
  variant = "main",
  ...rest
}) => {
  const styles = useStyleConfig("MainContentContainer", { variant });

  // I hate having to do this but seems there's some bug when using __css and some of the props used here
  if (variant === "spy") {
    return <VStack {...rest} as="main" my={4} alignItems="start" w="full" />;
  }

  return <VStack {...rest} as="main" __css={styles} />;
};
