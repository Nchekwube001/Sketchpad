import {
  Blur,
  Canvas,
  Group,
  SkFont,
  Text as SkText,
  useFont,
} from "@shopify/react-native-skia";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SECRET = "592508";
const FONT_SIZE = 48;
const LETTER_WIDTH = 48;
const TEXT_X_OFFSET = 36;
const TEXT_Y_POSITION = 70;

interface BlurredTextProps {
  letter: string;
  index: number;
  x: number;
  y: number;
  font: SkFont | null;
  activeCharacterIndex: SharedValue<number>;
}

function BlurredText(props: BlurredTextProps) {
  const blurValue = useDerivedValue(() => {
    const activeIndex = props.activeCharacterIndex.get();

    if (activeIndex === -1) {
      return withTiming(12, { duration: 200 });
    }

    const distance = Math.abs(props.index - activeIndex);
    const targetBlur = distance * 2.5;

    return withTiming(targetBlur, { duration: 200 });
  });

  const scaleValue = useDerivedValue(() => {
    const activeIndex = props.activeCharacterIndex.get();

    if (activeIndex === -1) {
      return withTiming(0.6, { duration: 400 });
    }

    const distance = Math.abs(props.index - activeIndex);
    const scale = Math.max(0.6, 1.5 - distance * 0.5);

    return withTiming(scale, { duration: 400 });
  });

  const transform = useDerivedValue(() => {
    return [{ scale: scaleValue.get() }];
  });

  const transformOrigin = useDerivedValue(() => ({
    x: props.x + LETTER_WIDTH / 2,
    y: props.y - LETTER_WIDTH / 4,
  }));

  return (
    <Group transform={transform} origin={transformOrigin}>
      <SkText x={props.x} y={props.y} text={props.letter} font={props.font}>
        <Blur blur={blurValue} />
      </SkText>
    </Group>
  );
}

export default function Index() {
  const font = useFont(
    require("@/assets/fonts/SpaceMono-Regular.ttf"),
    FONT_SIZE
  );

  const touchX = useSharedValue(-1);
  const touchY = useSharedValue(-1);
  const isActive = useSharedValue(false);

  const activeCharacterIndex = useDerivedValue(() => {
    if (!isActive.get() || touchX.get() < 0) return -1;
    const index = Math.floor((touchX.get() - TEXT_X_OFFSET) / LETTER_WIDTH);
    return index >= 0 && index < SECRET.length ? index : -1;
  });

  const panGesture = Gesture.Pan()
    .onStart((ev: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      touchX.set(ev.x);
      touchY.set(ev.y);
      isActive.set(true);
    })
    .onUpdate((ev: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      touchX.set(ev.x);
      touchY.set(ev.y);
    })
    .onEnd(() => {
      isActive.set(false);
      touchX.set(-1);
      touchY.set(-1);
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.instructions}>Pan to reveal the Secret... 🤫</Text>
        <GestureDetector gesture={panGesture}>
          <Canvas style={styles.canvas}>
            {SECRET.split("").map((letter, index) => (
              <BlurredText
                key={index}
                letter={letter}
                index={index}
                x={TEXT_X_OFFSET + index * LETTER_WIDTH}
                y={TEXT_Y_POSITION}
                font={font}
                activeCharacterIndex={activeCharacterIndex}
              />
            ))}
          </Canvas>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#16222A",
    experimental_backgroundImage:
      "linear-gradient(to bottom, #3A6073, #16222A)",
  },
  canvas: {
    borderRadius: 16,
    width: 360,
    height: 100,
    boxShadow: "0px 0px 15px 8px rgba(0,0,0,0.2)",
    backgroundColor: "#fff",
  },
  instructions: {
    fontSize: 24,
    color: "#fff",
  },
});
