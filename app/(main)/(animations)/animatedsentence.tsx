// Inspiration: https://dribbble.com/shots/24989789-Mustard-Golf-Swing-Analysis-App

import { memo, useMemo } from "react";
import { TextProps, View } from "react-native";
import Animated, {
  FadeOut,
  runOnJS,
  SlideInDown,
} from "react-native-reanimated";

type AnimatedSentenceProps = TextProps & {
  onExitFinish?: () => void;
  onEnterFinish?: (wordsCount: number) => void;
  stagger?: number;
};
export const AnimatedSentence = memo(
  ({
    children,
    onExitFinish,
    onEnterFinish,
    stagger = 100,
    ...rest
  }: AnimatedSentenceProps) => {
    if (typeof children !== "string") {
      throw new Error("AnimatedSentence only accepts string");
    }

    const words = useMemo(() => children.split(" "), [children]);
    return (
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}
        key={children}
      >
        {words.map((word, index) => (
          <View style={{ overflow: "hidden" }} key={`word-${index}`}>
            <Animated.Text
              entering={SlideInDown.springify()
                .damping(80)
                .stiffness(200)
                .delay(index * 100)
                .withInitialValues({
                  originY: ((rest.style?.fontSize ?? 50) + 10) * 2,
                })
                .withCallback((finished) => {
                  if (
                    finished &&
                    index === words.length - 1 &&
                    onEnterFinish &&
                    children !== ""
                  ) {
                    runOnJS(onEnterFinish)(words.length);
                  }
                })}
              exiting={FadeOut.springify()
                .damping(80)
                .stiffness(200)
                .withCallback((finished) => {
                  if (
                    finished &&
                    index === words.length - 1 &&
                    onExitFinish &&
                    children !== ""
                  ) {
                    runOnJS(onExitFinish)();
                  }
                })}
              {...rest}
            >
              {/* {index !== 0 && " "} */}
              {word}
            </Animated.Text>
          </View>
        ))}
      </View>
    );
  }
);

import { faker } from "@faker-js/faker";
import { MotiView } from "moti";
import { useState } from "react";
import { StatusBar } from "react-native";

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const colors = [
  // Existing colors
  {
    background: "#2D003F",
    text: "#8A2BE2",
  },
  {
    background: "#8A2BE2",
    text: "#2D003F",
  },
  {
    background: "#001F3F", // Dark Blue Background
    text: "#00A6FF",
  },
  {
    background: "#00A6FF",
    text: "#001F3F", // Dark Blue Background
  },
  {
    background: "#3F1F00", // Dark Orange Background
    text: "#FFA500",
  },
  {
    background: "#FFA500",
    text: "#3F1F00", // Dark Orange Background
  },
  // New high-contrast variants with nice colors
  {
    background: "#0D3B66", // Deep Blue
    text: "#FAF0CA", // Soft Yellow
  },
  {
    background: "#FAF0CA", // Soft Yellow
    text: "#0D3B66", // Deep Blue
  },
  {
    background: "#FF6F61", // Coral
    text: "#2B2D42", // Dark Slate
  },
  {
    background: "#2B2D42", // Dark Slate
    text: "#FF6F61", // Coral
  },
  {
    background: "#28AFB0", // Aqua
    text: "#F6F7EB", // Light Cream
  },
  {
    background: "#F6F7EB", // Light Cream
    text: "#28AFB0", // Aqua
  },
  {
    background: "#FFD700", // Gold
    text: "#282C34", // Charcoal
  },
  {
    background: "#282C34", // Charcoal
    text: "#FFD700", // Gold
  },
  {
    background: "#7F4F24", // Coffee Brown
    text: "#D9BF77", // Warm Beige
  },
  {
    background: "#D9BF77", // Warm Beige
    text: "#7F4F24", // Coffee Brown
  },
  {
    background: "#4A7C59", // Forest Green
    text: "#D9D9D9", // Light Gray
  },
  {
    background: "#D9D9D9", // Light Gray
    text: "#4A7C59", // Forest Green
  },
];

faker.seed(44);

const randomFacts = [
  "Animate  ReactNative  .com",
  "more than 127+ react native animations",
  "save time",
  "increase User Experience",
  "perfect for rapid deployment and polished results",
  "animations are designed to bring life and dynamism to your app",
  "Animate  ReactNative  .com",
  "enhance your app's aesthetics",
  "improve overall user experience",
  "Unlimited projects",
  "Unlimited clients",
  "lifetime license",
  "free updates",
  "10+1 Shared Element transitions",
];
export default function AnimatedSentenceExample() {
  const [sentence, setSentence] = useState(randomFacts[0]);
  const [colorIndex, setColorIndex] = useState(0);
  const color = colors[colorIndex];

  return (
    <MotiView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
      animate={{
        backgroundColor: color.background,
      }}
    >
      <AnimatedSentence
        style={{
          fontSize: 52,
          lineHeight: 52 * 1.0,
          letterSpacing: -2,
          fontWeight: "900",
          flexShrink: 1,
          color: color.text,
          textTransform: "uppercase",
        }}
        onExitFinish={async () => {
          await wait(1000);

          setSentence(randomFacts[(colorIndex + 1) % randomFacts.length]);
          setColorIndex((colorIndex + 1) % colors.length);
        }}
        onEnterFinish={async (wordsCount) => {
          console.log(wordsCount);
          // Average speaking speed is 200 words per minute.
          // so we need to delay 60 / 200 = 0.3 seconds per word

          await wait((wordsCount * 60 * 1000) / 200);
          setSentence("");
        }}
      >
        {sentence}
      </AnimatedSentence>
      <StatusBar hidden />
    </MotiView>
  );
}
