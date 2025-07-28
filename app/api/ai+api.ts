import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat, zodTextFormat } from "openai/helpers/zod";
import { JSONSchema } from "zod/v4/core";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});
const responseObject = z.object({
  title: z.string(),
  content: z.string(),
  thought: z.string(),
  post_rate: z.coerce.number(),
});
export async function POST(request: Request) {
  console.log("POST Requst received in ai");
  const { content } = await request.json();
  if (!content) {
    return new Response("No content provided", {
      status: 400,
    });
  }
  try {
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const completion = openai.chat.completions
      .stream({
        model: "gpt-4o-mini",
        stream: true,
        response_format: {
          type: "json_schema",
          json_schema: {
            schema: z.toJSONSchema(responseObject),
            name: "post",
          },
        },
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that helps improve posts for social media. You wil be given a post and you need to improve it",
            // "You are an assistant that helps improve posts for social media. You wil be given a post and you need to improve it, making it a 6000 page post, do that elegantly and stream the response",
          },
          {
            role: "user",
            content: `Here is the content: ${content}`,
          },
        ],
      })
      .on("content.delta", async ({ delta, parsed }) => {
        // console.log("📦 Delta received:", { delta });
        // console.log("📦 parsed received:", { parsed });
        // await writer.write(encoder.encode(JSON.stringify(delta)));
        return await writer.write(encoder.encode(delta));
      })
      .on("content.done", async () => {
        console.log("✅ Stream done");
        return await writer.close();
      })
      .on("error", async (err) => {
        console.error("❌ Stream error:", err);
        await writer.close();
      });

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.log({
      chatError: e,
    });

    return new Response("Error", {
      status: 500,
    });
  }
}
