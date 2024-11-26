import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import pallete from "@/constants/colors/pallete";
import ChatItem from "@/components/utils/ChatItem";
import socketInstance from "./socketInstance";

const defChannels = ["Emery Barbosa", "Bukayo Saka", "Smith rowe"];
const Messagehome = () => {
  const [channels, setChannels] = useState<any[]>([]);
  const createGroups = useCallback(() => {
    defChannels.forEach((channel) => {
      socketInstance.emit("createChannel", channel);
    });
  }, []);
  const getChannels = useCallback(() => {
    socketInstance.emit("getAllGroups");
    socketInstance.on("groupList", (groupInfos) => {
      console.log({
        groupInfos,
      });
      setChannels(groupInfos);
    });
  }, []);

  useEffect(() => {
    createGroups();
  }, []);
  useEffect(() => {
    getChannels();
  }, []);

  return (
    <View className="flex-1 w-full h-full bgw pt-10 bg-white">
      <FlatList
        showsVerticalScrollIndicator={false}
        className="flex-1"
        // contentContainerStyle={[globalStyle.px2p4]}
        data={channels}
        keyExtractor={() => Math.random().toString().slice(2, 9)}
        renderItem={({ item }) => (
          <View className="pb-9 w-full px-5">
            <ChatItem item={item} />
          </View>
        )}
      />
    </View>
  );
};
export const messageStyle = StyleSheet.create({
  indicatorStyle: {
    borderColor: pallete.accentBlue600,
    borderBottomWidth: 2,
  },
});
export default Messagehome;
