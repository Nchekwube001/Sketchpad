import { Dimensions } from "react-native";

export const spring_config = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedTreshold: 0.1,
  stiffness: 500,
};
export const { height, width } = Dimensions.get("window");
