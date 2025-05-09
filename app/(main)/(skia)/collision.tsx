import { View, Text } from "react-native";
import React, { useEffect } from "react";
import globalStyle, { height, width } from "@/globalStyle/globalStyle";
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Canvas,
  Circle,
  LinearGradient,
  Oval,
  RoundedRect,
  vec,
  useImage,
  Image,
} from "@shopify/react-native-skia";

import {
  BrickInterface,
  CircleInterface,
  PaddleInterface,
} from "@/constants/utils/types";
import {
  BALL_COLOR,
  BRICK_HEIGHT,
  BRICK_MIDDLE,
  BRICK_ROW_LENGTH,
  BRICK_WIDTH,
  OVAL_HIGHT,
  OVAL_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_MIDDLE,
  PADDLE_WIDTH,
  RADIUS,
  TOTAL_BRICKS,
} from "@/constants/utils/constants";
import { animate, createBouncingExample } from "@/constants/utils/logic";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface Props {
  idx: number;
  brick: BrickInterface;
}

const Brick = ({ idx, brick }: Props) => {
  const color = useDerivedValue(() => {
    return brick.canCollide.value ? "red" : "transparent";
  }, [brick.canCollide]);

  return (
    <RoundedRect
      key={idx}
      x={brick.x}
      y={brick.y}
      width={brick.width}
      height={brick.height}
      color={color}
      r={8}
    >
      <LinearGradient
        start={vec(5, 300)}
        end={vec(4, 50)}
        colors={["red", "green"]}
      />
    </RoundedRect>
  );
};

const Collision = () => {
  const image = useImage(require("../../../assets/images/dvdLogo.png"));

  const circleObject: CircleInterface = {
    type: "Circle",
    id: 0,
    x: useSharedValue(0),
    y: useSharedValue(0),
    r: RADIUS,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
    color: useSharedValue("brown"),
  };
  const rectangleObject: PaddleInterface = {
    type: "Paddle",
    id: 0,
    x: useSharedValue(PADDLE_MIDDLE),
    y: useSharedValue(height - 100),
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: useSharedValue("white"),
  };

  const bricks: BrickInterface[] = Array(TOTAL_BRICKS)
    .fill(0)
    .map((_, idx) => {
      const farBrickX = BRICK_MIDDLE + BRICK_WIDTH + 50;
      const middleBrickX = BRICK_MIDDLE;
      const closeBrick = BRICK_MIDDLE - BRICK_WIDTH - 50;
      const startingY = 60;
      const ySpacing = 45;
      let startingXPosition = -1;

      if (idx % BRICK_ROW_LENGTH === 0) {
        startingXPosition = farBrickX;
      } else if (idx % BRICK_ROW_LENGTH === 1) {
        startingXPosition = middleBrickX;
      } else if (idx % BRICK_ROW_LENGTH === 2) {
        startingXPosition = closeBrick;
      }

      const startingYPosition =
        startingY + ySpacing * Math.floor(idx / BRICK_ROW_LENGTH);

      return {
        type: "Brick",
        id: 0,
        x: useSharedValue(startingXPosition),
        y: useSharedValue(startingYPosition),
        ax: 0,
        ay: 0,
        vx: 0,
        vy: 0,
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        canCollide: useSharedValue(true),
      };
    });

  createBouncingExample(circleObject);

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) {
      return;
    }
    animate(
      [circleObject, rectangleObject],
      frameInfo.timeSincePreviousFrame,
      0
      // useSharedValue(0)
    );
  });
  const gesture = Gesture.Pan().onChange(({ x }) => {
    rectangleObject.x.value = x - PADDLE_WIDTH / 2;
  });
  console.log({
    circleObject,
  });
  const imageWidth = OVAL_WIDTH / 1.5;
  const imageHeight = OVAL_HIGHT / 1.5;
  const imageX = useDerivedValue(
    () => circleObject.x.value + (OVAL_WIDTH - imageWidth) / 2
  );
  const imageY = useDerivedValue(
    () => circleObject.y.value + (OVAL_HIGHT - imageHeight) / 2
  );
  // const imageX = useDerivedValue(() => circleObject.x.value + OVAL_WIDTH / 3);
  // const imageY = useDerivedValue(() => circleObject.y.value + OVAL_HIGHT / 3);
  return (
    <GestureDetector gesture={gesture}>
      <View style={[globalStyle.bgBlack, globalStyle.flexOne]}>
        <Canvas style={[globalStyle.flexOne]}>
          {/* <Circle
            cx={circleObject.x}
            cy={circleObject.y}
            r={circleObject.r}
            color={circleObject.color}
          /> */}
          <Oval
            x={circleObject.x}
            y={circleObject.y}
            width={OVAL_WIDTH}
            height={OVAL_HIGHT}
            color={circleObject.color}
          />
          <Image
            image={image}
            fit="fill"
            x={imageX}
            y={imageY}
            width={imageWidth}
            height={imageHeight}
          />
          {/* <RoundedRect
            x={rectangleObject.x}
            y={rectangleObject.y}
            width={rectangleObject.width}
            height={rectangleObject.height}
            color={"white"}
            r={8}
          /> */}
          {/* {bricks.map((brick, idx) => {
            return <Brick key={idx} brick={brick} idx={idx} />;
          })} */}
        </Canvas>
      </View>
    </GestureDetector>
  );
};

export default Collision;
// import { View, Text } from "react-native";
// import React, { useEffect } from "react";
// import globalStyle, { height, width } from "@/globalStyle/globalStyle";
// import { useSharedValue, withTiming } from "react-native-reanimated";
// import { Canvas, Circle } from "@shopify/react-native-skia";

// const r = 8;
// const duration = 150;
// const speed = 30;
// const Collision = () => {
//   const cx = useSharedValue(30);
//   const cy = useSharedValue(30);
//   const isForward = useSharedValue(true);
//   const isDownward = useSharedValue(true);
//   const move = () => {
//     "worklet";
//     if (cx.value - r * 2 >= width) {
//       isForward.value = false;
//     } else if (cx.value - r * 2 <= 0) {
//       isForward.value = true;
//     }
//     if (cy.value - r * 2 >= height) {
//       isDownward.value = false;
//     } else if (cy.value - r * 2 <= 0) {
//       isDownward.value = true;
//     }
//     cx.value = withTiming(
//       isForward.value ? cx.value + speed : cx.value - speed,
//       {
//         duration: 350,
//       }
//     );
//     cy.value = withTiming(
//       isDownward.value ? cy.value + speed : cy.value - speed,
//       {
//         duration: 350,
//       }
//     );
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       move();
//     }, duration);

//     return () => clearTimeout(interval);
//   }, []);

//   return (
//     <View style={[globalStyle.bgWhite, globalStyle.flexOne]}>
//       <Canvas style={[globalStyle.flexOne]}>
//         <Circle cx={cx} cy={cy} r={r} color={"black"} />
//       </Canvas>
//     </View>
//   );
// };

// export default Collision;
