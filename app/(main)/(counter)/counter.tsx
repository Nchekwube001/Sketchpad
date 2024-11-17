import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Ticker from "./";

export default function App() {
  // Example of using a formatter to format the number as currency
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const [value, setValue] = useState<number | string>(
    // formatter.format(9988.34)
    formatter.format(8295.19)
    // 8295.19
  );
  console.log({
    formatter: formatter.format(8295.19),
    intl: new Intl.NumberFormat(),
  });

  return (
    <View
      style={styles.container}
      onTouchStart={() => {
        setValue(
          formatter.format(Math.floor(Math.random() * 900000 + 99999) / 100)
        );
      }}
    >
      {/* <Ticker value={value} fontSize={120} /> */}
      <Ticker value={value} fontSize={60} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
