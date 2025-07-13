import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  clamp,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Box from "../layout/Box";
import Svg, { Circle } from "react-native-svg";
import globalStyle from "@/globalStyle/globalStyle";
import pallete from "@/constants/colors/pallete";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const _spacing = 8;
const _rulerHeight = 24;
const _rulerWidth = 2;
const _itemSize = _spacing;
const { width } = Dimensions.get("window");
const R = 38;
const STROKE_WIDTH = 6;

let circle_length = 2 * Math.PI * R;
type RulerLineProps = {
  index: number;
  scrollX: SharedValue<number>;
};
function RulerLine({ index, scrollX }: RulerLineProps) {
  const stylez = useAnimatedStyle(() => {
    return {
      // height: interpolate(
      //   scrollX.value,
      //   [index - 1, index, index + 1],
      //   [_rulerHeight - 1, _rulerHeight, _rulerHeight - 1]
      // ),
      // transform: [
      //   {
      //     scaleY: interpolate(
      //       scrollX.value,
      //       [index - 1, index, index + 1],
      //       [0.98, 1, 0.98]
      //     ),
      //   },
      // ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          height: index % 5 === 0 ? _rulerHeight * 1.8 : _rulerHeight,
          width: _itemSize,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        },
        // stylez,
      ]}
    >
      <View
        style={{
          width: _rulerWidth,
          height: "100%",
          backgroundColor: "black",
          opacity: 0.3,
        }}
      />
    </Animated.View>
  );
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
type AnimatedTextProps = {
  value: SharedValue<number>;
  style?: TextStyle;
};
Animated.addWhitelistedNativeProps({ text: true });

function AnimatedText({ value, style = undefined }: AnimatedTextProps) {
  const animatedPropz = useAnimatedProps(() => {
    return {
      text: String(Math.round(value.value)),
    };
  });
  return (
    <AnimatedTextInput
      underlineColorAndroid={"transparent"}
      editable={false}
      defaultValue={String(value.value)}
      animatedProps={animatedPropz}
      style={[
        {
          fontSize: 24,
          fontWeight: "700",
          textAlign: "center",
          letterSpacing: -2,
          fontVariant: ["tabular-nums"],
        },
        style,
      ]}
    />
  );
}

type RulerProps = {
  onChange?: (value: number) => void;
  fadeColor?: string;
  ticks?: number;
};
export function Ruler({
  onChange,
  fadeColor = "#ffffff",
  ticks = 61,
}: RulerProps) {
  const data = useMemo(() => [...Array(ticks).keys()], [ticks]);
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = clamp(e.contentOffset.x / _itemSize, 0, data.length - 1);
    },
    onMomentumEnd: (e) => {
      // set some state here, maybe call a callback
      if (onChange) {
        runOnJS(onChange)(Math.floor(scrollX.value));
      }
    },
  });
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circle_length - circle_length * (scrollX.value / ticks),
  }));
  return (
    <View
      style={{
        justifyContent: "center",
        gap: _spacing,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: _spacing,
          flexDirection: "row",
        }}
      >
        <Box
          style={[
            globalStyle.justifyCenter,
            globalStyle.alignItemsCenter,
            {
              width: (R + STROKE_WIDTH) * 2,
              height: (R + STROKE_WIDTH) * 2,
            },
          ]}
        >
          <Box
            style={[
              globalStyle.absolute,
              globalStyle.justifyCenter,
              globalStyle.alignItemsCenter,
              globalStyle.flexrow,
            ]}
          >
            <AnimatedText value={scrollX} />
            <Text
              style={{
                fontWeight: "500",
                fontSize: 16,
                lineHeight: 16,
                fontVariant: ["tabular-nums"],
                opacity: 0.6,
                letterSpacing: -1,
                paddingLeft: 4,
              }}
            >
              s.
            </Text>
          </Box>
          <Animated.View
            style={{
              aspectRatio: 1,
              transform: [
                {
                  rotate: "270deg",
                },
              ],
            }}
          >
            <AnimatedSvg
              height="100%"
              width="100%"
              viewBox="0 0 100 100"
              style={[
                globalStyle.justifyCenter,
                globalStyle.alignItemsCenter,
                globalStyle.borderRadius,
                globalStyle.w10,
                globalStyle.h10,
              ]}
            >
              <Circle
                cx={"50"}
                cy={"50"}
                r={R}
                strokeWidth={STROKE_WIDTH}
                fill={"transparent"}
                stroke={pallete.primaryGrey200}
              />
              <AnimatedCircle
                cx={"50"}
                cy={"50"}
                r={R}
                fill={"transparent"}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap={"round"}
                stroke={pallete.accentOrange500}
                strokeDasharray={circle_length}
                animatedProps={animatedProps}
              />
            </AnimatedSvg>
          </Animated.View>
        </Box>
      </View>
      <View>
        <Animated.FlatList
          data={data}
          keyExtractor={(item) => String(item)}
          horizontal
          decelerationRate={"fast"}
          showsHorizontalScrollIndicator={false}
          snapToInterval={_itemSize}
          contentContainerStyle={{
            paddingHorizontal: width / 2 - _itemSize / 2,
          }}
          renderItem={({ index }) => {
            return <RulerLine index={index} scrollX={scrollX} />;
          }}
          onScroll={onScroll}
          scrollEventThrottle={1000 / 60} // ~16ms
        />
        <View
          style={{
            alignSelf: "center",
            position: "absolute",
            top: -20,
          }}
        >
          <DownArrow size={14} />
        </View>
        <LinearGradient
          style={[StyleSheet.absoluteFillObject]}
          colors={[fadeColor, `${fadeColor}00`, `${fadeColor}00`, fadeColor]}
          start={[0, 0.5]}
          end={[1, 0.5]}
          locations={[0, 0.3, 0.7, 1]}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}

type DownArrowProps = {
  size?: number;
  color?: string;
  style?: ViewStyle;
};

export function DownArrow({
  size = 20,
  color = pallete.accentOrange500,
  style,
}: DownArrowProps) {
  return (
    <View
      style={[
        {
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.5,
          borderRightWidth: size * 0.5,
          borderTopWidth: size,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: color,
        },
        style,
      ]}
    />
  );
}
