import { useState } from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import { Asset } from "expo-asset";
import {
  FlipType,
  SaveFormat,
  useImageManipulator,
} from "expo-image-manipulator";

const IMAGE = Asset.fromModule(require("@/assets/images/bg.jpg"));

export default function ImageManipulator() {
  const [image, setImage] = useState(IMAGE);
  const context = useImageManipulator(IMAGE.uri);

  const rotate90andFlip = async () => {
    context.rotate(90).flip(FlipType.Vertical);
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.PNG,
    });

    setImage(result);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image.localUri || image.uri }}
          style={styles.image}
        />
      </View>
      <Button title="Rotate and Flip" onPress={rotate90andFlip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
