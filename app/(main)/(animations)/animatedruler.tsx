import { Ruler } from "@/components/utils/Ruler";
import React, { useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function AnimatedRuler() {
  const [value, setValue] = useState<number>(0);
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 24, paddingHorizontal: 20 }}>
        <Text>New value for the ruler (State)</Text>
        <Text style={{ fontSize: 32 }}>{value ?? "No value yet"}</Text>
      </View>
      <Ruler
        fadeColor="#eeeeee"
        onChange={(value) => {
          setValue(value);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#eeeeee",
    gap: 24,
  },
});
