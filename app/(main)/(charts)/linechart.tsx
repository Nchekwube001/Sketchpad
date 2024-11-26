import { View, Text, useColorScheme, Button } from "react-native";
import React, { useState } from "react";
import {
  Circle,
  LinearGradient,
  useFont,
  Text as SkText,
} from "@shopify/react-native-skia";
import globalStyle from "@/globalStyle/globalStyle";
import { Area, CartesianChart, Line, useChartPressState } from "victory-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
const spaceMono = require("../../../assets/fonts/SpaceMono-Regular.ttf");
export const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));
export const DATA2 = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 80 + 10 * Math.random(),
}));

const LineChart = () => {
  const font = useFont(spaceMono, 12);
  const chartFont = useFont(spaceMono, 30);
  const colorMode = useColorScheme();
  const labelColor = colorMode === "dark" ? "white" : "black";
  const lineColor = colorMode === "dark" ? "lightgrey" : "black";
  const [chartData, setChartData] = useState(DATA);
  const { state, isActive } = useChartPressState({
    x: 0,
    y: {
      highTmp: 0,
    },
  });

  const value = useDerivedValue(
    () => `$ ${state.y.highTmp.value.value.toFixed(2)}`
  );
  const onPress = () => {
    // if (chartData === DATA) {
    //   setChartData(DATA2);
    // } else {
    //   setChartData(DATA);
    // }
    setChartData(
      Array.from({ length: 31 }, (_, i) => ({
        day: i,
        highTmp: 80 + 10 * Math.random(),
      }))
    );
  };
  return (
    <View
      style={[
        globalStyle.flexOne,
        globalStyle.bgBlack,
        globalStyle.alignItemsCenter,
        globalStyle.px1,
        globalStyle.py2,
      ]}
    >
      <View style={[globalStyle.pt2, globalStyle.w9, globalStyle.h6]}>
        <CartesianChart
          data={chartData}
          xKey={"day"}
          yKeys={["highTmp"]}
          domainPadding={{ top: 30 }}
          axisOptions={{
            font,
            labelColor,
            lineColor,
          }}
          chartPressState={state}
        >
          {({ chartBounds, points }) => {
            return (
              <>
                {isActive && (
                  <SkText
                    text={value}
                    x={chartBounds.left + 40}
                    y={40}
                    font={font}
                    color={labelColor}
                    style={"fill"}
                  />
                )}
                <Line
                  points={points.highTmp}
                  color={"lightgreen"}
                  animate={{
                    type: "timing",
                    duration: 500,
                  }}
                  strokeWidth={3}
                />

                {/* <Area
                  points={points.highTmp}
                  animate={{
                    type: "timing",
                    duration: 500,
                  }}
                  y0={chartBounds.bottom}
                >
                  <LinearGradient
                    start={{ x: chartBounds.bottom, y: 200 }}
                    end={{
                      x: chartBounds.bottom,
                      y: chartBounds.bottom,
                    }}
                    colors={["green", "#90ee9050"]}
                  />
                </Area> */}
                {isActive && (
                  <Tooltip x={state.x.position} y={state.y.highTmp.position} />
                )}
              </>
            );
          }}
        </CartesianChart>
      </View>

      <View>
        <Button title="Animate" onPress={onPress} />
      </View>
    </View>
  );
};

const Tooltip = ({
  x,
  y,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
}) => {
  return <Circle cx={x} cy={y} color={"grey"} opacity={0.8} r={10} />;
};
export default LineChart;
