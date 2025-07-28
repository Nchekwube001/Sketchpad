import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { RevealMask } from "@/components/ui/RevealMask";
import globalStyle from "@/globalStyle/globalStyle";

const Reveal = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RevealMask Demo</Text>
      <Text style={styles.subtitle}>Drag to reveal hidden content</Text>

      <RevealMask
        primary={
          <View style={[styles.primary, globalStyle.bgBlack]}>
            {/* <Text style={styles.primaryText}>🌟 Primary Layer</Text>
            <Text style={styles.hint}>Drag me!</Text> */}
          </View>
          //   <View style={styles.primary}>
          //     <Text style={styles.primaryText}>🌟 Primary Layer</Text>
          //     <Text style={styles.hint}>Drag me!</Text>
          //   </View>
        }
        secondary={
          <View style={styles.secondary}>
            <Text style={styles.secondaryText}>✨ Hidden Layer</Text>
            <Text style={styles.hint}>You found it!</Text>
          </View>
        }
        maskRadius={50}
      />
    </View>
  );
};

export default Reveal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  primary: {
    height: 200,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  secondary: {
    height: 200,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  primaryText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
  },
  secondaryText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
});
