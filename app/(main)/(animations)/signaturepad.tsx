import { View, Text, Pressable, StyleSheet } from "react-native";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Eraser, Eye, PenLine, RotateCcw, Undo } from "lucide-react-native";
import globalStyle, { width } from "@/globalStyle/globalStyle";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  runOnUI,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import pallete from "@/constants/colors/pallete";
import { svgPathProperties } from "svg-path-properties";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { G, Path, PathProps } from "react-native-svg";
import { LucideProps } from "lucide-react-native";
import TextComponent from "@/components/text/TextComponent";
import MaskedView from "@react-native-masked-view/masked-view";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const PATH_PROPS: PathProps = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const ICON_PROPS: LucideProps = {
  size: 21,
  strokeWidth: 1.8,
};
const BTN_HEIGHT = 38;
const HeaderBar = ({
  onReset,
  onPreview,
  pathLength,
}: {
  onPreview?: () => void;
  onReset?: () => void;
  pathLength: SharedValue<number>;
}) => {
  const iconProps: LucideProps = {
    ...ICON_PROPS,
    size: 20,
    color: pallete.placeHolderTextDark,
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(pathLength.value > 0 ? 0 : -50, {
            duration: 300,
          }),
        },
      ],
    };
  });

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        opacity: 0.6,
        paddingHorizontal: 12,
        alignItems: "center",
      }}
    >
      <Pressable>
        <PenLine {...iconProps} />
      </Pressable>
      <TextComponent style={[{ lineHeight: 48 }, globalStyle.textWhitePrimary]}>
        Draw signature
      </TextComponent>
      <Animated.View
        style={[
          {
            flex: 1,
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
            justifyContent: "flex-end",
          },
          animatedStyle,
        ]}
      >
        <Pressable onPress={onPreview} style={[globalStyle.pr0p8]}>
          <Eye {...iconProps} size={22} />
        </Pressable>
        <Pressable onPress={onReset} style={[globalStyle.pr0p8]}>
          <RotateCcw {...iconProps} size={19} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const Signaturepad = () => {
  return (
    <View
      style={[
        globalStyle.flexOne,
        globalStyle.bgBlack,
        globalStyle.justifyCenter,
        globalStyle.alignItemsCenter,
      ]}
    >
      <Pad />
    </View>
  );
};

const Pad = () => {
  const padRef = useRef<any>(null);
  const pathLength = useSharedValue<number>(0);
  const playing = useSharedValue<boolean>(false);
  const signed = useSharedValue<boolean>(false);
  const handleErase = () => {
    if (padRef.current) {
      padRef.current.erase();
    }
  };
  const handleUndo = () => {
    if (padRef.current) {
      padRef.current.undo();
    }
  };
  const handleReset = () => {
    if (padRef.current) {
      padRef.current.erase();
    }
  };
  const handlePreview = () => {
    "worklet";
    if (padRef.current) {
      padRef.current.play();
    }
  };

  const handleStop = () => {
    if (padRef.current) {
      padRef.current.stop();
    }
  };

  const handleSign = () => {
    if (padRef.current) {
      handleStop();
      setTimeout(() => {
        playing.value = true;
      }, 0);
      padRef.current.play();
    }
  };

  return (
    <View
      style={{
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: pallete.gray40,
      }}
    >
      <HeaderBar
        onReset={handleReset}
        onPreview={handlePreview}
        pathLength={pathLength}
      />
      <DrawPad
        height={180}
        width={width * 0.85}
        ref={padRef}
        stroke={pallete.green0}
        // stroke={pallete.white}
        pathLength={pathLength}
        playing={playing}
      />
      <ActionBar
        onErase={handleErase}
        onUndo={handleUndo}
        onStop={handleStop}
        onPlay={handleSign}
        pathLength={pathLength}
        signed={signed}
      />
    </View>
  );
};

interface DrawPadProps {
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
          console.log({
            updatedPaths,
          });

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
                  stroke={pallete.white}
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

const ActionBar = ({
  onErase,
  onUndo,
  onStop,
  onPlay,
  pathLength,
  signed,
}: {
  onErase: () => void;
  onUndo: () => void;
  onStop: () => void;
  onPlay: () => void;
  pathLength: SharedValue<number>;
  signed: SharedValue<boolean>;
}) => {
  const buttonWidth = 140;
  const pressing = useSharedValue(false);

  const iconProps: LucideProps = {
    ...ICON_PROPS,
    color: pallete.white,
  };

  useAnimatedReaction(
    () => pressing.value,
    (isPressing) => {
      if (isPressing) {
        runOnJS(onPlay)();
      } else {
        runOnJS(onStop)();
      }
    }
  );

  const progress = useDerivedValue(() =>
    withTiming(
      (signed.value || pressing.value) && pathLength.value > 0 ? 1 : 0,
      {
        duration: pressing.value ? pathLength.value * 2 : 0,
      }
    )
  );

  useAnimatedReaction(
    () => progress.value,
    (currentProgress) => {
      if (currentProgress === 1) {
        signed.value = pathLength.value > 0 && pressing.value;
      } else {
        signed.value = false;
      }
    }
  );

  const slideAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: signed.value ? buttonWidth : buttonWidth * progress.value,
    };
  });

  const signedAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(signed.value ? BTN_HEIGHT : 0),
        },
      ],
    };
  });

  return (
    <View
      style={{
        padding: 8,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          {
            flexDirection: "row",
            gap: 12,
            opacity: 0.6,
          },
          signedAnimatedStyle,
        ]}
      >
        <Pressable onPress={onUndo} style={[globalStyle.pl1p2]}>
          <Undo {...iconProps} />
        </Pressable>
        <Pressable onPress={onErase} style={[globalStyle.pl1p2]}>
          <Eraser {...iconProps} />
        </Pressable>
      </Animated.View>
      <Pressable
        style={[
          styles.confirmBtnBlock,
          styles.confirmBtn,
          { backgroundColor: "#ffffff" + "20", width: buttonWidth },
        ]}
        onPressIn={() => {
          pressing.value = !signed.value;
        }}
        onPressOut={() => {
          pressing.value = false;
        }}
      >
        <OverlayMask
          color="#D1FADC"
          element={
            <View
              style={{ width: "100%", height: "100%", backgroundColor: "#000" }}
            />
          }
          animatedStyle={slideAnimatedStyle}
        />
        <Animated.View style={[signedAnimatedStyle]}>
          <View style={[styles.confirmBtnBlock, {}]}>
            <TextComponent style={{ fontSize: 15, color: "#1B7F3E" }}>
              Signed
            </TextComponent>
          </View>
          <View style={styles.confirmBtnBlock}>
            <TextComponent
              style={[globalStyle.textWhitePrimary, { fontSize: 15 }]}
            >
              Hold to confirm
            </TextComponent>
            <OverlayMask
              color="#1B7F3E"
              element={
                <TextComponent style={{ fontSize: 15, color: pallete.white }}>
                  Hold to confirm
                </TextComponent>
              }
              animatedStyle={slideAnimatedStyle}
            />
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const OverlayMask = ({
  color,
  element,
  animatedStyle,
}: {
  color: string;
  element: React.ReactNode;
  animatedStyle?: any;
}) => {
  return (
    <MaskedView
      style={{ flex: 1, ...StyleSheet.absoluteFillObject }}
      maskElement={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {element}
        </View>
      }
    >
      <Animated.View
        style={[
          { flex: 1, height: "100%", backgroundColor: color },
          animatedStyle,
        ]}
      />
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingLeft: 12,
  },
  headerBtn: {
    paddingRight: 6,
  },
  confirmBtn: {
    borderRadius: 6,
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  confirmBtnBlock: {
    height: BTN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Signaturepad;
