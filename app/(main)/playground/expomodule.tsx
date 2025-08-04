import { View, Text, Button } from "react-native";
import React from "react";
import LayoutWithSafeArea from "@/components/layout/LayoutWithSafeArea";
import ExpoModuleTestModule from "@/modules/expo-module-test/src/ExpoModuleTestModule";

const ExpoModule = () => {
  return (
    <LayoutWithSafeArea>
      <Button
        title="Expo Module Playground"
        onPress={() => {
          console.log("Button Pressed");
          const val = ExpoModuleTestModule.hello();
          console.log({
            val,
          });
        }}
      />
    </LayoutWithSafeArea>
  );
};

export default ExpoModule;
