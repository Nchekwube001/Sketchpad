import { Pressable, View, ViewStyle } from "react-native";
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Constants
const _spacing = 10;
const _dotContainer = 48;
const _dotSize = _dotContainer / 3;
// Colors
const _activeDotColor = "rgb(255, 165, 0)";
const _inactiveDotColor = "#aaa";

// Types
type OnboardingIndicatorProps = {
  data: number[];
  selectedIndex: number;
  onChange: (index: number) => void;
};
type PaginationProps = {
  count: number;
  selectedIndex: number;
  style?: ViewStyle;
  onChange: any;
};

type DotProps = {
  index: number;
  animation: SharedValue<number>;
};

export function SnakeOnboardingIndicator({
  data,
  onChange,
  selectedIndex,
}: OnboardingIndicatorProps) {
  return (
    <View style={{ gap: _spacing }}>
      <Pagination
        selectedIndex={selectedIndex}
        count={data.length}
        onChange={onChange}
        style={{ alignSelf: "center" }}
      />
    </View>
  );
}

// Pagination Indicator (green container)

function PaginationIndicator({
  animation,
  selectedIndex,
}: {
  animation: SharedValue<number>;
  selectedIndex: number;
}) {
  const isOpposite = selectedIndex < animation.value;
  const _delay = 100;
  const _duration = 50;

  const stylez = useAnimatedStyle(() => {
    return {
      left: isOpposite
        ? withTiming(animation.value * _dotContainer, {
            duration: _duration,
          })
        : withDelay(_delay, withTiming(animation.value * _dotContainer)),
      right: !isOpposite
        ? withTiming(_dotContainer * (3 - animation.value), {
            duration: _duration,
          })
        : withDelay(_delay, withTiming(_dotContainer * (3 - animation.value))),
    };
  });
  return (
    <Animated.View
      style={[
        {
          height: _dotContainer,
          borderRadius: _dotContainer,
          backgroundColor: "#000",
          position: "absolute",
        },
        stylez,
      ]}
    />
  );
}

// Pagination Dots

function Pagination({
  count,
  selectedIndex,
  style,
  onChange,
}: PaginationProps) {
  const animation = useDerivedValue(() => {
    return withSpring(selectedIndex, {
      damping: 18,
      stiffness: 200,
    });
  });

  return (
    <View style={[{ flexDirection: "row" }, style]}>
      <PaginationIndicator
        selectedIndex={selectedIndex}
        animation={animation}
      />
      {[...Array(count).keys()].map((index) => (
        <AnimatedPressable
          key={`dot-${index}`}
          onPress={() => {
            onChange?.(index);
          }}
        >
          <Dot index={index} animation={animation} />
        </AnimatedPressable>
      ))}
    </View>
  );
}

function Dot({ index, animation }: DotProps) {
  const stylez = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animation.value,
        [index - 1, index, index + 1],
        // [_inactiveDotColor, _activeDotColor, _activeDotColor]
        [_inactiveDotColor, _activeDotColor, _inactiveDotColor]
      ),
    };
  });
  return (
    <View
      style={{
        width: _dotContainer,
        aspectRatio: 1,
        borderRadius: _dotContainer,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: _inactiveDotColor,
            width: _dotSize,
            aspectRatio: 1,
            borderRadius: _dotSize,
          },
          stylez,
        ]}
      />
    </View>
  );
}
