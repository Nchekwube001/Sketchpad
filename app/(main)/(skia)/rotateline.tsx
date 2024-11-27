import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Canvas, Circle, Line, Points, vec } from "@shopify/react-native-skia";
import { height, width } from "@/globalStyle/globalStyle";
import {
  Easing,
  interpolate,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const Rotateline = () => {
  const cx = width / 2;
  const cy = height / 2;

  const animationVal = useSharedValue(0);
  const radiusVal = useSharedValue(0);

  useEffect(() => {
    animationVal.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);
  useEffect(() => {
    radiusVal.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, []);

  //   const angle = useSharedValue(Math.PI * 2);
  const radius = 180;
  //   const dx = useDerivedValue(() => cx + radius);
  //   const dy = useDerivedValue(() => cy + radius);
  const angle = useDerivedValue(() => {
    const value = interpolate(animationVal.value, [0, 1], [0, Math.PI * 2]);

    return value;
  });
  const rWhite = useDerivedValue(() => {
    const value = interpolate(radiusVal.value, [0, 1], [8, 18]);

    return value;
  });
  const dx = useDerivedValue(() => cx + radius * Math.cos(angle.value));
  const dy = useDerivedValue(() => cy + radius * Math.sin(angle.value));
  console.log({
    dx: dx.value,
    dy: dy.value,
  });

  return (
    <Canvas style={{ flex: 1 }}>
      <Circle cx={cx} cy={cy} r={rWhite} color={"white"} />
      <Circle cx={dx} cy={dy} r={8} color={"red"} />
    </Canvas>
  );
};

export default Rotateline;
