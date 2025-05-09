import { SharedValue } from "react-native-reanimated";

type shapeVariant = "Circle" | "Paddle" | "Brick";

export interface ShapeInterface {
  x: SharedValue<number>;
  y: SharedValue<number>;
  ax: number;
  ay: number;
  vx: number;
  vy: number;
  type: shapeVariant;
  id: number;
  color: SharedValue<string>;
}

export interface CircleInterface extends ShapeInterface {
  type: "Circle";
  r: number;
}
export interface PaddleInterface extends ShapeInterface {
  type: "Paddle";
  height: number;
  width: number;
}
export interface BrickInterface extends ShapeInterface {
  type: "Brick";
  height: number;
  width: number;
  canCollide: SharedValue<boolean>;
}

export interface Collision {
  o1: ShapeInterface;
  o2: ShapeInterface;
  dx: number;
  dy: number;
  d: number;
}
