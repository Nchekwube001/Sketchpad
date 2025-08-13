import LiquidSwitchComponent from "@/components/LiquidSwitchComponent";

export default function App() {
  return (
    <LiquidSwitchComponent
      size={100}
      onChange={(val) => console.log("Switched to", val)}
      trackColors={{
        true: "#00C853",
        false: "#CFD8DC",
      }}
      images={{
        true: {
          //   source: require("@/assets/check.png"),
          source: "",
          width: 24,
          height: 24,
          color: "rgba(255,255,255,0.8)",
        },
        false: {
          //   source: require("@/assets/cross.png"),
          source: "",

          width: 24,
          height: 24,
          color: "rgba(255,255,255,0.8)",
        },
      }}
    />
  );
}
