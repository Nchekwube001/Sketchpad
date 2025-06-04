/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";
export const darkGradient = {
  top: "#4E2DA6",
  middle: "#35205B",
  lower: "#1E1033",
  bottom: "#111111",
};

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    barColor: "#000000",
    card: "#1E2021",
  },
  dark: {
    text: "#ECEDEE",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    background: "#1F1F1F",
    barColor: "#000000",
    tint: tintColorDark,
  },
};
