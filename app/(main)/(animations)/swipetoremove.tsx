import { useTheme } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Image, ImageBackground } from "expo-image";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  LinearTransition,
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type Notification = {
  id: string;
  icon: any;
  title: string;
  subtitle?: string;
  time: string;
};

export const notifications: Notification[] = [
  {
    id: "1",
    icon: "https://randomuser.me/api/portraits/women/32.jpg",
    title: "Sarah Johnson",
    subtitle: "Hey! Are you coming to the party tonight? 🎉",
    time: "2m",
  },
  {
    id: "2",
    icon: "https://randomuser.me/api/portraits/men/45.jpg",
    title: "Mike Chen",
    subtitle:
      "Just sent you the project files. Let me know if you need anything else! 📁",
    time: "15m",
  },
  {
    id: "3",
    icon: "https://randomuser.me/api/portraits/women/68.jpg",
    title: "Emma Wilson",
    subtitle: "OMG! Did you see the new movie? It was amazing! 🎬",
    time: "1h",
  },
  {
    id: "4",
    icon: "https://randomuser.me/api/portraits/men/22.jpg",
    title: "David Park",
    subtitle: "Thanks for the help yesterday! You're a lifesaver 🙌",
    time: "2h",
  },
  {
    id: "5",
    icon: "https://randomuser.me/api/portraits/women/90.jpg",
    title: "Lisa Anderson",
    subtitle: "Can we reschedule our meeting to tomorrow? Something came up 🤔",
    time: "3h",
  },
  {
    id: "6",
    icon: "https://randomuser.me/api/portraits/men/33.jpg",
    title: "James Wilson",
    subtitle: "Just got the tickets! See you at the concert! 🎵",
    time: "5h",
  },
  {
    id: "7",
    icon: "https://randomuser.me/api/portraits/women/55.jpg",
    title: "Sophie Martinez",
    subtitle: "The photos from last weekend are ready! Check them out 📸",
    time: "8h",
  },
  {
    id: "8",
    icon: "https://randomuser.me/api/portraits/men/77.jpg",
    title: "Alex Thompson",
    subtitle: "Did you try that new restaurant I recommended? 🍽️",
    time: "12h",
  },
  {
    id: "9",
    icon: "https://randomuser.me/api/portraits/women/44.jpg",
    title: "Rachel Green",
    subtitle: "Happy Birthday! 🎂 Hope you have an amazing day!",
    time: "1d",
  },
];

const SCREEN_WIDTH = Dimensions.get("window").width;

interface NotificationCardProps {
  item: Notification;
  isPanning: SharedValue<boolean>;
  onItemDelete: (id: string) => void;
  adjacentOffset?: SharedValue<number>;
  index: number;
  activeIndex: SharedValue<number>;
  firstItem: boolean;
  lastItem: boolean;
  isAdjacent?: boolean;
  isPrevious?: boolean;
}

const NotificationCard = (props: NotificationCardProps) => {
  const {
    item,
    isPanning,
    onItemDelete,
    adjacentOffset,
    index,
    activeIndex,
    firstItem,
    lastItem,
  } = props;
  const theme = useTheme();
  const offsetX = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const lastX = useSharedValue(0);
  const lastTime = useSharedValue(0);
  const velocity = useSharedValue(0);
  const adjacentTension = useSharedValue(false);
  const prevTension = useSharedValue(false);
  const minBorderRadius = 6;

  const isAdjacent = useDerivedValue(() => {
    return Math.abs(activeIndex.value - index) === 1;
  });

  const isPrevious = useDerivedValue(() => {
    return index < activeIndex.value;
  });

  useDerivedValue(() => {
    const currentTension = adjacentTension.value;
    if (prevTension.value && !currentTension) {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    }
    prevTension.value = currentTension;
  });

  useDerivedValue(() => {
    if (!isPanning.value) {
      if (Math.abs(offsetX.value) > SCREEN_WIDTH * 0.1) {
        offsetX.value = withSpring(2 * offsetX.value, {
          mass: 1,
          damping: 25,
          stiffness: 500,
          overshootClamping: false,
          restDisplacementThreshold: 0.001,
          restSpeedThreshold: 0.001,
        });
      }
    }
    if (Math.abs(offsetX.value) > SCREEN_WIDTH) {
      runOnJS(onItemDelete)(item.id);
    }
  });

  const panGesture = Gesture.Manual()
    .onTouchesDown((e) => {
      const x = e.changedTouches[0]?.absoluteX;
      const y = e.changedTouches[0]?.absoluteY;
      adjacentTension.value = true;
      if (x != null && y != null) {
        startX.value = x;
        startY.value = y;
        lastX.value = x;
        lastTime.value = Date.now();
        activeIndex.value = index;
      }
    })
    .onTouchesMove((e, manager) => {
      const x = e.changedTouches[0]?.absoluteX;
      const y = e.changedTouches[0]?.absoluteY;
      if (x != null && y != null) {
        const deltaX = x - startX.value;
        const deltaY = y - startY.value;
        const currentTime = Date.now();
        const timeDelta = currentTime - lastTime.value;
        const heavyDelta = deltaX * 0.92;

        // Calculate velocity (pixels per millisecond)
        if (timeDelta > 0) {
          velocity.value = (x - lastX.value) / timeDelta;
        }

        lastX.value = x;
        lastTime.value = currentTime;

        if (Math.abs(heavyDelta) > 5 && Math.abs(deltaY) < 5) {
          isPanning.value = true;
          manager.activate();
        }
        offsetX.value =
          Math.abs(heavyDelta) < SCREEN_WIDTH * 0.1 ? heavyDelta : deltaX;
        if (adjacentOffset) {
          if (
            Math.abs(heavyDelta) < SCREEN_WIDTH * 0.1 &&
            adjacentTension.value
          ) {
            adjacentOffset.value = heavyDelta * 0.3;
          } else {
            adjacentOffset.value = withSpring(
              0,
              {
                mass: 1,
                damping: 25,
                stiffness: 500,
                overshootClamping: false,
                restDisplacementThreshold: 0.001,
                restSpeedThreshold: 0.001,
              },
              () => {
                if (adjacentTension.value) {
                  adjacentTension.value = false;
                }
              }
            );
          }
        }
      }
    })
    .onTouchesUp((e, manager) => {
      // Convert velocity to pixels per second for withDecay
      const velocityInPixelsPerSecond = velocity.value * 1000;
      if (Math.abs(velocityInPixelsPerSecond) > 1000) {
        offsetX.value = withDecay({
          velocity: velocityInPixelsPerSecond,
          deceleration: 0.998,
        });
      } else {
        offsetX.value = withSpring(0, {
          mass: 1,
          damping: 25,
          stiffness: 500,
          overshootClamping: false,
          restDisplacementThreshold: 0.001,
          restSpeedThreshold: 0.001,
        });
        if (adjacentOffset) {
          adjacentOffset.value = withSpring(0, {
            mass: 1,
            damping: 25,
            stiffness: 500,
            overshootClamping: false,
            restDisplacementThreshold: 0.001,
            restSpeedThreshold: 0.001,
          });
        }
      }
      isPanning.value = false;
      manager.end();
    })
    .onTouchesCancelled((e, manager) => {
      offsetX.value = withSpring(0);
      if (adjacentOffset) {
        adjacentOffset.value = withSpring(0);
      }
      isPanning.value = false;
      manager.end();
    });

  const animatedItemStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === index;
    const isAdjacentToActive = isAdjacent.value;
    const isPrev = isPrevious.value;
    const offset = adjacentOffset?.value || 0;
    const absOffset = Math.abs(offset);

    const border = isActive
      ? interpolate(
          offsetX.value,
          [-SCREEN_WIDTH * 0.1, 0, SCREEN_WIDTH * 0.1],
          [20, minBorderRadius, 20],
          Extrapolation.CLAMP
        )
      : minBorderRadius;

    // Only apply transform to active item or adjacent items
    const transform = isActive
      ? [{ translateX: offsetX.value }]
      : isAdjacentToActive
      ? [{ translateX: offset }]
      : [];

    const borderRadius = {
      borderRadius: border,
      borderTopLeftRadius: firstItem ? 40 : border,
      borderTopRightRadius: firstItem ? 40 : border,
      borderBottomLeftRadius: lastItem ? 40 : border,
      borderBottomRightRadius: lastItem ? 40 : border,
    };

    if (isAdjacentToActive && !isActive) {
      if (offset > 0) {
        if (isPrev) {
          borderRadius.borderBottomLeftRadius = interpolate(
            absOffset,
            [0, SCREEN_WIDTH * 0.1],
            [minBorderRadius, 100]
          );
        } else {
          borderRadius.borderTopLeftRadius = interpolate(
            absOffset,
            [0, SCREEN_WIDTH * 0.1],
            [minBorderRadius, 100]
          );
        }
      } else {
        if (isPrev) {
          borderRadius.borderBottomRightRadius = interpolate(
            absOffset,
            [0, SCREEN_WIDTH * 0.1],
            [minBorderRadius, 100]
          );
        } else {
          borderRadius.borderTopRightRadius = interpolate(
            absOffset,
            [0, SCREEN_WIDTH * 0.1],
            [minBorderRadius, 100]
          );
        }
      }
    }

    return {
      transform,
      ...borderRadius,
    };
  }, [
    activeIndex,
    adjacentOffset,
    firstItem,
    index,
    lastItem,
    offsetX,
    isAdjacent,
    isPrevious,
  ]);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.card,
          animatedItemStyle,
          {
            borderRadius: minBorderRadius,
          },
          firstItem && {
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          },
          lastItem && {
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          },
        ]}
      >
        <BlurView
          intensity={100}
          tint={"systemChromeMaterial"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <Image source={item.icon} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text
            style={[styles.title, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {!!item.subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.text, opacity: 0.8 },
              ]}
              numberOfLines={1}
            >
              {item.subtitle}
            </Text>
          )}
        </View>
        <Text style={[styles.time, { color: theme.colors.text, opacity: 0.8 }]}>
          {item.time}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default function Index() {
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [data, setData] = useState<Notification[]>(notifications);
  const isPanning = useSharedValue(false);
  const adjacentOffset = useSharedValue(0);
  const activeIndex = useSharedValue(-1);

  const animatedProps = useAnimatedProps(() => {
    return {
      scrollEnabled: !isPanning.value,
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/bg.jpg")}
        style={{ flex: 1 }}
        blurRadius={800}
        contentFit="cover"
      >
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: theme.colors.background, opacity: 0.1 },
          ]}
        />
        <Animated.FlatList
          itemLayoutAnimation={LinearTransition.springify()
            .mass(1)
            .damping(25)
            .stiffness(200)}
          animatedProps={animatedProps}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <NotificationCard
              item={item}
              isPanning={isPanning}
              onItemDelete={(id) => {
                setData(data.filter((item) => item.id !== id));
              }}
              adjacentOffset={adjacentOffset}
              index={index}
              activeIndex={activeIndex}
              firstItem={index === 0}
              lastItem={index === data.length - 1}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 3,
            paddingTop: top + 20,
            paddingBottom: bottom,
          }}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: "hidden",
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    marginLeft: 8,
  },
  silentSection: {
    marginTop: 16,
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
  },
  silentText: {
    fontWeight: "500",
    fontSize: 15,
  },
});
