import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RippleCover } from "@/components/ui/RippleCover";

const Ripple = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>RippleCover Demo</Text>
      <Text style={styles.subtitle}>Tap anywhere to create ripple effects</Text>

      <RippleCover
        maxSpeed={600}
        ringWidth={40}
        decayRate={3}
        slowdownFactor={4}
        maxRipples={8}
      >
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ripple Effect</Text>
            <Text style={styles.sectionText}>Tap me!</Text>
          </View>

          <View style={[styles.section, styles.secondSection]}>
            <Text style={styles.sectionTitle}>Interactive</Text>
            <Text style={styles.sectionText}>Try multiple taps</Text>
          </View>

          <View style={[styles.section, styles.thirdSection]}>
            <Text style={styles.sectionTitle}>Distortion</Text>
            <Text style={styles.sectionText}>Watch the waves</Text>
          </View>
        </View>
      </RippleCover>
    </SafeAreaView>
  );
};
export default Ripple;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#7f8c8d",
  },
  content: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  section: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498db",
  },
  secondSection: {
    backgroundColor: "#e74c3c",
  },
  thirdSection: {
    backgroundColor: "#2ecc71",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
});
