import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
import SlideUp from "./SlideUp";
import { useState } from "react";
import React from "react";
import useThemeColors from "@/app/contexts/ThemeColors";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  hasAvatar?: boolean;
}

export default function Header({
  showBackButton = false,
  title = "",
  hasAvatar = false,
}: HeaderProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showSlideUp, setShowSlideUp] = useState(false);

  return (
    <>
      <View
        className=" px-5 py-6 flex-row bg-light-primary/40 dark:bg-black/80 items-center justify-between absolute top-0 left-0 right-0 z-50"
        style={{ paddingTop: insets.top + 10 }}
      >
        <BlurView
          tint="light"
          intensity={25}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View className="flex-row items-center">
          {showBackButton && (
            <Pressable
              onPress={() => router.back()}
              className="mr-3 p-1"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="arrow-left" color={colors.icon} size={24} />
            </Pressable>
          )}
          {/* {hasAvatar && (
            <Pressable onPress={() => setShowSlideUp(true)}>
              <Image
                source={require("@/assets/img/thomino.jpg")}
                className="w-8 h-8 rounded-full"
              />
            </Pressable>
          )} */}
          {title && (
            <Text className="text-neutral-900 dark:text-neutral-50 text-2xl font-bold">
              {title}
            </Text>
          )}
        </View>
        <ThemeToggle />
      </View>
      <SlideUp visible={showSlideUp} onClose={() => setShowSlideUp(false)} />
    </>
  );
}
