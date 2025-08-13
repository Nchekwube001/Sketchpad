import {
  Canvas,
  Group,
  Image,
  Path,
  RoundedRect,
  Skia,
  useImage,
} from "@shopify/react-native-skia";
import React, { memo, useMemo, useRef } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import {
  Extrapolation,
  interpolate,
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  size?: number; //acts as the height. width will be calculated related to width.
  onChange: (value: boolean) => void;
  containerStyle?: ViewStyle;
  initialValue?: boolean;
  gap?: number;
  trackColors?: {
    true: string;
    false: string;
  };
  images?: {
    true?: {
      source: string | number;
      width: number;
      height: number;
      fit?: "contain" | "cover" | "fill" | "none" | "scaleDown";
      color?: string; // rgba format
    };
    false?: {
      source: string | number;
      width: number;
      height: number;
      fit?: "contain" | "cover" | "fill" | "none" | "scaleDown";
      color?: string; // rgba format
    };
  };
  thumbColor?: string;
}

function rgbaStringToColorMatrix(rgba: string): number[] {
  const match = rgba.match(
    /rgba?\s*\(\s*(\d+)[, ]+(\d+)[, ]+(\d+)(?:[, ]+([\d.]+))?\s*\)/i
  );
  if (!match) throw new Error("Invalid rgba format");

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  return [
    0,
    0,
    0,
    0,
    r / 255,
    0,
    0,
    0,
    0,
    g / 255,
    0,
    0,
    0,
    0,
    b / 255,
    0,
    0,
    0,
    a,
    0,
  ];
}

const BASE_HEIGHT = 142;
const BASE_WIDTH = 292;

const bg =
  "M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0C110.212 0 119 30 146 30C173 30 182 0 221 0C260 0 292 31.7878 292 71C292 110.212 260.212 142 221 142C181.788 142 173 112 146 112C119 112 110.212 142 71 142Z";

function LiquidSwitch({
  size = 80,
  onChange,
  containerStyle,
  gap = 4,
  trackColors = {
    true: "#1690F3",
    false: "#adb5bd",
  },
  thumbColor = "white",
  images,
  initialValue = false,
}: Props) {
  const progress = useSharedValue(initialValue ? 1 : 0);
  const innerProgress = useSharedValue(initialValue ? 1 : 0);
  const isTrue = useRef(initialValue);

  const trueImage = useImage(images?.true?.source);
  const falseImage = useImage(images?.false?.source);

  const scale = useMemo(() => {
    return size / BASE_HEIGHT;
  }, [size]);

  const width = BASE_WIDTH * scale;
  const height = BASE_HEIGHT * scale;

  const rectSize = height - 2 * gap;
  const innerRectSize = height / 2 - gap;

  const paint = useMemo(() => {
    const blur = scale > 1 ? 15 : scale > 0.5 ? 10 : 5;
    const paint = Skia.Paint();
    paint.setAntiAlias(true);

    paint.setImageFilter(Skia.ImageFilter.MakeBlur(blur, blur, 0, null));

    paint.setColorFilter(
      Skia.ColorFilter.MakeMatrix([
        1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 18, -7,
      ])
    );

    return paint;
  }, [scale]);

  const createColorPaint = (color?: string) => {
    if (!color) return null;

    console.log("Creating paint for color:", color);
    const paint = Skia.Paint();
    const rgbaMatch = color.match(
      /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/
    );

    if (rgbaMatch) {
      const matrix = rgbaStringToColorMatrix(color);

      paint.setColorFilter(Skia.ColorFilter.MakeMatrix(matrix));
    } else {
      console.log("No RGBA match found for:", color);
    }
    return paint;
  };

  const trueImagePaint = useMemo(
    () => createColorPaint(images?.true?.color),
    [images?.true?.color]
  );
  const falseImagePaint = useMemo(
    () => createColorPaint(images?.false?.color),
    [images?.false?.color]
  );

  const whitePaint = useMemo(() => {
    const paint = Skia.Paint();
    paint.setColorFilter(
      Skia.ColorFilter.MakeMatrix([
        0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0,
      ])
    );
    return paint;
  }, []);

  const leftRectTransform = useDerivedValue(() => {
    const scale = interpolate(
      progress.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP
    );
    const x = interpolate(
      progress.value,
      [0, 1],
      [0, rectSize / 2 + gap * 2],
      Extrapolation.CLAMP
    );
    return [{ translateX: x }, { scale: scale }];
  }, [progress, rectSize]);

  const rightRectTransform = useDerivedValue(() => {
    const scale = interpolate(
      progress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    const x = interpolate(
      progress.value,
      [0, 1],
      [-rectSize / 2 - gap * 2, 0],
      Extrapolation.CLAMP
    );
    return [{ translateX: x }, { scale: scale }];
  }, [progress, rectSize]);

  const rectTransform = useDerivedValue(() => {
    const x = interpolate(
      innerProgress.value,
      [0, 1],
      [0, width - rectSize - gap * 2],
      Extrapolation.CLAMP
    );
    return [{ translateX: x }];
  }, [innerProgress, gap, rectSize]);

  const animatedColor = useDerivedValue(() => {
    return interpolateColor(
      progress.value,
      [0, 1],
      [trackColors.false, trackColors.true]
    );
  }, [progress, trackColors]);

  const change = () => {
    progress.value = withTiming(!isTrue.current ? 1 : 0, { duration: 450 });
    innerProgress.value = withTiming(!isTrue.current ? 1 : 0, {
      duration: 600,
    });
    isTrue.current = !isTrue.current;
    onChange?.(isTrue.current);
  };

  return (
    <View style={containerStyle}>
      <Pressable onPress={change}>
        <Canvas style={{ width: width + 1, height: height + 1 }}>
          <Path
            path={bg}
            color={animatedColor}
            transform={[{ scale: scale }]}
          />
          {images?.true && trueImage && (
            <Group layer={trueImagePaint || whitePaint}>
              <Image
                image={trueImage}
                fit={images?.true?.fit || "contain"}
                width={images?.true?.width}
                height={images?.true?.height}
                x={gap + (rectSize - images?.true?.width) / 2}
                y={(height - images?.true?.height) / 2}
              />
            </Group>
          )}
          {images?.false && falseImage && (
            <Group layer={falseImagePaint || whitePaint}>
              <Image
                image={falseImage}
                fit={images?.false?.fit || "contain"}
                width={images?.false?.width}
                height={images?.false?.height}
                x={
                  width -
                  gap -
                  images?.false?.width -
                  (rectSize - images?.false?.width) / 2
                }
                y={(height - images?.false?.height) / 2}
              />
            </Group>
          )}
          <Group layer={paint}>
            <RoundedRect
              x={gap}
              y={(height - innerRectSize) / 2}
              width={rectSize}
              height={innerRectSize}
              r={rectSize / 2}
              color={thumbColor}
              transform={rectTransform}
            />
            <RoundedRect
              x={gap}
              y={(height - rectSize) / 2}
              width={rectSize}
              height={rectSize}
              r={rectSize / 2}
              color={thumbColor}
              transform={leftRectTransform}
              origin={{
                x: rectSize / 2 + gap,
                y: (height - rectSize) / 2 + rectSize / 2,
              }}
            />
            <RoundedRect
              x={width - rectSize - gap}
              y={(height - rectSize) / 2}
              width={rectSize}
              height={rectSize}
              r={rectSize / 2}
              color={thumbColor}
              transform={rightRectTransform}
              origin={{
                x: width - rectSize - gap + rectSize / 2,
                y: (height - rectSize) / 2 + rectSize / 2,
              }}
            />
          </Group>
        </Canvas>
      </Pressable>
    </View>
  );
}

export default memo(LiquidSwitch);
