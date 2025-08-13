import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Animated, {
  Layout,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  LinearTransition,
  FadeInUp,
  FadeOutDown,
  FadeOut,
  FadeInDown,
  FadeIn,
  SlideInRight,
  SlideOutLeft,
  withRepeat,
  SlideOutRight,
  useAnimatedProps,
  useDerivedValue,
} from "react-native-reanimated";
import {
  Camera,
  CameraDevice,
  PhotoFile,
  useCameraDevice,
  useFrameProcessor,
} from "react-native-vision-camera";
import {
  Canvas,
  Group,
  // Image,
  // Mask,
  Oval,
  // Rect,
  useImage,
} from "@shopify/react-native-skia";
// import {scanFaces, Face} from 'vision-camera-face-detector';
// "react-native-vision-camera": "^4.0.1",
// "vision-camera-trustee-face-detector-v3": "^1.4.0"
// "react-native-vision-camera": "^3.9.2",

import {
  ImageBackground,
  Linking,
  ScrollView,
  Image,
  StyleSheet,
  Text,
} from "react-native";
// import {scanFaces, type Face} from 'vision-camera-trustee-face-detector-v3';
import { FlatList } from "react-native";
import { View } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

import {
  ClipPath,
  Defs,
  Ellipse,
  Rect,
  Svg,
  Image as SvgImage,
  Mask,
} from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useComponentSize } from "@/constants/utils/hooks";
import globalStyle, { width } from "@/globalStyle/globalStyle";
import LayoutWithSafeArea from "@/components/layout/LayoutWithSafeArea";
import pallete from "@/constants/colors/pallete";
import { BlurView } from "expo-blur";

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const _ovalWidth = 240;
const _ovalHeight = 328;
const _strokeWidth = 4;
const selfieImage =
  "https://images.unsplash.com/photo-1753952253400-da11f889ee3f?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const CompleteEnrollment = () => {
  const { size, onLayout } = useComponentSize();
  const [step, setStep] = useState(1);
  const totalStep = useMemo(() => 4, []);
  const [spouseStep, setSpouseStep] = useState(1);
  const transY = useSharedValue(0);
  const clipRef = useRef(null);

  const captureClip = () => {
    // captureRef(clipRef, {
    //   format: "jpg",
    //   quality: 1,
    // }).then(
    //   (uri) => {
    //     if (uri) {
    //     }
    //   },
    //   (error) => {
    //     if (error) {
    //     }
    //   }
    // );
  };

  const ovalOrigin = useSharedValue({
    x: 0,
    y: 0,
  });
  const translateX = useSharedValue(width / 2);
  const translateY = useSharedValue(_ovalHeight);
  const translateXCamera = useSharedValue(width / 2);
  const translateYCamera = useDerivedValue(() => {
    // return size.height / 2;
    return _ovalHeight - 50;
  });

  const gesture = Gesture.Pan()
    .onBegin(({ x, y }) => {
      translateX.value = translateY.value = Math.min(
        Math.max(_ovalWidth / 2 + _strokeWidth, x),
        size.width - _ovalWidth / 2 - _strokeWidth
      );
      translateY.value = Math.min(
        Math.max(_ovalHeight / 2 + _strokeWidth, y),
        size.height - _ovalHeight / 2 - _strokeWidth
      );
    })
    .onChange(({ x, y }) => {
      translateX.value = translateY.value = Math.min(
        Math.max(_ovalWidth / 2 + _strokeWidth, x),
        size.width - _ovalWidth / 2 - _strokeWidth
      );
      translateY.value = Math.min(
        Math.max(_ovalHeight / 2 + _strokeWidth, y),
        size.height - _ovalHeight / 2 - _strokeWidth
      );
    });

  const animatedProps = useAnimatedProps(() => ({
    cx: translateX.value,
    cy: translateY.value,
  }));
  const animatedPropsCamera = useAnimatedProps(() => ({
    cx: translateXCamera.value,
    cy: translateYCamera.value,
  }));
  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: transY.value,
        },
      ],
    };
  });
  useEffect(() => {
    transY.value = withRepeat(
      withTiming(-8, {
        duration: 700,
      }),
      -1,
      true
    );
  }, [transY]);
  const [childStep, setchildStep] = useState(1);
  const [interestedStep, setinterestedStep] = useState(4);

  const infoTotalStep = useMemo(() => 2, []);

  const [faces, setFaces] = useState<any>();
  const [photo, setPhoto] = useState<string>("");
  // const [selfiImage, setSelfieImage] = useState<PhotoFile | undefined>(
  const [selfiImage, setSelfieImage] = useState<string | undefined>(undefined);
  const skiaImage = useImage(selfiImage);
  const [selfieStep, setSelfieStep] = useState(3);
  const [showProviderModal, setShowProvidermodal] = useState(false);
  const [showSpouseModal, setShowSpousemodal] = useState(false);
  const [showSpousePicker, setShowSpousePicker] = useState(false);
  const [showChildModal, setShowChildmodal] = useState(false);
  const [showInterestedModal, setShowInterestedmodal] = useState(false);
  const rotation = useSharedValue(0);
  const cameraRef = useRef<Camera>(null);
  const targetRef = useRef<View>(null);
  const [targetRect, setTargetRect] = useState({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    // The measurement and state update for `targetRect` happens in a single commit
    // allowing ToolTip to position itself without intermediate paints
    targetRef.current?.measureInWindow((x, y, widt, heigh) => {
      // console.log({
      //   x,
      //   y,
      //   widt,
      //   heigh,
      // });

      setTargetRect({ width: widt, height: heigh });
    });
  }, [setTargetRect]);
  // useEffect(() => {
  //   console.log(faces);
  // }, [faces]);
  // useEffect(() => {
  //   console.log(targetRect);
  // }, [targetRect]);

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";

    try {
      // const scannedFaces = scanFaces(frame);
      // runOnJS(setFaces)(scannedFaces);
      // const scannedFaces = scanFaces(frame, {});
      // if (Object.keys(scannedFaces).length > 0) {
      //   console.log({
      //     scanFaces,
      //   });
      //   handleFaceDetection(scannedFaces);
      // }
      //   console.log(scannedFaces?.faces);
    } catch (error) {
      console.error({ error });
    }

    // const objects = [{name: 'Bana'}];
    // // const objects = detectObjects(frame);
    // const label = objects[0].name;
    // console.log(`You're looking at a ${label}.`);
    // const scannedFaces = scanFaces(frame);
    // runOnJS(setFaces)(scannedFaces);
  }, []);

  // const devices = useCameraDevices();
  // const device = devices.front;
  const device = useCameraDevice("front");

  async function getPermission() {
    const permission = await Camera.requestCameraPermission();
    // console.log(`Camera permission status: ${permission}`);
    if (permission === "denied") await Linking.openSettings();
  }
  useEffect(() => {
    getPermission();
  }, []);

  const takePhoto = async () => {
    const img = await cameraRef?.current?.takePhoto();
    console.log({
      img,
    });

    setSelfieImage(`file://${img?.path}`);
    setSelfieStep(3);
    // setShowSelfie(false);
  };

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(`${rotation.value === 0 ? 0 : 180}deg`),
        },
      ],
    };
  });
  return (
    <>
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown}
        style={[globalStyle.flexOne]}
      >
        <View
          style={[
            globalStyle.bgBlack,
            globalStyle.justifyCenter,
            globalStyle.alignItemsCenter,
            globalStyle.flexOne,
          ]}
        >
          <View
            ref={targetRef}
            onLayout={onLayout}
            style={[globalStyle.flexOne, globalStyle.w10]}
          >
            <View style={[globalStyle.flexOne]}>
              <Image
                source={{ uri: selfieImage }}
                style={[globalStyle.w10, globalStyle.h10]}
              />

              <GestureDetector gesture={gesture}>
                <View
                  style={[
                    globalStyle.justifyCenter,
                    globalStyle.alignItemsCenter,
                    globalStyle.w10,
                    globalStyle.h10,
                    globalStyle.absolute,
                    {
                      //   backgroundColor: "rgba(0,0,0,0.8)",
                      backgroundColor: "rgba(46, 113, 209, 0.9)",
                      zIndex: 10,
                    },
                  ]}
                >
                  <AnimatedSvg
                    ref={clipRef}
                    style={completeStyle.svg}
                    width="100%"
                    height="100%"
                  >
                    <Defs>
                      <ClipPath id="clip">
                        <AnimatedEllipse
                          rx={_ovalWidth / 2}
                          ry={_ovalHeight / 2}
                          fill="transparent"
                          stroke="white"
                          strokeWidth="4"
                          animatedProps={animatedProps}
                        />
                      </ClipPath>
                    </Defs>
                    <SvgImage
                      href={{
                        uri: selfieImage,
                      }}
                      width="100%"
                      height="100%"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#clip)"
                    />
                  </AnimatedSvg>
                  <View style={[globalStyle.absolute, globalStyle.flexOne]}>
                    <BlurView
                      style={[globalStyle.flexOne]}
                      intensity={100}
                      tint="light"
                    />
                  </View>
                </View>
              </GestureDetector>
            </View>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const completeStyle = ScaledSheet.create({
  line: {
    height: "1@s",
    backgroundColor: pallete.cardGray,
    // borderBottomWidth: '1@s',
    // borderBottomColor: pallete.cardGray,
    // borderColor: 'red',
    // borderStyle: 'dotted',
  },
  tooltip: {
    width: "16@s",
    height: "16@s",
    bottom: "-6@s",
    transform: [
      {
        rotate: "45deg",
      },
    ],
  },
  selfieView: {
    width: "180@s",
    height: "180@s",
    borderRadius: "24@s",
    borderWidth: "2@s",
    borderColor: pallete.primaryGrey100,
    borderStyle: "dashed",
  },
  // overlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  svg: {
    width: "100%",
    height: "100%",
  },
});

export default CompleteEnrollment;
