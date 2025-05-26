import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  FadeOutDown,
  LinearTransition,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const sixColorfulBackgrounds = [
  "#FF0000",
  "#FF7F00",
  "#0099cc",
  "#0000FF",
  "#4B0082",
  "#9400D3",
];

const _spacing = 12;
const _activeHeight = 400;
const _linearTransition = LinearTransition.springify()
  .damping(80)
  .stiffness(200);

type ItemProps = {
  index: number;
  bg: string;
  visibleSession: number | null;
  setVisibleSession: (index: number | null) => void;
  isActive: boolean;
};

function Item({
  index,
  visibleSession,
  setVisibleSession,
  isActive,
  bg,
}: ItemProps) {
  const activeZIndex = useSharedValue(0);
  const _stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isActive ? 1.5 : 1, {
            damping: 80,
            stiffness: 200,
          }),
        },
      ],
    };
  });
  return (
    <Animated.View
      onTouchStart={() => {
        // Lazy to use a Pressable
        activeZIndex.value = 1000;
        if (index === visibleSession) {
          setVisibleSession(null);
        } else {
          setVisibleSession(index);
        }
      }}
      style={[
        {
          width: isActive ? "100%" : "50%",
          height: isActive ? _activeHeight : "auto",
          zIndex: activeZIndex,
        },
      ]}
      exiting={FadeOutDown.springify().damping(80).stiffness(200)}
      entering={FadeIn.springify().damping(80).stiffness(200)}
      layout={LinearTransition.springify()
        .damping(80)
        .stiffness(200)
        .withCallback((finished) => {
          if (finished && !isActive) {
            activeZIndex.value = 0;
          }
        })}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: bg,
            borderRadius: _spacing,
            margin: isActive ? 0 : _spacing / 2,
          },
        ]}
        layout={_linearTransition}
      />
      <Animated.View
        layout={_linearTransition}
        key={`item-${index}`}
        style={[
          {
            gap: 4,
            flex: 1,
            padding: _spacing * 2,
            justifyContent: "center",
            alignItems: isActive ? "center" : "flex-start",
          },
          _stylez,
        ]}
      >
        <Animated.Text
          style={[
            {
              fontSize: 42,
              fontWeight: "500",
              color: "white",
            },
            _stylez,
          ]}
          layout={_linearTransition}
        >
          {index * 5 + 5}m
        </Animated.Text>
        <Animated.View
          style={{
            flexDirection: "row",
            gap: _spacing / 2,
            marginTop: isActive ? _spacing : 0,
          }}
          layout={_linearTransition}
        >
          {[...Array(6).keys()].map((i) => (
            <View
              key={`dot-${i}`}
              style={{
                width: 8,
                aspectRatio: 1,
                borderRadius: 10,
                backgroundColor: "#fff",
                opacity: index >= i ? 1 : 0.4,
              }}
            />
          ))}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

export default function SessionsModal() {
  const [visibleSession, setVisibleSession] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasVisibleSession = visibleSession !== null;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Button
        title="Show Modal"
        onPress={() => setIsVisible((isVisible) => !isVisible)}
      />
      {isVisible && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut.withCallback((finished) => {
            if (finished) {
              runOnJS(setVisibleSession)(null);
            }
          })}
          onTouchStart={() => setIsVisible(false)}
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.3)",
            },
          ]}
        />
      )}
      {isVisible && (
        <Animated.View
          layout={_linearTransition}
          entering={SlideInDown.springify().damping(80).stiffness(200)}
          exiting={SlideOutDown.duration(500)}
          style={{
            position: "absolute",
            left: _spacing,
            bottom: _spacing * 4,
            right: _spacing,
            borderRadius: _spacing,
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          {/* HEADER */}
          {!hasVisibleSession && (
            <Animated.View
              layout={_linearTransition}
              exiting={FadeOutDown.springify().damping(80).stiffness(200)}
              style={{
                height: 64,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: _spacing,
                backgroundColor: "rgba(0,0,0,0.05)",
              }}
            >
              <Text style={{ fontSize: 28, fontWeight: "500", opacity: 0.7 }}>
                Start the session
              </Text>
            </Animated.View>
          )}
          {/*
            This is a dummy view to fill the space when the animating the active item.
            This is needed because the Item is positioned absolute when active so the new
            height of the parent will be 0 mostly.
          */}
          {hasVisibleSession && <View style={{ height: _activeHeight }} />}
          {/* The items list. This is taking full advantage of Reanimated layout animations */}
          <Animated.View
            layout={_linearTransition}
            style={{
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
              padding: hasVisibleSession ? 0 : _spacing,
              // gap: _spacing / 2,
              position: hasVisibleSession ? "absolute" : "relative",
            }}
          >
            {sixColorfulBackgrounds.map((bg, index) => {
              const isActive = index === visibleSession;
              if (!isActive && hasVisibleSession) {
                return;
              }
              return (
                <Item
                  key={`bg-${index}`}
                  bg={bg}
                  index={index}
                  visibleSession={visibleSession}
                  setVisibleSession={setVisibleSession}
                  isActive={isActive}
                />
              );
            })}
          </Animated.View>
          {hasVisibleSession ? (
            <Animated.View
              onTouchStart={() => {
                // We handle reset from exiting callback, check the withCallback on exiting
                setIsVisible(false);
              }}
              style={{
                paddingVertical: _spacing,
                margin: _spacing,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: _spacing,
                backgroundColor: "rgba(255,255,255, 0.1)",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                // zIndex: 10000,
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>
                Start the session
              </Text>
            </Animated.View>
          ) : (
            <Animated.View
              onTouchStart={() => setIsVisible(false)}
              style={{
                paddingVertical: _spacing,
                margin: _spacing,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: _spacing,
                backgroundColor: "rgba(0,0,0,0.05)",
              }}
            >
              <Text style={{ fontSize: 18 }}>Cancel</Text>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </View>
  );
}
