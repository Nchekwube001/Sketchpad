import CircleLoaderComponent from "@/components/CircleLoaderComponent";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function CircleLoaderExample() {
  const [play, setPlay] = useState(false);

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Pressable
        onPress={() => setPlay((p) => !p)}
        style={{ marginBottom: 32 }}
      >
        <Text style={{ fontSize: 24 }}>{play ? "Reset" : "Play"}</Text>
      </Pressable>
      <CircleLoaderComponent
        radius={80}
        circleR={4}
        colors={[
          "#EF5A57",
          "#F5AF00",
          "#4BAA4E",
          "#EF5A57",
          "#F5AF00",
          "#4BAA4E",
        ]}
        isPlaying={play}
      />
    </View>
  );
}
