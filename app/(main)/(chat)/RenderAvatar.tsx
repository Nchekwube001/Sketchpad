import React, { FC } from "react";
import { ScaledSheet } from "react-native-size-matters";
import { Image, View } from "react-native";
import globalStyle from "@/globalStyle/globalStyle";
interface avatarProps {
  props: any;
}
const RenderAvatar: FC<avatarProps> = ({ props }) => {
  let current = props.currentMessage.user.avatar;
  return (
    <View style={[avatarStyle.avatar]}>
      <Image
        source={current ? { uri: current } : { uri: "" }}
        style={[globalStyle.w10, globalStyle.h10, globalStyle.br]}
      />
    </View>
  );
};

export const avatarStyle = ScaledSheet.create({
  avatar: {
    width: "28@s",
    height: "28@s",
    borderRadius: "26@s",
    // borderWidth: '2@s',
    // padding: '2@s',
    // borderColor: pallete.primary,
  },
});
export default RenderAvatar;
