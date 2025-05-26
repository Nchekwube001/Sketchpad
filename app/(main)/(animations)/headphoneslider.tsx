import { Dimensions, SafeAreaView, View } from "react-native";
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeInLeft,
  interpolate,
  SharedValue,
  SlideInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
export const headphones = [
  {
    image:
      "https://images.cdn.europe-west1.gcp.commercetools.com/e566ca9d-a6df-4e08-ab79-02d6d12043a8/Aiaiai_TMA2_DJ%20W_HER-XcPN5mZK-large.png",
    title: "DJ Wireless",
  },
  {
    image:
      "https://images.prismic.io/aiaiai/ZulslbVsGrYSvbVY_TMA-2StudioWireless.webp?auto=format,compress&rect=0,0,3500,3500&w=1400&h=1400",
    title: "Studio Wireless+",
  },
  {
    image:
      "https://images.prismic.io/aiaiai/ZulslLVsGrYSvbVX_TMA-2DJ.webp?auto=format,compress&rect=0,0,3595,3595&w=1400&h=1400",
    title: "DJ",
  },
  {
    image:
      "https://images.prismic.io/aiaiai/ZulslLVsGrYSvbVV_DJXE.webp?auto=format,compress&rect=0,0,1400,1400&w=1400&h=1400",
    title: "DJ XE",
  },
  {
    image:
      "https://images.prismic.io/aiaiai/Zulsl7VsGrYSvbVa_tma-2-studio-owpYeor_.webp?auto=format,compress&rect=0,0,1400,1400&w=1400&h=1400",
    title: "Studio",
  },
  {
    image:
      "https://images.prismic.io/aiaiai/ZulsmLVsGrYSvbVb_tma-2-Studio-xe-new.webp?auto=format,compress&rect=0,0,1800,1800&w=1400&h=1400",
    title: "Studio XE",
  },
  {
    image:
      "https://images.prismic.io/aiaiai/ZulslrVsGrYSvbVZ_tma-2-move-wireless.webp?auto=format,compress&rect=0,0,2800,2800&w=1400&h=1400",
    title: "Move Wireless",
  },
  {
    image:
      "https://images.prismic.io/aiaiai/ZulsmbVsGrYSvbVd_TMA-Wireless-XE.webp?auto=format,compress&rect=0,0,2100,2100&w=1400&h=1400",
    title: "Move XE Wireless",
  },
];

export type Headphone = (typeof headphones)[0];

const { height } = Dimensions.get("window");
const _itemSize = height * 0.6;

type ItemProps = {
  index: number;
  scrollY: SharedValue<number>;
  item: Headphone;
};

function Item({ item, index, scrollY }: ItemProps) {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value / _itemSize,
        [index - 1, index, index + 1],
        [0, 1, 0]
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [(index - 1) * _itemSize, index * _itemSize, index * _itemSize + 1],
            [0, 0, 1]
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [
              (index - 1) * _itemSize,
              index * _itemSize,
              (index + 1) * _itemSize,
            ],
            [1.2, 1, 0],
            {
              extrapolateRight: Extrapolation.CLAMP,
            }
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: "100%",
          height: _itemSize,
          justifyContent: "center",
        },
        stylez,
      ]}
    >
      <Animated.Image
        source={{ uri: item.image }}
        style={{ height: "80%", width: "auto" }}
        entering={FadeInDown.springify().damping(80).stiffness(200).delay(200)}
      />
    </Animated.View>
  );
}

function Title({ item, index, scrollY }: ItemProps) {
  const fontSize = 48;
  const stylez = useAnimatedStyle(() => {
    return {
      position: "absolute",
      fontSize: fontSize,
      lineHeight: fontSize * 1.2,
      fontWeight: "700",
      letterSpacing: -2,
      opacity: interpolate(
        scrollY.value / _itemSize,
        [index - 0.5, index, index + 0.5],
        [0, 1, 0]
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value / _itemSize,
            [index - 1, index, index + 1],
            [fontSize * 1.2, 0, -fontSize * 1.5]
          ),
        },
        {
          scale: interpolate(
            scrollY.value / _itemSize,
            [index - 1, index, index + 1],
            [0, 1, 0]
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
      entering={
        index === 0
          ? FadeInDown.springify().damping(80).stiffness(200)
          : undefined
      }
    >
      <Animated.Text style={stylez} numberOfLines={1} adjustsFontSizeToFit>
        {item.title}
      </Animated.Text>
    </Animated.View>
  );
}

function PaginationIndicator({
  index,
  scrollY,
}: Pick<ItemProps, "index" | "scrollY">) {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value / _itemSize,
        [index - 2, index - 1, index, index + 1, index + 2],
        [0.2, 0.5, 1, 0.5, 0.2],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          scaleX: interpolate(
            scrollY.value / _itemSize,
            [index - 2, index - 1, index, index + 1, index + 2],
            [1, 1.4, 2, 1.4, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      entering={SlideInRight.delay(index * 20)}
      style={[
        {
          width: 10,
          height: 2,
          backgroundColor: "black",
          transformOrigin: ["100%", "50%", 0],
        },
        stylez,
      ]}
    />
  );
}

export default function ScaleCarousel() {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <Animated.View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: height * 0.1,
          paddingHorizontal: 20,
        }}
      >
        {headphones.map((item, index) => (
          <Title key={item.title} item={item} index={index} scrollY={scrollY} />
        ))}
      </Animated.View>
      <Animated.FlatList
        data={headphones}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={{
          paddingTop: height * 0.05,
          paddingBottom: (height - _itemSize) / 2,
        }}
        snapToInterval={_itemSize}
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <Item item={item} index={index} scrollY={scrollY} />
        )}
        onScroll={onScroll}
        scrollEventThrottle={1000 / 60}
        showsVerticalScrollIndicator={false}
        bounces={false}
      />
      <Animated.Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/AIAIAI_company_logo.png?20210624195053",
        }}
        entering={FadeInLeft.springify().damping(80).stiffness(200).delay(400)}
        style={{
          width: "20%",
          aspectRatio: 1,
          marginLeft: 20,
          marginTop: 20,
          position: "absolute",
          bottom: 60,
        }}
      />
      <View
        style={{
          gap: 6,
          position: "absolute",
          right: 10,
          top: "40%",
          zIndex: 99,
        }}
        pointerEvents="none"
      >
        {headphones.map((_, index) => (
          <PaginationIndicator key={index} index={index} scrollY={scrollY} />
        ))}
      </View>
    </SafeAreaView>
  );
}
