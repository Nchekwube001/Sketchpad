import CustomTabBar from "@/components/utils/CustomTabBar";
import pallete from "@/constants/colors/pallete";
import globalStyle from "@/globalStyle/globalStyle";
import { Tabs } from "expo-router";
import { HomeIcon } from "lucide-react-native";
import React from "react";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: [globalStyle.fontSize10, globalStyle.fontWeight500],
          tabBarActiveTintColor: pallete.pastelBlue500,
          tabBarInactiveTintColor: pallete.GrayText,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => {
              return focused ? <HomeIcon /> : <HomeIcon />;
            },
          }}
        />
        <Tabs.Screen name="guardians" />
      </Tabs>
    </>
  );
}
