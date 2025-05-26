import { Marquee } from "@animatereactnative/marquee";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Dimensions, Platform, Pressable, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";
// Grabbed from https://everyaiimage.com/
// Script used:
/*
copy(JSON.stringify([...document.querySelectorAll('.grid-column .relly > img')].map(x => x.src).slice(0, 50), null, 2))

*/

export const aiMock = [
  "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWl8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWl8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YWl8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFpfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1625314868143-20e93ce3ff33?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFpfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1673255745677-e36f618550d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFpfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1546188994-07c34f6e5e1b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnV0dXJlfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1573537805874-4cedc5d389ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnV0dXJlfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1519493442754-8eb0a6cec050?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1561555642-29be0d2dee1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1599394407175-b6da85464b90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1553152531-b98a2fc8d3bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1668234694846-c751b842b220?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1669916850011-1f7ee9bb00d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWl8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWl8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YWl8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFpfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1625314868143-20e93ce3ff33?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFpfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1673255745677-e36f618550d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFpfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1546188994-07c34f6e5e1b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnV0dXJlfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1573537805874-4cedc5d389ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnV0dXJlfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1519493442754-8eb0a6cec050?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1561555642-29be0d2dee1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1599394407175-b6da85464b90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1553152531-b98a2fc8d3bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1668234694846-c751b842b220?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1669916850011-1f7ee9bb00d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1599394407175-b6da85464b90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZ1dHVyZXxlbnwwfHwwfHx8MA%3D%3D",
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const { width } = Dimensions.get("window");
const _itemSize = Platform.OS === "web" ? width * 0.24 : width * 0.45;
const _spacing = Platform.OS === "web" ? 12 : 8;
const _bgColor = "#0C0820";
const _buttonColor = "#8F38FE";
const _initialDelay = 200;
const _duration = 500;

function chunkArray(array: string[], size: number) {
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
}

export default function AiPlaygroundHome() {
  const images = useMemo(
    () => chunkArray(aiMock, Math.floor(aiMock.length / 3)),
    []
  );
  return (
    <View style={{ flex: 1, backgroundColor: _bgColor, overflow: "hidden" }}>
      <View style={{ flex: 1, overflow: "hidden" }}>
        <View
          style={{
            flex: 1,
            gap: _spacing,
            transform: [
              {
                rotate: Platform.OS === "web" ? "-4deg" : "-4deg",
              },
            ],
          }}
        >
          {images.map((column, columnIndex) => (
            <Marquee
              speed={Platform.OS === "web" ? 1 : 0.2}
              spacing={_spacing}
              key={`marquee-${columnIndex}`}
              reverse={columnIndex % 2 !== 0}
            >
              <View style={{ flexDirection: "row", gap: _spacing }}>
                {column.map((image, index) => (
                  <Animated.Image
                    key={`image-for-column-${columnIndex}-${index}`}
                    source={{ uri: image }}
                    entering={
                      columnIndex % 2 === 0
                        ? FadeInRight.duration(_duration).delay(
                            _initialDelay * (columnIndex + 1) +
                              Math.random() * 100
                          )
                        : FadeInLeft.duration(_duration).delay(
                            _initialDelay * (columnIndex + 1) +
                              Math.random() * 100
                          )
                    }
                    style={{
                      width: _itemSize,
                      aspectRatio: 1,
                      borderRadius: _spacing,
                    }}
                  />
                ))}
              </View>
            </Marquee>
          ))}
        </View>
        <LinearGradient
          colors={["#00000000", _bgColor, _bgColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.7, 1]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "30%",
          }}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[_bgColor, _bgColor, "#00000000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, Platform.OS === "web" ? 0.1 : 0.3, 1]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: Platform.OS === "web" ? "25%" : "15%",
          }}
          pointerEvents="none"
        />
      </View>
      <View
        style={{
          flex: 0.5,
          paddingTop: _spacing * 2,
          alignItems: "center",
          paddingHorizontal: _spacing,
          gap: _spacing,
        }}
      >
        <Animated.Text
          entering={FadeInDown.springify()
            .damping(12)
            .delay(_initialDelay + 100)}
          style={{ color: "#fff", fontSize: 28, textAlign: "center" }}
        >
          Unlock Your{" "}
          <Text style={{ fontWeight: "bold" }}>Creative{"\n"}Potential</Text>{" "}
          with Al
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.springify()
            .damping(12)
            .delay(_initialDelay + 200)}
          style={{
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            paddingHorizontal: _spacing,
          }}
        >
          Imagination effortlessly crafts beautiful images in an instant.
        </Animated.Text>
        <AnimatedPressable
          entering={FadeInDown.springify()
            .damping(12)
            .delay(_initialDelay + 300)}
          onPress={() => {}}
          style={{ marginTop: _spacing * 2 }}
        >
          <View
            style={{
              height: 48,
              borderRadius: 32,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: _buttonColor,
              paddingHorizontal: _spacing * 3,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              🪄 Start generating images
            </Text>
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}
