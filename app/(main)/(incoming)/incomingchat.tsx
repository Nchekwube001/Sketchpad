import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useEffect, useRef, useState } from "react";
import { FlexAlignType, Image, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { IncomingChatList } from "./";
import { ChatItem, generateNewMessage } from "./mock";

const MAX_MESSAGES = 5;
const positions: Partial<FlexAlignType>[] = [
  "flex-start",
  "center",
  "flex-end",
];
const chatSpeed = {
  slow: [1000, 500],
  medium: [500, 500],
  fast: [250, 250],
  "insane 🚀": [50, 100],
};
const _spacing = 4;
export default function App() {
  const [data, setData] = useState<ChatItem[]>([]);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const [alignItems, setAlignItems] = useState(0);
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState<keyof typeof chatSpeed>("slow");

  useEffect(() => {
    // Just faking incoming new data as they were live :)
    const generateData = () => {
      clearTimeout(timeout?.current ? timeout.current : undefined);
      const selectedSpeed = chatSpeed[speed];
      const timer = Math.random() * selectedSpeed[0] + selectedSpeed[1];
      // console.log("Calling setData in ", timer);
      timeout.current = setTimeout(() => {
        // console.log("Called for ", timer);
        setData((data) => {
          // return [generateNewMessage(), ...data.slice(0, MAX_MESSAGES * 10)];
          return [generateNewMessage(), ...data];
        });
        generateData();
      }, timer);
    };

    generateData();

    return () => {
      clearTimeout(timeout?.current ? timeout.current : undefined);
      timeout.current = null;
    };
  }, [speed]);
  return (
    <View style={styles.container}>
      <IncomingChatList
        data={data}
        contentContainerStyle={{
          alignItems: positions[alignItems],
          alignSelf: positions[position],
          maxWidth: "70%",
        }}
        renderItem={({ item }) => {
          return (
            <Animated.View
              style={[
                {
                  gap: _spacing,
                  alignItems: "flex-start",
                  padding: _spacing * 2,
                  borderRadius: 12,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: _spacing,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    width: 16,
                    aspectRatio: 1,
                    borderRadius: 24,
                  }}
                  source={{ uri: item.user.avatar }}
                />
                <Text style={{ fontSize: 12 }}>{item.user.name}</Text>
              </View>
              <View
                style={{
                  backgroundColor: "#ddd",
                  padding: _spacing * 2,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 12 }}>{item.description}</Text>
              </View>
            </Animated.View>
          );
        }}
      />
      <View
        style={{
          flex: 0.5,
          marginTop: 80,
          gap: 10,
          padding: 20,
        }}
      >
        <Text>Content position: </Text>
        <SegmentedControl
          values={["left", "center", "right"]}
          style={{ width: 300 }}
          selectedIndex={alignItems}
          onChange={(event) => {
            setAlignItems(event.nativeEvent.selectedSegmentIndex);
          }}
        />
        <Text>Layout position: </Text>
        <SegmentedControl
          values={["left", "center", "right"]}
          style={{ width: 300 }}
          selectedIndex={position}
          onChange={(event) => {
            setPosition(event.nativeEvent.selectedSegmentIndex);
          }}
        />
        <Text>Chat speed: </Text>
        <SegmentedControl
          values={Object.keys(chatSpeed)}
          style={{ width: 300 }}
          selectedIndex={Object.keys(chatSpeed).indexOf(speed)}
          onChange={(event) => {
            setSpeed(event.nativeEvent.value as keyof typeof chatSpeed);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
