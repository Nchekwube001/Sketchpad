import { View, Text, TextInput } from "react-native";
import React from "react";
import Box from "@/components/layout/Box";
import globalStyle, { width } from "@/globalStyle/globalStyle";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ChevronLeft, Download, Search } from "lucide-react-native";
import pallete from "@/constants/colors/pallete";
import LayoutWithSafeArea from "@/components/layout/LayoutWithSafeArea";
import { SafeAreaView } from "react-native-safe-area-context";
const _mainHeight = 40;
const _spacing = 16;
const _searchWidth = _mainHeight + _spacing * 2;

const SearchAnimation = () => {
  const translateX = useSharedValue(-_mainHeight);
  const searchStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));
  return (
    <Box style={[globalStyle.flexOne, globalStyle.bgBlack]}>
      <SafeAreaView>
        <Animated.View
          style={[
            globalStyle.flexrow,
            globalStyle.alignItemsCenter,
            {
              gap: _spacing,
            },
            searchStyle,
          ]}
        >
          <Box
            style={[
              globalStyle.justifyCenter,
              globalStyle.alignItemsCenter,

              {
                height: _mainHeight,
                aspectRatio: 1,
                borderWidth: 1,
                borderRadius: _mainHeight,
                borderColor: pallete.gray,
                backgroundColor: pallete.shadowBg,
              },
            ]}
          >
            <ChevronLeft
              color={pallete.primaryGrey50}
              size={_mainHeight * 0.45}
            />
          </Box>
          <Box
            style={[
              globalStyle.flexrow,
              globalStyle.alignItemsCenter,
              {
                height: _mainHeight,
                backgroundColor: pallete.shadowBg,
                borderWidth: 1,
                borderRadius: _mainHeight,
                borderColor: pallete.gray,
                width: width - _searchWidth,
                gap: _spacing,
                paddingHorizontal: _spacing,
              },
            ]}
          >
            <Search color={pallete.primaryGrey50} size={_mainHeight * 0.45} />

            <TextInput
              placeholder="Search"
              col
              style={[globalStyle.flexOne, globalStyle.h10]}
            />
          </Box>

          <Box
            style={[
              globalStyle.justifyCenter,
              globalStyle.alignItemsCenter,

              {
                height: _mainHeight,
                aspectRatio: 1,
                borderWidth: 1,
                borderRadius: _mainHeight,
                borderColor: pallete.gray,
                backgroundColor: pallete.shadowBg,
              },
            ]}
          >
            <Download color={pallete.primaryGrey50} size={_mainHeight * 0.45} />
          </Box>
        </Animated.View>
      </SafeAreaView>
    </Box>
  );
};

export default SearchAnimation;
