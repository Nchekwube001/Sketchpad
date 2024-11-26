import { View, Text, Button } from "react-native";
import React from "react";
import { useStore } from "@/app/store/store";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { UnistylesRuntime } from "react-native-unistyles";
function Controls() {
  const { increasePopulation } = useStore((state) => state);
  console.log({
    currenttheme: UnistylesRuntime.themeName,
  });

  return (
    <Button
      onPress={() => {
        increasePopulation();
        UnistylesRuntime.themeName === "light"
          ? UnistylesRuntime.setTheme("dark")
          : UnistylesRuntime.setTheme("light");
      }}
      title="one up"
    />
  );
}
const zustandtest = () => {
  const { bears } = useStore((state) => state);
  const { styles, theme } = useStyles(stylesheet);
  console.log({
    theme,
  });

  return (
    <View style={[styles.container]}>
      <Text>{bears} count</Text>

      <Controls />
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: {
      // your breakpoints
      xs: theme.colors.background,
      sm: theme.colors.background,
    },
  },
}));
export default zustandtest;
