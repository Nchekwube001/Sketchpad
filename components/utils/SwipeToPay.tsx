import React, { FC, useEffect, useMemo } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ArrowRightBlack from "@/assets/svgs/ArrowRightBlack.svg";
import Box from "../layout/Box";
import { useComponentSize } from "@/constants/utils/hooks";
import { spring_config, width } from "@/constants/utils/constants";
import { Text } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
export const _padding = 4;
export const _width = 48;
interface swipeProps {
  onSwipe: () => void;
  enabled: boolean;
  text?: string;
}
const SwipeToPay: FC<swipeProps> = ({ onSwipe, enabled, text }) => {
  const { size, onLayout } = useComponentSize();
  const transX = useSharedValue(0);
  const isPanning = useSharedValue(0);
  const xScaleValue = useSharedValue(_width);

  const maxWidth = useMemo(
    () => size.width - _width - _padding * 2,
    [size.width]
  );
  const gesture = Gesture.Pan()
    .onFinalize(({ x }) => {
      if (x >= maxWidth) {
        transX.value = maxWidth;
        isPanning.value = 1;
      } else {
        transX.value = 0;
        isPanning.value = 0;
      }
    })
    .onBegin(({ x }) => {
      transX.value = x;
      isPanning.value = 1;
      // }
    })
    .onChange(({ x }) => {
      // if (x <= 50) {
      if (x >= maxWidth) {
        transX.value = maxWidth;
        runOnJS(onSwipe)();
        // withDelay(2000, (transX.value = 0));
      }
      // else if (x === maxWidth) {
      // }
      else {
        transX.value = x;
      }
      isPanning.value = 1;

      // }
    });
  useEffect(() => {
    if (enabled) {
      xScaleValue.value = withRepeat(
        withTiming(_width + _width * 0.15, {
          duration: 700,
        }),
        //   withSpring(_width + _width * 0.15, spring_config),
        -1,
        true
      );
    }
    if (!enabled) {
      xScaleValue.value = _width;
    }
  }, [enabled, xScaleValue]);
  const panStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isPanning.value === 1 ? 0 : 1, spring_config),
      transform: [
        {
          translateY: withSpring(
            isPanning.value === 1 ? 200 : 0,
            spring_config
          ),
        },
      ],
      zIndex: isPanning.value === 1 ? 2 : 8,
      position: "absolute",
      width: size.width - (enabled ? _width - _padding : 0),
      right: 0,
      bottom: 0,
      // backgroundColor: 'red',
      backgroundColor: "transparent",
      // height: size.height,
      height: size.height,
    };
  });
  const aStyle = useAnimatedStyle(() => {
    return {
      left: withSpring(transX.value, spring_config),
      zIndex: 6,
      // transform: [
      //   {
      //     scaleX: xScaleValue.value,
      //   },
      // ],
    };
  });
  const widthStyle = useAnimatedStyle(() => {
    return {
      width: transX.value === 0 ? xScaleValue.value : _width,
      zIndex: 6,
      // transform: [
      //   {
      //     scaleX: xScaleValue.value,
      //   },
      // ],
    };
  });
  const opacityStyle = useAnimatedStyle(() => {
    const inputRange = [0, width / 2];
    return {
      opacity: interpolate(transX.value, inputRange, [1, 0]),
      zIndex: 3,
    };
  });
  const orangeStyle = useAnimatedStyle(() => {
    const inputRange = [0, maxWidth];
    return {
      // width: interpolate(transX.value, inputRange, [0, maxWidth + _width]),
      // width: withTiming(transX.value + _width),
      width: withSpring(
        transX.value + (transX.value === 0 ? 0 : _width),
        spring_config
      ),
      left: _padding,
      opacity: transX.value <= 4 ? 0 : 1,
      zIndex: 4,
      height: _width,
      backgroundColor: "orange",
      borderRadius: 40,
      position: "absolute",
      // left: _padding,
    };
  });
  return (
    <Box>
      <GestureDetector gesture={gesture}>
        <Box>
          <Box
            onLayout={onLayout}
            className="flex-row items-center w-full rounded-xl p-[4px]"
            style={[
              {
                padding: _padding,
                // backgroundColor: "#2A3037",
                backgroundColor: "black",
                flexDirection: "row",
                width: "100%",
                borderRadius: 50,
                alignItems: "center",
              },
            ]}
          >
            <Animated.View style={[aStyle]}>
              <Animated.View
                // className={"bg-black py-3 justify-center items-center rounded-lg"}
                style={[
                  {
                    backgroundColor: "white",
                    // paddingVertical: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    width: _width,
                    height: _width,
                    borderRadius: _width,
                    zIndex: 6,
                  },

                  // widthStyle,
                ]}
              >
                <Octicons name="arrow-right" size={24} color="black" />
              </Animated.View>
            </Animated.View>

            <Animated.View
              className={"justify-center items-center w-full absolute"}
              style={[opacityStyle]}
            >
              <Text
                className="text-sm text-center text-gray-300"
                style={{
                  color: "white",
                }}
              >
                {text ?? "Swipe to book"}
              </Text>
            </Animated.View>
            <Animated.View style={[orangeStyle]} />
          </Box>
        </Box>
      </GestureDetector>
      <Animated.View style={[panStyle]}></Animated.View>
    </Box>
  );
};

export default SwipeToPay;
