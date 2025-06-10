import { View, Text, Pressable, TextInput } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  LinearTransition,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import globalStyle, { height } from "@/globalStyle/globalStyle";
import {
  HomeIcon,
  Workflow,
  MessageSquare,
  Settings,
  ArrowLeft,
  Send,
  SpeechIcon,
} from "lucide-react-native";
import Box from "@/components/layout/Box";
import { SafeAreaView } from "react-native-safe-area-context";
import pallete from "@/constants/colors/pallete";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import TextComponent from "@/components/text/TextComponent";
import { StatusBar } from "expo-status-bar";
const _spring_config = {
  damping: 10,
  stiffness: 80,
};
const _first_step = height / 4;
const _second_step = height / 2;
const _third_step = height * 0.85;
const AnimatedOverlay = () => {
  const panHeight = useSharedValue(0);
  const isPanning = useSharedValue(false);
  const prevTranslationY = useSharedValue(0);
  const bottomStyle = useAnimatedStyle(() => ({
    height: height - Math.min(panHeight.value, _first_step),
  }));

  const isPastQuater = useDerivedValue(() => panHeight.value > _first_step);
  function clamp({ val, min, max }: { val: number; min: number; max: number }) {
    "worklet";
    return Math.min(Math.max(val, min), max);
  }
  const tabItems = [
    {
      title: "Home",
      icon: <HomeIcon color={pallete.black} />,
    },
    {
      title: "Workflow",
      icon: <Workflow color={pallete.GrayText} />,
    },
    {
      title: "Chat",
      icon: <MessageSquare color={pallete.GrayText} />,
      onPress: () => {
        panHeight.value = withTiming(_first_step);
      },
    },
    {
      title: "Settings",
      icon: <Settings color={pallete.GrayText} />,
    },
  ];
  const borderStyle = useAnimatedStyle(() => ({
    borderRadius: 32,
    // borderRadius: interpolate(panHeight.value, [0, height / 3], [16, 32]),
  }));
  const topStyle = useAnimatedStyle(() => ({
    zIndex: panHeight.value > 0 && panHeight.value <= _first_step ? -1 : 4,
    // top: height - panHeight.value,
    height: panHeight.value,
    // height: 400,
    bottom: 0,
    alignSelf: "flex-end",
  }));
  const handleStyle = useAnimatedStyle(() => ({
    bottom: panHeight.value - 30,
    width: 40,
    height: 6,
    borderRadius: 20,
    backgroundColor: pallete.gray40,
    alignSelf: "center",
    zIndex: 30,
  }));
  const threshold = 100;
  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      prevTranslationY.value = panHeight.value;
      isPanning.value = true;
    })

    .onUpdate(({ translationY, velocityY }) => {
      isPanning.value = true;

      panHeight.value = clamp({
        val: prevTranslationY.value - translationY,
        max: height,
        min: 0,
      });
    })
    .onEnd(({ velocityY }) => {
      isPanning.value = false;
      if (velocityY > 3000) {
        panHeight.value = withTiming(0);
        return;
      }
      if (panHeight.value < threshold) {
        panHeight.value = withTiming(0);
      } else if (panHeight.value > threshold && panHeight.value < _first_step) {
        panHeight.value = withTiming(_first_step);
      } else if (
        panHeight.value > _first_step &&
        panHeight.value < _second_step
      ) {
        panHeight.value = withTiming(_second_step);
      } else if (
        panHeight.value > _second_step &&
        panHeight.value < _third_step
      ) {
        panHeight.value = withTiming(_third_step);
      } else {
        panHeight.value = withTiming(_third_step);
      }
    });
  //   const panGesture = Gesture.Pan()
  //     .minDistance(10)
  //     .onStart(() => {
  //       prevTranslationY.value = Math.abs(panHeight.value);
  //       isPanning.value = true;
  //     })

  //     .onUpdate(({ y }) => {
  //       panHeight.value = height - y;
  //       isPanning.value = true;
  //     })
  //     .onEnd(() => {
  //       if (panHeight.value < threshold) {
  //         panHeight.value = withTiming(0);
  //       } else if (panHeight.value > threshold && panHeight.value < _first_step) {
  //         panHeight.value = withTiming(_first_step);
  //       } else if (
  //         panHeight.value > _first_step &&
  //         panHeight.value < _second_step
  //       ) {
  //         panHeight.value = withTiming(_second_step);
  //       } else if (
  //         panHeight.value > _second_step &&
  //         panHeight.value < _third_step
  //       ) {
  //         panHeight.value = withTiming(_third_step);
  //       } else {
  //         panHeight.value = withTiming(_third_step);
  //       }
  //       isPanning.value = false;
  //     });
  const tabStyle = useAnimatedStyle(() => ({
    opacity:
      panHeight.value >= _second_step && !isPanning.value ? withTiming(1) : 0,
    transform: [
      {
        translateY: withTiming(
          panHeight.value >= _second_step && !isPanning.value ? 0 : -50
        ),
      },
    ],
  }));
  const chatStyle = useAnimatedStyle(() => ({
    display:
      panHeight.value < _first_step && !isPanning.value ? "flex" : "none",
    // flex: withDelay(
    //   500,
    //   panHeight.value < _first_step && !isPanning.value ? 1 : 0
    // ),
  }));
  return (
    <Animated.View style={[globalStyle.height, globalStyle.bgBlack]}>
      <StatusBar hidden={true} />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[globalStyle.flexOne]}>
          <Animated.View
            style={[
              globalStyle.bgBlack,
              globalStyle.absolute,
              globalStyle.height,
              globalStyle.width,
              borderStyle,
              topStyle,
            ]}
          >
            <SafeAreaView
              style={[globalStyle.flexOne, globalStyle.justifyBetween]}
            >
              <Animated.View
                style={[
                  globalStyle.flexrow,
                  globalStyle.alignItemsCenter,
                  globalStyle.justifyBetween,
                  globalStyle.px2,
                  tabStyle,
                ]}
              >
                <Pressable
                  style={[
                    globalStyle.justifyCenter,
                    globalStyle.alignItemsCenter,
                    globalStyle.bgTextInputDark,
                    {
                      width: 36,
                      height: 36,
                      borderRadius: 20,
                    },
                  ]}
                >
                  <ArrowLeft color={pallete.white} size={20} />
                </Pressable>
                <TextComponent
                  style={[globalStyle.fontSize16, globalStyle.textWhitePrimary]}
                >
                  Ask Zenna
                </TextComponent>
                <Pressable
                  style={[
                    globalStyle.justifyCenter,
                    globalStyle.alignItemsCenter,
                    globalStyle.bgTextInputDark,
                    {
                      width: 36,
                      height: 36,
                      borderRadius: 20,
                    },
                  ]}
                >
                  <SpeechIcon color={pallete.white} size={20} />
                </Pressable>
              </Animated.View>
              <Box style={[globalStyle.px2]}>
                <Box
                  style={[
                    globalStyle.flexrow,
                    globalStyle.bgTextInputDark,
                    globalStyle.borderRadius16,
                    globalStyle.alignItemsCenter,
                    globalStyle.justifyBetween,
                    globalStyle.px0p5,
                    {
                      height: 48,
                    },
                  ]}
                >
                  <Box style={[globalStyle.flexOne, globalStyle.px0p8]}>
                    <TextInput
                      placeholder="Type anything..."
                      placeholderTextColor={pallete.gray40}
                      style={[
                        globalStyle.h10,
                        globalStyle.w10,
                        globalStyle.textWhitePrimary,
                      ]}
                    />
                  </Box>
                  <Pressable
                    style={[
                      globalStyle.bgWhite,
                      globalStyle.justifyCenter,
                      globalStyle.alignItemsCenter,
                      {
                        width: 44,
                        height: 36,
                        borderRadius: 12,
                      },
                    ]}
                  >
                    <Send color={pallete.black} />
                  </Pressable>
                </Box>
              </Box>
            </SafeAreaView>
          </Animated.View>

          <Animated.View style={[globalStyle.absolute, handleStyle]} />
          <Animated.View
            style={[globalStyle.bgWhite, borderStyle, bottomStyle]}
          >
            <SafeAreaView style={[globalStyle.flexOne]}>
              <View style={[globalStyle.flexOne, globalStyle.justifyBetween]}>
                <View style={[globalStyle.flexOne]}>
                  <View
                    style={[
                      globalStyle.flexrow,
                      globalStyle.alignItemsCenter,
                      globalStyle.justifyBetween,
                      globalStyle.px2,
                    ]}
                  >
                    <View>
                      <TextComponent style={[globalStyle.fontSize16]}>
                        Welcome
                      </TextComponent>
                      <TextComponent
                        style={[globalStyle.fontSize12, globalStyle.pt0p2]}
                      >
                        Tak to us
                      </TextComponent>
                    </View>
                    <View>
                      <Box
                        style={[
                          globalStyle.br,
                          globalStyle.bgBlack,
                          {
                            width: 40,
                            height: 40,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                <Animated.View
                  //   layout={LinearTransition.duration(100)}
                  style={[
                    globalStyle.flexrow,
                    globalStyle.alignItemsCenter,
                    globalStyle.justifyEvenly,
                  ]}
                >
                  {tabItems.map(({ icon, title, onPress }) => (
                    <Animated.View
                      key={title}
                      style={[
                        globalStyle.flexOne,
                        title === "Chat" && chatStyle,
                      ]}
                    >
                      <Pressable
                        onPress={onPress}
                        style={[
                          globalStyle.justifyCenter,
                          globalStyle.alignItemsCenter,
                        ]}
                      >
                        {icon}
                      </Pressable>
                    </Animated.View>
                  ))}
                </Animated.View>
              </View>
            </SafeAreaView>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export default AnimatedOverlay;
