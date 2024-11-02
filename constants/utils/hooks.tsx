import { useCallback, useState } from "react";
import { LayoutChangeEvent } from "react-native";

export const useComponentSize = () => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width: Math.round(width), height: Math.round(height) });
  }, []);

  return { size, onLayout };
};
