import moment from "moment";
import React, { FC } from "react";
import { ScaledSheet } from "react-native-size-matters";
import RenderAvatar, { avatarStyle } from "./RenderAvatar";
import globalStyle from "@/globalStyle/globalStyle";
import { Text, View } from "react-native";
import pallete from "@/constants/colors/pallete";

interface bubbleProps {
  props: any;
  currentUserId?: string;
}

const RenderBubble: FC<bubbleProps> = ({ props, currentUserId }) => {
  const userId = props.currentMessage?.user?._id?.toString();
  const nextUserId = props?.nextMessage?.user?._id?.toString();
  // console.log({
  //   nextUserId,
  // });

  let messageBelongsToCurrentUser = userId === currentUserId;
  let nextMessageBelongsToCurrentUser = nextUserId === userId;
  return (
    <View
      style={[
        globalStyle.flexOne,
        globalStyle.flexrow,
        globalStyle.w10,
        // messageBelongsToCurrentUser && globalStyle.justifyEnd,
        messageBelongsToCurrentUser && globalStyle.flexrowReverse,
        globalStyle.alignItemsEnd,
        // globalStyle.bgPrimary,
        // messageBelongsToCurrentUser && globalStyle.bgBlack,
      ]}
    >
      <View style={[globalStyle.px0p8]}>
        {!nextMessageBelongsToCurrentUser && <RenderAvatar props={props} />}
        {nextMessageBelongsToCurrentUser && (
          <View style={[avatarStyle.avatar]} />
        )}
      </View>
      <View
        style={[
          globalStyle.borderRadius6,
          messageBelongsToCurrentUser
            ? renderStyle.bgSender
            : renderStyle.bgReceiver,
          renderStyle.max,
        ]}
      >
        <View
          key={props?.currentMessage?.timestamp?.toString()}
          style={[
            globalStyle.py1,
            globalStyle.px1p5,
            globalStyle.borderRadius16,
          ]}
        >
          <Text style={[globalStyle.fontSize12]}>
            {props?.currentMessage?.text}
          </Text>
          <View
            style={[
              globalStyle.mt0p5,
              globalStyle.flexrow,
              globalStyle.justifyEnd,
            ]}
          >
            <Text
              // secondary={messageBelongsToCurrentUser}
              style={[globalStyle.fontSize8, globalStyle.fontRobotoLight]}
            >
              {moment(props?.currentMessage?.timestamp).format("LT")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const renderStyle = ScaledSheet.create({
  bgSender: {
    backgroundColor: pallete.bgSender,
  },
  bgReceiver: {
    backgroundColor: pallete.bgReceiver,
  },
  max: {
    maxWidth: "80%",
  },
});

export default RenderBubble;
