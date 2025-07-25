import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import globalStyle from "@/globalStyle/globalStyle";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  HomeIcon,
  Workflow,
  MessageSquare,
  Settings,
  ArrowLeft,
  Send,
  SpeechIcon,
  PlusSquareIcon,
  Sparkle,
} from "lucide-react-native";
import pallete from "@/constants/colors/pallete";
import { SafeAreaView } from "react-native-safe-area-context";
import TextComponent from "@/components/text/TextComponent";
import { router } from "expo-router";
const Bottomtabitems = () => {
  const animationVal = useSharedValue(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [postContent, setPostContent] = useState("");
  const tabItems = [
    {
      title: "Home",
      icon: <HomeIcon color={pallete.black} />,
    },
    {
      title: "Workflow",
      icon: <Workflow color={pallete.GrayText} />,
    },
    {
      title: "Add",
      icon: <PlusSquareIcon color={pallete.white} />,
      onPress: () => {
        animationVal.value = withTiming(animationVal.value === 0 ? 1 : 0);
      },
      childer: [
        {
          title: "Home1",
          icon: <HomeIcon color={pallete.white} size={18} />,
        },
        {
          title: "Workflow1",
          icon: <Workflow color={pallete.white} size={18} />,
        },
        {
          title: "Settings1",
          icon: <Settings color={pallete.white} size={18} />,
        },
        {
          title: "Home",
          icon: <HomeIcon color={pallete.white} size={18} />,
        },
        {
          title: "Workflow",
          icon: <Workflow color={pallete.white} size={18} />,
        },
        {
          title: "Settings",
          icon: <Settings color={pallete.white} size={18} />,
        },
      ],
    },
    {
      title: "Chat",
      icon: <MessageSquare color={pallete.GrayText} />,
      onPress: () => {
        // panHeight.value = withTiming(_first_step);
      },
    },
    {
      title: "Settings",
      icon: <Settings color={pallete.GrayText} />,
    },
  ];
  // "origin": "https://expo-api-routes-video.expo.app"

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    // const response = await fetch("api/post");
    const response = await fetch("http://localhost:8081/api/post");
    const data = await response.json();
    console.log({
      data,
    });
    setPosts(data);
  }

  return (
    <View style={[globalStyle.flexOne]}>
      <SafeAreaView
        style={[
          globalStyle.flexOne,
          globalStyle.alignItemsCenter,
          globalStyle.justifyEnd,
        ]}
      >
        <View style={[globalStyle.flexOne, globalStyle.w10, globalStyle.pb3]}>
          <ScrollView contentContainerStyle={[globalStyle.px2]}>
            <TextComponent style={[globalStyle.fontSize32]}>Home</TextComponent>
            <TextComponent style={[globalStyle.textGray, globalStyle.pt2p4]}>
              Create Post
            </TextComponent>
            <View
              style={[
                globalStyle.bgGray,
                globalStyle.p1p2,
                globalStyle.borderRadius16,
                globalStyle.flexrow,
                globalStyle.alignItemsCenter,
                globalStyle.mt1p2,
                { gap: 16 },
              ]}
            >
              <View style={[globalStyle.flexOne]}>
                <TextInput
                  value={postContent}
                  onChangeText={setPostContent}
                  placeholder="What's on your mind"
                  style={[
                    globalStyle.w10,
                    globalStyle.borderGray,
                    globalStyle.borderRadius8,
                    globalStyle.px0p8,
                    {
                      height: 46,
                    },
                  ]}
                />
              </View>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/postanalysis",
                    params: { postContent },
                  });
                }}
              >
                <Sparkle color={pallete.orange10} size={28} />
              </Pressable>
            </View>
          </ScrollView>
        </View>
        <Animated.View
          style={[
            globalStyle.flexrow,
            globalStyle.alignItemsCenter,
            globalStyle.justifyEvenly,
          ]}
        >
          {tabItems.map(({ icon, title, onPress, childer }) => (
            <Animated.View
              key={title}
              style={[
                globalStyle.flexOne,
                globalStyle.justifyCenter,
                globalStyle.alignItemsCenter,
                // globalStyle.flexrow,
                title === "Add" && {
                  top: -30,
                },
              ]}
            >
              {title === "Add" && (
                <View
                  style={[
                    globalStyle.flexrow,
                    globalStyle.alignItemsCenter,
                    globalStyle.justifyCenter,
                    globalStyle.absolute,
                    globalStyle.flexOne,
                    {
                      gap: 8,
                    },
                  ]}
                >
                  {childer &&
                    childer.map(({ icon, title }, index) => {
                      const totalAngle = Math.PI;
                      const startAngle = (Math.PI - totalAngle) / 2;
                      const angleStep =
                        totalAngle / (childer.length + startAngle);
                      const radius = 80;
                      const angle = angleStep * (index + angleStep / 2);
                      const x = useDerivedValue(
                        () => radius * Math.cos(angle) * animationVal.value
                      );
                      const y = useDerivedValue(
                        () => radius * Math.sin(angle) * animationVal.value
                      );
                      // const totalAngle = Math.PI;
                      // const startAngle = (Math.PI - totalAngle) / 2;
                      // const angleStep =
                      //   totalAngle / (childer.length + startAngle);
                      // const radius = 80;
                      // const angle = angleStep * (index + angleStep / 2);
                      // const x = useDerivedValue(
                      //   () => radius * Math.cos(angle) * animationVal.value
                      // );
                      // const y = useDerivedValue(
                      //   () => radius * Math.sin(angle) * animationVal.value
                      // );

                      const childStyle = useAnimatedStyle(() => ({
                        opacity: animationVal.value,
                        transform: [
                          {
                            translateX: -x.value,
                          },
                          {
                            translateY: -y.value,
                          },
                          {
                            rotate: `${interpolate(
                              animationVal.value,
                              [0, 0.5, 1],
                              [180, 180, 0]
                            )}deg`,
                          },
                        ],
                      }));
                      return (
                        <Animated.View
                          key={title}
                          style={[
                            globalStyle.justifyCenter,
                            globalStyle.alignItemsCenter,
                            globalStyle.bgBlack,
                            globalStyle.br,
                            globalStyle.absolute,
                            childStyle,

                            {
                              width: 30,
                              height: 30,
                            },
                          ]}
                        >
                          <Pressable
                            onPress={onPress}
                            style={[
                              globalStyle.justifyCenter,
                              globalStyle.alignItemsCenter,
                            ]}
                          >
                            {icon}
                          </Pressable>
                        </Animated.View>
                      );
                    })}
                </View>
              )}
              <View>
                {title === "Add" ? (
                  <Pressable
                    onPress={onPress}
                    style={[
                      globalStyle.justifyCenter,
                      globalStyle.alignItemsCenter,
                      //   globalStyle.flexOne,
                      {
                        backgroundColor: pallete.black,
                        width: 60,
                        height: 60,
                        borderRadius: 200,
                      },
                    ]}
                  >
                    {icon}
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={onPress}
                    style={[
                      globalStyle.justifyCenter,
                      globalStyle.alignItemsCenter,
                    ]}
                  >
                    {icon}
                  </Pressable>
                )}
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

export default Bottomtabitems;
