import { Dimensions } from "react-native";

export const spring_config = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedTreshold: 0.1,
  stiffness: 500,
};
export const { height, width } = Dimensions.get("window");
export const randomisedIDs = () => {
  let items = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 13, 14, 15, 16, 17, 18, 19, 12, 10,
  ];
  let id = "";

  for (const element of items) {
    let rand = Math.floor(Math.random() * items.length + element);

    id += rand;
  }
  return id;
};
