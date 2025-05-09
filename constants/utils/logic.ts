import { SharedValue } from "react-native-reanimated";
import {
  height,
  MAX_SPEED,
  OVAL_HIGHT,
  OVAL_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  RADIUS,
  width,
} from "./constants";
import {
  BrickInterface,
  CircleInterface,
  Collision,
  PaddleInterface,
  ShapeInterface,
} from "./types";

export const createBouncingExample = (circleObject: CircleInterface) => {
  "worklet";

  circleObject.x.value = 100;
  circleObject.y.value = 450;
  circleObject.r = RADIUS;
  circleObject.ax = 0.5;
  circleObject.ay = 1;
  circleObject.vx = 0;
  circleObject.vy = 0;
};

const move = (object: ShapeInterface, dt: number) => {
  "worklet";

  object.vx += object.ax * dt;
  object.vy += object.ay * dt;
  //   object.vx += dt;
  //   object.vy += dt;

  if (object.vx > MAX_SPEED) {
    object.vx = MAX_SPEED;
  }
  if (object.vx < -MAX_SPEED) {
    object.vx = -MAX_SPEED;
  }
  if (object.vy > MAX_SPEED) {
    object.vy = MAX_SPEED;
  }
  if (object.vy < -MAX_SPEED) {
    object.vy = -MAX_SPEED;
  }

  object.x.value += object.vx * dt;
  object.y.value += object.vy * dt;
};

export const resolveWallCollisions = (object: ShapeInterface) => {
  "worklet";

  const circleObject = object as CircleInterface;
  // Right wall collision
  if (circleObject.x.value + OVAL_WIDTH > width) {
    circleObject.x.value = width - OVAL_WIDTH;
    circleObject.vx = -circleObject.vx;
    circleObject.ax = -circleObject.ax;
    circleObject.color.value = "red";
  }

  // Bottom wall collision
  else if (circleObject.y.value + OVAL_HIGHT > height) {
    circleObject.y.value = height - OVAL_HIGHT;
    circleObject.vy = -circleObject.vy;
    circleObject.ay = -circleObject.ay;
    circleObject.color.value = "blue";
  }

  // left wall collision
  else if (circleObject.x.value < 0) {
    circleObject.x.value = circleObject.r;
    circleObject.vx = -circleObject.vx;
    circleObject.ax = -circleObject.ax;
    circleObject.color.value = "green";
  }

  // Top wall collision
  else if (circleObject.y.value - circleObject.r < 0) {
    circleObject.y.value = circleObject.r;
    circleObject.vy = -circleObject.vy;
    circleObject.ay = -circleObject.ay;
    circleObject.color.value = "yellow";
  }
};

function circleRect(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
) {
  "worklet";

  let testX = cx;
  let testY = cy;

  if (cx < rx) testX = rx; // left edge
  else if (cx > rx + rw) testX = rx + rw; // right edge

  if (cy < ry) testY = ry; // top edge
  else if (cy > ry + rh) testY = ry + rh; //bottol edge

  //distances from closest edges

  let distX = cx - testX;
  let distY = cy - testY;
  let distance = Math.sqrt(distX * distX + distY * distY);

  // if distance < radius, a collision has occurred

  if (distance <= RADIUS) {
    return true;
  }

  return false;
}

export const checkCollison = (o1: ShapeInterface, o2: ShapeInterface) => {
  "worklet";
  if (
    (o1.type === "Circle" && o2.type === "Paddle") ||
    (o1.type === "Circle" && o2.type === "Brick")
  ) {
    if (o2.type === "Brick") {
      const brick = o2 as BrickInterface;
      console.log({
        canCollide: brick.canCollide.value,
      });

      if (!brick.canCollide.value) {
        return {
          collisionInfo: null,
          collided: false,
        };
      }
    }

    const dx = o2.x.value - o1.x.value;
    const dy = o2.y.value - o1.y.value;

    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    const circleObject = o1 as CircleInterface;
    const rectangleObject = o2 as PaddleInterface;

    const isCollision = circleRect(
      circleObject.x.value,
      circleObject.y.value,
      rectangleObject.x.value,
      rectangleObject.y.value,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    if (isCollision) {
      o1.color.value = "white";
      if (o2.type === "Brick") {
        const brick = o2 as BrickInterface;
        brick.canCollide.value = false;
      }

      return {
        collisionInfo: {
          o1,
          o2,
          dx,
          dy,
          d,
        },
        collided: true,
      };
    }
  }

  return {
    collisionInfo: null,
    collided: false,
  };
};
export const resolveCollisionsWithBounce = (info: Collision) => {
  "worklet";

  const circleInfo = info.o1 as CircleInterface;
  circleInfo.y.value = circleInfo.y.value - circleInfo.r;
  circleInfo.vy = -circleInfo.vy;
  circleInfo.ay = -circleInfo.ay;
};

export const animate = (
  objects: ShapeInterface[],
  timeSincePreviousFrame: number | null,
  //   brickCount: SharedValue<number>,
  brickCount: number,
  // speed = 0.15,
  speed = 0.25
) => {
  "worklet";

  for (const o of objects) {
    if (o.type === "Circle") {
      move(o, (speed / 16) * Number(timeSincePreviousFrame));
    }
  }
  for (const o of objects) {
    if (o.type === "Circle") {
      resolveWallCollisions(o);
    }
  }

  const collisions: Collision[] = [];

  for (const [i, o1] of objects.entries()) {
    for (const [j, o2] of objects.entries()) {
      if (i < j) {
        const { collided, collisionInfo } = checkCollison(o1, o2);
        // console.log({ collided, collisionInfo });
        if (collided && collisionInfo) {
          collisions.push(collisionInfo);
        }
      }
    }
  }

  for (const col of collisions) {
    resolveCollisionsWithBounce(col);
  }
};
