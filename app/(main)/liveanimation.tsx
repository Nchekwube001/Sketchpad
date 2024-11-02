import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

const boxWidth = 130;
const boxHeight = 60;
const Liveanimation = () => {
  const [isActive, setISActive] = useState(false);
  const active = useSharedValue(0);
  const inputRange = [0, 1];
  const widthStyle = useAnimatedStyle(() => ({
    width: interpolate(active.value, inputRange, [0, boxWidth]),
    height: "100%",
    position: "absolute",
  }));
  const scaleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      active.value,
      [0, 1],
      ["#b91c1c", "#fff"]
    ),
    borderColor: interpolateColor(active.value, [0, 1], ["#b91c1c", "#fff"]),
    borderWidth: 2,
    width: 20,
    height: 20,
    marginLeft: 8,
    borderRadius: 200,
    transform: [
      {
        scale: interpolate(
          active.value,
          [0, 0.55, 0.9, 0.95, 1],
          [1, 1, 1.5, 1, 1]
        ),
      },
    ],
  }));
  return (
    <View className="h-full justify-center items-center">
      <Pressable
        onPress={() => {
          active.value = withTiming(active.value === 1 ? 0 : 1);
          setISActive((prev) => !prev);
        }}
      >
        <View
          className="bg-white rounded-full overflow-hidden"
          style={{
            width: boxWidth,
            height: boxHeight,
          }}
        >
          <Animated.View
            style={[widthStyle]}
            className={"bg-red-700 rounded-full"}
          />
          <View
            className="flex-row items-center h-full justify-center rounded-full "
            style={{
              width: boxWidth,
            }}
          >
            <Text
              className={`${isActive ? "text-white" : "text-red-700"} text-2xl`}
            >
              LIVE
            </Text>
            <Animated.View
              style={[scaleStyle]}
              //   className={`${isActive ? "border-white" : "border-red-700"} ${
              //     isActive ? "bg-white" : ""
              //   } border-2 w-5 h-5 rounded-full ml-2`}
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default Liveanimation;
