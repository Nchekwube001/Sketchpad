import MemoScratchCard from "@/components/ScratchCardComponent";
import { Rect } from "@shopify/react-native-skia";
import { Image } from "expo-image";

export default function App() {
  return (
    <MemoScratchCard containerStyle={{ width: 300, height: 300 }}>
      <MemoScratchCard.Behind>
        {/* Content shown after scratching */}
        <Image
          source={require("@/assets/images/cd.png")}
          style={{ width: 300, height: 300 }}
        />
      </MemoScratchCard.Behind>
      <MemoScratchCard.Overlay>
        {/* Scratchable surface */}
        <Rect x={0} y={0} width={300} height={300} color="#ccc" />
      </MemoScratchCard.Overlay>
    </MemoScratchCard>
  );
}
