import React, { useEffect } from "react";
import {
  Canvas,
  Path,
  Paint,
  Skia,
  SweepGradient,
  Circle,
} from "@shopify/react-native-skia";
import { Button, Dimensions, LayoutChangeEvent } from "react-native";
import { View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
// const AnimatedPath = Animated.createAnimatedComponent(Path);
const _padding = 24;
const _strokeWidth = 16;
const { width: _screenWidth, height: _screenHeight } = Dimensions.get("window");
const _viewWidth = _screenWidth - 2 * _padding;
const _drawWidth = _viewWidth - 2 * _strokeWidth;

const purple = "#9c27b0";
const blue = "#29b6f6";
const lightGrey = "#eeeeee";
const textPurple = "#311b92";
const textGrey = "#616161";
const _ballRadius = 12; // Radius of the moving ball
const percent = 0.5;
const Skiaplayground = () => {
  const cx = 150; // Center x-coordinate
  const cy = 150; // Center y-coordinate
  const r = 100; // Radius of the circle
  const p = useSharedValue(0);

  // Animated value for the angle (in radians)
  const theta = useSharedValue(0);
  const circleCx = useSharedValue(_strokeWidth);
  const circleCy = useSharedValue(_viewWidth / 2);
  const getRandon = () => {
    "worklet";
    const val = Math.random();
    return val;
  };
  useEffect(() => {
    p.value = withTiming(getRandon(), { duration: 1000 });
  }, [r]);

  const animatedProp = useAnimatedProps(() => ({
    end: p.value,
  }));
  // Create a path for the semi-circle
  const semiCirclePath = Skia.Path.Make();
  semiCirclePath.moveTo(0, _viewWidth / 2); // Move to the start of the semi-circle (leftmost point)
  semiCirclePath.addArc(
    {
      x: _strokeWidth,
      y: _strokeWidth,
      width: _drawWidth,
      height: _drawWidth,
    },
    180,
    180
  );
  //   semiCirclePath.close(); // Close the path if a filled semi-circle is desired
  const randomise = () => {
    p.value = withTiming(getRandon(), { duration: 1000 });
    // p.value = withTiming(0.5, { duration: 1000 });
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: _padding,
      }}
    >
      <Canvas
        style={{
          width: _viewWidth,
          height: _viewWidth,
        }}
      >
        <Path path={semiCirclePath} color={"transparent"}>
          <Paint
            style={"stroke"}
            strokeWidth={_strokeWidth}
            strokeCap={"round"}
            color={lightGrey}
          />
        </Path>
        <Path path={semiCirclePath} color={"transparent"} end={p}>
          <Paint
            style={"stroke"}
            strokeWidth={_strokeWidth}
            strokeCap={"round"}
            color={lightGrey}
          >
            <SweepGradient
              c={{
                x: _viewWidth / 2,
                y: _viewWidth / 2 + _strokeWidth,
              }}
              colors={[purple, blue]}
              end={180 + 180 * percent}
            />
          </Paint>
        </Path>
        <Circle
          cx={circleCx}
          cy={circleCy}
          //   cx={(_screenWidth - _strokeWidth) / 2}
          //   cy={(_viewWidth - _strokeWidth) / 2}
          //   cx={_drawWidth / 2 + _ballRadius * Math.cos(Math.PI)}
          //   cy={_drawWidth / 2 + _ballRadius * Math.sin(Math.PI)}
          //   cx={
          //     _ballRadius +
          //     _strokeWidth / 2 +
          //     // (_viewWidth / 2) *
          //     Math.cos(p.value)
          //   }
          //   cy={_viewWidth / 2 - (_viewWidth / 2) * Math.sin(p.value)}
          //   cy={_viewWidth / 2 + (_viewWidth / 2) * Math.sin(p.value)}
          //   cx={cx + r * Math.cos(theta.current)} // Update x using parametric equation
          //   cy={cy + r * Math.sin(theta.current)} // Update y using parametric equation
          r={_ballRadius}
          color="white"
        />
      </Canvas>

      <Button onPress={randomise} title="Randomise" />
    </View>
  );
};

export default Skiaplayground;
