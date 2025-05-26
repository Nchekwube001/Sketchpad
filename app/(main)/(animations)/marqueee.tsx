import { Marquee } from "@animatereactnative/marquee";
import { Stagger } from "@animatereactnative/stagger";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  FadeOut,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

const images = [
  "https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=800x800",
  "https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=800x800",
  "https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=800x800",
  "https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=800x800",
  "https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=800x800",
  "https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=800x800",
  "https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=800x800",
];

const { width } = Dimensions.get("window");
const _itemWidth = width * 0.62;
const _itemHeight = _itemWidth * 1.67;
const _itemSize = _itemWidth + 16;

function Item({
  image,
  index,
  offset,
}: {
  image: string;
  index: number;
  offset: SharedValue<number>;
}) {
  const stylez = useAnimatedStyle(() => {
    // get phase like iOS based on index, _itemSize, and offset.value that
    // is the current x offset
    // I am also subtracting the width of the screen and half of the item size
    // so the interpolation can work properly and the item will be outside the
    // viewport and will not be visible.
    const itemPosition = _itemSize * index - width - _itemSize / 2;
    const totalSize = _itemSize * images.length;
    // I am compensating 1000 to simulate 1000 times the total scroll
    // because there's an issue when user pans back and offset is negative
    // to I ensure that this will never happen :) unless the user pans back
    // 1000 times the total size of the container that has the images :)
    // First, we need to get the item initial position so we can reset it
    // as each element is scrolled to the left and we move it outside the
    // viewport by adding the width of the screen and half of the item size
    // so interpolation can work properly and you'll not see any glitches.
    const range =
      ((itemPosition - (offset.value + totalSize * 1000)) % totalSize) +
      width +
      _itemSize / 2;
    // [item_fully_not_visible_left, middle of the screen, item_fully_not_visible_right]
    const inputRange = [-_itemSize, (width - _itemWidth) / 2, width];

    return {
      transform: [
        {
          rotate: `${interpolate(range, inputRange, [-3, 0, 3])}deg`,
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: _itemWidth,
          height: _itemHeight,
          justifyContent: "center",
          alignItems: "center",
        },
        stylez,
      ]}
    >
      <Image
        source={{ uri: image }}
        style={[
          StyleSheet.absoluteFillObject,
          {
            flex: 1,
            borderRadius: 16,
            // new feature added with new arch.
            // boxShadow: "0 8 10 rgba(0, 0, 0, 0.3)",
          },
        ]}
      />
    </Animated.View>
  );
}

export default function AppleInvites() {
  const offset = useSharedValue(0);
  const [index, setIndex] = useState(0);

  const activeIndex = useDerivedValue(() => {
    return (
      // left edge of the item reaches the center of the screen
      ((offset.value + width / 2) / _itemSize) % images.length
    );
  });
  useAnimatedReaction(
    () => Math.abs(Math.floor(activeIndex.value)),
    (newIndex) => {
      if (newIndex !== index) {
        runOnJS(setIndex)(newIndex);
      }
    }
  );

  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12 * 2,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <View style={[StyleSheet.absoluteFillObject, { opacity: 0.5 }]}>
        {/* When index will change, this will unmount itself, force unmount pretty much */}
        <Animated.Image
          key={`bg-image-${index}`}
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(1000)}
          source={{ uri: images[index] }}
          style={StyleSheet.absoluteFillObject}
          blurRadius={50}
        />
      </View>
      <Marquee
        direction="horizontal"
        spacing={16}
        position={offset}
        speed={1}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <Animated.View
          style={{ flexDirection: "row", gap: 4 * 4 }}
          entering={FadeInUp.duration(1500)
            .delay(500)
            .easing(Easing.elastic(0.9))
            .withInitialValues({
              transform: [{ translateY: -_itemHeight / 2 }],
              opacity: 0,
            })}
        >
          {images.map((image, index) => (
            <Item
              key={index}
              index={index}
              image={image}
              activeIndex={activeIndex}
              offset={offset}
            />
          ))}
        </Animated.View>
      </Marquee>
      <Stagger
        duration={500}
        stagger={100}
        initialEnteringDelay={1000}
        style={{
          flex: 0.5,
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Text style={{ color: "white", fontWeight: "500", opacity: 0.6 }}>
          Welcome to
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          My Playground
        </Text>
      </Stagger>
    </Animated.View>
  );
}
