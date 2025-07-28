import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import React, { memo } from "react";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const BUTTON_SCALE = 1.02;

function isHex7(value: string): value is `#${string}` {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

const iosDefaultTimigConfig = {
  duration: 250,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
};

function ButtonHeat({
  children,
  style,
  wrapperStyle,
  onPress,
  hitSlopInset = 0,
  popColor: _popColor = "#FFFFFF",
  ...props
}: React.ComponentProps<typeof Pressable> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  hitSlopInset?: number;
  popColor?: `#${string}`;
}) {
  const scale = useSharedValue(1);
  const pressed = useSharedValue(false);
  const offsetX = useSharedValue<number>(0);
  const offsetY = useSharedValue<number>(0);
  const wrapper = useSharedValue<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });

  const popColor = isHex7(_popColor) ? _popColor : "#FFFFFF";

  const absoluteX = useDerivedValue(() => {
    return offsetX.value - wrapper.value.width / 2;
  });

  const absoluteY = useDerivedValue(() => {
    return offsetY.value - wrapper.value.height / 2;
  });

  const isWithinBounds = useDerivedValue(() => {
    const maxOffsetX = wrapper.value.width / 2;
    const maxOffsetY = wrapper.value.height / 2;
    if (!pressed.value) return false;
    return (
      Math.abs(absoluteX.value) <= maxOffsetX &&
      Math.abs(absoluteY.value) <= maxOffsetY
    );
  });

  const gesture = Gesture.Pan()
    .minDistance(0)

    .onStart(() => {
      pressed.value = true;
    })
    .onUpdate((event) => {
      offsetX.value = event.x;
      offsetY.value = event.y;

      if (!isWithinBounds.value) {
        scale.value = 1;
      } else {
        scale.value = BUTTON_SCALE;
      }
    })
    .onEnd(() => {
      if (onPress && pressed.value && isWithinBounds.value) {
        runOnJS(onPress)();
      }

      pressed.value = false;
    });

  const tapGesture = Gesture.Tap()
    .maxDuration(Infinity)
    .onTouchesDown((e) => {
      pressed.value = true;
      offsetX.value = e.allTouches[0].x;
      offsetY.value = e.allTouches[0].y;
    })
    .onFinalize(() => {
      pressed.value = false;
    });

  const gestures = Gesture.Simultaneous(gesture, tapGesture);

  useAnimatedReaction(
    () => pressed.value,
    (isPressed) => {
      if (isPressed) {
        scale.value = BUTTON_SCALE;
      } else {
        scale.value = 1;
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, iosDefaultTimigConfig) }],
    };
  });

  const onLayout = (event: {
    nativeEvent: { layout: { height: number; width: number } };
  }) => {
    wrapper.value = {
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    };
  };

  const lightenStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(
        isWithinBounds.value ? 0.2 : 0,
        iosDefaultTimigConfig
      ),
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const w = Math.max(wrapper.value.width, wrapper.value.height * 3);

    return {
      width: w,
      top: absoluteY.value - w / 2 + wrapper.value.height / 2,
      left: absoluteX.value - w / 2 + wrapper.value.width / 2,
      opacity: withTiming(isWithinBounds.value ? 1 : 0, iosDefaultTimigConfig),
    };
  });

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View
        style={[
          { flex: 1, overflow: "hidden", backgroundColor: "black" },
          wrapperStyle,
          animatedStyle,
        ]}
        onLayout={onLayout}
      >
        <AnimatedPressable
          onPress={onPress}
          {...props}
          style={[style, { overflow: "hidden" }]}
          hitSlop={hitSlopInset}
        >
          <AnimatedLinearGradient
            colors={[popColor + "00", popColor, popColor + "00"]}
            style={[styles.glow, glowStyle]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: popColor,
              },
              lightenStyle,
            ]}
          />
          {children}
        </AnimatedPressable>
      </Animated.View>
    </GestureDetector>
  );
}

export default memo(ButtonHeat);

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
    // backgroundColor: "red",
    borderRadius: "50%",
    aspectRatio: 1,
  },
});
