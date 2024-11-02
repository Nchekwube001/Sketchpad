import {
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
} from "react-native";
import React, { FC, ReactElement, ReactNode } from "react";
import Box from "./Box";
import { RefreshControl } from "react-native";
import pallete from "@/constants/colors/pallete";
interface MainLayoutProps {
  children: ReactNode;
  grayBg?: boolean;
  refreshControl?: ReactElement;
  hideTouchable?: boolean;
  transparent?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}
const LayoutWithSafeArea: FC<MainLayoutProps> = ({
  children,
  hideTouchable,
  isRefreshing,
  onRefresh,
}) => {
  return (
    <Box className="h-screen bg-white">
      <StatusBar backgroundColor={pallete.white} barStyle={"light-content"} />
      <SafeAreaView className="h-screen bg-white">
        <Box className={"flex-1 bg-white"}>
          {hideTouchable ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={!!onRefresh}
              className="flex-1"
              refreshControl={
                onRefresh ? (
                  <RefreshControl
                    refreshing={!!isRefreshing}
                    progressBackgroundColor={pallete.white}
                    onRefresh={onRefresh}
                    tintColor={pallete.black}
                  />
                ) : undefined
              }
            >
              {children}
            </ScrollView>
          ) : (
            <TouchableWithoutFeedback
              accessible={false}
              onPress={Keyboard.dismiss}
              className="flex-1"
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={!!onRefresh}
                className="flex-1"
                refreshControl={
                  onRefresh ? (
                    <RefreshControl
                      refreshing={!!isRefreshing}
                      progressBackgroundColor={pallete.white}
                      onRefresh={onRefresh}
                      tintColor={pallete.black}
                    />
                  ) : undefined
                }
              >
                {children}
              </ScrollView>
            </TouchableWithoutFeedback>
          )}
        </Box>
      </SafeAreaView>
    </Box>
  );
};

export default LayoutWithSafeArea;
