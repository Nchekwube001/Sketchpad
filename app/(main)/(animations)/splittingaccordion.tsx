import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useMemo, useState } from "react";
import Animated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const damping = 10;
const enteringAnimation = FadeInUp.springify().damping(damping);
const exitingAnimation = FadeOutUp.springify().damping(damping);
const layout = LinearTransition.springify().damping(damping);

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome5);

const borderRadius = 24;

const data = [
  {
    icon: <MaterialIcons name="ads-click" size={30} color="#B5B4BB" />,
    title: "What is Interative Design?",
    description:
      "Interactive design is the process of creating designs that are interactive and responsive to user input. It involves designing interfaces that allow users to interact with content in a way that is intuitive and natural.",
  },
  {
    icon: <Feather name="layers" size={30} color="#B5B4BB" />,
    title: "Principles & Patterns",
    description:
      "Fundamental guidelines and repeated solutions that ensure consistency and usability in design.",
  },
  {
    icon: <MaterialIcons name="touch-app" size={30} color="#B5B4BB" />,
    title: "Usability & Accessibility",
    description:
      "Focus on making digital design easy to use and accessible for everyone, including those with disabilities.",
  },
  {
    icon: <Feather name="send" size={30} color="#B5B4BB" />,
    title: "Prototyping & Testing",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
  {
    icon: (
      <MaterialCommunityIcons
        name="speedometer-slow"
        size={30}
        color="#B5B4BB"
      />
    ),
    title: "UX Optimisation",
    description:
      "Improving the user experience by enhancing usability and satisfaction.",
  },
];

const CardSplittingAccordion = () => {
  const [index, setIndex] = useState(-1);

  return (
    <View style={styles.screen}>
      {data.map((item, idx) => (
        <Item
          key={idx}
          item={item}
          itemIndex={idx}
          selectedIndex={index}
          onPress={() => setIndex((p) => (p === idx ? -1 : idx))}
        />
      ))}
    </View>
  );
};

export default CardSplittingAccordion;

const Item = ({ item, itemIndex, selectedIndex, onPress }: any) => {
  const isSelected = itemIndex === selectedIndex;

  const iconStyle = useAnimatedStyle(
    () => ({
      transform: [
        // { rotate: withSpring(isSelected ? "180deg" : "0deg", { damping }) },
        {
          rotate: withTiming(isSelected ? "180deg" : "0deg", { duration: 100 }),
        },
      ],
    }),
    [isSelected, itemIndex, selectedIndex]
  );

  const updatedStyles = useMemo(() => {
    const isTopItem = itemIndex === 0 || itemIndex === selectedIndex + 1;
    const isBottomItem =
      itemIndex === data.length - 1 || itemIndex === selectedIndex - 1;
    return {
      borderTopWidth: isTopItem ? 1 : 0,
      borderBottomWidth: isBottomItem ? 1 : 0,
      borderTopLeftRadius: isTopItem ? borderRadius : 0,
      borderTopRightRadius: isTopItem ? borderRadius : 0,
      borderBottomLeftRadius: isBottomItem ? borderRadius : 0,
      borderBottomRightRadius: isBottomItem ? borderRadius : 0,
    };
  }, [itemIndex, selectedIndex]);

  return (
    <AnimatedPressable
      layout={layout}
      style={[styles.item, isSelected ? styles.itemSelected : updatedStyles]}
      onPress={onPress}
    >
      <View style={styles.titleContainer}>
        <View style={styles.iconContainer}>
          {item.icon}
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Animated.View style={iconStyle}>
          <FontAwesome5 name={"chevron-up"} size={20} color="#8F8F9A" />
        </Animated.View>
      </View>
      {isSelected && (
        <Animated.View
          exiting={exitingAnimation}
          entering={enteringAnimation}
          layout={layout}
          style={{ paddingBottom: 16 }}
        >
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgb(242,238,234)",
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "#FEFEFE",
    padding: 20,
    borderRadius: 24,
    width: "100%",
  },
  item: {
    backgroundColor: "#FEFEFE",
    paddingHorizontal: 20,
    width: "100%",
    borderColor: "#B7B6BC",
    borderWidth: 1,
  },
  itemSelected: {
    borderWidth: 1,
    backgroundColor: "#FBFBFD",
    marginVertical: 10,
    borderRadius,
    borderColor: "#B7B6BC",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#2B2B2B",
    paddingVertical: 16,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D2D30",
  },
  description: {
    fontSize: 16,
    color: "#59595D",
  },

  // #FBFBFD - selected
});
