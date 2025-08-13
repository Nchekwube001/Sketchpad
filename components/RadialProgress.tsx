import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  RoundedRect,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import { memo, useMemo } from "react";
import { ViewStyle } from "react-native";
import {
  Extrapolation,
  interpolate,
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";

type RimItem = { x: number; y: number; angle: number };

interface Props {
  size?: number;
  containerStyle?: ViewStyle;
  progress: SharedValue<number>;
  font: number;
  fontSize: number;
  innerColor?: string;
  lineColor?: string;
  lineThickness?: number;
  lineCount?: number;
  lineHeight?: number;
  animationConfig?: {
    opacity?: number;
    scale?: number;
  };
}

interface AnimatedRectProps {
  point: RimItem;
  progress: SharedValue<number>;
  index: number;
  color: string;
  width: number;
  height: number;
  scaleFactor: number;
  opacityFactor: number;
}

const defaultAnimationConfig = {
  scale: 1.3,
  opacity: 0.4,
};

function makeRimPositions(
  cx: number,
  cy: number,
  r: number,
  count: number
): RimItem[] {
  const out: RimItem[] = [];
  const step = (2 * Math.PI) / Math.max(1, count);
  const startAngle = -Math.PI / 2;

  for (let i = 0; i < count; i++) {
    const a = startAngle + i * step;
    out.push({
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
      angle: a,
    });
  }
  return out;
}

function AnimatedRect({
  point,
  progress,
  index,
  color,
  width,
  height,
  scaleFactor,
  opacityFactor,
}: AnimatedRectProps) {
  const transform = useDerivedValue(() => {
    const scale = interpolate(
      progress.value,
      [index, index + 1],
      [1, scaleFactor],
      Extrapolation.CLAMP
    );
    return [{ scale }];
  }, [scaleFactor, progress]);

  const opacity = useDerivedValue(() => {
    return interpolate(
      progress.value,
      [index, index + 1],
      [opacityFactor, 1],
      Extrapolation.CLAMP
    );
  }, [progress, opacityFactor]);

  return (
    <Group
      transform={[
        { translateX: point.x },
        { translateY: point.y },
        { rotate: point.angle + Math.PI / 2 },
      ]}
    >
      <RoundedRect
        x={-width / 2}
        y={-height}
        width={width}
        height={height}
        r={width / 2}
        color={color}
        transform={transform}
        opacity={opacity}
      />
    </Group>
  );
}

function RadialProgress({
  size = 200,
  progress,
  font,
  fontSize,
  innerColor = "#111111",
  lineColor = "white",
  lineThickness = 2,
  lineCount = 90,
  lineHeight = 30,
  animationConfig,
  containerStyle,
}: Props) {
  const rects = useMemo(() => {
    const p = makeRimPositions(size / 2, size / 2, size / 2, lineCount);
    return p;
  }, [size, lineCount]);

  const f = useFont(font, fontSize);

  const animConfigs = useMemo(() => {
    return { ...defaultAnimationConfig, ...animationConfig };
  }, [animationConfig]);

  const animationValue = useDerivedValue(() => {
    return progress.value * lineCount;
  }, [progress, lineCount]);

  const text = useDerivedValue(() => {
    return (progress.value * 100).toFixed(0) + "%";
  }, [progress]);

  const textX = useDerivedValue(() => {
    const textWidth = f?.measureText(text.value).width || 0;
    return (size - textWidth) / 2;
  }, [text, f]);

  return (
    <Canvas
      style={[
        {
          width: size + animConfigs.scale * lineHeight * 2,
          height: size + animConfigs.scale * lineHeight * 2,
        },
        containerStyle,
      ]}
    >
      <Group
        transform={[
          { translateX: animConfigs.scale * lineHeight },
          { translateY: animConfigs.scale * lineHeight },
        ]}
      >
        {rects.map((p, i) => (
          <AnimatedRect
            key={i}
            point={p}
            index={i}
            progress={animationValue}
            color={lineColor}
            width={lineThickness}
            height={lineHeight}
            scaleFactor={animConfigs.scale}
            opacityFactor={animConfigs.opacity}
          />
        ))}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={(size + lineHeight) / 2}
          color={innerColor}
        >
          <BlurMask blur={10} />
        </Circle>
        <Text
          text={text}
          font={f}
          x={textX}
          color={lineColor}
          y={size / 2 + fontSize / 4}
        />
      </Group>
    </Canvas>
  );
}

export default memo(RadialProgress);
