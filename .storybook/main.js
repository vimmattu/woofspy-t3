const path = require("path");
module.exports = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@chakra-ui/storybook-addon",
    "@tomfreudenberg/next-auth-mock/storybook",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    docsPage: true,
  },
  features: {
    emotionAlias: false,
  },
  webpackFinal: async (config) => {
    config.resolve.alias[
      "@tomfreudenberg/next-auth-mock/storybook/preview-mock-auth-states"
    ] = path.resolve(__dirname, "previewMockAuthStates.js");
    return config;
  },
};
