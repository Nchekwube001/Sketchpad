import React, { useCallback, useLayoutEffect, useState } from "react";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Stack, useNavigation } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
export type Activity = {
  time: string;
  activity_color: string;
  activity_name: string;
  activity_description: string;
  duration: string;
  activity_image: string;
};

export type ActivityData = Activity[];

export const activities: ActivityData = [
  {
    time: "10:00 PM",
    activity_color: "#74B421",
    activity_name: "Sleep",
    activity_description: "Went to bed early for a full night's rest.",
    duration: "8 hrs",
    activity_image: require("@/assets/svgs/moon.svg"),
  },
  {
    time: "07:00 PM",
    activity_color: "#09A6C4",
    activity_name: "Evening Swim",
    activity_description:
      "Practiced freestyle strokes for 30 minutes. Water was calm and refreshing.",
    duration: "30 mins",
    activity_image: require("@/assets/svgs/swim.svg"),
  },
  {
    time: "05:30 PM",
    activity_color: "#DD413B",
    activity_name: "Gym Workout",
    activity_description:
      "Intense upper body session:\n1. Bench press - 3 sets of 12 reps\n2. Pull-ups - 3 sets to failure\n3. Dumbbell curls - 3 sets of 15 reps",
    duration: "1 hr 30 mins",
    activity_image: require("@/assets/svgs/dumbbell.svg"),
  },
  {
    time: "01:00 PM",
    activity_color: "#15A294",
    activity_name: "Office Yoga",
    activity_description:
      "Focused on improving posture and relieving tension in the back and neck.",
    duration: "45 mins",
    activity_image: require("@/assets/svgs/yoga.svg"),
  },
  {
    time: "09:00 AM",
    activity_color: "#3A83FC",
    activity_name: "Mountain Hike",
    activity_description:
      "Key highlights:\n- Reached the summit at 10 AM\n- Spotted diverse flora and fauna\n- Enjoyed breathtaking views of the valley",
    duration: "3 hrs",
    activity_image: require("@/assets/svgs/hike.svg"),
  },
  {
    time: "08:00 AM",
    activity_color: "#25B353",
    activity_name: "Garden Walk",
    activity_description:
      "Strolled through the botanical garden, appreciating the vibrant flowers and serene environment.",
    duration: "40 mins",
    activity_image: require("@/assets/svgs/garden.svg"),
  },
  {
    time: "06:30 AM",
    activity_color: "#5F6B79",
    activity_name: "Morning Run",
    activity_description:
      "Covered 5 kilometers around the park with a steady pace.",
    duration: "30 mins",
    activity_image: require("@/assets/svgs/run.svg"),
  },
  {
    time: "06:00 AM",
    activity_color: "#E9B306",
    activity_name: "Wake Up",
    activity_description: "Started the day feeling refreshed and energized.",
    duration: "",
    activity_image: require("@/assets/svgs/sun.svg"),
  },
];

const List = () => {
  const navigation = useNavigation();
  const [state, setState] = useState<ActivityData>([...activities.slice(0, 1)]);
  const [index, setIndex] = useState(activities.length - 1);

  const addItem = useCallback(() => {
    if (index >= 0) {
      setState((prevState) => [activities[index], ...prevState]);
      setIndex(index - 1);
    } else {
      setIndex(activities.length - 1);
      setState([]);
    }
  }, [index]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <AddButton isMinus={index < 0} onPress={addItem} />,
      title: "",
    });
  }, [navigation, index]);

  return (
    <Animated.FlatList
      itemLayoutAnimation={LinearTransition.springify()
        .damping(18)
        .stiffness(200)}
      data={state}
      contentInsetAdjustmentBehavior="automatic"
      keyExtractor={(item) => item.activity_name}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item, index }) => (
        <RenderItem activity={item} isLast={state.length - 1 === index} />
      )}
    />
  );
};

export default List;

import { Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

const AddButton = ({
  isMinus,
  onPress,
}: {
  isMinus: boolean;
  onPress: () => void;
}) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.95 : 1 }],
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <AntDesign
        name={isMinus ? "minuscircleo" : "pluscircleo"}
        size={22}
        color={theme.colors.primary}
      />
    </Pressable>
  );
};

import { StyleSheet, View, ViewProps } from "react-native";

import {
  AnimatedProps,
  FadeInUp,
  FadeOutDown,
  ZoomIn,
} from "react-native-reanimated";

type RenderItemType = {
  activity: Activity;
  isLast: boolean;
};

type ActivityImageType = {
  activity: Activity;
  isLast: boolean;
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

export const RenderItem = (params: RenderItemType) => {
  const { activity, isLast } = params;
  const theme = useTheme();
  return (
    <Animated.View
      entering={FadeInUp.springify().damping(18).stiffness(200)}
      exiting={FadeOutDown}
      style={styles.container}
    >
      <ActivityImage activity={activity} isLast={isLast} />
      {/* To make card animate separate  */}
      <CardContainer entering={FadeInUp.springify().damping(18).stiffness(200)}>
        <Heading style={{ color: theme.colors.text }}>
          {activity.activity_name}
        </Heading>
        <SubHeading
          style={[styles.subHeadingStyle, { color: theme.colors.text }]}
        >
          {activity.time}
        </SubHeading>
        <Paragraph style={{ color: theme.colors.text }}>
          {activity.activity_description}
        </Paragraph>
      </CardContainer>
    </Animated.View>
  );
};

const CardContainer = (props: AnimatedProps<ViewProps>) => {
  const theme = useTheme();
  const themedContainerStyle = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  };
  return (
    <Animated.View
      {...props}
      style={[styles.card, themedContainerStyle, props.style]}
    />
  );
};

const ActivityImage = (params: ActivityImageType) => {
  const { activity, isLast } = params;
  const theme = useTheme();
  const backgroundColor = activity.activity_color;
  const imageMargin = 16;
  return (
    <Animated.View>
      <View
        style={[
          styles.imageWrapper,
          { backgroundColor, marginTop: imageMargin },
        ]}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          colors={[theme.colors.text, "transparent"]}
          style={styles.imageGradient}
        />
        <AnimatedImage
          entering={ZoomIn.springify().damping(18).stiffness(200)}
          source={activity.activity_image}
          style={styles.image}
        />
      </View>
      <Line
        style={{
          opacity: isLast ? 0 : 1,
          marginBottom: -imageMargin - styles.image.height / 2,
        }}
      />
    </Animated.View>
  );
};

export const Line = (props: AnimatedProps<ViewProps>) => {
  const theme = useTheme();
  return (
    <Animated.View
      {...props}
      style={[
        { backgroundColor: theme.colors.border },
        styles.line,
        props.style,
      ]}
    />
  );
};

import { Text, TextProps } from "react-native";

export const Heading = (props: TextProps) => (
  <Text {...props} style={[styles.heading, props.style]} />
);
export const SubHeading = (props: TextProps) => (
  <Text {...props} style={[styles.subHeading, props.style]} />
);
export const Paragraph = (props: TextProps) => (
  <Text {...props} style={[styles.paragraph, props.style]} />
);

const styles = StyleSheet.create({
  line: {
    flex: 1,
    width: 3,
    alignSelf: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  imageWrapper: {
    width: 45,
    height: 45,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  imageGradient: {
    width: 45,
    height: 45,
    borderRadius: 25,
    position: "absolute",
  },
  image: {
    width: 25,
    height: 25,
    zIndex: 1,
  },
  card: {
    padding: 16,
    flexShrink: 1,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  subHeadingStyle: {
    marginTop: 5,
    marginBottom: 10,
  },
  heading: {
    fontSize: 15,
    fontWeight: "600",
    opacity: 0.8,
  },
  subHeading: {
    fontSize: 13,
    opacity: 0.6,
  },
  paragraph: {
    fontSize: 15,
    opacity: 0.7,
  },
});
