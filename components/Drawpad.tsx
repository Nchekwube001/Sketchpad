import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View } from "react-native";
import Svg, { G, Path, PathProps } from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  runOnJS,
  interpolate,
  withDelay,
  withTiming,
  SharedValue,
  useAnimatedReaction,
  Easing,
  runOnUI,
} from "react-native-reanimated";
import { svgPathProperties } from "svg-path-properties";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const PATH_PROPS: PathProps = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export interface DrawPadProps {
  width: number;
  height: number;
  strokeWidth?: number;
  stroke: string;
  pathLength: SharedValue<number>;
  playing: SharedValue<boolean>;
}

const DrawPad = forwardRef(
  (
    {
      width,
      height,
      strokeWidth = 3.5,
      stroke,
      pathLength,
      playing,
    }: DrawPadProps,
    ref
  ) => {
    const [paths, setPaths] = useState<string[]>([]);
    const currentPath = useSharedValue<string>("");

    useEffect(() => {
      if (pathLength) {
        pathLength.value = paths.reduce((total, path) => {
          return total + new svgPathProperties(path).getTotalLength();
        }, 0);
      }
    }, [paths]);

    const animatedProps = useAnimatedProps(() => ({
      d: currentPath.value,
    }));

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

    const handleErase = () => {
      setPaths([]);
      currentPath.value = "";
    };

    const handleUndo = useCallback(() => {
      setPaths((prev) => {
        const newPaths = [...prev];
        newPaths.pop();
        return newPaths;
      });
    }, []);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handlePlay = useCallback(() => {
      if (!playing.value) {
        playing.value = true;
        timeoutId = setTimeout(() => {
          playing.value = false;
        }, pathLength.value * 2);

        return () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        };
      }
    }, [playing, pathLength]);

    const handleStop = useCallback(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      runOnUI(() => {
        playing.value = false;
      })();
    }, [timeoutId, playing]);

    useImperativeHandle(ref, () => ({
      erase: handleErase,
      undo: handleUndo,
      play: handlePlay,
      stop: handleStop,
    }));

    const panGesture = Gesture.Pan()
      .minDistance(0)
      .onStart((e) => {
        currentPath.value = `M ${e.x} ${e.y}`;
      })
      .onUpdate((e) => {
        currentPath.value += ` L ${e.x} ${e.y}`;
      })
      .onEnd(() => {
        runOnJS(finishPath)();
      });

    return (
      <GestureDetector gesture={panGesture}>
        <View>
          <Svg height={height} width={Math.min(width, 480)}>
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
                  stroke={stroke}
                />
              );
            })}
            <AnimatedPath
              animatedProps={animatedProps}
              stroke={stroke}
              strokeWidth={strokeWidth}
              {...PATH_PROPS}
            />
          </Svg>
        </View>
      </GestureDetector>
    );
  }
);

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

export default DrawPad;
