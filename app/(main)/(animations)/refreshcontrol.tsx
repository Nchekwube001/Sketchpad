import { View, Text, ScrollView } from "react-native";
import React from "react";
import { RefreshControl } from "react-native-gesture-handler";
import { ArrowUpFromDot } from "lucide-react-native";

const refreshcontrol = () => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        // refreshControl={
        //   <ArrowUpFromDot />

        // }
      >
        {new Array(100).fill(0).map((_, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
            }}
          >
            <Text>{index}</Text>
            <ArrowUpFromDot />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default refreshcontrol;
