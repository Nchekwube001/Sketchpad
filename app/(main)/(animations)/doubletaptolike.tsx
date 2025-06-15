import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import postsData, { Item } from "../../../components/posts/postdata";
import Animated, {
  Extrapolation,
  interpolate,
  measure,
  MeasuredDimensions,
  runOnJS,
  runOnUI,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Box from "@/components/layout/Box";
import globalStyle, { width } from "@/globalStyle/globalStyle";
import {
  Canvas,
  interpolateColors,
  LinearGradient,
  Path,
  Skia,
  SkiaDomView,
  vec,
} from "@shopify/react-native-skia";
import {
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
const heartPath =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 " +
  "2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 " +
  "1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 " +
  "0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
type PerplexityListProps = {
  data: Item[];
};
// const AnimatedPath = Animated.createAnimatedComponent(Path);

type AnimatedCardProps = {
  item: Item;
  index: number;
  viewableIndex: number | null;
  scrollY: SharedValue<number>;
  showHeart: SharedValue<boolean>;
  tapPoints: SharedValue<{ x: number; y: number }>;
  measurement: SharedValue<MeasuredDimensions | null>;
  setHearts: React.Dispatch<
    React.SetStateAction<
      {
        x: number;
        y: number;
        key: string;
      }[]
    >
  >;
};

// Constants
const { height } = Dimensions.get("screen");
const _spacing = 8;
const _borderRadius = 12;
const _itemSize = height * 0.62;
const _itemFullSize = _itemSize + _spacing * 2;
const size = 120;
const scale = size / 24;
const heartSize = 36;
const scaleEnd = heartSize / 24;
export function AnimatedCard({
  item,
  index,
  scrollY,
  viewableIndex,
  measurement,
  tapPoints,
  showHeart,
  setHearts,
}: AnimatedCardProps) {
  const liked = useSharedValue(0);
  const pathColor = useDerivedValue(() =>
    interpolateColors(liked.value, [0, 1], ["gray", "red"])
  );
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [index - 1, index, index + 1],
        [0.4, 1, 0.4]
      ),
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            [index - 1, index, index + 1],
            [0.92, 1, 0.92],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });
  const targetRef = useAnimatedRef();
  const handleMeasure = () => {
    runOnUI(() => {
      const measured = measure(targetRef);
      measurement.value = measured;
      // ...
    })();
  };
  useEffect(() => {
    if (viewableIndex === index) {
      setTimeout(() => {
        handleMeasure();
      }, 1000);
    }
  }, [viewableIndex, index]);
  const setAllHearts = ({ x, y }: { x: number; y: number }) => {
    setHearts((prev) => [
      ...prev,
      { x: x, y: y, key: Math.floor(Math.random() * 150).toString() },
    ]);
  };
  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onEnd(({ absoluteX, absoluteY }) => {
      console.log("Double tap!");
      runOnJS(setAllHearts)({
        x: absoluteX - size / 2,
        y: absoluteY - size / 2,
      });

      // tapPoints.value = {
      //   x: absoluteX,
      //   y: absoluteY,
      // };
      // console.log({
      //   absoluteX,
      //   absoluteY,
      // });
    });
  return (
    <GestureDetector gesture={doubleTap}>
      <Animated.View
        style={[
          {
            height: _itemSize,
            padding: _spacing * 2,
            borderRadius: _borderRadius,
            gap: _spacing * 2,
            backgroundColor: `${item.bg}22`,
          },
          stylez,
        ]}
      >
        <Image
          source={{ uri: item.image }}
          style={[
            StyleSheet.absoluteFillObject,
            { borderRadius: _borderRadius, opacity: 0.6 },
          ]}
          blurRadius={50}
        />
        <Image
          source={{ uri: item.image }}
          style={{
            borderRadius: _borderRadius - _spacing / 2,
            flex: 1,
            height: _itemSize * 0.4,
            objectFit: "cover",
            margin: -_spacing,
          }}
        />
        <View style={{ gap: _spacing }}>
          <Text style={{ fontSize: 24, color: "#fff", fontWeight: "700" }}>
            {item.title}
          </Text>
          <Text style={{ fontWeight: "300", color: "#ddd" }} numberOfLines={3}>
            {item.description}
          </Text>
        </View>
        <Box
          style={[
            globalStyle.flexrow,
            globalStyle.alignItemsCenter,
            globalStyle.justifyBetween,
          ]}
        >
          <Animated.View ref={targetRef} style={{ width: 36, height: 36 }}>
            <Canvas
              style={{ flex: 1 }}
              onTouchEnd={() => {
                liked.value = liked.value === 0 ? 1 : 0;
              }}
            >
              {heartPath && (
                <Path
                  path={heartPath}
                  // animatedProps={animatedProps}
                  color={pathColor}
                  style="fill"
                  transform={[
                    {
                      scale: scaleEnd,
                    },
                  ]}
                />
              )}
            </Canvas>
          </Animated.View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: _spacing,
            }}
          >
            <Image
              source={{ uri: item.author.avatar }}
              style={{ width: 24, borderRadius: 30, aspectRatio: 1 }}
            />
            <Text style={{ color: "#ddd", fontSize: 12 }}>
              {item.author.name}
            </Text>
          </View>
        </Box>
      </Animated.View>
    </GestureDetector>
  );
}

export function PerplexityList({ data }: PerplexityListProps) {
  const scrollY = useSharedValue(0);
  const [viewableIndex, setViewableIndex] = useState<number | null>(null);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y / _itemFullSize;
  });
  const itemRefs = useRef<Record<string, ReturnType<typeof useAnimatedRef>>>(
    {}
  );
  const measurement = useSharedValue<MeasuredDimensions | null>(null);
  const tapPoints = useSharedValue({
    x: 0,
    y: 0,
  });
  const [hearts, setHearts] = useState<{ x: number; y: number; key: string }[]>(
    []
  );

  const showHeart = useSharedValue(false);
  console.log({
    hearts,
  });

  return (
    <Box style={[globalStyle.flexOne]}>
      <Animated.FlatList
        data={data}
        contentContainerStyle={{
          gap: _spacing * 2,
          paddingHorizontal: _spacing * 2,
          paddingVertical: (height - _itemSize) / 2,
        }}
        onScroll={onScroll}
        viewabilityConfig={{
          waitForInteraction: false,
          itemVisiblePercentThreshold: 80,
        }}
        onViewableItemsChanged={({ viewableItems }) => {
          setViewableIndex(
            viewableItems[0]?.isViewable ? viewableItems[0]?.index : null
          );
        }}
        scrollEventThrottle={1000 / 60} // 16.6ms
        snapToInterval={_itemFullSize}
        decelerationRate={"fast"}
        renderItem={({ item, index }) => (
          <AnimatedCard
            viewableIndex={viewableIndex}
            measurement={measurement}
            item={item}
            index={index}
            scrollY={scrollY}
            showHeart={showHeart}
            tapPoints={tapPoints}
            setHearts={setHearts}
          />
        )}
      />
      <Canvas
        key={tapPoints.value.x}
        style={[
          StyleSheet.absoluteFill,
          {
            pointerEvents: "none",
            //  backgroundColor: "red"
          },
        ]}
      >
        {hearts.map(({ x, y, key }) => (
          <PathItem
            key={key}
            x={x}
            y={y}
            measurement={measurement}
            itemKey={key}
            setHearts={setHearts}
          />
        ))}
      </Canvas>
    </Box>
  );
}

const PathItem = ({
  x,
  y,
  measurement,
  setHearts,
  itemKey,
}: {
  x: number;
  y: number;
  itemKey: string;
  measurement: SharedValue<MeasuredDimensions | null>;
  setHearts: React.Dispatch<
    React.SetStateAction<
      {
        x: number;
        y: number;
        key: string;
      }[]
    >
  >;
}) => {
  const filter = () => {
    setHearts((prev) => prev.filter((it) => it.key !== itemKey));
  };
  const animationVal = useSharedValue(0);
  useEffect(() => {
    animationVal.value = withTiming(
      1,
      {
        duration: 500,
      },
      () => {
        runOnJS(filter)();
      }
    );
  }, []);
  const inputRange = [0, 0.4, 1];
  const scaleVal = useDerivedValue(
    () => interpolate(animationVal.value, inputRange, [scale, scale, scaleEnd]),
    []
  );
  const translateX = useDerivedValue(
    () =>
      interpolate(animationVal.value, inputRange, [
        x,
        x + (x > width / 2 ? -80 : 80),
        measurement.value?.pageX || 0,
      ]),
    []
  );
  const translateY = useDerivedValue(
    () =>
      interpolate(animationVal.value, inputRange, [
        y,
        y - 80,
        measurement.value?.pageY || 0,
      ]),
    []
  );
  const transform = useDerivedValue(
    () => [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        scale: scaleVal.value,
      },
    ],
    []
  );
  return (
    <Path path={heartPath} transform={transform}>
      <LinearGradient
        start={vec(0, 0)}
        end={vec(20, 20)}
        colors={["#ff5f6d", "#ffc371"]} // Gradient from pink to orange
      />
    </Path>
  );
};

export default function Posts() {
  return (
    <View style={styles.container}>
      <PerplexityList data={postsData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
  },
});
