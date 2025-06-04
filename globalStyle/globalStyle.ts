import {
  DimensionValue,
  Dimensions,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
export const { height, width } = Dimensions.get("window");
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import pallete from "@/constants/colors/pallete";

export const STATUSBAR_HEIGHT = getStatusBarHeight();
export type styleType = ViewStyle | TextStyle | ImageStyle;
const globalStyle = ScaledSheet.create({
  underline: {
    textDecorationLine: "underline",
  },
  bgError: {
    backgroundColor: pallete.error,
  },
  bgToastWarn: {
    backgroundColor: pallete.toastWarn,
  },
  dot: {
    width: "6@s",
    height: "6@s",
    marginHorizontal: "6@s",
    borderRadius: "20@s",
  },
  borderTopGray: {
    borderTopColor: pallete.gray,
    borderTopWidth: "0.5@s",
  },
  borderTopDark: {
    borderTopColor: pallete.borderTopDark,
    borderTopWidth: "1@s",
  },
  borderTopLight: {
    borderTopColor: pallete.borderTopDark,
    borderTopWidth: "1@s",
  },
  borderRed: {
    borderColor: pallete.red0,
  },
  billsICon: {
    width: "30@s",
    height: "30@s",
  },
  textToastSuccess: {
    color: pallete.green30,
  },
  textUpgrade: {
    color: pallete.airtimeLight,
  },
  textUpgradeDark: {
    color: pallete.upgradeDark,
  },
  textVerified: {
    color: pallete.creditText,
  },
  textToastError: {
    color: pallete.red20,
  },
  bgTier2: {
    backgroundColor: pallete.onb1Bg,
  },
  disabledBg: {
    backgroundColor: pallete.disabledBg,
  },
  bgGray: {
    backgroundColor: pallete.bgGray,
  },
  bgGold: {
    backgroundColor: pallete.goldBg,
  },
  bgPlat: {
    backgroundColor: pallete.platBg,
  },
  bgTier1: {
    backgroundColor: pallete.onb2Bg,
  },
  bgToastSuccessLight: {
    backgroundColor: pallete.toastSuccessLight,
  },
  bgToastSuccessDark: {
    backgroundColor: pallete.toastSuccessDark,
  },
  bgToastSuccess: {
    backgroundColor: pallete.toastSuccess2,
  },
  bgToastSuccess2: {
    backgroundColor: pallete.toastSuccess,
  },
  bgToastError: {
    backgroundColor: pallete.toastError2,
  },
  bgToastErrorLight: {
    backgroundColor: pallete.toastErrorLight,
  },
  bgToastErrorDark: {
    backgroundColor: pallete.toastSuccessDark,
  },
  bgToastSideError: {
    backgroundColor: pallete.toastErrorSide,
  },
  borderToastSideError: {
    borderColor: pallete.toastErrorSide,
    borderWidth: "1@s",
  },
  textToastSide: {
    color: pallete.toastErrorSide,
  },
  bgRedBtn: {
    backgroundColor: pallete.redBtn,
  },
  textRedBtn: {
    color: pallete.redBtnText,
  },
  bgToastSideSuccess: {
    backgroundColor: pallete.toastSuccessSide,
  },
  sideWidth: {
    width: "5@s",
  },

  apiToast: {
    position: "absolute",
    top: "40@s",
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10@s",
    zIndex: 1000,
  },
  flexrow: {
    flexDirection: "row",
  },
  flexrowReverse: {
    flexDirection: "row-reverse",
  },
  zIndex: {
    zIndex: 30,
  },
  flexwrap: {
    flexWrap: "wrap",
  },
  borWhite: {
    borderColor: pallete.white,
    borderWidth: "2@s",
  },
  borderWidth1: {
    borderWidth: "1@s",
  },
  borderWidth2: {
    borderWidth: "2@s",
  },
  br: {
    borderRadius: "500@s",
  },
  borderRadius: {
    borderRadius: "12@s",
  },
  borderRadius2: {
    borderRadius: "2@s",
  },
  borderRadius4: {
    borderRadius: "4@s",
  },
  borderRadius6: {
    borderRadius: "6@s",
  },
  borderRadius8: {
    borderRadius: "8@s",
  },
  borderRadius16: {
    borderRadius: "16@s",
  },
  borderRadius24: {
    borderRadius: "24@s",
  },
  borderRadius32: {
    borderRadius: "32@s",
  },
  borderRad: {
    borderRadius: "10@s",
  },
  modalBr: {
    borderTopLeftRadius: "16@s",
    borderTopRightRadius: "16@s",
  },
  modalBrBottom: {
    borderBottomLeftRadius: "16@s",
    borderBottomRightRadius: "16@s",
  },
  borderInput: {
    borderWidth: 1,
    borderColor: pallete.circleInactiveLight,
  },
  borderGray: {
    borderWidth: 1,
    borderColor: pallete.grey05,
  },
  bottomBr: {
    borderTopLeftRadius: "40@s",
    borderTopRightRadius: "40@s",
  },
  toastBr: {
    borderBottomRightRadius: "10@s",
    borderTopRightRadius: "10@s",
  },
  relative: {
    position: "relative",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyEvenly: {
    justifyContent: "space-evenly",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  alignItemsEnd: {
    alignItems: "flex-end",
  },
  alignItemsBaseline: {
    alignItems: "baseline",
  },
  ppHeight: {
    height: "250@s",
  },
  absolute: {
    position: "absolute",
  },
  flexOne: {
    flex: 1,
  },
  mx2p2: {
    marginHorizontal: "22@vs" as DimensionValue,
  },
  mt0p4: {
    marginTop: "4@vs" as DimensionValue,
  },
  mt0p5: {
    marginTop: "5@vs" as DimensionValue,
  },
  mt0p8: {
    marginTop: "8@vs" as DimensionValue,
  },
  mt1: {
    marginTop: "10@vs" as DimensionValue,
  },
  mt1p2: {
    marginTop: "12@vs" as DimensionValue,
  },
  mt1p5: {
    marginTop: "15@vs" as DimensionValue,
  },
  mt1p6: {
    marginTop: "16@vs" as DimensionValue,
  },
  mt2: {
    marginTop: "20@vs" as DimensionValue,
  },
  mt2p4: {
    marginTop: "24@vs" as DimensionValue,
  },
  mt3: {
    marginTop: "30@vs" as DimensionValue,
  },
  mt3p2: {
    marginTop: "32@vs" as DimensionValue,
  },
  mt4: {
    marginTop: "40@vs" as DimensionValue,
  },
  mt5: {
    marginTop: "50@vs" as DimensionValue,
  },
  mt6: {
    marginTop: "60@vs" as DimensionValue,
  },
  mt7: {
    marginTop: "70@vs" as DimensionValue,
  },
  mt8: {
    marginTop: "80@vs" as DimensionValue,
  },
  mt9: {
    marginTop: "90@vs" as DimensionValue,
  },
  mt10: {
    marginTop: "100@vs" as DimensionValue,
  },
  ml0p3: {
    marginLeft: "3@ms" as DimensionValue,
  },
  ml0p4: {
    marginLeft: "4@ms" as DimensionValue,
  },
  ml0p5: {
    marginLeft: "5@ms" as DimensionValue,
  },
  ml0p8: {
    marginLeft: "8@ms" as DimensionValue,
  },
  ml1: {
    marginLeft: "10@ms" as DimensionValue,
  },
  ml1p2: {
    marginLeft: "12@ms" as DimensionValue,
  },
  ml2: {
    marginLeft: "20@ms" as DimensionValue,
  },
  ml2p4: {
    marginLeft: "24@ms" as DimensionValue,
  },
  ml3: {
    marginLeft: "30@ms" as DimensionValue,
  },
  ml4: {
    marginLeft: "40@ms" as DimensionValue,
  },
  ml5: {
    marginLeft: "50@ms" as DimensionValue,
  },
  ml6: {
    marginLeft: "60@ms" as DimensionValue,
  },
  ml7: {
    marginLeft: "70@ms" as DimensionValue,
  },
  ml8: {
    marginLeft: "80@ms" as DimensionValue,
  },
  ml9: {
    marginLeft: "90@ms" as DimensionValue,
  },
  ml10: {
    marginLeft: "100@ms" as DimensionValue,
  },
  p0p1: {
    padding: "1@s" as DimensionValue,
  },
  p0p2: {
    padding: "2@s" as DimensionValue,
  },
  p0p3: {
    padding: "3@s" as DimensionValue,
  },
  p0p4: {
    padding: "4@s" as DimensionValue,
  },
  p0p5: {
    padding: "5@s" as DimensionValue,
  },
  p0p6: {
    padding: "6@s" as DimensionValue,
  },
  p0p7: {
    padding: "7@s" as DimensionValue,
  },
  p0p8: {
    padding: "8@s" as DimensionValue,
  },
  p1: {
    padding: "10@s" as DimensionValue,
  },
  p1p5: {
    padding: "15@s" as DimensionValue,
  },
  p1p2: {
    padding: "12@s" as DimensionValue,
  },
  p1p6: {
    padding: "16@s" as DimensionValue,
  },
  p2: {
    padding: "20@s" as DimensionValue,
  },
  p2p4: {
    padding: "24@s" as DimensionValue,
  },
  p3: {
    padding: "30@s" as DimensionValue,
  },
  p4: {
    padding: "40@s" as DimensionValue,
  },
  p5: {
    padding: "50@s" as DimensionValue,
  },
  p6: {
    padding: "60@s" as DimensionValue,
  },
  p7: {
    padding: "70@s" as DimensionValue,
  },
  p8: {
    padding: "80@s" as DimensionValue,
  },
  p9: {
    padding: "90@s" as DimensionValue,
  },
  p10: {
    padding: "100@s",
  },
  pr0p4: {
    paddingRight: "4@ms",
  },
  pr0p5: {
    paddingRight: "5@ms",
  },
  pr0p6: {
    paddingRight: "6@ms",
  },
  pr0p8: {
    paddingRight: "8@ms",
  },
  pr1: {
    paddingRight: "10@ms",
  },
  pr1p2: {
    paddingRight: "12@ms",
  },
  pr1p6: {
    paddingRight: "16@ms",
  },
  pr2: {
    paddingRight: "20@ms",
  },
  pr2p4: {
    paddingRight: "24@ms",
  },
  pr3: {
    paddingRight: "30@ms",
  },
  pr4: {
    paddingRight: "40@ms",
  },
  pr5: {
    paddingRight: "50@ms",
  },
  pr6: {
    paddingRight: "60@ms",
  },
  pr7: {
    paddingRight: "70@ms",
  },
  pr8: {
    paddingRight: "80@ms",
  },
  pr9: {
    paddingRight: "90@ms",
  },
  pr10: {
    paddingRight: "100@ms",
  },
  pl0p4: {
    paddingLeft: "4@s",
  },
  pl0p5: {
    paddingLeft: "5@s",
  },
  pl0p6: {
    paddingLeft: "6@s",
  },
  pl0p8: {
    paddingLeft: "8@s",
  },
  pl1: {
    paddingLeft: "10@s",
  },
  pl1p2: {
    paddingLeft: "12@s",
  },
  pl1p6: {
    paddingLeft: "16@s",
  },
  pl2: {
    paddingLeft: "20@s",
  },
  pl2p4: {
    paddingLeft: "24@s",
  },
  pl3: {
    paddingLeft: "30@s",
  },
  pl4: {
    paddingLeft: "40@s",
  },
  pl5: {
    paddingLeft: "50@s",
  },
  pl6: {
    paddingLeft: "60@s",
  },
  pl7: {
    paddingLeft: "70@s",
  },
  pl8: {
    paddingLeft: "80@s",
  },
  pl9: {
    paddingLeft: "90@s",
  },
  pl10: {
    paddingLeft: "100@s",
  },
  pb0p3: {
    paddingBottom: "3@s",
  },
  pb0p8: {
    paddingBottom: "8@s",
  },
  pb1: {
    paddingBottom: "10@s",
  },
  pb1p2: {
    paddingBottom: "12@s",
  },
  pb1p6: {
    paddingBottom: "16@s",
  },
  pb2: {
    paddingBottom: "20@s",
  },
  pb2p4: {
    paddingBottom: "24@s",
  },
  pb3: {
    paddingBottom: "30@s",
  },
  pb4: {
    paddingBottom: "40@s",
  },
  pb5: {
    paddingBottom: "50@s",
  },
  pb6: {
    paddingBottom: "60@s",
  },
  pb7: {
    paddingBottom: "70@s",
  },
  pb8: {
    paddingBottom: "80@s",
  },
  pb9: {
    paddingBottom: "90@s",
  },
  pb10: {
    paddingBottom: "100@s",
  },
  pb11: {
    paddingBottom: "110@s",
  },
  pb124: {
    paddingBottom: "124@s",
  },
  pb136: {
    paddingBottom: "136@s",
  },

  px0: {
    paddingHorizontal: "0@ms",
  },
  px0p2: {
    paddingHorizontal: "2@ms",
  },
  px0p4: {
    paddingHorizontal: "4@ms",
  },
  px0p5: {
    paddingHorizontal: "5@ms",
  },
  px0p8: {
    paddingHorizontal: "8@ms",
  },
  px1: {
    paddingHorizontal: "10@ms",
  },
  px12: {
    paddingHorizontal: "12@ms",
  },
  px16: {
    paddingHorizontal: "16@ms",
  },
  px1p2: {
    paddingHorizontal: "12@ms",
  },
  px1p5: {
    paddingHorizontal: "15@ms",
  },
  px1p6: {
    paddingHorizontal: "16@ms",
  },
  px2: {
    paddingHorizontal: "20@ms",
  },
  px2p4: {
    paddingHorizontal: "24@ms",
  },
  px3: {
    paddingHorizontal: "30@ms",
  },
  px4: {
    paddingHorizontal: "40@ms",
  },
  px5: {
    paddingHorizontal: "50@ms",
  },
  px6: {
    paddingHorizontal: "60@ms",
  },
  px7: {
    paddingHorizontal: "70@ms",
  },
  px8: {
    paddingHorizontal: "80@ms",
  },
  px9: {
    paddingHorizontal: "90@ms",
  },
  px10: {
    paddingHorizontal: "100@ms",
  },
  py0p2: {
    paddingVertical: "2@vs",
  },
  py0p4: {
    paddingVertical: "4@vs",
  },
  py0p5: {
    paddingVertical: "5@vs",
  },
  py0p6: {
    paddingVertical: "6@vs",
  },
  py0p8: {
    paddingVertical: "8@vs",
  },
  py1p2: {
    paddingVertical: "12@vs",
  },
  py1: {
    paddingVertical: "10@vs",
  },
  py0: {
    paddingVertical: "0@vs",
  },
  py1p6: {
    paddingVertical: "16@vs",
  },
  py1p5: {
    paddingVertical: "15@vs",
  },
  py2: {
    paddingVertical: "20@vs",
  },
  py2p4: {
    paddingVertical: "24@vs",
  },
  py3: {
    paddingVertical: "30@vs",
  },
  py4: {
    paddingVertical: "40@vs",
  },
  py5: {
    paddingVertical: "50@vs",
  },
  py6: {
    paddingVertical: "60@vs",
  },
  py7: {
    paddingVertical: "70@vs",
  },
  py8: {
    paddingVertical: "80@vs",
  },
  py9: {
    paddingVertical: "90@vs",
  },
  py10: {
    paddingVertical: "100@vs",
  },
  pt30p: {
    paddingTop: "30%",
  },
  ptStatus: {
    paddingTop: STATUSBAR_HEIGHT + 60,
  },
  pt0p2: {
    paddingTop: "2@vs",
  },
  pt0p4: {
    paddingTop: "4@vs",
  },
  pt0p8: {
    paddingTop: "8@vs",
  },
  pt1: {
    paddingTop: "10@vs",
  },
  pt1p2: {
    paddingTop: "12@vs",
  },
  pt1p5: {
    paddingTop: "15@vs",
  },
  pt1p4: {
    paddingTop: "14@vs",
  },
  pt1p6: {
    paddingTop: "16@vs",
  },
  pt2: {
    paddingTop: "20@vs",
  },
  pt2p1: {
    paddingTop: "21@vs",
  },
  pt2p2: {
    paddingTop: "22@vs",
  },
  pt2p3: {
    paddingTop: "23@vs",
  },
  pt2p4: {
    paddingTop: "24@vs",
  },
  pt2p8: {
    paddingTop: "28@vs",
  },
  pt3: {
    paddingTop: "30@vs",
  },
  pt3p2: {
    paddingTop: "32@vs",
  },
  pt3p6: {
    paddingTop: "36@vs",
  },
  pt4: {
    paddingTop: "40@vs",
  },
  pt4p8: {
    paddingTop: "48@vs",
  },
  pt5: {
    paddingTop: "50@vs",
  },
  pt6: {
    paddingTop: "60@vs",
  },
  pt7: {
    paddingTop: "70@vs",
  },
  pt8: {
    paddingTop: "80@vs",
  },
  pt9: {
    paddingTop: "90@vs",
  },
  pt10: {
    paddingTop: "100@vs",
  },
  pt140: {
    paddingTop: "140@vs",
  },
  pt160: {
    paddingTop: "160@vs",
  },
  w0: {
    width: 0,
  },
  w1: {
    width: "10%",
  },
  w1p2: {
    width: "12%",
  },
  w1p3: {
    width: "13%",
  },
  w1p5: {
    width: "15%",
  },
  w2: {
    width: "20%",
  },
  w2p2: {
    width: "22%",
  },
  w2p5: {
    width: "25%",
  },
  w3: {
    width: "30%",
  },
  w3p1: {
    width: "31%",
  },
  w3p2: {
    width: "32%",
  },
  w3p3: {
    width: "33%",
  },
  w4: {
    width: "40%",
  },
  w5: {
    width: "50%",
  },
  w6: {
    width: "60%",
  },
  w7: {
    width: "70%",
  },
  w8: {
    width: "80%",
  },
  w8p2: {
    width: "82%",
  },
  w8p3: {
    width: "83%",
  },
  w8p5: {
    width: "85%",
  },
  w8p6: {
    width: "86%",
  },
  w8p7: {
    width: "87%",
  },
  w8p8: {
    width: "88%",
  },
  w9: {
    width: "90%",
  },
  w10: {
    width: "100%",
  },
  h0: {
    height: 0,
  },
  h1: {
    height: "10%",
  },
  h2: {
    height: "20%",
  },
  h3: {
    height: "30%",
  },
  h4: {
    height: "40%",
  },
  h5: {
    height: "50%",
  },
  h6: {
    height: "60%",
  },
  h7: {
    height: "70%",
  },
  h8: {
    height: "80%",
  },
  h9: {
    height: "90%",
  },
  h10: {
    height: "100%",
  },
  mr0p3: {
    marginRight: "3@ms",
  },
  mr0p4: {
    marginRight: "4@ms",
  },
  mr0p5: {
    marginRight: "5@ms",
  },
  mr0p8: {
    marginRight: "8@ms",
  },
  mr1: {
    marginRight: "10@ms",
  },
  mr1p6: {
    marginRight: "16@ms",
  },
  mr10: {
    marginRight: "100@ms",
  },
  mr2: {
    marginRight: "20@ms",
  },
  mr2p4: {
    marginRight: "24@ms",
  },
  mr3: {
    marginRight: "30@ms",
  },
  mr4: {
    marginRight: "40@ms",
  },
  mr5: {
    marginRight: "50@ms",
  },
  mr6: {
    marginRight: "60@ms",
  },
  mr7: {
    marginRight: "70@ms",
  },
  mr8: {
    marginRight: "80@ms",
  },
  mr9: {
    marginRight: "90@ms",
  },
  m0: {
    margin: 0,
  },
  mx0: {
    marginHorizontal: 0,
  },
  mb0: {
    marginBottom: 0,
  },
  mb0p4: {
    marginBottom: "4@ms",
  },
  mb0p5: {
    marginBottom: "5@ms",
  },
  mb0p8: {
    marginBottom: "8@ms",
  },
  mb1: {
    marginBottom: "10@ms",
  },
  mb1p2: {
    marginBottom: "12@ms",
  },
  mb1p6: {
    marginBottom: "16@ms",
  },
  mb2: {
    marginBottom: "20@ms",
  },
  mb2p4: {
    marginBottom: "24@ms",
  },
  mb3: {
    marginBottom: "30@ms",
  },
  mb4: {
    marginBottom: "40@ms",
  },
  mb5: {
    marginBottom: "50@ms",
  },
  mb6: {
    marginBottom: "60@ms",
  },
  mb7: {
    marginBottom: "70@ms",
  },
  mb8: {
    marginBottom: "80@ms",
  },
  mb9: {
    marginBottom: "90@ms",
  },
  mb10: {
    marginBottom: "100@ms",
  },
  lineHeight28: {
    lineHeight: "28@s",
  },
  letterSpacing: {
    letterSpacing: "0.6@s",
  },
  fontWeight300: {
    fontWeight: "300",
  },
  fontWeight400: {
    fontWeight: "400",
  },
  fontWeight500: {
    fontWeight: "500",
  },
  fontWeight600: {
    fontWeight: "600",
  },
  fontWeight700: {
    fontWeight: "700",
  },
  fontWeight800: {
    fontWeight: "800",
  },
  fontWeight900: {
    fontWeight: "900",
  },
  fontNunitoLight: {
    fontFamily: "Nunito-Light",
  },
  fontNunitoRegular: {
    fontFamily: "Nunito-Regular",
  },
  fontNunitoMedium: {
    fontFamily: "Nunito-Medium",
  },
  fontNunitoSemiBold: {
    fontFamily: "Nunito-SemiBold",
  },
  fontNunitoBold: {
    fontFamily: "Nunito-Bold",
  },
  fontRobotoLight: {
    fontFamily: "Roboto-Light",
  },
  fontRobotoRegular: {
    fontFamily: "Roboto-Regular",
  },
  fontRobotoMedium: {
    fontFamily: "Roboto-Medium",
  },
  fontRobotoBold: {
    fontFamily: "Roboto-Bold",
  },
  fontSize7: {
    fontSize: "7@s",
  },
  fontSize8: {
    fontSize: "8@s",
  },
  fontSize9: {
    fontSize: "9@s",
  },
  fontSize10: {
    fontSize: "10@s",
  },
  fontSize11: {
    fontSize: "11@s",
  },
  fontSize12: {
    fontSize: "12@s",
  },
  textCapitalise: {
    textTransform: "capitalize",
  },
  fontSize13: {
    fontSize: "13@s",
  },
  dotSmall: {
    width: "3@s",
    height: "3@s",
  },
  fontSize14: {
    fontSize: "14@s",
  },
  fontSize15: {
    fontSize: "15@s",
  },
  fontSize16: {
    fontSize: "16@s",
  },
  fontSize17: {
    fontSize: "17@s",
  },
  fontSize18: {
    fontSize: "18@s",
  },
  fontSize19: {
    fontSize: "19@s",
  },
  fontSize20: {
    fontSize: "20@s",
  },
  fontSize21: {
    fontSize: "21@s",
  },
  fontSize22: {
    fontSize: "22@s",
  },
  fontSize23: {
    fontSize: "23@s",
  },
  fontSize24: {
    fontSize: "24@s",
  },
  fontSize30: {
    fontSize: "30@s",
  },
  fontSize32: {
    fontSize: "32@s",
  },
  fontSize36: {
    fontSize: "36@s",
  },
  fontSize42: {
    fontSize: "42@s",
  },
  textError: {
    color: pallete.error,
  },
  textWhitePrimary: {
    color: pallete.white,
  },
  textPrimary: {
    color: pallete.primary,
  },
  textWhiteSecondary: {
    color: pallete.whiteSecondary,
  },
  textGray: {
    color: pallete.gray,
  },
  textPlaceholderLight: {
    color: pallete.placeHolderTextLight,
  },
  textPlaceholderDark: {
    color: pallete.placeHolderTextDark,
  },
  textGreen20: {
    color: pallete.green20,
  },
  textBlackPrimary: {
    color: pallete.textBlackPrimary,
  },
  textGreen: {
    color: pallete.green0,
  },
  textBlackSecondary: {
    color: pallete.textBlackSecondary,
  },
  textPurplePrimary: {
    color: pallete.Primary_text,
  },
  textPurple10: {
    color: pallete.primary10,
  },
  textSecondary: {
    color: pallete.secondary,
  },
  uppercase: {
    textTransform: "uppercase",
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
  bgTintLight: {
    backgroundColor: pallete.lightInput_bg,
  },
  bgTintDark: {
    backgroundColor: pallete.darkInput_bg,
  },
  bgTextInputLight: {
    backgroundColor: pallete.white,
  },
  bgTextInputDark: {
    backgroundColor: pallete.darkInput_bg,
  },
  bgWhite: {
    backgroundColor: pallete.white,
  },
  borderTopCard: {
    borderTopWidth: "1@s",
    borderTopColor: pallete.borderCard,
  },
  bgWhiteBg: {
    backgroundColor: pallete.whiteBg,
  },
  bgBackdrop: {
    backgroundColor: pallete.backdrop,
  },
  bgSpectranet: {
    backgroundColor: pallete.spectranet,
  },
  bgPrimary: {
    backgroundColor: pallete.primary,
  },
  bgMtn: {
    backgroundColor: pallete.mtnYellow,
  },

  bgPurple10: {
    backgroundColor: pallete.primary10,
  },
  bgBlack: {
    backgroundColor: pallete.black,
  },
  bgVoda: {
    backgroundColor: pallete.bgVoda,
  },
  bgGlo: {
    backgroundColor: pallete.gloBg,
  },
  bgDisabledBtn: {
    backgroundColor: pallete.disabledBg,
  },
  bgDarkPrimary: {
    backgroundColor: pallete.darkBg,
  },
  bgDebit: {
    backgroundColor: pallete.debit,
  },
  bgCredit: {
    backgroundColor: pallete.credit,
  },
  bgDebitDark: {
    backgroundColor: pallete.debitDark,
  },
  bgCreditDark: {
    backgroundColor: pallete.creditDark,
  },
  bgDarkSecondary: {
    backgroundColor: pallete.darkSecondary,
  },
  bgSecondary: {
    backgroundColor: pallete.secondaryBtn,
  },
  bgSecondaryText: {
    backgroundColor: pallete.textBlackSecondary,
  },
  bgTransparent: {
    backgroundColor: pallete.transparent,
  },
  bgLoading: {
    backgroundColor: pallete.primary70,
  },
  textInputHeight: {
    height: "44@s",
  },
  selectHeight: {
    height: "54@s",
  },
  MultiTextInputHeight: {
    height: "100@s",
  },
  minHeight: {
    minHeight: height,
  },
  height: {
    height,
  },
  modalHeight: {
    height: height * 0.85,
  },
  width: {
    width,
  },
  textAlignVertical: {
    textAlignVertical: "top",
  },
  errorText: {
    color: pallete.errorText,
  },
  borderBlack: {
    borderWidth: 1,
    borderColor: pallete.black,
  },
  borderPrimary: {
    borderWidth: 1,
    borderColor: pallete.primary,
  },
  borderWhite: {
    borderWidth: 1,
    borderColor: pallete.white,
  },
  borderTransBtn: {
    borderWidth: 1,
    borderColor: pallete.primary,
  },
  borderSecondaryBtn: {
    borderWidth: 1,
    borderColor: pallete.primary10,
  },
  borderTransBtnDark: {
    borderWidth: 1,
    borderColor: pallete.white,
  },
  displayNone: {
    display: "none",
  },

  shadowRadius: {
    // borderRadius: '12@s',
    // elevation: 3,
    shadowColor: pallete.shadowBg,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    borderColor: pallete.shadowBg2,
    borderWidth: "1@s",
  },
  noOpacity: {
    opacity: 0,
  },
  overflowHidden: {
    overflow: "hidden",
  },
  aspectRatio: {
    aspectRatio: 1,
  },
  passwordMeter: {
    height: "4@s",
    backgroundColor: pallete.blurDot,
  },
});
// } as unknown as Record<string, styleType>);

export default globalStyle;
