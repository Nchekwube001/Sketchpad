import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { OnboardingIndicator } from "./";

const data = [...Array(4).keys()];

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <View style={styles.container}>
      <OnboardingIndicator
        data={data}
        onChange={(index) => setSelectedIndex(index)}
        selectedIndex={selectedIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});
