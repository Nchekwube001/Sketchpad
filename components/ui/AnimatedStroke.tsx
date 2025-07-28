import { View, Text } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Path } from "react-native-svg";

interface animatedStrokeProps {
  d: string;
  index: number;
  progress: SharedValue<number>;
}
const AnimatedPath = Animated.createAnimatedComponent(Path);
// const colors = ["#ffc27a", "#7edab9", "#45a6e5", "#fe8777"];
const colors = ["teal", "indigo", "orange", "green", "brown"];

const AnimatedStroke: FC<animatedStrokeProps> = ({ d, index, progress }) => {
  const [length, setLength] = useState(0);
  const stroke = "indigo";
  //   const stroke = colors[Math.round(Math.random() * colors.length - 1)];
  const ref = useRef<typeof AnimatedPath>(null);
  const strokeAnim = useAnimatedProps(() => ({
    strokeDashoffset:
      length - length * Easing.bezierFn(0.65, 0, 0.35, 1)(progress.value),
    //   length - length * Easing.bezierFn(0.61, 1, 0.88, 1)(progress.value),
  }));
  const bgstrokeAnim = useAnimatedProps(() => ({
    strokeDashoffset:
      length - length * Easing.bezierFn(0.61, 1, 0.88, 1)(progress.value),
    //   length - length * Easing.bezierFn(0.65, 0, 0.35, 1)(progress.value),
  }));
  return (
    <>
      <AnimatedPath
        d={d}
        stroke={stroke}
        strokeWidth={5}
        strokeDasharray={length}
        animatedProps={bgstrokeAnim}
      />
      <AnimatedPath
        onLayout={() => {
          const lgth = ref?.current?.getTotalLength();

          setLength(lgth);
        }}
        ref={ref}
        d={d}
        stroke={"black"}
        strokeWidth={5}
        strokeDasharray={length}
        animatedProps={strokeAnim}
      />
    </>
  );
};

export default AnimatedStroke;
