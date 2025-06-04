import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import React, { useMemo, useState } from "react";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import TextComponent from "@/components/text/TextComponent";
import globalStyle from "@/globalStyle/globalStyle";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Search } from "lucide-react-native";
import pallete from "@/constants/colors/pallete";
const ScrollHeader = () => {
  const scrollY = useSharedValue(0);
  const previousY = useSharedValue(0);
  const isScrollingUp = useSharedValue(true);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      if (currentY > previousY.value) {
        isScrollingUp.value = false;
      } else if (currentY < previousY.value) {
        isScrollingUp.value = true;
      } else if (currentY === 0) {
        isScrollingUp.value = true;
      }

      previousY.value = currentY;
      scrollY.value = currentY;
    },
  });

  return (
    <View style={[globalStyle.bgGray, globalStyle.flexOne]}>
      <HeaderView translationY={scrollY} isScrollingUp={isScrollingUp} />

      <View style={[globalStyle.flexOne]}>
        <Animated.ScrollView
          bounces={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[globalStyle.pt1p2]}
        >
          {new Array(100).fill(0).map((_, index) => (
            <View
              key={index}
              style={[
                globalStyle.px1p2,
                globalStyle.flexrow,
                globalStyle.alignItemsCenter,
                globalStyle.py1p2,
              ]}
            >
              <View
                style={[
                  globalStyle.br,

                  {
                    width: 60,
                    height: 60,
                    backgroundColor: pallete.gray40,
                  },
                ]}
              />
              <View
                style={[
                  globalStyle.pl0p8,
                  globalStyle.flexOne,
                  {
                    gap: 4,
                  },
                ]}
              >
                <View
                  style={[
                    globalStyle.br,
                    globalStyle.w4,
                    {
                      height: 12,
                      backgroundColor: pallete.gray40,
                    },
                  ]}
                />
                <View
                  style={[
                    globalStyle.br,
                    globalStyle.w8,
                    {
                      height: 12,
                      backgroundColor: pallete.gray40,
                    },
                  ]}
                />
                <View
                  style={[
                    globalStyle.br,
                    globalStyle.w2,
                    {
                      height: 12,
                      backgroundColor: pallete.gray40,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
};

const HeaderView = ({
  isScrollingUp,
}: {
  translationY: SharedValue<number>;
  isScrollingUp: SharedValue<boolean>;
}) => {
  const STATUSBAR_HEIGHT = getStatusBarHeight();
  const marginTop = STATUSBAR_HEIGHT + 40;

  const headerStyle = useAnimatedStyle(() => ({
    paddingHorizontal: 20,

    marginTop: withTiming(!isScrollingUp.value ? 0 : marginTop, {
      duration: !isScrollingUp.value ? 100 : 300,
    }),
    position: !isScrollingUp.value ? "absolute" : "relative",
    zIndex: 10,
    backgroundColor: !isScrollingUp.value ? pallete.white : pallete.bgGray,
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(!isScrollingUp.value ? 0 : -20),
      },
    ],
    height: withTiming(!isScrollingUp.value ? 0 : 42, {
      duration: 300,
    }),
  }));
  const textInputStyle = useAnimatedStyle(() => ({
    paddingTop: withTiming(isScrollingUp.value ? 0 : STATUSBAR_HEIGHT),
  }));
  const tabItems = useMemo(
    () => [
      "All",
      "Trending",
      "NFTs",
      "Collectibles",
      "Art",
      "Gaming",
      "Music",
      "Sports",
      "Fashion",
      "Photography",
      "Videos",
    ],
    []
  );

  const [activeTab, setActiveTab] = useState(tabItems[0]);

  return (
    <Animated.View style={[headerStyle, globalStyle.pb1p2]}>
      <Animated.View style={[textStyle]}>
        <TextComponent
          style={[
            globalStyle.fontSize36,
            globalStyle.fontNunitoBold,
            globalStyle.fontWeight700,
          ]}
        >
          MarketPlace
        </TextComponent>
      </Animated.View>
      <Animated.View style={[textInputStyle]}>
        <Animated.View
          style={[
            globalStyle.w10,
            globalStyle.flexrow,
            globalStyle.alignItemsCenter,
            globalStyle.br,
            globalStyle.bgWhite,
            globalStyle.mt0p8,
          ]}
        >
          <View style={[globalStyle.px1p2]}>
            <Search size={18} color={pallete.black} />
          </View>

          <TextInput
            style={[
              globalStyle.w10,
              {
                height: 44,
              },
            ]}
            onFocus={() => (isScrollingUp.value = false)}
            onBlur={() => (isScrollingUp.value = true)}
            placeholder="Search marketplace"
          />
        </Animated.View>
      </Animated.View>

      <View style={[globalStyle.pt1p6]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            gap: 12,
          }}
        >
          {tabItems.map((item) => (
            <View
              key={item}
              style={[
                globalStyle.br,
                item === activeTab ? globalStyle.bgBlack : globalStyle.bgWhite,
                globalStyle.px1p2,
                globalStyle.py0p8,
              ]}
            >
              <Pressable onPress={() => setActiveTab(item)}>
                <TextComponent
                  style={[
                    item === activeTab
                      ? globalStyle.textWhitePrimary
                      : globalStyle.textBlackPrimary,
                    globalStyle.fontSize16,
                  ]}
                >
                  {item}
                </TextComponent>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

export default ScrollHeader;
