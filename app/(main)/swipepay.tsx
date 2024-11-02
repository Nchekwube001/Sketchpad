import React from "react";
import LayoutWithSafeArea from "@/components/layout/LayoutWithSafeArea";
import Box from "@/components/layout/Box";
import { Text } from "react-native";
import SwipeToPay from "@/components/utils/SwipeToPay";
import TextComponent from "@/components/text/TextComponent";

const SwipePay = () => {
  return (
    <Box className="h-screen bg-white flex-col justify-end items-center pb-[40px] w-full px-8">
      <Box className="w-full">
        {/* <TextComponent>ddndjd</TextComponent> */}
        <SwipeToPay enabled onSwipe={() => {}} />
      </Box>
    </Box>
  );
};

export default SwipePay;
