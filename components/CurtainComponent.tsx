import React, { memo } from "react";
import { Dimensions, StyleSheet, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Canvas, Path, Shadow } from "@shopify/react-native-skia";

const colors = {
  blue1: "#1690F3", //#1690F3
  blue2: "#C5E2FC", //#C5E2FC

  green1: "#4BAA4E", //#4BAA4E
  green2: "#D4EDD4", //#D4EDD4

  red1: "#EF5A57", //#EF5A57
  red2: "#FAC8C7", //#FAC8C7

  orange1: "#F5AF00", //#F5AF00
  orange2: "#FFE8AD", //#FFE8AD,

  dark1: "#111111", //#111111
  dark2: "#2d3439", //#2d3439
  dark3: "#5d666f", //#5d666f
  dark4: "#adb5bd", //#adb5bd
  dark5: "#dee2e6", //#dee2e6
  dark6: "#F3F5F6", //#F3F5F6

  white: "#FFFFFF",
  p1: "#FFE8AD",
  p2: "#FDF9E5",
};

export type ColorTheme = typeof colors;
export type ColorNames = keyof typeof colors | (string & {});

function hexToRgba(hex: ColorNames, opacity: number): string {
  // If hex is a key of colors, resolve it
  const hexValue = hex in colors ? colors[hex as keyof typeof colors] : hex;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, ${opacity})`
    : "";
}
const { width: W, height: H } = Dimensions.get("window");

interface Props {
  containerStyle?: ViewStyle;
  width?: number;
  height?: number;
  minY?: number;
  maxY?: number;
  onAnimationEnd?: () => void;
  colors?: string[];
  progress: SharedValue<number>;
}

const mapRange = (
  value: number,
  inputRange: Array<number>,
  outputRange: Array<number>,
  clamp?: boolean
) => {
  "worklet";
  if (clamp) {
    if (value < inputRange[0]) {
      return outputRange[0];
    } else if (value > inputRange[1]) {
      return outputRange[1];
    }
  }

  const res =
    outputRange[0] +
    ((value - inputRange[0]) * (outputRange[1] - outputRange[0])) /
      (inputRange[1] - inputRange[0]);

  return res;
};

function CurtainComponent({
  containerStyle,
  width = W,
  height = H,
  minY = 80,
  maxY = H - 60,
  onAnimationEnd,
  colors = ["#FFE8AD", "#EF5A57"],
  progress,
}: Props) {
  const onGesture = Gesture.Pan()
    .onBegin((e) => {
      progress.value = withSpring(mapRange(e.y, [minY, maxY], [0, 1], true));
    })
    .onUpdate((e) => {
      progress.value = mapRange(e.y, [minY, maxY], [0, 1], true);
    })
    .onFinalize((e) => {
      if (e.y > height / 2 + 50) {
        progress.value = withTiming(1, { easing: Easing.linear }, () => {
          onAnimationEnd && runOnJS(onAnimationEnd)();
        });
      } else {
        progress.value = withTiming(0, { duration: 1000 });
      }
    });

  const leftPath = useDerivedValue(() => {
    const start = interpolate(progress.value, [0, 0.7], [width / 2, 0], {
      extrapolateLeft: Extrapolation.CLAMP,
    });
    const curve = interpolate(
      progress.value,
      [0.5, 0.7, 1],
      [width / 2, width * 0.1, 0],
      Extrapolation.CLAMP
    );
    const end = interpolate(
      progress.value,
      [0.7, 1],
      [width / 2, 0],
      Extrapolation.CLAMP
    );
    const curve2 = interpolate(
      progress.value,
      [0.5, 0.9],
      [width / 2, 0],
      Extrapolation.CLAMP
    );
    return `M ${start} 0 C ${curve} ${height / 2}, ${curve2} ${
      (height / 3) * 2
    }, ${end} ${height} L 0 ${height} L 0 0 Z`;
  });

  const rightPath = useDerivedValue(() => {
    const start = interpolate(progress.value, [0, 0.7], [width / 2, width], {
      extrapolateLeft: Extrapolation.CLAMP,
    });
    const curve = interpolate(
      progress.value,
      [0.5, 0.7, 1],
      [width / 2, width * 0.9, width],
      Extrapolation.CLAMP
    );
    const end = interpolate(
      progress.value,
      [0.7, 1],
      [width / 2, width],
      Extrapolation.CLAMP
    );
    const curve2 = interpolate(
      progress.value,
      [0.5, 0.9],
      [width / 2, width],
      Extrapolation.CLAMP
    );
    return `M ${start} 0 C ${curve} ${height / 2}, ${curve2} ${
      (height / 3) * 2
    }, ${end} ${height} L ${width} ${height} L ${width} 0 Z`;
  });

  return (
    <GestureDetector gesture={onGesture}>
      <Animated.View style={[containerStyle, { width, height }]}>
        <Canvas style={styles.canvas}>
          <Path path={leftPath} color={colors[0]} style={"fill"}>
            <Shadow dx={0} dy={0} blur={10} color={hexToRgba("#111111", 0.5)} />
          </Path>
          <Path path={rightPath} color={colors[1]} style={"fill"}>
            <Shadow dx={0} dy={0} blur={10} color={hexToRgba("#111111", 0.5)} />
          </Path>
        </Canvas>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: "100%",
    height: "100%",
  },
});

export default memo(CurtainComponent);
