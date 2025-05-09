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

export const BALL_COLOR = "#fff";
export const TOTAL_BRICKS = 18;
export const PADDLE_HEIGHT = 40;
export const PADDLE_WIDTH = 125;
export const BRICK_HEIGHT = 25;
export const BRICK_WIDTH = 80;
export const BRICK_ROW_LENGTH = 3;
export const BRICK_MIDDLE = width / 2 - BRICK_WIDTH / 2;
export const PADDLE_MIDDLE = width / 2 - PADDLE_WIDTH / 2;
export const RADIUS = 16;
// export const MAX_SPEED = 50;
export const MAX_SPEED = 10;

export const OVAL_WIDTH = 256;
export const OVAL_HIGHT = 128;
