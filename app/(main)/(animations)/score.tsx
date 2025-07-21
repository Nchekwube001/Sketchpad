import { View, Text } from "react-native";
import React, { useRef, useState } from "react";
import { Canvas } from "@shopify/react-native-skia";
import Box from "@/components/layout/Box";
import globalStyle, { height, width } from "@/globalStyle/globalStyle";
import { svgPathProperties } from "svg-path-properties";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, {
  Circle,
  G,
  Line,
  Path,
  PathProps,
  Polygon,
} from "react-native-svg";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import pallete from "@/constants/colors/pallete";

const PATH_PROPS: PathProps = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const strokeWidth = 6;
const footballArea = 40;
const postArea = 70;
const AnimatedPath = Animated.createAnimatedComponent(Path);

const Score = () => {
  const [paths, setPaths] = useState<string[]>([]);
  const playing = useSharedValue<boolean>(false);

  const finishPath = () => {
    const pathValue = currentPath.value;
    if (pathValue) {
      setPaths((prev) => {
        const updatedPaths = [...prev, pathValue];
        setTimeout(() => {
          currentPath.value = "";
        }, 0);
        return updatedPaths;
      });
    }
  };
  const currentPath = useSharedValue<string>("");
  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onStart((e) => {
      currentPath.value = `M ${e.x} ${e.y}`;
    })
    .onUpdate((e) => {
      console.log({
        e,
      });

      currentPath.value += ` L ${e.x} ${e.y}`;
    })
    .onEnd(() => {
      runOnJS(finishPath)();
    });

  const handleErase = () => {
    setPaths([]);
    currentPath.value = "";
  };
  const progress = useSharedValue(1);
  // const length = new svgPathProperties(path).getTotalLength();

  const animatedProps = useAnimatedProps(() => ({
    d: currentPath.value,
  }));
  return (
    <GestureDetector gesture={panGesture}>
      <Box style={[globalStyle.flexOne, globalStyle.bgBlack]}>
        <Box
          style={[
            globalStyle.w10,
            globalStyle.justifyCenter,
            globalStyle.alignItemsCenter,
            { height: postArea },
          ]}
        >
          <GoalPost />
        </Box>
        <Svg
          height={height - footballArea - postArea}
          width={Math.min(width, 480)}
        >
          {paths.map((p, i) => {
            const prevLength = paths.slice(0, i).reduce((total, prevPath) => {
              return total + new svgPathProperties(prevPath).getTotalLength();
            }, 0);

            return (
              <DrawPath
                key={i}
                path={p}
                prevLength={prevLength}
                playing={playing}
                strokeWidth={strokeWidth}
                stroke={pallete.white}
              />
            );
          })}
          <AnimatedPath
            animatedProps={animatedProps}
            strokeWidth={strokeWidth}
            stroke={pallete.white}
            {...PATH_PROPS}
          />
        </Svg>
        <Box
          style={[
            globalStyle.w10,
            globalStyle.justifyCenter,
            globalStyle.alignItemsCenter,
            { height: footballArea },
          ]}
        >
          <Football />
        </Box>
      </Box>
    </GestureDetector>
  );
};

const DrawPath = ({
  path,
  prevLength,
  playing,
  strokeWidth,
  stroke,
}: {
  path: string;
  prevLength: number;
  playing: SharedValue<boolean>;
  strokeWidth: number;
  stroke: string;
}) => {
  const pathRef = useRef<Path>(null);
  const length = new svgPathProperties(path).getTotalLength();
  const progress = useSharedValue(1);

  useAnimatedReaction(
    () => playing.value,
    (isPlaying, prev) => {
      if (isPlaying === prev) return;
      if (isPlaying) {
        progress.value = 0;
        progress.value = withDelay(
          prevLength * 2 + 1,
          withTiming(1, {
            duration: length * 2,
            easing: Easing.bezier(0.4, 0, 0.5, 1),
          })
        );
      } else {
        progress.value =
          progress.value < 1
            ? withTiming(
                0,
                {
                  duration: progress.value > 0 ? length * 2 : 0,
                  easing: Easing.bezier(0.4, 0, 0.5, 1),
                },
                () => {
                  progress.value = 1;
                }
              )
            : 1;
      }
    }
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: interpolate(progress.value, [0, 1], [length, 0]),
    };
  });

  return (
    <G>
      <Path
        d={path}
        strokeWidth={strokeWidth}
        stroke={stroke}
        ref={pathRef}
        strokeOpacity={0.2}
        {...PATH_PROPS}
      />
      <AnimatedPath
        d={path}
        strokeWidth={strokeWidth}
        stroke={stroke}
        strokeDasharray={length}
        animatedProps={animatedProps}
        {...PATH_PROPS}
      />
    </G>
  );
};
export function GoalPost() {
  const size = width / 2;

  return (
    <Svg width={size} height={postArea} viewBox="0 0 100 100">
      {/* Goal posts */}
      <Line x1="0" y1="0" x2="0" y2="100" stroke="white" strokeWidth={2} />
      <Line x1="100" y1="0" x2="100" y2="100" stroke="white" strokeWidth={2} />
      <Line x1="0" y1="0" x2="100" y2="0" stroke="white" strokeWidth={2} />

      {/* Net pattern behind */}
      {[...Array(15)].map((_, i) => (
        <Line
          key={`vertical-${i}`}
          x1={0 + i * 7.5}
          y1={0}
          x2={0 + i * 7.5}
          y2={100}
          stroke="white"
          strokeWidth={0.5}
        />
      ))}
      {[...Array(15)].map((_, i) => (
        <Line
          key={`horizontal-${i}`}
          x1={0}
          y1={0 + i * 8.75}
          x2={100}
          y2={0 + i * 8.75}
          stroke="white"
          strokeWidth={0.5}
        />
      ))}
    </Svg>
  );
}

export function Football({ size = footballArea }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Outer circle representing the ball */}
      <Circle
        cx="50"
        cy="50"
        r="48"
        fill="white"
        stroke="black"
        strokeWidth={2}
      />

      {/* Central pentagon */}
      <Polygon points="50,20 61,35 55,55 45,55 39,35" fill="black" />

      {/* Two side outlines to suggest pattern */}
      <Path
        d="M50 20 L80 30 L90 50 L80 70 L50 80"
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M50 20 L20 30 L10 50 L20 70 L50 80"
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
    </Svg>
  );
}

export default Score;
