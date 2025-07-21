import { Button, View } from "react-native";
import React, { useEffect } from "react";
import LayoutWithSafeArea from "@/components/layout/LayoutWithSafeArea";
import TextComponent from "@/components/text/TextComponent";
import globalStyle from "@/globalStyle/globalStyle";
import { useLocalSearchParams } from "expo-router";
// import {} from 'expo/fetch'
const PostAnalysis = () => {
  const { postContent } = useLocalSearchParams();
  console.log({
    postContent,
  });

  useEffect(() => {
    fetchPostAnalysis();
  }, []);

  async function fetchPostAnalysis() {
    // const response = await fetch("api/post");
    const response = await fetch("http://localhost:8081/api/ai", {
      method: "POST",
      body: JSON.stringify({ content: postContent }),
    });
  }

  return (
    <LayoutWithSafeArea>
      <View style={[globalStyle.px2, { gap: 12 }]}>
        <TextComponent
          style={[
            globalStyle.textBlackPrimary,
            globalStyle.fontSize32,
            globalStyle.pb1p2,
            globalStyle.pt2p4,
          ]}
        >
          Post Analysis
        </TextComponent>
        <RecomendBox title={"RECOMMENDED TITLE"} content={"Title"} />
        <RecomendBox title={"RECOMMENDED CONTENT"} content={"Content"} />
        <RecomendBox
          title={"WHAT I THINK ABOUT THIS POST"}
          content={"Thoughts"}
        />
        <RecomendBox title={"OVERALL POST QUALITY"} content={"Post Rate"} />

        <View
          style={[
            globalStyle.flexrow,
            globalStyle.justifyCenter,
            globalStyle.alignItemsCenter,
            { gap: 12 },
          ]}
        >
          <Button title="Acept" />
        </View>
      </View>
    </LayoutWithSafeArea>
  );
};

export default PostAnalysis;

const RecomendBox = ({
  content,
  title,
}: {
  title: string;
  content: string;
}) => {
  return (
    <View>
      <TextComponent style={[globalStyle.textBlackSecondary]}>
        &nbsp;{title}
      </TextComponent>
      <View
        style={[
          globalStyle.bgGray,
          globalStyle.p1p2,
          globalStyle.borderRadius16,
          globalStyle.justifyCenter,
          globalStyle.mt1p2,
        ]}
      >
        <TextComponent style={[globalStyle.textBlackPrimary]}>
          {content}
        </TextComponent>
      </View>
    </View>
  );
};
