import { View, Text, Dimensions, StyleSheet } from "react-native";
import React from "react";
import { Canvas, Circle, Path, Skia } from "@shopify/react-native-skia";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { polar2Canvas } from "react-native-redash";
const { height, width } = Dimensions.get("window");
const ArcSlider = () => {
  const strokeWidth = 20;
  const center = width / 2;
  const r = (width - strokeWidth) / 2 - 40;
  const startAngle = Math.PI;
  const endAngle = Math.PI * 2;
  const x1 = center - r * Math.cos(startAngle);
  const y1 = -r * Math.sin(startAngle) + center;
  const x2 = center - r * Math.cos(endAngle);
  const y2 = -r * Math.sin(endAngle) + center;

  const backgroundPath = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`;
  const foregroundPath = `M ${x2} ${y2} A ${r} ${r} 1 0 1 ${x1} ${y1}`;
  const skiaBackgroundPath = Skia.Path.MakeFromSVGString(backgroundPath);
  const skiaForegroundPath = Skia.Path.MakeFromSVGString(foregroundPath);
  const movableCx = useSharedValue(x2);
  const movableCy = useSharedValue(y2);

  const previousCx = useSharedValue(x2);
  const previousCy = useSharedValue(y2);

  const skiaCx = useSharedValue(x2);
  const skiaCy = useSharedValue(y2);
  const skiaPercentComplete = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate(({ absoluteX, translationX, translationY }) => {
      const oldX = translationX + previousCx.value;
      const oldY = translationY + previousCy.value;

      const xPrime = oldX - center;
      const yPrime = -(oldY - center);

      const rawTheta = Math.atan2(yPrime, xPrime);

      console.log({
        rawTheta,
      });

      let newTheta = 0;
      const widthval = width / 2 + 30;
      if (absoluteX < widthval && rawTheta < 0) {
        newTheta = Math.PI;
      } else if (absoluteX > widthval && rawTheta <= 0) {
        newTheta = Math.PI;
      } else {
        newTheta = rawTheta;
      }

      const newCoords = polar2Canvas(
        {
          theta: newTheta,
          radius: r,
        },
        {
          x: center,
          y: center,
        }
      );
      skiaPercentComplete.value = 1 - newTheta / Math.PI;
      movableCx.value = newCoords.x;
      movableCy.value = newCoords.y;
    })
    .onEnd(() => {
      previousCx.value = movableCx.value;
      previousCy.value = movableCy.value;
    });

  useAnimatedReaction(
    () => {
      return movableCx.value;
    },
    (result) => {
      skiaCx.value = result;
    },
    []
  );
  useAnimatedReaction(
    () => {
      return movableCy.value;
    },
    (result) => {
      skiaCy.value = result;
    },
    []
  );

  if (!skiaBackgroundPath || !skiaForegroundPath) {
    return <View />;
  }
  return (
    <GestureHandlerRootView style={[style.container]}>
      <GestureDetector gesture={gesture}>
        <View style={[style.container]}>
          <View style={[style.ghost]} />
          <Canvas style={[style.canvas]}>
            <Path
              path={skiaBackgroundPath}
              strokeWidth={strokeWidth}
              strokeCap={"round"}
              color={"grey"}
              style={"stroke"}
            />
            <Path
              path={skiaForegroundPath}
              strokeWidth={strokeWidth}
              strokeCap={"round"}
              color={"black"}
              style={"stroke"}
              start={0}
              end={skiaPercentComplete}
            />

            <Circle r={20} color={"black"} cx={skiaCx} cy={skiaCy} />
            <Circle r={15} color={"white"} cx={skiaCx} cy={skiaCy} />
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  canvas: {
    flex: 1,
  },
  ghost: {
    flex: 2,
    alignContent: "center",
    alignItems: "center",
  },
});
export default ArcSlider;
