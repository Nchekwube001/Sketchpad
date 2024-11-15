import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutLeft,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Foundation from "@expo/vector-icons/Foundation";
const AnimatedCreate = () => {
  const [showItems, setShowItems] = useState(true);
  return (
    <View className="bg-white flex-1 justify-center items-center">
      <Animated.View
        className={`bg-gray-100  
            ${
              //   showItems ? "rounded-xl" : "rounded-full"
              showItems ? "rounded-xl" : "rounded-xl"
            }
         border-gray-200 border-[1px]`}
        layout={LinearTransition.duration(450)}
      >
        <Pressable
          className=""
          onPress={() => {
            setShowItems(true);
          }}
        >
          <View className={`flex-row justify-between items-center py-5 px-4`}>
            <View className="flex-row items-center">
              {!showItems && (
                <Animated.View
                  key={`${showItems}`}
                  entering={FadeIn.delay(150)}
                  exiting={FadeOut}
                >
                  <Entypo name="plus" size={20} color="black" />
                </Animated.View>
              )}
              <Animated.View
                key={`${showItems}-create`}
                entering={FadeIn}
                exiting={FadeOut}
              >
                <Text className="text-black font-semibold">Create New</Text>
              </Animated.View>
            </View>
            {showItems && (
              <Animated.View
                key={`${showItems}-items`}
                entering={FadeInDown.delay(300)}
                exiting={FadeOutLeft}
              >
                <Pressable
                  onPress={() => {
                    setShowItems(false);
                  }}
                >
                  <Ionicons name="close-circle" size={20} color="black" />
                </Pressable>
              </Animated.View>
            )}
          </View>
          {showItems && (
            <Animated.View
              key={`${showItems}-items`}
              entering={FadeInDown.delay(300)}
              exiting={FadeOutDown}
            >
              <View className="bg-white px-4 rounded-xl">
                <View className="flex-row justify-between items-center">
                  <Item
                    icon={
                      <Octicons name="briefcase" size={20} color="gray" />
                      //   <MaterialCommunityIcons
                      //     name="briefcase-variant-outline"
                      //     size={20}
                      //     color="gray"
                      //   />
                    }
                    text="Project"
                  />
                  <Item
                    icon={<Octicons name="tasklist" size={20} color="gray" />}
                    text="Task"
                  />
                  <Item
                    icon={
                      <SimpleLineIcons name="notebook" size={20} color="gray" />
                    }
                    text="Note"
                  />
                </View>
              </View>
              <View className="bg-white px-4 rounded-xl">
                <View className="flex-row justify-between items-center">
                  <Item
                    icon={<Foundation name="target" size={20} color="gray" />}
                    text="Goal"
                  />
                  <Item
                    icon={
                      <Ionicons name="golf-outline" size={20} color="gray" />
                    }
                    text="Milestone"
                  />
                  <Item
                    icon={<Entypo name="calendar" size={20} color="gray" />}
                    text="Reminder"
                  />
                </View>
              </View>
            </Animated.View>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const Item = ({ text, icon }: { text: string; icon: any }) => {
  return (
    <View className="justify-center items-center w-24 h-24">
      {icon}
      <Text>{text}</Text>
    </View>
  );
};
export default AnimatedCreate;
