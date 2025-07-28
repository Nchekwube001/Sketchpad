import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import globalStyle from "@/globalStyle/globalStyle";
// let cameraCount = 0;
// let mediaConstraints = {
//   audio: true,
//   video: {
//     frameRate: 30,
//     facingMode: "user",
//   },
// };
// try {
//   const devices: any = await mediaDevices.enumerateDevices();

//   devices.map((device: any) => {
//     if (device.kind != "videoinput") {
//       return;
//     }

//     cameraCount = cameraCount + 1;
//   });
// } catch (err) {
//   // Handle Error
// }
const Webrtc = () => {
  // Stream of local user
  const [localStream, setlocalStream] = useState<MediaStream | null>(null);

  /* When a call is connected, the video stream from the receiver is appended to this state in the stream*/
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  // Handling Mic status
  const [localMicOn, setlocalMicOn] = useState(true);

  // Handling Camera status
  const [localWebcamOn, setlocalWebcamOn] = useState(true);

  // Switch Camera
  function switchCamera() {
    localStream?.getVideoTracks().forEach((track) => {
      track.applyConstraints({
        // facingMode: isFront ? "user" : "environment",
      });
    });
  }
  /* This creates an WebRTC Peer Connection, which will be used to set local/remote descriptions and offers. */
  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
        {
          urls: "stun:stun1.l.google.com:19302",
        },
        {
          urls: "stun:stun2.l.google.com:19302",
        },
      ],
    })
  );

  useEffect(() => {
    // socket.on("newCall", (data) => {
    //   /* This event occurs whenever any peer wishes to establish a call with you. */
    // });

    // socket.on("callAnswered", (data) => {
    //   /* This event occurs whenever remote peer accept the call. */
    // });

    // socket.on("ICEcandidate", (data) => {
    //   /* This event is for exchangin Candidates. */
    // });

    let isFront = true;

    /*The MediaDevices interface allows you to access connected media inputs such as cameras and microphones. We ask the user for permission to access those media inputs by invoking the mediaDevices.getUserMedia() method. */
    mediaDevices.enumerateDevices().then((sourceInfos: any) => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == "videoinput" &&
          sourceInfo.facing == (isFront ? "user" : "environment")
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 500, // Provide your own width, height and frame rate here
            height: 300,
            frameRate: 30,
            facingMode: isFront ? "user" : "environment",
            //   optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
          },
        })
        .then((stream) => {
          // Get local stream!
          setlocalStream(stream);

          // setup stream listening
          //   peerConnection.current.addStream(stream);
        })
        .catch((error) => {
          // Log error
        });
    });

    // peerConnection.current.onaddstream = (event) => {
    //   setRemoteStream(event.stream);
    // };

    // Setup ice handling
    // peerConnection.current.onicecandidate = (event) => {};

    return () => {
      //   socket.off("newCall");
      //   socket.off("callAnswered");
      //   socket.off("ICEcandidate");
    };
  }, []);
  return (
    <View style={[globalStyle.flexOne, globalStyle.bgBlack]}>
      {localStream ? (
        <RTCView
          objectFit={"cover"}
          style={{ flex: 1, backgroundColor: "#050A0E" }}
          streamURL={localStream.toURL()}
        />
      ) : null}
    </View>
  );
};

export default Webrtc;
