import { StyleSheet, View } from "react-native";
import { PerplexityList } from ".";
import mockData from "./mockdata";

export default function App() {
  return (
    <View style={styles.container}>
      <PerplexityList data={mockData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
  },
});
