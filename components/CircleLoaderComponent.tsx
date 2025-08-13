import {
  Canvas,
  Circle,
  Group,
  interpolateColors,
} from "@shopify/react-native-skia";
import { memo, useEffect, useMemo } from "react";
import {
  cancelAnimation,
  Easing,
  interpolate,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Point = { x: number; y: number };

interface Props {
  radius?: number;
  circleR?: number;
  colors?: string[];
  isPlaying: boolean;
}

interface AnimatedCircleProps {
  startPos: Point;
  endPos: Point;
  index: number;
  r: number;
  colors?: string[];
  isPlaying: boolean;
}

const totalCount = 18;
const ballCount = 9;
const duration = 1500;
const delayStep = duration / ballCount;
const defaultColors = ["#EF5A57", "#F5AF00", "#4BAA4E"];

function getCirclePoints(
  centerX: number,
  centerY: number,
  radius: number,
  count: number = totalCount
): Point[] {
  const points: Point[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    points.push({ x, y });
  }

  return points;
}

function getInputRangeFromOutput<T>(output: T[]): number[] {
  const step = 1 / (output.length - 1);
  return output.map((_, i) => parseFloat((i * step).toFixed(6)));
}

function AnimatedCircle({
  startPos,
  endPos,
  index,
  r,
  isPlaying,
  colors = defaultColors,
}: AnimatedCircleProps) {
  const anim = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      anim.value = withDelay(
        index * delayStep,
        withRepeat(
          withTiming(1, {
            duration: duration,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true
        )
      );
    } else {
      cancelAnimation(anim);
      anim.value = withTiming(0);
    }
  }, [isPlaying]);

  const colorAnimationInput = useMemo(() => {
    return getInputRangeFromOutput(colors);
  }, [colors]);

  const x = useDerivedValue(() => {
    return interpolate(anim.value, [0, 1], [startPos.x, endPos.x]);
  });

  const y = useDerivedValue(() => {
    return interpolate(anim.value, [0, 1], [startPos.y, endPos.y]);
  });

  const color = useDerivedValue(() => {
    return interpolateColors(anim.value, colorAnimationInput, colors);
  });

  return <Circle cx={x} cy={y} r={r} color={color} />;
}

function CircleLoaderComponent({
  radius = 120,
  circleR = 10,
  colors,
  isPlaying,
}: Props) {
  const centerX = radius;
  const centerY = radius;

  const balls = useMemo(() => {
    return getCirclePoints(centerX, centerY, radius);
  }, [radius]);

  return (
    <Canvas style={{ width: radius * 2 + 20, height: radius * 2 + 20 }}>
      <Group transform={[{ translateX: 10 }, { translateY: 10 }]}>
        {balls.slice(0, ballCount).map((item, index) => (
          <AnimatedCircle
            key={index}
            index={index}
            startPos={item}
            endPos={balls[index + ballCount]}
            r={circleR}
            colors={colors}
            isPlaying={isPlaying}
          />
        ))}
      </Group>
    </Canvas>
  );
}

export default memo(CircleLoaderComponent);
