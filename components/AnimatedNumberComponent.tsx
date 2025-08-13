import { memo, useMemo, useRef } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import Animated, {
  EasingFunction,
  FadeInDown,
  FadeOutDown,
  LayoutAnimationFunction,
  LinearTransition,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type SeparatorType = "comma" | "dot";
type SeparatorAnimationType = "swap" | "translate";

interface TimingOptions {
  type: "timing";
  duration?: number;
  easing?: EasingFunction;
}

interface SpringOptions {
  type: "spring";
  damping?: number;
  mass?: number;
  stiffness?: number;
  overshootClamp?: boolean;
}

type AnimationConfigs = TimingOptions | SpringOptions;

interface Props {
  number: string;
  separator?: SeparatorType;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  separatorAnimation?: SeparatorAnimationType;
  animationConfig?: AnimationConfigs;
  prefix?: string;
  suffix?: string;
}

interface AnimatedTextProps {
  char: string;
  textStyle?: StyleProp<TextStyle>;
  separatorAnimation: SeparatorAnimationType;
  animationConfig: AnimationConfigs;
  separator: SeparatorType;
  layoutAnimations: any;
}

interface CharWithId {
  id: string;
  char: string;
}

let globalId = 0;

const defaultAnimationConfigs = {
  type: "timing",
  duration: 300,
} as TimingOptions;

const separatorMap = {
  comma: ",",
  dot: ".",
};

function formatNumberToCharArray(
  input: string | number,
  separator: SeparatorType = "comma"
): string[] {
  const sepChar = separator === "comma" ? "," : ".";
  const raw = String(input).replace(/[^\d]/g, "");
  const digits = raw.split("");

  const result: string[] = [];
  let count = 0;

  for (let i = digits.length - 1; i >= 0; i--) {
    result.unshift(digits[i]);
    count++;
    if (count % 3 === 0 && i !== 0) {
      result.unshift(sepChar);
    }
  }

  return result;
}

function updateCharList(
  newInput: string | number,
  prev: CharWithId[],
  separator: SeparatorType = "comma"
): CharWithId[] {
  const sepChar = separator === "comma" ? "," : ".";
  const nextChars = formatNumberToCharArray(newInput, separator);
  const next: CharWithId[] = [];
  const used = new Set<number>();

  const newSepIndexes = nextChars
    .map((char, i) => ({ char, index: i }))
    .filter((item) => item.char === sepChar);

  const prevSeps = prev
    .map((item, i) => ({ ...item, index: i }))
    .filter((item) => item.char === sepChar);

  const sepMap = new Map<number, CharWithId>();

  const newSepCount = newSepIndexes.length;
  const prevSepCount = prevSeps.length;

  const freshCount =
    newSepCount >= prevSepCount ? newSepCount - prevSepCount : 0;

  const prevStartIndex =
    newSepCount < prevSepCount ? prevSepCount - newSepCount : 0;

  for (let i = 0; i < newSepIndexes.length; i++) {
    const newSep = newSepIndexes[i];

    if (i < freshCount) {
      sepMap.set(newSep.index, {
        id: `char-${globalId++}`,
        char: sepChar,
      });
    } else {
      const prevMatch = prevSeps[prevStartIndex + i - freshCount];
      if (prevMatch) {
        sepMap.set(newSep.index, {
          id: prevMatch.id,
          char: prevMatch.char,
        });
        used.add(prevMatch.index);
      }
    }
  }

  for (let i = 0; i < nextChars.length; i++) {
    const char = nextChars[i];

    if (char === sepChar && sepMap.has(i)) {
      next.push(sepMap.get(i)!);
      continue;
    }

    const matchIndex = prev.findIndex((item, j) => {
      return !used.has(j) && item.char === char;
    });

    if (matchIndex !== -1) {
      used.add(matchIndex);
      next.push(prev[matchIndex]);
    } else {
      next.push({ id: `char-${globalId++}`, char });
    }
  }

  return next;
}

function estimateSpringDuration(
  mass: number = 1,
  stiffness: number = 100,
  damping: number = 10
): number {
  const dampingRatio = damping / (2 * Math.sqrt(mass * stiffness));
  const settlingTime = 2 * Math.PI * Math.sqrt(mass / stiffness) * dampingRatio;
  return Math.round(settlingTime * 1000);
}

function createLayoutAnimation(baseAnim: any, config: AnimationConfigs) {
  let anim = baseAnim;

  if (config.type === "timing") {
    anim = anim.duration(config.duration);

    if (typeof config.easing === "function") {
      anim = anim.easing(config.easing);
    }
  }

  if (config.type === "spring") {
    anim = anim.springify();

    if (typeof config.damping === "number") {
      anim = anim.damping(config.damping);
    }
    if (typeof config.mass === "number") {
      anim = anim.mass(config.mass);
    }
    if (typeof config.stiffness === "number") {
      anim = anim.stiffness(config.stiffness);
    }

    if (typeof config.overshootClamp === "boolean") {
      anim = anim.overshootClamp(config.overshootClamp);
    }
  }

  return anim;
}

function AnimatedText({
  char,
  textStyle,
  animationConfig,
  separatorAnimation,
  separator,
  layoutAnimations,
}: AnimatedTextProps) {
  const customLayoutAnimation = useMemo(() => {
    let springAnimationDuration = null;

    if (animationConfig.type === "spring") {
      springAnimationDuration = estimateSpringDuration(
        animationConfig.mass,
        animationConfig.stiffness,
        animationConfig.damping
      );
    }

    const CustomLayout: LayoutAnimationFunction = (values) => {
      "worklet";
      const { type, ...animationConfigs } = animationConfig;
      const isSpring = animationConfig.type === "spring";
      const isTiming = animationConfig.type === "timing";

      const halfDuration =
        isTiming && typeof animationConfig.duration === "number"
          ? animationConfig.duration / 2
          : springAnimationDuration
          ? springAnimationDuration / 2
          : 200;

      const animFunction = isSpring ? withSpring : withTiming;

      return {
        initialValues: {
          opacity: 1,
          transform: [{ translateY: 0 }],
          originX: values.currentOriginX,
        },
        animations: {
          originX: animFunction(values.targetOriginX, animationConfigs),
          transform: [
            {
              translateY: withSequence(
                withTiming(15, {
                  duration: halfDuration,
                  ...(isTiming &&
                    typeof animationConfig.easing === "function" && {
                      easing: animationConfig.easing,
                    }),
                }),
                animFunction(
                  0,
                  isSpring
                    ? animationConfigs
                    : { ...animationConfigs, duration: halfDuration }
                )
              ),
            },
          ],
        },
      };
    };

    return CustomLayout;
  }, []);

  return (
    <Animated.Text
      entering={layoutAnimations.entering}
      exiting={layoutAnimations.exiting}
      layout={
        char === separatorMap[separator] && separatorAnimation === "swap"
          ? customLayoutAnimation
          : layoutAnimations.layout
      }
      style={textStyle}
    >
      {char}
    </Animated.Text>
  );
}

function AnimatedNumberComponent({
  number,
  separator = "comma",
  textStyle,
  containerStyle,
  separatorAnimation = "swap",
  animationConfig = defaultAnimationConfigs,
  prefix,
  suffix,
}: Props) {
  const prevList = useRef<any>([]);

  const units = useMemo(() => {
    const newList = updateCharList(number, prevList.current, separator);
    prevList.current = newList;
    return newList;
  }, [number, separator]);

  const layoutAnimations = useMemo(() => {
    return {
      entering: createLayoutAnimation(FadeInDown, animationConfig),
      exiting: createLayoutAnimation(FadeOutDown, animationConfig),
      layout: createLayoutAnimation(LinearTransition, animationConfig),
    };
  }, [animationConfig]);

  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      layout={LinearTransition}
    >
      {prefix && (
        <Animated.Text style={textStyle} layout={layoutAnimations.layout}>
          {prefix}
        </Animated.Text>
      )}
      {units.map((item) => {
        return (
          <AnimatedText
            char={item.char}
            key={item.id}
            textStyle={textStyle}
            animationConfig={animationConfig}
            separator={separator}
            separatorAnimation={separatorAnimation}
            layoutAnimations={layoutAnimations}
          />
        );
      })}
      {suffix && (
        <Animated.Text style={textStyle} layout={layoutAnimations.layout}>
          {suffix}
        </Animated.Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});

export default memo(AnimatedNumberComponent);
