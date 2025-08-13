import RadialProgress from "@/components/RadialProgress";
import globalStyle from "@/globalStyle/globalStyle";
import { useEffect } from "react";
import { View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

export default function RadialProgressExample() {
  const progress = useSharedValue(0.3); // thirty percent

  useEffect(() => {
    progress.value = withTiming(0.8, { duration: 1500 });
  }, []);

  return (
    <View style={[globalStyle.bgBlack, globalStyle.flexOne]}>
      <RadialProgress
        size={200}
        progress={progress}
        font={require("@/assets/fonts/SpaceMono-Regular.ttf")}
        fontSize={28}
        innerColor="#111111"
        lineColor="#00C853"
        lineThickness={3}
        lineCount={90}
        lineHeight={30}
        animationConfig={{
          scale: 1.4,
          opacity: 0.6,
        }}
        containerStyle={{
          alignSelf: "center",
          marginTop: 40,
        }}
      />
    </View>
  );
}
