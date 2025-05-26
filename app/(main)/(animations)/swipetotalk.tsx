import React from "react";
import { StyleSheet, View } from "react-native";
import Swipable from "@/components/Swipable";

const SwipeToTalk = () => {
  return (
    <View style={styles.container}>
      <Swipable />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default SwipeToTalk;
