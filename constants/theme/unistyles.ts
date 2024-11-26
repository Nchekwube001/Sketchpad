import { breakpoints } from "./breakpoints";
import { darkTheme, lightTheme } from "./theme";
import { UnistylesRegistry } from "react-native-unistyles";

export type AppBreakpoints = typeof breakpoints;

// if you defined themes
export type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

UnistylesRegistry.addBreakpoints(breakpoints)
  .addThemes({
    light: lightTheme,
    dark: darkTheme,
    // register other themes with unique names
  })
  .addConfig({
    // you can pass here optional config described below
    adaptiveThemes: true,
    // initialTheme: "light",
  });
