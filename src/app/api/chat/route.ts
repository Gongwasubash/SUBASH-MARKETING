import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Simple response without streaming
    const response = {
      id: "chatcmpl-" + Date.now(),
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: "gpt-4",
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: "Hello! I am SUBASH AI. I received your message and I'm working correctly. How can I help you today?"
        },
        finish_reason: "stop"
      }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 20,
        total_tokens: 30
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ 
      error: "Chat failed", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
