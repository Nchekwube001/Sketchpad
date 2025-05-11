import {
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import React, { useRef, useState } from "react";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";

const BLOG_DATA = {
  id: 3,
  title: "Clean Mobile App UI Design",
  excerpt:
    "A practical guide to designing sleek, intuitive, and visually appealing mobile app interfaces.",
  content:
    "Great UI design is more than just looks—it improves usability, accessibility, and user experience. This guide covers essential principles for crafting clean and functional mobile app interfaces.",
  author: "Solarin Johnson",
  date: "2023-10-05",
  imageUrl: "https://example.com/images/clean-ui.jpg",
  tags: ["UI Design", "Mobile UX", "App Design"],
  sections: [
    {
      title: "Why Clean UI Matters",
      content: [
        "A cluttered UI confuses users, while a clean design makes interactions effortless. By focusing on simplicity, spacing, and consistency, you create an intuitive experience that improves usability and engagement.",
        "Top companies prioritize clean UI to boost user engagement and retention. A well-structured interface reduces cognitive load and enhances user satisfaction. Understanding the psychology behind clean design helps you craft more user-friendly and scalable interfaces.",
      ],
    },
    {
      title: "Typography and Readability",
      content: [
        "Typography sets the tone for your app. Choose readable fonts like Inter or Roboto, maintain proper spacing, and ensure a clear text hierarchy to create a pleasant reading experience.",
        "Headings should stand out without overwhelming the screen. Proper line height, font weight, and spacing improve readability. Keep body text at a comfortable size, typically between 14px and 16px, and avoid excessive bold or italic styles that can strain the eyes.",
        "Consider accessibility in typography choices. Ensure contrast ratios meet WCAG standards, avoid using only color to convey meaning, and use dynamic scaling for different screen sizes.",
      ],
    },
    {
      title: "Spacing and Layout",
      content: [
        "White space (negative space) helps declutter the UI and improve focus. Elements need breathing room to enhance readability and usability, making content easier to scan.",
        "Use consistent padding and margins. Following an 8px or 4px spacing system helps maintain a structured and balanced layout across different screen sizes and resolutions.",
      ],
    },
    {
      title: "Color and Contrast",
      content: [
        "Colors impact user perception. A simple, well-balanced color scheme enhances aesthetics and usability, reinforcing brand identity while improving readability.",
        "Use high contrast for readability (e.g., dark text on a light background). Stick to a limited color palette and avoid unnecessary gradients or excessive shadows that can reduce clarity and visual hierarchy.",
        "Color psychology plays a role in UX. Cool tones evoke calmness, warm tones create energy, and neutral shades provide balance. Ensure accessibility by testing color contrast and avoiding color combinations that hinder readability for visually impaired users.",
      ],
    },
    {
      title: "Touch and Interaction Design",
      content: [
        "Buttons, gestures, and animations should feel smooth and natural. Ensure touch targets are at least 44x44 pixels for accessibility, making interactions effortless and reducing frustration.",
        "Use motion subtly—smooth transitions and microinteractions should enhance the experience, not distract from it. Animations should provide feedback, such as button press effects or loading indicators, to guide users.",
      ],
    },
    {
      title: "Icons and Imagery",
      content: [
        "Icons should be intuitive and universally recognizable. They help users navigate and understand actions quickly. Use a consistent style and size for icons throughout the app.",
        "Images should be high quality and relevant. They can enhance the visual appeal and provide context, but avoid overloading the interface with too many images, which can slow down performance.",
        "Optimize images for different screen sizes and resolutions. Use responsive images and consider using vector graphics (SVGs) for scalability and clarity on various devices.",
      ],
    },
  ],
};

import { Ionicons } from "@expo/vector-icons";
import { useScaleFont } from "@/hooks/useFontScale";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import ResponsiveText from "@/components/ResponsiveText";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const isWeb = Platform.OS === "web";

interface FlowBarProps {
  currentIndex: SharedValue<number>;
  progress: SharedValue<number>;
  scrollHeight: SharedValue<number>;
  totalSections: number;
}

const PEEK_VIEW_HEIGHT = 50;
const FULL_VIEW_HEIGHT = 32;
const FULL_VIEW_COVER_HEIGHT = 70;
const FULL_BAR_HEIGHT = 260;
const TIMING_CONFIG = { duration: 250, easing: Easing.out(Easing.ease) };
const SPRING_CONFIG = {
  damping: 18,
  mass: 0.5,
  stiffness: 180,
};

const WORDS_PER_MINUTE = 200; // Average reading speed

const { content, title, sections, author, date, excerpt } = BLOG_DATA;
const SECTIONS_TITLE = sections.map((section) => section.title);
const TOTAL_WORDS = sections.reduce((acc, section) => {
  return acc + section.content.join(" ").split(/\s+/).length;
}, 0);

const TOTAL_TIME = Math.ceil(TOTAL_WORDS / WORDS_PER_MINUTE);

function FlowBar({
  currentIndex,
  progress,
  scrollHeight,
  totalSections,
}: FlowBarProps) {
  const backgroundColor = useThemeColor({}, "barColor");
  const scaleFont = useScaleFont();

  const [isExpanded, setIsExpanded] = useState(false);

  const scrollProgress = useDerivedValue(() => Math.max(0, progress.value));

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(isExpanded ? "93%" : "80%", SPRING_CONFIG),
      height: withSpring(
        isExpanded ? FULL_BAR_HEIGHT : PEEK_VIEW_HEIGHT,
        SPRING_CONFIG
      ),
      borderRadius: withSpring(isExpanded ? 38 : 60, SPRING_CONFIG),
      borderTopLeftRadius: withSpring(isExpanded ? 30 : 60, SPRING_CONFIG),
      borderTopRightRadius: withSpring(isExpanded ? 30 : 60, SPRING_CONFIG),
    };
  });

  const scrollTitleViewStyle = useAnimatedStyle(() => {
    const translateY = withSpring(
      interpolate(
        currentIndex.value,
        [0, totalSections],
        [0, -totalSections * PEEK_VIEW_HEIGHT]
      ),
      SPRING_CONFIG
    );

    if (isExpanded) return {};

    return {
      transform: [{ translateY }],
    };
  });

  const animatedMainStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isExpanded ? 100 : PEEK_VIEW_HEIGHT, TIMING_CONFIG),
      padding: withTiming(isExpanded ? 11 : 0, TIMING_CONFIG),
      gap: withTiming(isExpanded ? 3 : 0, TIMING_CONFIG),
    };
  });

  const animatedHandleStyle = useAnimatedStyle(() => {
    return {
      borderRadius: withTiming(
        isExpanded ? 12 : PEEK_VIEW_HEIGHT,
        TIMING_CONFIG
      ),
    };
  });

  const animatedAuthorStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isExpanded ? 0.5 : 0, SPRING_CONFIG),
      transform: [{ translateY: -14 }],
    };
  });

  const scrollFullTitleViewStyle = useAnimatedStyle(() => {
    const translateY = withSpring(
      interpolate(
        currentIndex.value,
        [0, totalSections],
        [0, -totalSections * FULL_VIEW_HEIGHT]
      ),
      SPRING_CONFIG
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View
      style={[styles.container, { backgroundColor }, animatedTextStyle]}
    >
      <Pressable onPress={() => setIsExpanded((prev) => !prev)}>
        <Animated.View style={[styles.main, animatedMainStyle]}>
          <View style={styles.handle}>
            <Animated.View style={[styles.handleCircle, animatedHandleStyle]}>
              <Image
                style={styles.image}
                source="https://avatars.githubusercontent.com/u/103961416?s=400&u=fd3d0b5e7536506aa57da94b49d54bc3c4f26fc4&v=4"
                contentFit="cover"
              />
            </Animated.View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              maxHeight: "100%",
            }}
          >
            <View style={styles.peek}>
              <Animated.View style={scrollTitleViewStyle}>
                <SectionList height={PEEK_VIEW_HEIGHT} />
              </Animated.View>
              <Overlay />
            </View>
            {
              <Animated.View style={animatedAuthorStyle}>
                <ThemedText
                  light
                  style={{
                    fontSize: scaleFont(14.8),
                  }}
                >
                  {author}
                </ThemedText>
              </Animated.View>
            }
          </View>
          <RadialProgress progress={scrollProgress} isExpanded={isExpanded} />
        </Animated.View>
      </Pressable>
      <Animated.View
        style={{
          overflow: "hidden",
        }}
      >
        <View
          style={{
            paddingHorizontal: 21,
          }}
        >
          <View
            style={[
              styles.peek,
              {
                marginVertical: FULL_VIEW_COVER_HEIGHT / 2.5,
                maxHeight: FULL_VIEW_HEIGHT,
                overflow: "visible",
                borderWidth: 1,
                borderBottomColor: "#ffffff35",
                borderTopColor: "#ffffff35",
                maxWidth: 240,
              },
            ]}
          >
            <Animated.View style={[scrollFullTitleViewStyle]}>
              <SectionList height={FULL_VIEW_HEIGHT} small />
            </Animated.View>
          </View>
          <Overlay
            stops={[
              backgroundColor + "dc",
              backgroundColor + "bc",
              "transparent",
              backgroundColor + "bc",
              backgroundColor + "dc",
            ]}
          />
        </View>
      </Animated.View>
      <LinearProgress progress={scrollProgress} />
    </Animated.View>
  );
}

const SectionList = ({
  height,
  small,
}: {
  height: number;
  small?: boolean;
}): JSX.Element => {
  const scaleFont = useScaleFont();

  return (
    <View>
      {SECTIONS_TITLE.map((title, index) => (
        <View
          key={index}
          style={{
            height,
            justifyContent: "center",
          }}
        >
          <ThemedText
            invert
            light
            style={{
              fontSize: scaleFont(14.5),
              fontFamily: !small ? "GeistSemiBold" : "GeistRegular",
              paddingRight: 8,
              userSelect: "none",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </ThemedText>
        </View>
      ))}
    </View>
  );
};

const RadialProgress = ({
  progress,
  isExpanded,
}: {
  progress: SharedValue<number>;
  isExpanded: boolean;
}) => {
  const radius = PEEK_VIEW_HEIGHT - 12;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const size = 32;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: withSpring(
      (1 - progress.value) * circumference,
      SPRING_CONFIG
    ),
  }));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isExpanded ? 0 : 1, SPRING_CONFIG),
      transform: [
        {
          translateX: withSpring(
            isExpanded ? FULL_BAR_HEIGHT : 0,
            SPRING_CONFIG
          ),
        },
        {
          translateY: withSpring(
            isExpanded ? FULL_BAR_HEIGHT : 0,
            SPRING_CONFIG
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          paddingHorizontal: 8,
          alignItems: "flex-end",
          justifyContent: "center",
          height: "100%",
        },
        animatedStyle,
      ]}
    >
      <Svg width={size} height={size} viewBox={`-50 -50 100 100`}>
        {/* Background Circle */}
        <Circle
          cx="0"
          cy="0"
          r={radius}
          stroke="#ffffff50"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <AnimatedCircle
          cx="0"
          cy="0"
          r={radius}
          stroke={"#ffffff"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform="rotate(-90)"
        />
      </Svg>
    </Animated.View>
  );
};

const Overlay = ({
  style,
  stops,
}: {
  style?: StyleProp<ViewStyle>;
  stops?: [string, string, ...string[]];
}) => {
  const color = useThemeColor({}, "barColor");
  return (
    <LinearGradient
      colors={stops || [color, "transparent", "transparent", color]}
      style={[styles.overlay, style]}
      dither
    />
  );
};

const LinearProgress = ({ progress }: { progress: SharedValue<number> }) => {
  const totalTime = useSharedValue(TOTAL_TIME * 60);

  const timeCovered = useDerivedValue(() => {
    return Math.min(
      Math.ceil(totalTime.value * progress.value),
      totalTime.value
    );
  });

  return (
    <View
      style={{
        paddingHorizontal: 21,
        flex: 1,
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View>
        <TimeFlow seconds={timeCovered} hours={false} />
      </View>
      <View
        style={{
          flex: 1,
          height: 7,
          borderRadius: 3.5,
          overflow: "hidden",
          backgroundColor: "#ffffff40",
        }}
      >
        <Animated.View
          style={[
            {
              height: "100%",
              backgroundColor: "#ffffffab",
              borderRadius: 3,
            },
            useAnimatedStyle(() => ({
              width: withSpring(`${progress.value * 100}%`, SPRING_CONFIG),
            })),
          ]}
        />
      </View>
      <View>
        <TimeFlow seconds={totalTime} hours={false} />
      </View>
    </View>
  );
};

type ArticleProps = {
  title: string;
  content: string[];
  index: number;
};

const Article: React.FC<ArticleProps> = ({ title, content }) => {
  return (
    <View style={styles.article}>
      <View>
        <ThemedText type="default">{title}</ThemedText>
      </View>
      <View style={styles.section}>
        {content.map((paragraph, i) => (
          <ThemedText key={i} style={styles.content} type="subtitle">
            {paragraph}
          </ThemedText>
        ))}
      </View>
    </View>
  );
};

interface HeaderProps {
  title: string;
  content: string;
  onBackPress: () => void;
}

const Header = ({ title, content, onBackPress }: HeaderProps) => {
  const scaleFont = useScaleFont();
  const text = useThemeColor({}, "text");
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons
            name="chevron-back-outline"
            color={text}
            size={scaleFont(25)}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.head}>
        <View>
          <ResponsiveText text={title} baseSize={29} type="title" />
        </View>
        <ThemedText style={styles.content} type="subtitle">
          {content}
        </ThemedText>
      </View>
    </View>
  );
};

type TimeFlowProps = {
  seconds: SharedValue<number>;
  hours?: boolean;
};

const DIGIT_HEIGHT = 16;
const TOTAL_DIGITS = 10;

const TimeFlowDigit: React.FC<{ digit: SharedValue<number> }> = ({ digit }) => {
  const scaleFont = useScaleFont();
  const fontSize = scaleFont(11.5);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            digit.value,
            [0, 9],
            [0, -9 * DIGIT_HEIGHT],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.digitContainer}>
      <Animated.View style={animatedStyle}>
        {[...Array(TOTAL_DIGITS).keys()].map((num) => (
          <ThemedText
            light
            key={num}
            style={[styles.digitText, { fontSize }]}
            type="title"
          >
            {num}
          </ThemedText>
        ))}
      </Animated.View>
    </View>
  );
};

const extractDigit = (
  value: SharedValue<number>,
  divisor: number,
  place: number
) => {
  return useDerivedValue(() => {
    return Math.floor(((value.value / divisor) % 60) / place) % 10;
  });
};

const TimeFlow: React.FC<TimeFlowProps> = ({ seconds, hours = true }) => {
  const hoursTens = extractDigit(seconds, 3600, 10);
  const hoursOnes = extractDigit(seconds, 3600, 1);
  const minutesTens = extractDigit(seconds, 60, 10);
  const minutesOnes = extractDigit(seconds, 60, 1);
  const secondsTens = extractDigit(seconds, 1, 10);
  const secondsOnes = extractDigit(seconds, 1, 1);
  const scaleFont = useScaleFont();
  const fontSize = scaleFont(11.5);

  const hourWidth = useAnimatedStyle(() => {
    return {
      width: hours || hoursOnes.value > 0 ? "auto" : 0,
      overflow: "hidden",
      flexDirection: "row",
    };
  });

  return (
    <View style={styles.timeFlow}>
      <Animated.View style={hourWidth}>
        <TimeFlowDigit digit={hoursTens} />
        <TimeFlowDigit digit={hoursOnes} />
        <ThemedText light style={[styles.separator, { fontSize }]}>
          :
        </ThemedText>
      </Animated.View>
      <TimeFlowDigit digit={minutesTens} />
      <TimeFlowDigit digit={minutesOnes} />
      <ThemedText light style={[styles.separator, { fontSize }]}>
        :
      </ThemedText>
      <TimeFlowDigit digit={secondsTens} />
      <TimeFlowDigit digit={secondsOnes} />
    </View>
  );
};

export default function Index() {
  const lastLoggedIndex = useSharedValue<number>(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    const lastItem = viewableItems[viewableItems.length - 1];

    if (lastItem?.isViewable && lastItem.index !== null) {
      lastLoggedIndex.value = lastItem.index;
    }
  };

  const viewabilityConfigCallbackPairs = React.useRef([
    {
      viewabilityConfig: { itemVisiblePercentThreshold: 100 },
      onViewableItemsChanged,
    },
  ]);

  const scrollY = useSharedValue(0);
  const totalHeight = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      totalHeight.value =
        event.contentSize.height - event.layoutMeasurement.height;
    },
  });

  const progress = useDerivedValue(() =>
    totalHeight.value > 0 ? scrollY.value / totalHeight.value : 0
  );

  return (
    <ThemedView style={{ flex: 1, overflow: "hidden" }}>
      <Animated.FlatList
        ListHeaderComponent={() => (
          <Header title={title} content={content} onBackPress={() => {}} />
        )}
        style={{
          flex: 1,
          alignSelf: "center",
          maxWidth: 640,
        }}
        contentContainerStyle={{ gap: 16, paddingBottom: 280 }}
        data={sections}
        renderItem={({ item, index }) => (
          <Article
            content={item.content}
            title={item.title}
            index={index + 1}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      <FlowBar
        scrollHeight={totalHeight}
        currentIndex={lastLoggedIndex}
        totalSections={sections.length}
        progress={progress}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  nav: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  head: {
    flexDirection: "column",
    width: "100%",
    gap: 6,
  },
  content: {
    paddingVertical: 5,
  },
  timeFlow: {
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.4,
  },
  digitContainer: { width: 8, height: DIGIT_HEIGHT, overflow: "hidden" },
  digitText: {
    textAlign: "center",
    lineHeight: DIGIT_HEIGHT,
    height: DIGIT_HEIGHT,
  },
  separator: {
    lineHeight: DIGIT_HEIGHT,
  },
  article: {
    marginVertical: 10,
    paddingHorizontal: 16,
    padding: 10,
    borderRadius: 5,
  },
  section: {
    marginTop: 10,
    gap: 20,
  },
  content2: {
    opacity: 0.8,
  },
  container2: {
    position: "absolute",
    backgroundColor: "red",
    alignSelf: "center",
    maxWidth: 380,
    bottom: "1.6%",
    overflow: "hidden",
  },

  peek: {
    maxHeight: PEEK_VIEW_HEIGHT,
    overflow: "hidden",
    flexDirection: "column",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },

  main: {
    flexDirection: "row",
    alignItems: "center",
  },
  handle: {
    padding: 10,
    height: isWeb ? "100%" : "auto",
  },
  handleCircle: {
    height: "100%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 5000,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    width: "100%",
  },
});
