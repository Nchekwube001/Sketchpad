import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Item } from "./mockdata";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type PerplexityListProps = {
  data: Item[];
};

type AnimatedCardProps = {
  item: Item;
  index: number;
  scrollY: SharedValue<number>;
};

// Constants
const { height } = Dimensions.get("screen");
const _spacing = 8;
const _borderRadius = 12;
const _itemSize = height * 0.62;
const _itemFullSize = _itemSize + _spacing * 2;

export function AnimatedCard({ item, index, scrollY }: AnimatedCardProps) {
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
  return (
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
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: _spacing }}
      >
        <Image
          source={{ uri: item.author.avatar }}
          style={{ width: 24, borderRadius: 30, aspectRatio: 1 }}
        />
        <Text style={{ color: "#ddd", fontSize: 12 }}>{item.author.name}</Text>
      </View>
    </Animated.View>
  );
}

export function PerplexityList({ data }: PerplexityListProps) {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y / _itemFullSize;
  });
  return (
    <Animated.FlatList
      data={data}
      contentContainerStyle={{
        gap: _spacing * 2,
        paddingHorizontal: _spacing * 2,
        paddingVertical: (height - _itemSize) / 2,
      }}
      onScroll={onScroll}
      scrollEventThrottle={1000 / 60} // 16.6ms
      snapToInterval={_itemFullSize}
      decelerationRate={"fast"}
      renderItem={({ item, index }) => (
        <AnimatedCard item={item} index={index} scrollY={scrollY} />
      )}
    />
  );
}
