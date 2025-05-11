import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import dayjs from "dayjs";
import LayoutWithSafeArea from "@/components/layout/LayoutWithSafeArea";
import { LegendList } from "@legendapp/list";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyle, { width } from "@/globalStyle/globalStyle";
import TextComponent from "@/components/text/TextComponent";
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
const _maxDays = 60;
const _formatter = "YYYY-MM-DD";
const startOfWeek = dayjs().startOf("week");
const _daysToDisplay = 5;
const _daySize = width / (_daysToDisplay + 1);
const _hourSize = _daySize * 1.4;

const days = [...Array(_maxDays).keys()].map((_, i) => {
  const day = startOfWeek.add(i, "day");

  return {
    day,
    formatted: day.format(_formatter),
  };
  //   .format(_formatter)
});
const GoogleCalendar = () => {
  const headerRef = useAnimatedRef<Animated.ScrollView>();
  const dateRef = useAnimatedRef<Animated.ScrollView>();
  const contentRef = useAnimatedRef<Animated.FlatList<(typeof days)[number]>>();
  const scrollX = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    const xVal = e.contentOffset.x;
    scrollX.value = xVal;
    scrollTo(headerRef, scrollX.value, 0, false);
  });
  const onScrollY = useAnimatedScrollHandler((e) => {
    const yval = e.contentOffset.y;
    scrollY.value = yval;
    scrollTo(dateRef, 0, scrollY.value, false);
  });

  //   useAnimatedReaction(
  //     () => scrollX.value,
  //     (value) => {
  //       scrollTo(headerRef, value, 0, false);
  //     }
  //   );
  //   useAnimatedReaction(
  //     () => scrollY.value,
  //     (value) => {
  //       scrollTo(dateRef, 0, value, false);
  //     }
  //   );
  const hoursBlock = useMemo(() => {
    const startOfDay = dayjs().startOf("day").set("hour", 0).set("minute", 0);
    return [...Array(24).keys()].map((hour) => startOfDay.add(hour, "hour"));
  }, []);
  return (
    <SafeAreaView style={[globalStyle.flexOne]}>
      <View style={[globalStyle.flexOne, globalStyle.flexrow, globalStyle.w10]}>
        <View>
          <Animated.ScrollView
            onScroll={onScroll}
            ref={dateRef}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            style={{
              width: _daySize,
              // position: "absolute",
              marginTop: _hourSize,
            }}
          >
            {hoursBlock.map((hour, index) => {
              return (
                <View
                  style={[
                    styles.borderRight,
                    styles.borderBottom,
                    {
                      // backgroundColor:
                      //   index % 2 === 0 ? "#ff0000" : "#00ff00",
                      //   borderBottomWidth: 1,
                      //   borderBottomColor: "#ddd",
                      height: _hourSize,
                      width: _daySize,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      //   backgroundColor: `hsl(${index + 15}, 100%, 90%)`,
                    },
                  ]}
                  key={`hour-${hour.toString()}`}
                >
                  <Text>{hour.format("H A")}</Text>
                </View>
              );
            })}
          </Animated.ScrollView>
        </View>
        <View style={[globalStyle.flexOne]}>
          <View>
            <Animated.ScrollView
              ref={headerRef}
              onScroll={onScroll}
              horizontal
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              snapToInterval={_daySize}
              decelerationRate={"fast"}
              scrollEventThrottle={16}
              //   style={{
              //     marginLeft: _daySize,
              //   }}
              //   contentContainerStyle={{
              //     gap: 8,
              //   }}
            >
              {days.map((item, index) => {
                const [dayNum, dayText] = item.day.format("DD_ddd").split("_");

                return (
                  <View
                    key={item.formatted}
                    style={{
                      alignItems: "center",
                      width: _daySize,
                      height: _hourSize,
                      backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#fff",
                      justifyContent: "flex-end",
                      paddingBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 24,
                      }}
                    >
                      {dayNum}
                    </Text>
                    <Text>{dayText}</Text>
                  </View>
                );
              })}
            </Animated.ScrollView>
          </View>
          <View style={[globalStyle.flexOne]}>
            <Animated.ScrollView
              bounces={false}
              onScroll={onScrollY}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              decelerationRate={"fast"}
              nestedScrollEnabled={true}
            >
              <Animated.FlatList
                ref={contentRef}
                onScroll={onScroll}
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={days}
                style={{
                  //   marginLeft: _daySize,
                  flex: 1,
                }}
                snapToInterval={_daySize}
                decelerationRate={"fast"}
                // scrollEventThrottle={''}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      width: _daySize,
                      backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#fff",
                      //   backgroundColor: "#fff",
                    }}
                  >
                    {hoursBlock.map((hour) => {
                      return (
                        <View
                          style={[
                            styles.borderBottom,
                            styles.borderRight,
                            {
                              // backgroundColor:
                              //   index % 2 === 0 ? "#ff0000" : "#00ff00",

                              height: _hourSize,
                              justifyContent: "center",
                              alignItems: "center",
                            },
                          ]}
                          key={`item-${item.formatted}-hour-${hour}`}
                        >
                          <TextComponent style={[globalStyle.fontSize10]}>
                            {hour.format("HH:mm A")}
                          </TextComponent>
                        </View>
                      );
                    })}
                  </View>
                )}
                // recycleItems
                // estimatedItemSize={60}
                keyExtractor={(item) => item.formatted}
              />
            </Animated.ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GoogleCalendar;

const styles = StyleSheet.create({
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: "#e6e6e6",
  },
  borderBottom: {
    borderBottomColor: "#e6e6e6",
    borderBottomWidth: 1,
  },
});
