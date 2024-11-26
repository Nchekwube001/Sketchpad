import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Animated, { SharedValue, useSharedValue } from "react-native-reanimated";

const length = 2 * Math.PI;
const { width, height } = Dimensions.get("window");

const radius = width / 2;
const trigonometry = () => {
  const progress = useSharedValue(0);
  const { styles } = useStyles(trigStyle);
  return (
    <View style={[styles.container]}>
      <View style={[styles.circle]}>
        <Driver progress={progress} radius={radius} />
      </View>
    </View>
  );
};

interface driverProps {
  radius: number;
  progress: SharedValue<number>;
}
const Driver = ({ progress, radius }: driverProps) => {
  const { styles } = useStyles(trigStyle);
  return (
    <View style={[StyleSheet.absoluteFill]}>
      <Animated.View style={[styles.driverCircle]} />
    </View>
  );
};
const trigStyle = createStyleSheet(() => ({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width,
    height: width,
    borderRadius: width,
    backgroundColor: "green",
    borderWidth: 3,
    borderColor: "black",
  },
  driverCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "red",
    borderWidth: 3,
    borderColor: "yellow",
  },
}));
export default trigonometry;
