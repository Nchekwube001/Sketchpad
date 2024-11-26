import { AppBreakpoints, AppThemes } from "./constants/theme/unistyles";

declare module "react-native-unistyles" {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}
