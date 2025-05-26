import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Canvas, Circle } from "@shopify/react-native-skia";

const length = 2 * Math.PI;
const { width, height } = Dimensions.get("window");

const cx = width / 2;
const cy = height / 2;
const radius = 120;
const _strokeWidth = 4;
const trigonometry = () => {
  const progress = useSharedValue(0);
  const { styles } = useStyles(trigStyle);
  const animationVal = useSharedValue(0);
  useEffect(() => {
    animationVal.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);
  const angle = useDerivedValue(() => {
    const value = interpolate(animationVal.value, [0, 1], [0, Math.PI * 2]);

    return value;
  });
  const dx = useDerivedValue(() => cx + radius * Math.cos(angle.value));
  const dy = useDerivedValue(() => cy + radius * Math.sin(angle.value));
  return (
    <Canvas style={{ flex: 1 }}>
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        style={"stroke"}
        strokeWidth={_strokeWidth}
        color={"white"}
      />
      <Circle cx={dx} cy={dy} r={8} color={"red"} />
      {/* <Driver progress={animationVal} radius={radius} /> */}
    </Canvas>
  );
};

interface driverProps {
  radius: number;
  progress: SharedValue<number>;
}
const Driver = ({ progress, radius }: driverProps) => {
  const { styles } = useStyles(trigStyle);
  return (
    <View style={[StyleSheet.absoluteFill]}>
      <Animated.View style={[styles.driverCircle]} />
    </View>
  );
};
const trigStyle = createStyleSheet(() => ({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width,
    height: width,
    borderRadius: width,
    backgroundColor: "green",
    borderWidth: 3,
    borderColor: "black",
  },
  driverCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "red",
    borderWidth: 3,
    borderColor: "yellow",
  },
}));
export default trigonometry;
