import { TextInput, View } from "react-native";
import { useRef, useState } from "react";
import AnimatedNumberComponent from "@/components/AnimatedNumberComponent";

export default function App() {
  const [number, setNumber] = useState("");
  const inputRef = useRef(null);

  return (
    <View style={{ flex: 1, width: "100%", backgroundColor: "black" }}>
      <AnimatedNumberComponent
        number={number}
        textStyle={{ fontSize: 18 }}
        containerStyle={{ width: "100%", justifyContent: "center" }}
        separatorAnimation="swap"
        separator="comma"
        animationConfig={{
          type: "spring",
          damping: 20,
          stiffness: 120,
        }}
      />
      <View
        style={{
          backgroundColor: "red",
        }}
      >
        <TextInput
          ref={inputRef}
          autoFocus
          style={{
            width: "100%",
            height: 0,
            backgroundColor: "transparent",
            position: "absolute",
            bottom: 0,
          }}
          onChangeText={setNumber}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}
