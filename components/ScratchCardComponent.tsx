import { Canvas, Group, Mask, Path, Rect } from "@shopify/react-native-skia";
import React, {
  Children,
  cloneElement,
  isValidElement,
  memo,
  useState,
} from "react";
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Props {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

type Size = { width: number; height: number };

interface SlotProps {
  children:
    | React.ReactNode
    | ((layout: { width: number; height: number }) => React.ReactNode);
}

const ScratchCard = ({ children, containerStyle }: Props) => {
  const [layout, setLayout] = useState<Size>({
    width: screenWidth,
    height: screenHeight,
  });

  const path = useSharedValue("");

  const onGesture = Gesture.Pan()
    .onStart(({ x, y }) => {
      path.value += `M ${x} ${y} `;
    })
    .onUpdate(({ x, y }) => {
      path.value += `L ${x} ${y} `;
    });

  let behind: React.ReactNode = null;
  let overlay: React.ReactNode | ((size: Size) => React.ReactNode) = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const element = child as React.ReactElement;

    if (element.type === ScratchCard.Behind) {
      behind = (element.props as any).children;
    }

    if (element.type === ScratchCard.Overlay) {
      overlay = (element.props as any).children;
    }
  });

  const renderOverlay = () => {
    if (typeof overlay === "function") {
      return overlay(layout);
    }

    if (isValidElement(overlay)) {
      return cloneElement(overlay as any, {
        width: layout.width,
        height: layout.height,
      });
    }

    return null;
  };

  return (
    <GestureDetector gesture={onGesture}>
      <Animated.View
        style={containerStyle}
        onLayout={({ nativeEvent }) => setLayout(nativeEvent.layout)}
      >
        {/* only behind */}
        {behind}

        {/* overlay with masking */}
        <Canvas style={StyleSheet.absoluteFill}>
          <Mask
            mode="luminance"
            mask={
              <Group>
                <Rect
                  x={0}
                  y={0}
                  width={layout.width}
                  height={layout.height}
                  color="white"
                />
                <Path
                  path={path}
                  color="black"
                  style="stroke"
                  strokeWidth={40}
                  strokeCap="round"
                  strokeJoin="round"
                />
              </Group>
            }
          >
            <Group>{renderOverlay()}</Group>
          </Mask>
        </Canvas>
      </Animated.View>
    </GestureDetector>
  );
};

// subcomponents
const Overlay = function Overlay({ children }: SlotProps) {
  return <View>{children}</View>;
};

const Behind = function Behind({ children }: SlotProps) {
  return <View>{children}</View>;
};

ScratchCard.Overlay = Overlay;
ScratchCard.Behind = Behind;

const MemoScratchCard = Object.assign(memo(ScratchCard), {
  Overlay,
  Behind,
});

export default MemoScratchCard;
