import React, { useState, useRef, useEffect } from "react";
import { View, Image, Pressable, Text, Animated, Easing } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
import useThemeColors from "@/app/contexts/ThemeColors";
interface SlideUpProps {
  visible?: boolean;
  onClose?: () => void;
}

export default function SlideUp({ visible = true, onClose }: SlideUpProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [showComponent, setShowComponent] = useState(visible);
  const slideAnim = useRef(new Animated.Value(1000)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowComponent(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(0.5)),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1000,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
      ]).start(() => {
        setShowComponent(false);
      });
    }
  }, [visible]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  if (!showComponent) return null;

  return (
    <>
      <Animated.View
        className="absolute right-0 bottom-0 p-4 z-50 w-full"
        style={{
          paddingBottom: insets.bottom,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        }}
      >
        {/* <View
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          className="bg-light-secondary w-full dark:bg-black rounded-3xl p-6"
        >
          <View className="flex-col items-center justify-start p-6">
            <Image
              source={require("@/assets/img/thomino.jpg")}
              className="w-16 h-16 rounded-full mb-2"
            />
            <View className="flex-1 items-center">
              <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                Built by
              </Text>
              <Text className="text-xl font-bold dark:text-white">Thomino</Text>
            </View>
          </View>
          <Pressable
            className="w-full mt-4 items-center py-4 rounded-xl bg-black dark:bg-white"
            onPress={handleClose}
          >
            <Text className="text-white font-bold dark:text-black">
              Close me
            </Text>
          </Pressable>
        </View> */}
      </Animated.View>
    </>
  );
}
