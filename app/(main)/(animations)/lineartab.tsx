import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const TabData = [
  { id: "0", title: "All Issues" },
  { id: "1", title: "Active" },
  { id: "2", title: "Backlog" },
  { id: "3", title: "Current" },
];

const Main = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("");
  console.log({
    activeTab,
  });

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ alignItems: "center" }}
    >
      <TabBar
        tabs={TabData}
        onChangeTab={setActiveTab}
        activeTab={activeTab}
        tabBarContainerStyle={styles.tabBarContainerStyle}
        tabStyle={[styles.tabStyle, { borderColor: theme.colors.border }]}
        indicatorStyle={[
          styles.indicatorStyle,
          { backgroundColor: theme.colors.border },
        ]}
        tabBarTextStyle={[styles.tabBarTextStyle, { color: theme.colors.text }]}
      />
    </ScrollView>
  );
};

export default Main;

import { Text, TextStyle, View, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ViewStyle } from "react-native";

type TTab = {
  id: string;
  title: string;
};

type TTabBar = {
  tabs: TTab[];
  activeTab: string;
  onChangeTab: (id: string) => void;
  tabBarContainerStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  tabBarTextStyle?: StyleProp<TextStyle>;
};

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

type TCurrentTabLayout = Record<string, TTabLayout>;

const TabBar = ({
  activeTab,
  tabs,
  onChangeTab,
  tabBarContainerStyle,
  indicatorStyle,
  tabBarTextStyle,
  tabStyle,
}: TTabBar) => {
  const activeTabLayout = useSharedValue<TTabLayout>(initialTabLayout);
  const [layouts, setLayouts] = useState<TCurrentTabLayout>({});

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

  const onHandlePress = (item: TTab) => {
    onChangeTab(item.id);
    activeTabLayout.value = withTiming(layouts[item.id]);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: activeTabLayout.value.height,
      top: activeTabLayout.value.y,
      width: activeTabLayout.value.width,
      left: activeTabLayout.value.x,
    };
  });

  return (
    <View>
      <Animated.View
        style={[animatedStyle, styles.baseIndicatorStyle, indicatorStyle]}
      />
      <View style={[styles.baseTabBarContainerStyle, tabBarContainerStyle]}>
        {tabs.map((item, index) => (
          <Pressable
            disabled={item.id === activeTab}
            key={item.id}
            onPress={() => onHandlePress(item)}
            onLayout={(event) => handleLayout(item.id, event, index)}
            style={tabStyle}
          >
            <Text style={tabBarTextStyle}>{item.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    paddingVertical: 20,
  },
  tabBarContainerStyle: {
    gap: 10,
  },
  tabStyle: {
    borderWidth: 1,
    borderRadius: 10,
  },
  indicatorStyle: {
    borderRadius: 10,
  },
  tabBarTextStyle: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: "500",
    opacity: 0.7,
  },
  baseTabBarContainerStyle: {
    flexDirection: "row",
  },
  baseIndicatorStyle: {
    position: "absolute",
  },
});
