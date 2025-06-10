import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { OnboardingAnimation } from "@/components/OnboardingAnimation";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const Circularanimation = () => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <OnboardingAnimation animationDelay={2000} />
      <AnimatedLinearGradient
        entering={FadeIn.delay(3500).duration(1000)}
        colors={[theme.colors.card, theme.colors.background]}
        style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
      />
      <Animated.View
        entering={FadeInUp.delay(3000).duration(1000)}
        style={[styles.bottomContainer, { paddingBottom: bottom }]}
      >
        <Text style={[styles.mainText, { color: theme.colors.text }]}>
          Get to know the UI/UX wizards crafting pixel-perfect experiences
        </Text>
        <Pressable
          style={[
            styles.connectButton,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text
            style={[styles.connectButtonText, { color: theme.colors.text }]}
          >
            Connect
          </Text>
        </Pressable>
        <Text style={[styles.subText, { color: theme.colors.text }]}>
          The next wave of creativity is brewing.
        </Text>
        <Text style={[styles.footerText, { color: theme.colors.text }]}>
          Be part of it.
        </Text>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  mainText: {
    fontSize: 20,
    textAlign: "center",
    width: "70%",
  },
  connectButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 35,
    marginBottom: 20,
    borderWidth: 1,
  },
  connectButtonText: {
    fontSize: 16,
  },
  subText: {
    fontSize: 15,
    width: "40%",
    textAlign: "center",
    opacity: 0.5,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.8,
    marginTop: 35,
    marginBottom: 10,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
export default Circularanimation;
