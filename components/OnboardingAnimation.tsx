import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  clamp,
  Easing,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}
export const USER_DATA = [
  {
    id: 1,
    name: "Leanne Graham",
    email: "Sincere@april.biz",
    avatar: "https://i.pravatar.cc/300?img=68",
  },
  {
    id: 2,
    name: "Ervin Howell",
    email: "Shanna@melissa.tv",
    avatar: "https://i.pravatar.cc/300?img=38",
  },

  {
    id: 3,
    name: "Clementine Bauch",
    email: "Nathan@yesenia.net",
    avatar: "https://i.pravatar.cc/300?img=54",
  },
  {
    id: 4,
    name: "Patricia Lebsack",
    email: "Julianne.OConner@kory.org",
    avatar: "https://i.pravatar.cc/300?img=25",
  },
  {
    id: 5,
    name: "Chelsey Dietrich",
    email: "Lucio_Hettinger@annie.ca",
    avatar: "https://i.pravatar.cc/300?img=12",
  },
  {
    id: 6,
    name: "Mrs. Dennis Schulist",
    email: "Karley_Dach@jasper.info",
    avatar: "https://i.pravatar.cc/300?img=69",
  },
  {
    id: 7,
    name: "Kurtis Weissnat",
    email: "Telly.Hoeger@billy.biz",
    avatar: "https://i.pravatar.cc/300?img=48",
  },
  {
    id: 8,
    name: "Nicholas Runolfsdottir V",
    email: "Sherwood@rosamond.me",
    avatar: "https://i.pravatar.cc/300?img=62",
  },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const CIRCLE_RADIUS = SCREEN_WIDTH * 0.28;
const CIRCLE_DIAMETER = CIRCLE_RADIUS * 2;
const CIRCLE_COUNT = USER_DATA.length;
const CIRCLE_INNER_RADIUS = 32;
const CIRCLE_INNER_DIAMETER = CIRCLE_INNER_RADIUS * 2;

// Animation durations
const INITIAL_DELAY = 200;
const PROGRESS_ANIMATION_DURATION = 800;
const ROTATION_ANIMATION_DURATION = 30000;
const ROTATION_RESET_DURATION = 900;

interface OnboardingAnimationProps {
  animationDelay?: number;
}

export const OnboardingAnimation: React.FC<OnboardingAnimationProps> = ({
  animationDelay = 2000,
}) => {
  const isAnimationActive = useSharedValue(false);
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1.5);
  const top = useSharedValue(100);

  const animatedRotateCircle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value * 360}deg`,
        },
        {
          scale: scale.value,
        },
      ],
      top: top.value,
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      isAnimationActive.value = true;
      scale.value = withTiming(1, { duration: 350 });
      top.value = withTiming(-100, { duration: 350 });
      progress.value = withDelay(
        INITIAL_DELAY,
        withTiming(
          1,
          {
            duration: PROGRESS_ANIMATION_DURATION,
            easing: Easing.bezier(0.65, 0.05, 0.36, 1),
          },
          () => {
            isAnimationActive.value = false;
            progress.value = 0;
            rotation.value = withRepeat(
              withTiming(1, {
                duration: ROTATION_ANIMATION_DURATION,
                easing: Easing.linear,
              }),
              -1,
              false
            );
          }
        )
      );
    }, animationDelay);
  }, []);

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <Animated.View style={[styles.circle, animatedRotateCircle]}>
        {USER_DATA.map((user, index) => (
          <InnerCircle
            key={index}
            index={index}
            progress={progress}
            isAnimationActive={isAnimationActive}
            rotation={rotation}
            user={user}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const InnerCircle = ({
  index,
  progress,
  isAnimationActive,
  rotation,
  user,
}: {
  index: number;
  progress: SharedValue<number>;
  isAnimationActive: SharedValue<boolean>;
  rotation: SharedValue<number>;
  user: User;
}) => {
  const theme = useTheme();
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotationValue = useSharedValue(0);

  const startPoint = 0;
  const endPoint = (index + 1) * (1 / CIRCLE_COUNT);

  useEffect(() => {
    rotationValue.value = -360 * (index / (CIRCLE_COUNT - 1));
  }, [index, rotationValue]);

  useDerivedValue(() => {
    const { x: xValue, y: yValue } = getCircumferencePoint(
      clamp(
        (progress.value * (index + 1)) / CIRCLE_COUNT,
        startPoint,
        endPoint
      ),
      CIRCLE_RADIUS
    );
    if (y.value === 0) {
      y.value = yValue;
    }
    if (isAnimationActive.value) {
      x.value = xValue;
      y.value = yValue;
      rotationValue.value = withTiming(0, {
        duration: ROTATION_RESET_DURATION,
      });
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
        {
          translateY: y.value,
        },
        {
          rotate: rotationValue.value
            ? `${rotationValue.value}deg`
            : `-${rotation.value * 360}deg`,
        },
        {
          scale: scale.value,
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.circleInner, animatedStyle]}>
      <View
        style={[
          styles.circleInner,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Image
          source={{ uri: user.avatar }}
          style={styles.circleInner}
          contentFit="contain"
        />
      </View>
    </Animated.View>
  );
};

/**
 * Get (x, y) coordinates on a circle's circumference.
 * @param {number} progress - Value between 0 and 1 (0 = 0°, 1 = 360°)
 * @param {number} radius - Radius of the circle
 * @returns {{ x: number, y: number }}
 */
function getCircumferencePoint(progress: number, radius: number) {
  "worklet";
  let baseAngle = -Math.PI / 2; // Start from top (-90 degrees)

  const angle = baseAngle + progress * 2 * Math.PI;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return { x, y };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: CIRCLE_DIAMETER,
    aspectRatio: 1,
    borderRadius: CIRCLE_RADIUS,
    justifyContent: "center",
    alignItems: "center",
  },
  circleInner: {
    width: CIRCLE_INNER_DIAMETER,
    height: CIRCLE_INNER_DIAMETER,
    borderRadius: CIRCLE_INNER_RADIUS,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
