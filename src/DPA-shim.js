// DPA-shim.js — exports appTheme without Looker SDK dependency
// This is a thin extraction of the appTheme function from DPA.jsx
// so that Storybook's preview.js can import it without pulling in
// the Looker Extension SDK (which requires a Looker host environment).
import { createTheme } from '@material-ui/core/styles';

export const appTheme = (palette) =>
  createTheme({
    palette,
    overrides: {
      MuiCssBaseline: {
        '@global': {
          h1: { color: palette.primary.main },
          body: { fontFamily: `Helvetica, sans-serif` },
          // Text color classes
          "[class*='text-primary']": { color: palette.primary.main },
          "[class*='text-secondary']": { color: palette.secondary.main },
          "[class*='text-default']": { color: palette.textColor.default },
          "[class*='text-contrast']": { color: palette.primary.contrastText },
          "[class*='text-gray']": { color: palette.other.grayColor2 },
          "[class*='text-success']": { color: palette.status.success },
          "[class*='text-warning']": { color: palette.status.warning },
          "[class*='text-gray-light']": { color: palette.other.grayColor3 },
          "[class*='text-primary-static']": { color: palette.static.primary },
          "[class*='text-secondary-static']": {
            color: `${palette.static.secondary} !important`,
          },
          "[class*='text-default-static']": { color: palette.static.default },

          // Background color classes
          "[class*='bg-default']": {
            backgroundColor: palette.background.default,
          },
          "[class*='bg-primary']": {
            backgroundColor: palette.primary.main,
          },
          "[class*='bg-grey']": { backgroundColor: palette.other.grayColor3 },
          "[class*='bg-transparent']": {
            backgroundColor: palette.other.rgbaGrey,
          },

          // Border color classes
          "[class*='border-color-default']": {
            borderColor: `${palette.other.grayColor3} !important`,
          },
          "[class*='border-color-light']": {
            borderColor: `${palette.background.default} !important`,
          },

          // Fill color classes
          "[class*='fill-default']": { fill: palette.textColor.default },
          "[class*='fill-gray']": { fill: palette.other.grayColor2 },
          "[class*='fill-primary']": { fill: palette.primary.main },
          "[class*='fill-secondary']": { fill: palette.primary.secondary },
        },
      },
    },
  });
