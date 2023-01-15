import { Button, LinkOverlay } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { ChevronRightIcon } from "@chakra-ui/icons";

interface Props {
  href: string;
  isActive: boolean;
}

export const SessionCardAction = ({ href, isActive }: Props) => {
  return (
    <NextLink href={href} passHref>
      <LinkOverlay>
        <Button variant="outline">
          {isActive && "View live"} <ChevronRightIcon />
        </Button>
      </LinkOverlay>
    </NextLink>
  );
};
