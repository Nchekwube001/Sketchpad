import { Button, View } from "react-native";
import React, { useEffect, useState } from "react";
import LayoutWithSafeArea from "@/components/layout/LayoutWithSafeArea";
import TextComponent from "@/components/text/TextComponent";
import globalStyle from "@/globalStyle/globalStyle";
import { useLocalSearchParams } from "expo-router";
import { fetch } from "expo/fetch";
interface aiResponse {
  title: string;
  content: string;
  thought: string;
  post_rate: number;
}
const PostAnalysis = () => {
  const { postContent } = useLocalSearchParams();
  const [response, setResponse] = useState<aiResponse | null>(null);
  const [partialJson, setPartialJson] = useState("");
  //   useEffect(() => {
  //     fetchPostAnalysis();
  //   }, []);

  async function fetchPostAnalysis() {
    // const response = await fetch("api/post");
    const response = await fetch("http://localhost:8081/api/ai", {
      method: "POST",
      body: JSON.stringify({ content: postContent }),
    });
    if (!response.ok) {
      console.error("Failed to fetch ai", response);

      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = (await reader?.read()) as any;
      if (done) break;
      const text = decoder.decode(value, {
        stream: true,
      });

      processChunk(text);
    }
  }
  const processChunk = (chunk: string) => {
    try {
      const accumulatedData = partialJson + chunk;
      try {
        const parsedData = JSON.parse(accumulatedData);
        setResponse(parsedData);
        setPartialJson("");
      } catch (error) {
        setPartialJson(accumulatedData);
      }
    } catch (e) {
      console.error("Error processing chunk", e);
    }
  };
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
        <RecomendBox
          title={"RECOMMENDED TITLE"}
          content={response?.title ?? ""}
        />
        <RecomendBox
          title={"RECOMMENDED CONTENT"}
          content={response?.content ?? ""}
        />
        <RecomendBox
          title={"WHAT I THINK ABOUT THIS POST"}
          content={response?.thought ?? ""}
        />
        <RecomendBox
          title={"OVERALL POST QUALITY"}
          content={`${response?.post_rate ?? ""}`}
        />

        <View
          style={[
            globalStyle.flexrow,
            globalStyle.justifyCenter,
            globalStyle.alignItemsCenter,
            { gap: 12 },
          ]}
        >
          <Button title="Reject" color={"rgb(255,0,0)"} />
          <Button title="Accept" />
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
