import { View, Text } from "react-native";
import React, { useState } from "react";
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from "react-native-webrtc";
let cameraCount = 0;
let mediaConstraints = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: "user",
  },
};
try {
  const devices: any = await mediaDevices.enumerateDevices();

  devices.map((device: any) => {
    if (device.kind != "videoinput") {
      return;
    }

    cameraCount = cameraCount + 1;
  });
} catch (err) {
  // Handle Error
}
const Webrtc = () => {
  // Stream of local user
  const [localStream, setlocalStream] = useState(null);

  /* When a call is connected, the video stream from the receiver is appended to this state in the stream*/
  const [remoteStream, setRemoteStream] = useState(null);
  return (
    <View>
      <Text>Webrtc</Text>
    </View>
  );
};

export default Webrtc;
