import { View, Text, useWindowDimensions } from "react-native";
import React, { useMemo } from "react";
import {
  Blur,
  Canvas,
  Circle,
  ColorMatrix,
  Group,
  Paint,
  Rect,
  SweepGradient,
} from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const radius = 80;
const Metaball = () => {
  const { width, height } = useWindowDimensions();
  const cx = useSharedValue(width / 2);
  const cy = useSharedValue(height / 2);
  const gesture = Gesture.Pan().onChange(
    ({ translationX, translationY, x, y }) => {
      cx.value = x;
      cy.value = y;
      //   cx.value = translationX;
      //   cy.value = translationY;
    }
  );
  const layer = useMemo(() => {
    return (
      <Paint>
        <Blur blur={30} />
        <ColorMatrix
          matrix={[
            1, 0, 0, 0, 0,
            //
            0, 1, 0, 0, 0,
            //
            0, 0, 1, 0, 0,
            //
            0, 0, 0, 60, -30,
          ]}
        />
      </Paint>
    );
  }, []);
  return (
    <GestureDetector gesture={gesture}>
      <Canvas
        style={{
          flex: 1,
          backgroundColor: "#111",
        }}
      >
        <Group layer={layer}>
          <Circle cx={cx} cy={cy} r={radius} color={"blue"} />
          <Circle cx={width / 2} cy={height / 2} r={radius} color={"blue"} />
          <SweepGradient
            c={{ x: 0, y: 0 }}
            colors={["cyan", "magenta", "cyan"]}
          />
        </Group>
      </Canvas>
    </GestureDetector>
  );
};

export default Metaball;
