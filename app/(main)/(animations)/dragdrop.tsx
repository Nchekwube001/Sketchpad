import globalStyle from "@/globalStyle/globalStyle";
import { DragDropContentView } from "expo-drag-drop-content-view";
import { useState } from "react";
export const IDragDropContentView = (props) => {
  const [sources, setSources] = useState<any[] | null>(null);

  return (
    <DragDropContentView
      onDrop={(event) => {
        setSources(event.assets);
      }}
      style={[globalStyle.flexOne]}
    />
  );
};
