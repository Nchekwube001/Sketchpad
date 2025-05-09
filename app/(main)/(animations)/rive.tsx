import { View, Text } from "react-native";
import React from "react";
import Rive from "rive-react-native";

const RiveApp = () => {
  return (
    <Rive
      url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
      artboardName="Avatar 1"
      stateMachineName="avatar"
      style={{ width: 400, height: 400 }}
    />
  );
};

export default RiveApp;
