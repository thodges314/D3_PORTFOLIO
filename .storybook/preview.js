import React, { useRef } from 'react';
/** @type { import('@storybook/react').Preview } */
import { ThemeProvider } from '@material-ui/core/styles';
import { appTheme } from '../src/DPA';
import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import CssBaseline from '@material-ui/core/CssBaseline';
import { lightTheme, darkTheme } from '../src/theming/colors';
import ToolTipContext from '../src/context/ToolTipContext';
import ToolTip from '../src/components/D3/SharedD3Exports/ToolTip2/ToolTip2';
import '../src/index.scss';
import '../src/DPA.scss';

// Load Material UI fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/material-icons';

const withComponentWrapper = (Story) => {
  const toolTipRef = useRef(null);
  return (
    <ToolTipContext.Provider value={toolTipRef}>
      <Story />
      <ToolTip ref={toolTipRef} />
    </ToolTipContext.Provider>
  );
};

const darkAppTheme = appTheme(darkTheme);
const lightAppTheme = appTheme(lightTheme);

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: [
          'Doughnut Chart',
          'Spider Chart',
          'Filled Line',
          'Filled Line Multiple DPA',
          'Diverging Index Bar',
          'Diverging Index Bar Multi DPA',
          'Scatterplot',
          'RadialScatter',
          'USStateMap',
          'USDMAMap',
          'ListViz',
          'FullTableViz',
          'build a story instructions',
        ],
      },
    },
  },
};

export default preview;

export const decorators = [
  withThemeFromJSXProvider({
    themes: {
      light: lightAppTheme,
      dark: darkAppTheme,
    },
    defaultTheme: 'light',
    Provider: ThemeProvider,
    GlobalStyles: CssBaseline,
  }),
  withComponentWrapper,
];
