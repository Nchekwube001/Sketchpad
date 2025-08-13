import { StackCarouselComponent } from "@/components/StackCarouselComponent";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const colors = [
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#f1c40f",
  "#9b59b6",
  "#1abc9c",
];

export default function StackCarousel() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.carouselContainer}>
        <StackCarouselComponent
          content={colors.map((color, index) => (
            <Card key={index} color={color} label={`Card ${index + 1}`} />
          ))}
          itemHeight={200}
          itemCount={4}
          baseSpacing={60}
          snapsDuration={200}
        />
      </View>
    </SafeAreaView>
  );
}

function Card({ color, label }: { color: string; label: string }) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.cardText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  carouselContainer: {
    width: "50%",
  },
  card: {
    height: 200,
    width: 200,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
});
