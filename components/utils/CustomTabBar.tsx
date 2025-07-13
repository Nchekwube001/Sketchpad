import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { History, HomeIcon, User, Users } from "lucide-react-native";
import { useState } from "react";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Box from "../layout/Box";
import globalStyle from "@/globalStyle/globalStyle";
import pallete from "@/constants/colors/pallete";
import { Pressable } from "react-native";

type TCurrentTabLayout = Record<string, TTabLayout>;

type TTabLayout = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const initialTabLayout = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};
const AnimatedPlatformPressable = Animated.createAnimatedComponent(Pressable);

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  // const {buildHref} = useLinkBuilder();
  const activeTabLayout = useSharedValue<TTabLayout>(initialTabLayout);
  const [layouts, setLayouts] = useState<TCurrentTabLayout>({});
  const [activeTab, setActiveTab] = useState("home");

  const handleLayout = (id: string, event: any, index: number) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    if (id === activeTab || index === 0) {
      activeTabLayout.value = { width, height, x, y };
    }
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      [id]: { width, height, x, y },
    }));
  };
  const onHandlePress = (id: string) => {
    setActiveTab(id);
    activeTabLayout.value = withTiming(layouts[id]);
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: activeTabLayout.value.height,
      top: activeTabLayout.value.y,
      width: activeTabLayout.value.width,
      left: withTiming(activeTabLayout.value.x, {
        duration: 200,
        easing: Easing.linear,
      }),
    };
  });
  return (
    <Animated.View
      layout={LinearTransition}
      style={[
        globalStyle.absolute,
        globalStyle.w8p3,
        globalStyle.borderRadius,
        globalStyle.justifyCenter,
        globalStyle.alignItemsCenter,
        globalStyle.p1p2,
        {
          flexDirection: "row",
          // boxShadow: '0 6px 8px rgba(255, 255, 255, 0.25)',
          alignSelf: "center",
          bottom: 12,
          backgroundColor: pallete.mainBg,
        },
      ]}
    >
      <Animated.View
        style={[
          animatedStyle,
          globalStyle.absolute,
          globalStyle.br,
          globalStyle.h10,
          {
            backgroundColor: pallete.pastelBlue500,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        if (["_sitemap", "+not-found"].includes(route.name)) {
          return null; // Skip these routes
        }
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = (index: string) => {
          onHandlePress(index);

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const color = isFocused ? pallete.white : pallete.GrayText;

        return (
          <AnimatedPlatformPressable
            layout={LinearTransition.springify().mass(0.5)}
            key={route.name}
            onLayout={(event) => handleLayout(label as string, event, index)}
            // href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={() => onPress(label as string)}
            onLongPress={onLongPress}
            style={[
              globalStyle.flexrow,
              globalStyle.borderRadius,
              globalStyle.justifyCenter,
              globalStyle.alignItemsCenter,
              globalStyle.px2,
              {
                backgroundColor: "transparent",
                // boxShadow: '0 6px 8px rgba(255, 255, 255, 0.25)',
                height: 36,
              },
            ]}
          >
            <Box style={[]}>{getIconByRouteName(route.name, color)}</Box>
            {isFocused && (
              <Animated.Text
                entering={FadeIn.delay(50).duration(250)}
                exiting={FadeOut}
                style={[
                  globalStyle.fontNunitoRegular,
                  globalStyle.pl0p4,
                  {
                    color: color,
                  },
                ]}
              >
                {capitalizeFirstLetter(label as string)}
              </Animated.Text>
            )}
          </AnimatedPlatformPressable>
        );
      })}
    </Animated.View>
  );
}

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
function getIconByRouteName(routeName: string, color: string, size = 18) {
  switch (routeName) {
    case "home":
      return <HomeIcon size={size} color={color} />;
    case "guardians":
      return <Users size={size} color={color} />;
    case "profile":
      return <User size={size} color={color} />;
    case "history":
      return <History size={size} color={color} />;
    default:
      return null;
  }
}
