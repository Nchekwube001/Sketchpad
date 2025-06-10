import { View, Text } from "react-native";
import React from "react";
import Box from "@/components/layout/Box";
import globalStyle from "@/globalStyle/globalStyle";
import Animated from "react-native-reanimated";
import TextComponent from "@/components/text/TextComponent";
import { SafeAreaView } from "react-native-safe-area-context";

const Scrolllength = () => {
  return (
    <SafeAreaView style={[globalStyle.flexOne, globalStyle.bgWhite]}>
      <Box style={[globalStyle.flexOne]}>
        <Box
          style={[
            globalStyle.px2,
            {
              //   marginTop: 40,
            },
          ]}
        >
          <Text style={[globalStyle.fontSize32, globalStyle.fontNunitoMedium]}>
            Article
          </Text>
        </Box>
        <Box style={[globalStyle.flexOne]}>
          <Animated.ScrollView>
            {new Array(120).fill("as").map((_, indx) => (
              <View key={indx.toString()}>
                <Text style={[globalStyle.textCenter, globalStyle.py2]}>
                  {Math.random().toString(36).substring(7)}
                </Text>
              </View>
            ))}
          </Animated.ScrollView>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default Scrolllength;
