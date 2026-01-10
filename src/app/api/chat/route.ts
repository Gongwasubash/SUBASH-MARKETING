import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { transformStream } from "@crayonai/stream";
import { DBMessage, getMessageStore } from "./messageStore";
import { tools } from "./tools";

export async function POST(req: NextRequest) {
  try {
    const { prompt, threadId, responseId } = (await req.json()) as {
      prompt: DBMessage;
      threadId: string;
      responseId: string;
    };
    
    const client = new OpenAI({
      baseURL: "https://api.thesys.dev/v1/embed/",
      apiKey: process.env.THESYS_API_KEY,
    });
    
    const messageStore = getMessageStore(threadId);
    messageStore.addMessage(prompt);

    const llmStream = await client.beta.chat.completions.runTools({
      model: "c1/openai/gpt-4o/v-20241230",
      temperature: 0.7,
      messages: messageStore.getOpenAICompatibleMessageList(),
      stream: true,
      tool_choice: tools.length > 0 ? "auto" : "none",
      tools,
    });

    const responseStream = transformStream(
      llmStream,
      (chunk) => {
        return chunk.choices?.[0]?.delta?.content ?? "";
      },
      {
        onEnd: ({ accumulated }) => {
          const message = accumulated.filter((message) => {
            return message;
          }).join("");
          messageStore.addMessage({
            role: "assistant",
            content: message,
            id: responseId,
          });
        },
      }
    ) as ReadableStream<string>;

    return new NextResponse(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: "Chat failed", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
