import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
// import ChevronLeftLight from "@/assets/svgs/chevronLeftLight";
import { useNavigation } from "@react-navigation/native";
import { ScaledSheet } from "react-native-size-matters";
// import FastImageComponent from '../../../components/fastImage/FastImageComponent';
// import {gazelleImage} from '../../../components/header/LogoHeader';
// import {randomisedIDs} from '../../../constants/utils/utils';
import { GiftedChat } from "react-native-gifted-chat";
import { randomisedIDs } from "@/constants/utils/constants";
import { gazelleImage } from "@/components/utils/ChatItem";
import { Image, Pressable, TextInput, View } from "react-native";
import globalStyle from "@/globalStyle/globalStyle";
import TextComponent from "@/components/text/TextComponent";
import pallete from "@/constants/colors/pallete";
import RenderBubble from "../RenderBubble";
import { router, useLocalSearchParams } from "expo-router";
import socketInstance from "../socketInstance";
// import RenderBubble from '../../../components/chats/RenderBubble';
// import ChatInputComponent from '../../../components/textInput/ChatInput';

const ChatScreen = () => {
  const { item } = useLocalSearchParams<{ item: any }>();
  const routeParams = JSON.parse(item);
  useEffect(() => {
    socketInstance.emit("findGroup", routeParams?.id);
    socketInstance.on("foundGroup", (allChats) => {
      const formattedMessage = allChats?.map((chatItem: any) => ({
        _id: chatItem?.id,
        _d: chatItem?.id,
        createdAt: chatItem?.createdAt,
        text: chatItem?.message,
        user: chatItem?.user,
      }));
      //    setMessages((previousMessages) =>
      //      GiftedChat.append(previousMessages, message)
      //    );
      setMessages(GiftedChat.append([], formattedMessage));
      console.log({
        "--------all chats-------": allChats,
      });
    });
  }, []);
  const userType = {
    name: "",
    email: "",
    avatar: "",
  };
  //  --> fetch all chats from network in the background
  const localStateChannels = [
    {
      uuid: "camelcase",
      channelName: "Camel case dev team",
      channelType: "", //'oneonone'|'multiUser',
      users: [{ ...userType }],
      initatitor: userType,
      chatCreatedAt: "",
      chatLastMessageDate: "",
      chats: [
        // ----last 5 items of chats
        {
          messageType: "", // text|media|'contact'|'call history',
          message: "hello",
          attachments: [
            {
              attachmentType: "", //'video'|'audio'|'photo'|'document'
              attachmentUrl: {
                main: "",
                "@1x1": "",
              },
              icon: "",
              thumbnail: "",
            },
          ], //object array,
          status: "sent", //"pending"|'sent'|'read'|'delivered'
          id: "400",
          channelId: "camelcase",
          user: userType,
        },
      ],
    },
  ];
  //   const localStateChat = [
  //     {
  //       message: "hello",
  //       status: "sent",
  //       id: "400",
  //       channelId: "camelcase",
  //       user: {},
  //     },
  //   ];
  const onPress = () => {};
  const userDetails = useMemo(() => {
    return {
      createdAt: 1,
      _id: 1,
      name: "Francisco",
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
    };
  }, []);
  const [messages, setMessages] = useState<any[]>([
    // {
    //   _id: 1,
    //   text: "Hello developerc",
    //   //   text: 'Hello developer lore  dasvasvasvdsadv ncbc bb d d dsbkdbcxjkcbxzkcbxbzxn vzxb xvx x bx xvx vxcxnbcnxcvxcnbxv bnx xnxbvnxbvnbvxbbvnbvxnzbvc',
    //   createdAt: new Date(),
    //   user: userDetails,
    // },
    // {
    //   _id: 2,
    //   text: "Hi there",
    //   createdAt: new Date(),
    //   user: {
    //     _id: 5,
    //     name: "React",
    //     avatar: gazelleImage,
    //   },
    // },
  ]);
  const [customText, setCustomText] = useState("");

  const customOnSend = () => {
    const newMessage = [
      {
        _id: randomisedIDs(),
        createdAt: new Date(),
        text: customText,
        user: userDetails,
      },
    ];
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessage)
    );
    setCustomText("");
  };

  const onSend = useCallback((message: any = []) => {
    console.log({
      message,
    });
    //   "message": [{"_id": "ce072bd6-cff0-41a3-9f7e-9d587901ff81", "createdAt": 2024-11-26T06:54:43.363Z, "text": "Hi", "user": [Object]}]
    const currentMessage = message?.[0] ?? {};
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, message)
    // );
    socketInstance.emit("newChatMessage", {
      id: routeParams?.id,
      message: currentMessage?.text ?? "",
      //   user: currentMessage?.user ?? {},
      user: userDetails,
      createdAt: currentMessage?.createdAt ?? "",
    });
    setCustomText("");
  }, []);
  return (
    <View style={[globalStyle.flexOne, globalStyle.bgWhite]}>
      <View
        style={[
          globalStyle.absolute,
          globalStyle.w10,
          globalStyle.flexrow,
          globalStyle.justifyBetween,
          globalStyle.bgTransparent,
          globalStyle.pt1p6,
          globalStyle.px2p4,
          {
            zIndex: 30,
          },
        ]}
      >
        <View style={[globalStyle.flexrow, globalStyle.alignItemsCenter]}>
          <Pressable
            style={[
              headerStyle.arrow as any,
              // globalStyle.justifyCenter,
              globalStyle.alignItemsCenter,
              globalStyle.flexrow,
              // {
              //   borderColor: darkMode ? palette.grey0Dark : palette.grey0,
              // },
            ]}
            onPress={router.back}
          >
            {/* {<ChevronLeftLight />} */}
          </Pressable>
          <View>
            <Image
              source={{ uri: gazelleImage }}
              style={[chatStyle.imageBox, globalStyle.br, globalStyle.mr0p8]}
            />
          </View>
          <View
            style={[
              globalStyle.flexrow,
              //   globalStyle.w10,
              globalStyle.justifyCenter,
            ]}
          >
            <TextComponent
              style={[
                globalStyle.fontWeight700,
                globalStyle.fontSize16,
                globalStyle.fontNunitoRegular,
              ]}
            >
              {routeParams?.channelName ?? ""}
            </TextComponent>
          </View>
        </View>

        <Pressable
          style={[
            headerStyle.arrow as any,
            globalStyle.justifyCenter,
            globalStyle.alignItemsCenter,
            globalStyle.flexrow,
          ]}
          onPress={onPress}
        >
          {/* <TextComponent>t</TextComponent> */}
          <Ionicons
            name="ellipsis-vertical-outline"
            size={22}
            color={pallete.darkInput_bg}
          />
        </Pressable>
      </View>

      <View style={[globalStyle.flexOne]}>
        <GiftedChat
          text={customText}
          onInputTextChanged={setCustomText}
          messages={messages}
          //   renderInputToolbar={() => (
          //     <TextInput
          //       value={customText}
          //       onChangeText={setCustomText}
          //       placeholder="Write a message.."
          //       onPress={customOnSend}
          //       style={[
          //         {
          //           height: 40,
          //           width: "100%",
          //         },
          //       ]}
          //     />
          //   )}
          renderAvatar={() => <></>}
          renderBubble={(props) => (
            <RenderBubble
              props={props}
              currentUserId={userDetails?._id?.toString()}
            />
          )}
          onSend={onSend}
          // user={userDetails}
        />
      </View>
    </View>
  );
};

const chatStyle = ScaledSheet.create({
  imageBox: {
    width: "32@s",
    height: "32@s",
  },
});
export const headerStyle = ScaledSheet.create({
  arrow: {
    borderRadius: "8@s",
    // borderWidth: 1,
    height: "30@s",
    width: "30@s",
    // borderColor: palette.red0,
  },
});

export default ChatScreen;
