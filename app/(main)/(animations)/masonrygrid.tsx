import { StatusBar } from "expo-status-bar";
import { View, Text, Animated } from "react-native";
import Header from "@/components/Header";
import { ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import React from "react";

const images = [
  {
    uri: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JhZGllbnR8ZW58MHx8MHx8fDA%3D",
  },
  {
    uri: "https://images.unsplash.com/photo-1618397746666-63405ce5d015?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGdyYWRpZW50fGVufDB8fDB8fHww",
  },
  {
    uri: "https://plus.unsplash.com/premium_photo-1668104454432-69c53f7196fc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Z3JhZGllbnR8ZW58MHx8MHx8fDA%3D",
  },
  {
    uri: "https://images.unsplash.com/photo-1618367588411-d9a90fefa881?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzN8fGdyYWRpZW50fGVufDB8fDB8fHww",
  },
  {
    uri: "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGdyYWRpZW50fGVufDB8fDB8fHww",
  },
  {
    uri: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGdyYWRpZW50fGVufDB8fDB8fHww",
  },
  {
    uri: "https://images.unsplash.com/photo-1604076984203-587c92ab2e58?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGdyYWRpZW50fGVufDB8fDB8fHww",
  },
  {
    uri: "https://images.unsplash.com/photo-1604342427523-189b17048839?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGdyYWRpZW50fGVufDB8fDB8fHww",
  },
  {
    uri: "https://images.unsplash.com/photo-1644426358812-879f02d1d867?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGdyYWRpZW50fGVufDB8fDB8fHww",
  },
  {
    uri: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGdyYWRpZW50fGVufDB8fDB8fHww",
  },
];

export default function MasonryScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Calculate the parallax effect - second column moves at 0.7x the speed
  const secondColumnTranslateY = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.2],
  });

  return (
    <>
      <Header showBackButton />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        className="px-5 bg-neutral-100 dark:bg-neutral-900"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        style={{ paddingTop: insets.top + 100, paddingBottom: insets.bottom }}
      >
        <View className="mb-20 mt-10">
          <Text className="text-4xl font-bold dark:text-white">
            Masonry grid
          </Text>
          <Text className="text-neutral-600 dark:text-neutral-400 text-lg">
            Welcome to my playground
          </Text>
        </View>

        <View className="flex-row" style={{ paddingBottom: insets.bottom }}>
          {/* First column - normal scroll */}
          <View className="flex-col w-1/2 pr-1">
            <MasonryItem
              source={images[0]}
              height={200}
              text="With text"
              textPosition="center"
            />
            <MasonryItem source={images[1]} height={250} />
            <MasonryItem
              source={images[3]}
              height={250}
              text="Explore the world"
              textPosition="center"
            />
            <MasonryItem
              source={images[2]}
              height={200}
              textPosition="center"
            />
          </View>

          {/* Second column - parallax effect */}
          <Animated.View
            className="flex-col w-1/2 pl-1"
            style={{
              transform: [{ translateY: secondColumnTranslateY }],
            }}
          >
            <MasonryItem source={images[5]} height={300} />
            <MasonryItem
              source={images[6]}
              height={200}
              text="Adventure awaits"
            />
            <MasonryItem source={images[7]} height={250} />
            <MasonryItem
              source={images[8]}
              height={200}
              text="Discover more"
              textPosition="center"
            />
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </>
  );
}

// MasonryItem component
interface MasonryItemProps {
  source: { uri: string };
  height: number;
  text?: string;
  textPosition?: "top" | "bottom" | "center";
}

const MasonryItem = ({
  source,
  height,
  text,
  textPosition = "bottom",
}: MasonryItemProps) => {
  return (
    <ImageBackground
      source={source}
      style={{
        height,
      }}
      className="w-full rounded-2xl overflow-hidden mb-2"
    >
      {text && (
        <LinearGradient
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            padding: 16,
          }}
          colors={["transparent", "rgba(0, 0, 0, 0.3)"]}
        >
          <Text className="text-white font-bold text-lg">{text}</Text>
        </LinearGradient>
      )}
    </ImageBackground>
  );
};
