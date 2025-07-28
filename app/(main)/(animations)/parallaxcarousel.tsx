import { ParallaxCarouselView } from "@/components/ui/ParallaxCarouselView";
import { View, useWindowDimensions, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const images = [
  require("@/assets/images/dp1.png"),
  require("@/assets/images/dp1.png"),
  require("@/assets/images/dp1.png"),
  require("@/assets/images/dp1.png"),
  require("@/assets/images/dp1.png"),
  require("@/assets/images/dp1.png"),
  require("@/assets/images/dp1.png"),
  require("@/assets/images/dp1.png"),
  require("@/assets/images/dp1.png"),
  require("@/assets/images/dp1.png"),
];

export default function Test() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.carouselContainer}>
        <ParallaxCarouselView>
          {images.map((src, index) => (
            <Card key={index} src={src} />
          ))}
        </ParallaxCarouselView>
      </View>
    </SafeAreaView>
  );
}

function Card({ src }: { src: any }) {
  const { width } = useWindowDimensions();

  return (
    <View
      style={[
        styles.card,
        { width: width * 0.7 }, // Wider for parallax effect
      ]}
    >
      <Image style={styles.image} resizeMode="repeat" source={src} />
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
  carouselContainer: {
    height: 208,
  },
  card: {
    height: 200,
    overflow: "hidden",
    borderRadius: 24,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
