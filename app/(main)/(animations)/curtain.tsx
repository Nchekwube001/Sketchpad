import CurtainComponent from "@/components/CurtainComponent";
import { Image } from "expo-image";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

export default function CurtainExample() {
  const animValue = useSharedValue(0);
  return (
    <View style={{ flex: 1 }}>
      {/* <Image
        source={require("../assets/images/nicheguys-logo.png")}
        style={{ width: 300, height: 1000 }}
        resizeMode="contain"
      /> */}
      <CurtainComponent
        progress={animValue}
        containerStyle={{ position: "absolute" }}
      />
    </View>
  );
}
