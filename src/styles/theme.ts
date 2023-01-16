import { extendTheme } from "@chakra-ui/react";
import { styleConfig as MainContentContainer } from "../components/MainContentContainer";

export const theme = extendTheme({
  fonts: {
    heading: `"Comic Neue", cursive`,
    body: `"Comic Neue", cursive`,
  },
  components: {
    MainContentContainer,
  },
});
