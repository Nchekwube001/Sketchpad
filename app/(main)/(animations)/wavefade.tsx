import { WaveFade } from "@/components/WaveFade";
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function WaveFadeDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => setVisible((v) => !v)}>
        <Text style={styles.buttonText}>{visible ? "Hide" : "Show"}</Text>
      </Pressable>

      <WaveFade
        visible={visible}
        duration={500}
        fadingColor="#ffffff"
        preventFlickering
      >
        <View style={styles.box}>
          <Text style={styles.boxText}>Hello Wave</Text>
        </View>
      </WaveFade>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "black",
    paddingHorizontal: 24,
    paddingVertical: 12,
    position: "absolute",
    top: "25%",
  },
  buttonText: {
    color: "white",
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: "#FF6347",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  boxText: {
    color: "#fff",
    fontSize: 18,
  },
});
