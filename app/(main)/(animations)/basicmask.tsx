import { View, Text } from "react-native";
import React from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const speed = 3000;
const size = 60;
const basicmask = () => {
  const translateX = useSharedValue<number>(0);

  const onLayout = (event: {
    nativeEvent: { layout: { width: number; x: number } };
  }) => {
    const { width, x } = event.nativeEvent.layout;
    translateX.value = withRepeat(
      withSequence(
        withTiming(width + x, { duration: speed }),
        withTiming(-size, { duration: 0 })
      ),
      -1,
      false
    );
  };

  const animatedSliderStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: size,
    height: "100%",
    left: translateX.value,
  }));

  return (
    <MaskedView
      style={{
        flex: 1,
        flexDirection: "row",
        height: "100%",
      }}
      maskElement={
        <View
          style={{
            // Transparent background because mask is based off alpha channel.
            backgroundColor: "transparent",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            onLayout={onLayout}
            style={{
              fontSize: 36,
              color: "black",
              fontWeight: "bold",
            }}
          >
            Unekwe Francis
          </Text>
        </View>
      }
    >
      {/* Shows behind the mask, you can put anything here, such as an image */}
      <View
        style={[
          {
            backgroundColor: "transparent",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          },
          //   layerStyle,
        ]}
      >
        <AnimatedLinearGradient
          //   colors={["#ffffff00", "#ffffff", "#ffffff00"]}
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          start={{ x: -1, y: 0.2 }}
          end={{ x: 1, y: 0 }}
          //   end={{ x: 1, y: 0 }}
          style={[animatedSliderStyle]}
        />
      </View>
      {/* <View style={{ flex: 1, height: "100%", backgroundColor: "#324376" }} />
      <View style={{ flex: 1, height: "100%", backgroundColor: "#F5DD90" }} />
      <View style={{ flex: 1, height: "100%", backgroundColor: "#F76C5E" }} />
      <View style={{ flex: 1, height: "100%", backgroundColor: "#e1e1e1" }} /> */}
    </MaskedView>
  );
};

export default basicmask;
