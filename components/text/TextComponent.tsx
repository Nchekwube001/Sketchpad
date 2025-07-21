import { StyleProp, Text, TextStyle } from "react-native";
import React, { FC } from "react";
interface textProps {
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  onPress?: () => void;
  children: any;
}
const TextComponent: FC<textProps> = ({
  numberOfLines,
  style,
  children,
  onPress,
}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      onPress={onPress}
      allowFontScaling={false}
      // className="text-sm text-black"
      className="text-black"
      style={[style]}
    >
      {children}
    </Text>
  );
};

export default TextComponent;
