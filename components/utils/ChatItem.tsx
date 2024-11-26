import React, { FC } from "react";
import Box from "../layout/Box";
import { Image, Pressable, Text, View } from "react-native";
import { createStyleSheet } from "react-native-unistyles";
import globalStyle from "@/globalStyle/globalStyle";
import { router } from "expo-router";
export const gazelleImage =
  "https://images.unsplash.com/photo-1580681477315-f272d1430746?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2F6ZWxsZXxlbnwwfHwwfHx8MA%3D%3D";
interface itemProp {
  item: any;
}
const ChatItem: FC<itemProp> = ({ item }) => {
  const itemMessages = item?.messages;
  return (
    <Pressable
      onPress={() => {
        router.navigate(`/chatscreen/${JSON.stringify(item)}`);
      }}
      style={[globalStyle.flexrow, globalStyle.alignItemsCenter]}
    >
      <View>
        <Image
          style={[chatItemStyle.img, globalStyle.br]}
          source={{
            uri: gazelleImage,
          }}
        />
      </View>
      <View style={[globalStyle.px0p8, globalStyle.flexOne]}>
        <Text style={[globalStyle.fontSize12, globalStyle.fontRobotoMedium]}>
          {item?.channelName}
        </Text>
        <Text style={[globalStyle.fontSize12, globalStyle.pt0p4]}>
          {itemMessages?.length > 0 ? "" : "Tap to chat"}
        </Text>
      </View>
      {itemMessages.length > 0 && (
        <View style={[globalStyle.alignItemsEnd, globalStyle.justifyCenter]}>
          <Text style={[globalStyle.fontSize10]}>25 mins ago</Text>
          <View
            style={[
              chatItemStyle.countBox,
              globalStyle.br,
              globalStyle.bgPrimary,
              globalStyle.justifyCenter,
              globalStyle.alignItemsCenter,
              globalStyle.mt0p4,
            ]}
          >
            <Text
              style={[globalStyle.fontSize10, globalStyle.textWhitePrimary]}
            >
              6
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

const chatItemStyle = createStyleSheet({
  img: {
    height: 45,
    width: 45,
  },
  countBox: {
    width: 15,
    height: 15,
  },
});
export default ChatItem;
