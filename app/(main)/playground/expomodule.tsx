import { View, Text, Button } from "react-native";
import React from "react";
import LayoutWithSafeArea from "@/components/layout/LayoutWithSafeArea";
import ExpoModuleTestModule from "@/modules/expo-module-test/src/ExpoModuleTestModule";
import { ExpoRadialChartView } from "@/modules/expo-radial-chart";
import { StatusBar } from "expo-status-bar";

const ExpoModule = () => {
  return (
    <>
      <StatusBar hidden />
      <ExpoRadialChartView
        style={{ flex: 1, margin: 16 }}
        data={[
          {
            color: "#71d12e",
            percentage: 0.5,
          },
          {
            color: "#2e71d1",
            percentage: 0.7,
          },
          {
            color: "#d12e71",
            percentage: 0.9,
          },
        ]}
        centerText="Hello Swift From Expo!"
      />
    </>
    // <LayoutWithSafeArea>
    //   <Text>hello</Text>
    //   <ExpoRadialChartView
    //     style={{ flex: 1, backgroundColor: "black" }}
    //     data={[
    //       {
    //         color: "#ff0000",
    //         percentage: 0.5,
    //       },
    //       {
    //         color: "#00ff00",
    //         percentage: 0.2,
    //       },
    //       {
    //         color: "#0000ff",
    //         percentage: 0.3,
    //       },
    //     ]}
    //   />
    //   <Button
    //     title="Expo Module Playground"
    //     onPress={() => {
    //       console.log("Button Pressed");
    //       const val = ExpoModuleTestModule.hello();
    //       console.log({
    //         val,
    //       });
    //     }}
    //   />
    // </LayoutWithSafeArea>
  );
};

export default ExpoModule;
