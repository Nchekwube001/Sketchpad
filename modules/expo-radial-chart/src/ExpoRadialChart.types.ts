import type { StyleProp, ViewStyle } from "react-native";

export type OnLoadEventPayload = {
  url: string;
};

export type ExpoRadialChartModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type ExpoRadialChartViewProps = {
  style?: ViewStyle;
  data: Series[];
  centerText: string;
};

export type Series = {
  color: string;
  percentage: number;
};
