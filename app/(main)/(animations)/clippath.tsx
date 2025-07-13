import React, { useRef } from "react";
import Box from "@/components/layout/Box";
import globalStyle, { height, width } from "@/globalStyle/globalStyle";
import {
  Canvas,
  Group,
  Image,
  Skia,
  useImage,
} from "@shopify/react-native-skia";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Svg, {
  ClipPath,
  Defs,
  Ellipse,
  Image as SvgImage,
} from "react-native-svg";
import { useComponentSize } from "@/constants/utils/hooks";
import { View } from "react-native";

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const _ovalWidth = 240;
const _ovalHeightVal = 328;
const _strokeWidth = 4;
const _scaleHeight = 4;
const _scaleWidth = width * 0.75;
const _circleSize = 24;
const imageUri =
  "https://images.unsplash.com/photo-1751134464611-ddee47c72c65?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D";
const ClipPathView = () => {
  const { size, onLayout } = useComponentSize();
  const translateX = useSharedValue(width / 2);
  // const translateY = useSharedValue(_ovalHeight);
  const translateY = useDerivedValue(() => {
    // return _ovalHeight - 50;
    // return _ovalHeight / 2 + 2;
    return size.height / 2 + 2;
  });
  const clipRef = useRef();
  const targetRef = useRef<View>(null);

  const image = useImage(imageUri);
  const star = Skia.Path.MakeFromSVGString(
    "M 128 0 L 168 80 L 256 93 L 192 155 L 207 244 L 128 202 L 49 244 L 64 155 L 0 93 L 88 80 L 128 0 Z"
  )!;
  const _ovalHeight =
    size?.height < _ovalHeightVal ? size?.height - 5 : _ovalHeightVal;
  const animatedProps = useAnimatedProps(() => ({
    cx: translateX.value,
    cy: translateY.value,
  }));
  return (
    <Box style={[globalStyle.flexOne]} ref={targetRef} onLayout={onLayout}>
      {/* <GestureDetector gesture={gesture}> */}

      <Box
        style={[
          globalStyle.flexOne,
          globalStyle.absolute,
          {
            zIndex: 2,
          },
        ]}
      >
        <Svg>
          <SvgImage
            href={{
              uri: imageUri,
            }}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </Svg>
      </Box>
      <Box
        //   zIndex={10}
        style={[
          globalStyle.justifyCenter,
          globalStyle.alignItemsCenter,
          globalStyle.w10,
          globalStyle.absolute,
          globalStyle.h10,
          {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 10,
          },
        ]}
      >
        <AnimatedSvg
          ref={clipRef as any}
          style={[globalStyle.w10, globalStyle.h10]}
          width="100%"
          height="100%"
        >
          <Defs>
            <ClipPath id="clip">
              <AnimatedEllipse
                // cx="50%"
                // cy="50%"
                rx={_ovalWidth / 2}
                ry={_ovalHeight / 2}
                fill="transparent"
                stroke="white"
                strokeWidth="4"
                animatedProps={animatedProps}
              />
            </ClipPath>
          </Defs>
          <SvgImage
            href={{
              uri: imageUri,
            }}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clip)"
          />
        </AnimatedSvg>
      </Box>
      {/* </GestureDetector> */}
    </Box>
  );
};

export default ClipPathView;
