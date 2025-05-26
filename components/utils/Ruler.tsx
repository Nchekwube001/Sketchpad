import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
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

const _spacing = 8;
const _rulerHeight = 24;
const _rulerWidth = 2;
const _itemSize = _spacing;
const { width } = Dimensions.get("window");

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
      transform: [
        {
          scaleY: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [0.98, 1, 0.98]
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          height: _rulerHeight,
          width: _itemSize,
          justifyContent: "center",
          alignItems: "center",
        },
        stylez,
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
          fontSize: 28,
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
  return (
    <View style={{ justifyContent: "center", gap: _spacing }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: _spacing,
        }}
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
          }}
        >
          min
        </Text>
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
            // alignItems: "flex-end",
          }}
          renderItem={({ index }) => {
            return <RulerLine index={index} scrollX={scrollX} />;
          }}
          // Scrolling
          onScroll={onScroll}
          scrollEventThrottle={1000 / 60} // ~16ms
        />
        <View
          style={{
            alignSelf: "center",
            position: "absolute",
            height: _rulerHeight,
            width: _rulerWidth,
            // height: _rulerHeight + _rulerWidth * 4,
            // width: _itemSize,
            // borderWidth: _rulerWidth,
            // top: -_rulerWidth * 2,
            // opacity: 0.5,
            backgroundColor: "#000",
          }}
        />
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
