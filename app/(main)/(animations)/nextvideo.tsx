import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import globalStyle, { width } from "@/globalStyle/globalStyle";
import MaskedView from "@react-native-masked-view/masked-view";
import TextComponent from "@/components/text/TextComponent";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  LinearTransition,
  cancelAnimation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Repeat, Pause, Play, StopCircle } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const speed = 3000;
const size = 60;

const NextVideo = () => {
  const path = Skia.Path.Make();
  path.moveTo(50, 0); // Top point
  path.lineTo(100, 100); // Bottom right
  path.lineTo(0, 100); // Bottom left
  path.close(); // Close the triangle

  const translateX = useSharedValue<number>(0);
  const isPaused = useSharedValue<boolean>(true);
  const onLayout = (event: {
    nativeEvent: { layout: { width: number; x: number } };
  }) => {
    const { width, x } = event.nativeEvent.layout;
    // translateX.value = withRepeat(
    //   withSequence(
    //     withTiming(width + x, { duration: speed }),
    //     withTiming(-size, { duration: 0 })
    //   ),
    //   -1,
    //   false
    // );
  };

  const playAnimation = (restart?: boolean) => {
    isPaused.value = false;
    if (restart) {
      translateX.value = withTiming(0, {
        duration: 0,
      });
    }
    const remainingDuration = speed * (restart ? 1 : 1 - translateX.value);
    translateX.value = withTiming(1, {
      duration: remainingDuration,
    });
  };
  const stopAnimation = () => {
    translateX.value = withTiming(0, {
      duration: 100,
    });
    isPaused.value = true;
  };
  const pauseAnimation = () => {
    cancelAnimation(translateX);
    isPaused.value = true;
  };

  const animatedSliderStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: `${interpolate(translateX.value, [0, 1], [0, 100])}%`,
    height: "100%",
    left: 0,
    backgroundColor: "white",
  }));
  const animatedBgStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: `${interpolate(translateX.value, [0, 1], [0, 100])}%`,
    height: "100%",
    left: 0,
    backgroundColor: "black",
  }));
  const playStyle = useAnimatedStyle(() => ({
    position: "absolute",
    display: translateX.value === 0 || isPaused.value ? "flex" : "none",
    zIndex: translateX.value === 0 || isPaused.value ? 2 : 1,
  }));
  const pauseStyle = useAnimatedStyle(() => ({
    position: "absolute",
    display:
      translateX.value > 0 && translateX.value < 1 && !isPaused.value
        ? "flex"
        : "none",
    zIndex:
      translateX.value > 0 && translateX.value < 1 && !isPaused.value ? 2 : 1,
  }));
  const main = useAnimatedStyle(() => ({
    display: translateX.value === 1 ? "none" : "flex",
  }));
  return (
    <View
      style={[
        globalStyle.justifyCenter,
        globalStyle.flexOne,
        globalStyle.alignItemsCenter,
      ]}
    >
      <StatusBar hidden />
      <View
        style={[
          globalStyle.px1p6,
          globalStyle.py1p2,
          {
            borderRadius: 16,
          },
        ]}
      >
        <Animated.View
          layout={LinearTransition}
          style={[
            globalStyle.flexrow,
            globalStyle.alignItemsCenter,
            globalStyle.justifyEnd,
            globalStyle.pb1p2,
            {
              gap: 20,
            },
          ]}
        >
          <Pressable hitSlop={8}>
            <Repeat
              onPress={() => playAnimation(true)}
              size={14}
              color="black"
            />
          </Pressable>
          <Animated.View
            style={[
              globalStyle.flexrow,
              globalStyle.justifyCenter,
              globalStyle.alignItemsCenter,
              main,
            ]}
          >
            <Animated.View style={[pauseStyle]}>
              <Pressable hitSlop={8} onPress={() => pauseAnimation()}>
                <Pause size={14} color="black" />
              </Pressable>
            </Animated.View>
            <Animated.View style={[playStyle]}>
              <Pressable hitSlop={8} onPress={() => playAnimation()}>
                <Play size={14} color="black" />
              </Pressable>
            </Animated.View>
          </Animated.View>

          <Pressable hitSlop={8} onPress={stopAnimation}>
            <StopCircle size={14} color="black" />
          </Pressable>
        </Animated.View>
        <View
          style={[
            globalStyle.bgGray,
            globalStyle.borderRadius8,
            globalStyle.overflowHidden,
            //   globalStyle.px1p2,
            {
              width: width / 3,
              height: 48,
            },
          ]}
        >
          <Animated.View style={[animatedBgStyle]} />
          <MaskedView
            style={{ flex: 1, flexDirection: "row", height: "100%" }}
            androidRenderingMode="software"
            maskElement={
              <View
                style={{
                  backgroundColor: "transparent",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <View
                  onLayout={onLayout}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: 0,
                      height: 0,
                      backgroundColor: "transparent",
                      borderStyle: "solid",
                      borderTopWidth: 5,
                      borderBottomWidth: 5,
                      borderLeftWidth: 10,
                      borderTopColor: "transparent",
                      borderBottomColor: "transparent",
                      borderLeftColor: "green", // Triangle color
                    }}
                  />
                  <TextComponent
                    style={{
                      fontSize: 14,
                      color: "black",
                      fontWeight: "bold",
                      paddingLeft: 8,
                    }}
                  >
                    Next Video
                  </TextComponent>
                </View>
              </View>
            }
          >
            <View style={[globalStyle.bgBlack, globalStyle.flexOne]} />
            <Animated.View style={[animatedSliderStyle]} />
          </MaskedView>
        </View>
      </View>
    </View>
  );
};

export default NextVideo;
