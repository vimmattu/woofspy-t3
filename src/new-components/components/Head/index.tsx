import { Heading, VisuallyHidden } from "@chakra-ui/react";
import NextHead from "next/head";
import { Fragment } from "react";

interface Props {
  title: string;
  hasHiddenHeader?: boolean;
}

export const Head = ({ title, hasHiddenHeader }: Props) => {
  const HeadingWrapper = hasHiddenHeader ? VisuallyHidden : Fragment;
  return (
    <>
      <NextHead>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </NextHead>
      <HeadingWrapper>
        <Heading w='full' as="h1" fontSize="3xl">
          {title}
        </Heading>
      </HeadingWrapper>
    </>
  );
};
