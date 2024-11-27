import { View, StyleSheet, Dimensions, TextInput } from "react-native";
import React, { useEffect } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  Canvas,
  Circle,
  useFont,
  Text as SkText,
} from "@shopify/react-native-skia";
import globalStyle from "@/globalStyle/globalStyle";
const spaceMono = require("../../../assets/fonts/SpaceMono-Regular.ttf");
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const length = 2 * Math.PI;
const { width, height } = Dimensions.get("window");

const cx = width / 2;
const cy = height / 2;
const radius = 100;
const lineNos = 24;
const circleDiameter = width / 2;
const circleRadius = circleDiameter / 2;
const _strokeWidth = 4;
const trigonometry = () => {
  const chartFont = useFont(spaceMono, 30);
  const progress = useSharedValue(0);
  const { styles } = useStyles(trigStyle);
  const animationVal = useSharedValue(0);
  const lineVal = useSharedValue(0);
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
    const interval = setInterval(() => {
      lineVal.value = withTiming(lineVal.value + 1, {
        duration: 2000,
        easing: Easing.linear,
      });
    }, 2000);

    return () => clearInterval(interval);
    // lineVal.value = withRepeat(
    //   withTiming(1, {
    //     duration: 2000,
    //     easing: Easing.linear,
    //   }),
    //   -1,
    //   true
    // );
  }, []);
  const angle = useDerivedValue(() => {
    const value = interpolate(animationVal.value, [0, 1], [0, Math.PI * 2]);

    return value;
  });
  const lineAngle = useDerivedValue(() => {
    const value = interpolate(lineVal.value, [0, 1], [0, Math.PI * 2]);

    return value;
  });
  const linText = useDerivedValue(() => `${lineAngle}`);
  const dx = useDerivedValue(() => cx + radius * Math.cos(angle.value));
  const dy = useDerivedValue(() => cy + radius * Math.sin(angle.value));
  return (
    <View style={[styles.container]}>
      {/* <Canvas style={{ flex: 1 }}>
        <SkText
          text={linText}
          x={0}
          y={0}
          font={chartFont}
          color={"black"}
          style={"fill"}
        />
      </Canvas> */}
      <View style={[styles.circle]} />

      {/* <Driver
        cx={cx}
        cy={cy}
        dx={dx}
        dy={dy}
        angle={angle}
        progress={animationVal}
        radius={18}
        circleRadius={circleRadius}
      /> */}

      {/* <Line
        deg={90}
        progress={lineVal}
        circleRadius={circleRadius}
        cx={cx}
        cy={cy}
        radius={10}
      />
      <Line
        deg={180}
        progress={lineVal}
        circleRadius={circleRadius}
        cx={cx}
        cy={cy}
        radius={10}
      />
      <Line
        deg={45}
        progress={lineVal}
        circleRadius={circleRadius}
        cx={cx}
        cy={cy}
        radius={10}
      /> */}
      {new Array(lineNos).fill("as").map((_, i) => (
        <Line
          key={i.toString()}
          deg={(360 / lineNos) * i}
          // deg={45}
          progress={lineAngle}
          circleRadius={circleRadius}
          cx={cx}
          cy={cy}
          radius={10}
          i={i}
          angle={lineAngle}
        />
      ))}
    </View>
  );
};

interface driverProps {
  radius: number;
  circleRadius: number;
  cx: number;
  cy: number;
  progress: SharedValue<number>;
  dx: SharedValue<number>;
  dy: SharedValue<number>;
  angle: SharedValue<number>;
}
const Driver = ({
  progress,
  angle,
  radius,
  cx,
  cy,
  circleRadius,
}: driverProps) => {
  const { styles } = useStyles(trigStyle);
  const dx = useDerivedValue(
    () => cx - radius / 2 + circleRadius * Math.cos(angle.value)
  );
  const dy = useDerivedValue(
    () => cy - radius / 2 + circleRadius * Math.sin(angle.value)
  );
  // const dx = useDerivedValue(() => cx + radius * Math.cos(angle.value));
  // const dy = useDerivedValue(() => cy + radius * Math.sin(angle.value));
  const circleStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: dx.value,
    top: dy.value,
    // left: cx - radius / 2 + circleRadius,
    // top: cy - radius / 2,
    width: radius,
    height: radius,
    backgroundColor: "cyan",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: radius,
  }));
  return (
    <View style={[StyleSheet.absoluteFill]}>
      <Animated.View style={[circleStyle]} />
    </View>
  );
};
interface lineProps {
  radius: number;
  circleRadius: number;
  cx: number;
  i: number;
  cy: number;
  deg: number;
  progress: SharedValue<number>;
  angle: SharedValue<number>;
}
const Line = ({
  circleRadius,
  cx,
  cy,
  radius,
  progress,
  deg,
  angle,
  i,
}: lineProps) => {
  const chartFont = useFont(spaceMono, 30);
  const angleToRad = (val: number) => {
    "worklet";
    return val * 0.0174533;
  };
  const { styles } = useStyles(trigStyle);
  const left = width / 2 - circleRadius;

  console.log({
    deg,
  });

  const radVal = useDerivedValue(() =>
    interpolate(deg, [0, 360], [0, 2 * Math.PI], Extrapolation.CLAMP)
  );

  const derivedAngle = useDerivedValue(() => angle.value);
  const dx = useDerivedValue(
    () =>
      cx -
      radius / 2 +
      circleRadius * Math.cos(derivedAngle.value + radVal.value)
    // () =>
    //   cx -
    //   radius / 2 +
    //   circleRadius * Math.cos(derivedAngle.value * derivedAngle.value)
    // () => cx - radius / 2 + circleRadius * Math.cos(Math.PI + Math.PI / 4)
  );
  const lineStyle = useAnimatedStyle(() => ({
    position: "relative",
    width: circleRadius * 2,
    height: 2,
    backgroundColor: "transparent",
    left,
  }));
  const overlayStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${deg}deg`,
      },
    ],
  }));
  const circleStyle = useAnimatedStyle(
    () => ({
      width: radius,
      height: radius,
      borderRadius: radius,
      backgroundColor: "orange",
      transform: [
        {
          translateX: dx.value,
        },
      ],
      // top: -radius / 2,
      // top: (i % 2 === 0 ? radius : -radius) / 2,
    }),
    [dx.value]
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${derivedAngle.value}`,
      // Here we use any because the text prop is not available in the type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });
  return (
    <>
      {/* <View
        style={[
          StyleSheet.absoluteFill,
          globalStyle.justifyCenter,
          globalStyle.alignItemsCenter,
        ]}
      >
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          value={derivedAngle.value?.toString()}
          style={[]}
          {...{ animatedProps }}
        />
      </View> */}

      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Animated.View style={[lineStyle]}>
          {/* <Animated.View style={[circleStyle]} /> */}
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Animated.View style={[circleStyle]} />
      </Animated.View>
    </>
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
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter,
    backgroundColor: "white",
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
}));
export default trigonometry;
