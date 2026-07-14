const path = require('path');

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling',
      options: {
        sass: {
          // Require your preprocessor
          implementation: require('sass'),
        },
      },
    },
    '@storybook/addon-mdx-gfm',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config) => {
    // Redirect imports of '../src/DPA' to '../src/DPA-shim'
    // This avoids pulling in the Looker SDK which requires a host environment
    config.resolve.alias = {
      ...config.resolve.alias,
      [path.resolve(__dirname, '../src/DPA')]: path.resolve(
        __dirname,
        '../src/DPA-shim.js'
      ),
    };
    return config;
  },
};
export default config;
