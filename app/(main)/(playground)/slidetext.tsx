import { View, Text } from "react-native";
import React, { useState } from "react";
import Box from "@/components/layout/Box";
import globalStyle from "@/globalStyle/globalStyle";
import TextComponent from "@/components/text/TextComponent";

const SlideText = () => {
  return (
    <Box
      style={[
        globalStyle.flexOne,
        globalStyle.justifyCenter,
        globalStyle.alignItemsCenter,
        globalStyle.bgBlack,
        //   {
        //     transform: [
        //       {
        //         rotate: "90deg",
        //       },
        //     ],
        //   },
      ]}
    >
      <MarqueeText
        text=" I AM THE BEST IN THE WORLD RIGHT NOW AND THERES NOTHING YOU CAN DO
          ABOUT IT"
      />
    </Box>
  );
};

export default SlideText;

import { useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MarqueeText = ({
  text,
  duration = 8000,
}: {
  text: string;
  duration?: number;
}) => {
  const translateX = useSharedValue(SCREEN_WIDTH);
  const [height, setHeight] = useState(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    const animate = () => {
      translateX.value = withRepeat(
        withTiming(-SCREEN_WIDTH, {
          duration,
          easing: Easing.linear,
        }),
        -1, // infinite
        false, // no reverse
        (finished) => {
          if (finished) {
            runOnJS(() => {
              translateX.value = SCREEN_WIDTH; // reset position after loop
            });
          }
        }
      );
    };

    animate();
  }, [translateX, duration]);

  return (
    <View
      style={[
        styles.container,
        {
          height: 30,
        },
      ]}
    >
      <Animated.Text
        onLayout={(e) => {
          console.log({
            layour: e.nativeEvent.layout.height.toFixed(0),
          });

          setHeight(Number(e.nativeEvent.layout.height.toFixed(0)));
        }}
        style={[styles.text, animatedStyle]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // overflow: "hidden",
    backgroundColor: "#111",
    // paddingVertical: 10,
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    width: "100%",
  },
});
