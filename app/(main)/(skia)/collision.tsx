import { View, Text } from "react-native";
import React, { useEffect } from "react";
import globalStyle, { height, width } from "@/globalStyle/globalStyle";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { Canvas, Circle } from "@shopify/react-native-skia";

const r = 8;
const duration = 150;
const speed = 30;
const Collision = () => {
  const cx = useSharedValue(30);
  const cy = useSharedValue(30);
  const isForward = useSharedValue(true);
  const isDownward = useSharedValue(true);
  const move = () => {
    "worklet";
    if (cx.value - r * 2 >= width) {
      isForward.value = false;
    } else if (cx.value - r * 2 <= 0) {
      isForward.value = true;
    }
    if (cy.value - r * 2 >= height) {
      isDownward.value = false;
    } else if (cy.value - r * 2 <= 0) {
      isDownward.value = true;
    }
    cx.value = withTiming(
      isForward.value ? cx.value + speed : cx.value - speed,
      {
        duration: 350,
      }
    );
    cy.value = withTiming(
      isDownward.value ? cy.value + speed : cy.value - speed,
      {
        duration: 350,
      }
    );
    // if (cy.value - r / 2 >= height) {
    //   cy.value = withTiming(cy.value - speed);
    // } else {
    //   cy.value = withTiming(cy.value + speed);
    // }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      move();
    }, duration);

    return () => clearTimeout(interval);
  }, []);

  return (
    <View style={[globalStyle.bgWhite, globalStyle.flexOne]}>
      <Canvas style={[globalStyle.flexOne]}>
        <Circle cx={cx} cy={cy} r={r} color={"black"} />
      </Canvas>
    </View>
  );
};

export default Collision;
