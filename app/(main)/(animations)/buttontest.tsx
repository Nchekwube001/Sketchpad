import { View, Text } from "react-native";
import React from "react";
import ButtonHeat from "@/components/ui/ButtonHeat";
import TextComponent from "@/components/text/TextComponent";

const ButtonTest = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          height: 50,
          width: "100%",
          backgroundColor: "black",
          alignSelf: "center",
        }}
      >
        <ButtonHeat
          popColor="#000234"
          children={
            <>
              <TextComponent>Asdiy</TextComponent>
            </>
          }
        />
      </View>
    </View>
  );
};

export default ButtonTest;
