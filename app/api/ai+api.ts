import openAi from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new openAi({
  apiKey: process.env.OPEN_AI_KEY,
});
const responseObject = z.object({
  title: z.string(),
  content: z.string(),
  thought: z.string(),
  post_rate: z.number(),
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
    // setup streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    //chat stream
    const completion = openai.chat.completions
      .stream({
        model: "gpt-4o-2024-05-13",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that helps improve posts for social media. You wil be given a post and you need to improve it",
          },
          {
            role: "user",
            content: `Here is the content: ${content}`,
          },
        ],
        response_format: zodResponseFormat(responseObject, "post"),
      })
      .on(
        "content.delta",
        async ({ parsed }) =>
          await writer.write(encoder.encode(JSON.stringify(parsed)))
      )
      .on("content.done", async () => await writer.close());

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    return new Response("Error", {
      status: 500,
    });
  }
}
