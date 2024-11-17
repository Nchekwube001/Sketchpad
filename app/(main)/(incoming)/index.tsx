import { PropsWithChildren, useState } from "react";
import { FlatListProps, ListRenderItem } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  interpolate,
  LinearTransition,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { MAX_MESSAGES } from "./mock";

// Types
type IncomingChatListProps<T> = FlatListProps<T> & {
  renderItem: ListRenderItem<T>;
};
type ChatItemProps = PropsWithChildren<{
  index: number;
  scrollY: SharedValue<number>;
}>;

export function AnimatedChatItem({ index, children, scrollY }: ChatItemProps) {
  const newIndex = useDerivedValue(() => {
    // Disable opacity if user is scrolling
    return withSpring(scrollY.value > 0 ? 0 : index, {
      damping: 80,
      stiffness: 200,
    });
  });
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(newIndex.value, [0, 1], [1, 1 - 1 / MAX_MESSAGES]),
    };
  });
  return (
    <Animated.View
      entering={FadeInDown.springify()
        .damping(80)
        .stiffness(200)
        .withInitialValues({
          opacity: 0,
          transform: [
            {
              translateY: 100,
            },
          ],
        })}
      exiting={FadeOutUp.springify().damping(80).stiffness(200)}
    >
      <Animated.View style={stylez}>{children}</Animated.View>
    </Animated.View>
  );
}

export function IncomingChatList<T>({
  style,
  renderItem,
  ...rest
}: IncomingChatListProps<T>) {
  const scrollY = useSharedValue(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const onScroll = useAnimatedScrollHandler((e) => {
    // Update scrollY value with delay to prevent layout thrashing
    // with a little bit of delay. This is because maintainVisibleContentPosition
    // it will trigger onScroll event and it will cause layout shift.
    scrollY.value = withDelay(
      50,
      withTiming(e.contentOffset.y, { duration: 0 })
    );
    runOnJS(setIsScrolling)(e.contentOffset.y > 0);
  });

  return (
    <Animated.FlatList
      {...rest}
      // Maintain visible content position only when scrolling
      {...(isScrolling && {
        maintainVisibleContentPosition: {
          minIndexForVisible: 0,
        },
      })}
      scrollEventThrottle={32}
      bounces={false}
      style={[{ flex: 1 }, style]}
      pointerEvents={"box-none"}
      layout={LinearTransition.springify().damping(80).stiffness(200)}
      // Disable layout animation when user is scrolling
      // to prevent layout thrashing and to ensure that
      // maintainVisibleContentPosition works as expected
      itemLayoutAnimation={
        isScrolling
          ? undefined
          : LinearTransition.springify().damping(80).stiffness(200)
      }
      inverted
      onScroll={onScroll}
      renderItem={(props) => {
        return (
          <AnimatedChatItem index={props.index} scrollY={scrollY}>
            {renderItem(props)}
          </AnimatedChatItem>
        );
      }}
    />
  );
}
