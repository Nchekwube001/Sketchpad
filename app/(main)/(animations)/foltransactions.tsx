import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import globalStyle from "@/globalStyle/globalStyle";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import TextComponent from "@/components/text/TextComponent";
import Entypo from "@expo/vector-icons/Entypo";
const topFlex = 0.5;
const imageSize = 40;
const gap = 8;
const messageHeight = 70;
const visibleItems = 3;
const colors = ["red", "green", "yellow", "blue", "purple"];
const FoldTransactions = () => {
  const folded = useSharedValue(false);
  const [text, setText] = useState("Fold");
  const onPress = () => {
    runOnJS(setText)(!folded.value ? "Unfold" : "Fold");
    folded.value = !folded.value;
  };
  const messages = [
    {
      name: "Yuji Itadori",
      message: "Hello There",
      time: "10:45 AM",
    },
    {
      name: "Satoru Gojo",
      message: "I am the strongest",
      time: "12:40 PM",
    },

    {
      name: "Megumi Fushiguro",
      message: "I am not a dog",
      time: "10:00 AM",
    },
    {
      name: "Nobara Kugisaki",
      message: "I am not a dog either",
      time: "10:01 AM",
    },
    {
      name: "Suzuki",
      message: "Calm Down",
      time: "11:12 PM",
    },
  ];
  const totalHeight = messages.length * messageHeight + messages.length * gap;

  const contentHeight = useDerivedValue(() => {
    return folded.value
      ? withTiming(messageHeight + visibleItems * gap)
      : withTiming(totalHeight);
  }, [folded.value, totalHeight]);
  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      height: contentHeight.value,
    };
  }, [contentHeight.value]);
  return (
    <View style={[globalStyle.flexOne, globalStyle.ptStatus]}>
      <View
        style={[
          globalStyle.bgWhite,
          globalStyle.borderRadius8,
          {
            flex: topFlex,
            marginHorizontal: 20,
          },
        ]}
      />
      <View
        style={[
          {
            flex: 1 - topFlex,
          },
        ]}
      >
        <View
          style={[
            globalStyle.py1p6,
            globalStyle.flexrow,
            globalStyle.alignItemsCenter,
            globalStyle.justifyBetween,
            globalStyle.px2,
          ]}
        >
          <TextComponent
            style={[globalStyle.fontRobotoBold, globalStyle.fontSize16]}
          >
            Messages
          </TextComponent>

          <Pressable
            style={[
              globalStyle.br,
              globalStyle.px1p5,
              globalStyle.py0p8,
              globalStyle.bgWhite,
              globalStyle.shadowRadius,
              globalStyle.borderInput,
              globalStyle.flexrow,
              globalStyle.alignItemsCenter,
            ]}
            onPress={onPress}
          >
            <TextComponent style={[globalStyle.pr0p4]}>{text}</TextComponent>
            <Entypo
              name={text === "Fold" ? "chevron-small-up" : "chevron-small-down"}
              size={18}
              color="black"
            />
          </Pressable>
        </View>
        <Animated.View style={[globalStyle.p2, globalStyle.flexOne]}>
          <Animated.ScrollView
            // key={`${folded.value}`}
            bounces={false}
            showsVerticalScrollIndicator={false}
            // style={[globalStyle.flexOne]}
            // contentContainerStyle={[animatedContentStyle]}
            // style={[
            //   {
            //     height: contentHeight,
            //   },
            // ]}
            // contentContainerStyle={[
            //   {
            //     height: contentHeight.value,
            //   },
            // ]}
          >
            <Animated.View style={[animatedContentStyle]}>
              {messages.map((item, index) => (
                <MessageView
                  folded={folded}
                  key={index.toString()}
                  index={index}
                  {...item}
                />
              ))}
            </Animated.View>
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </View>
  );
};

const MessageView = ({
  index,
  message,
  name,
  time,
  folded,
}: {
  message: string;
  index: number;
  name: string;
  time: string;
  folded: SharedValue<boolean>;
}) => {
  const style = useAnimatedStyle(
    () => ({
      position: "absolute",
      top: withTiming(
        folded.value ? index * 8 : index * messageHeight + index * gap
      ),
      zIndex: 50 - index,
      opacity: folded.value
        ? withTiming(index > visibleItems - 1 ? 0 : 1 - index * 0.2, {
            duration: 0.1,
          })
        : withTiming(1, {
            duration: 0.1,
          }),
      transform: [
        {
          scale: withTiming(
            folded.value ? (index > visibleItems - 1 ? 0 : 1 - index * 0.05) : 1
          ),
        },
      ],
    }),
    [folded.value, index]
  );
  //   const style = useAnimatedStyle(
  //     () => ({
  //       position: folded.value ? "absolute" : "relative",
  //       top: folded.value ? withTiming(index * 8) : undefined,
  //       zIndex: 50 - index,
  //       opacity: folded.value
  //         ? withTiming(index > visibleItems - 1 ? 0 : 1 - index * 0.2)
  //         : undefined,
  //       ...(folded.value
  //         ? {
  //             transform: [
  //               {
  //                 scale: withTiming(
  //                   index > visibleItems - 1 ? 0 : 1 - index * 0.05
  //                 ),
  //               },
  //             ],
  //           }
  //         : {}),
  //     }),
  //     [folded.value, index]
  //   );
  return (
    <Animated.View
      style={[
        globalStyle.bgWhite,
        globalStyle.borderRadius8,
        globalStyle.px1p2,
        globalStyle.shadowRadius,
        globalStyle.borderInput,
        globalStyle.flexrow,
        globalStyle.alignItemsCenter,
        globalStyle.w10,
        {
          height: messageHeight,
        },
        style,
      ]}
    >
      <View
        style={[
          globalStyle.br,
          {
            width: imageSize,
            height: imageSize,
            backgroundColor: colors[index % colors.length],
          },
        ]}
      />
      <View style={[globalStyle.flexOne, globalStyle.pl0p8]}>
        <View
          style={[
            globalStyle.flexrow,
            globalStyle.alignItemsCenter,
            globalStyle.justifyBetween,
          ]}
        >
          <TextComponent
            style={[globalStyle.fontRobotoBold, globalStyle.fontSize16]}
          >
            {name}
          </TextComponent>
          <TextComponent style={[globalStyle.textGray, globalStyle.fontSize12]}>
            {time}
          </TextComponent>
        </View>
        <TextComponent style={[globalStyle.pt0p4]}>{message}</TextComponent>
      </View>
    </Animated.View>
  );
};

export default FoldTransactions;
