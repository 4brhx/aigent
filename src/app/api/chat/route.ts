import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface ChatRequest {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { model, messages, temperature = 0.7, maxTokens = 4096, stream = false } = body;

    // Determine provider from model name
    const provider = getProvider(model);
    
    if (stream) {
      return handleStream(provider, model, messages, temperature, maxTokens);
    }

    const response = await callModel(provider, model, messages, temperature, maxTokens);
    
    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function getProvider(model: string): string {
  if (model.startsWith("gemini")) return "gemini";
  if (model.startsWith("claude")) return "claude";
  if (model.startsWith("gpt")) return "openai";
  if (model.startsWith("deepseek")) return "deepseek";
  return "openai";
}

async function callModel(
  provider: string,
  model: string,
  messages: { role: string; content: string }[],
  temperature: number,
  maxTokens: number
) {
  switch (provider) {
    case "gemini":
      return callGemini(model, messages, temperature, maxTokens);
    case "claude":
      return callClaude(model, messages, temperature, maxTokens);
    case "openai":
      return callOpenAI(model, messages, temperature, maxTokens);
    case "deepseek":
      return callDeepSeek(model, messages, temperature, maxTokens);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

async function callGemini(
  model: string,
  messages: { role: string; content: string }[],
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      }),
    }
  );

  if (!response.ok) throw new Error(`Gemini error: ${response.statusText}`);
  const data = await response.json();

  return {
    content: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
    model,
    provider: "gemini",
    tokens: {
      input: data.usageMetadata?.promptTokenCount || 0,
      output: data.usageMetadata?.candidatesTokenCount || 0,
    },
  };
}

async function callClaude(
  model: string,
  messages: { role: string; content: string }[],
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const systemMessage = messages.find((m) => m.role === "system")?.content;
  const chatMessages = messages.filter((m) => m.role !== "system");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: chatMessages,
      ...(systemMessage && { system: systemMessage }),
    }),
  });

  if (!response.ok) throw new Error(`Claude error: ${response.statusText}`);
  const data = await response.json();

  return {
    content: data.content?.[0]?.text || "",
    model,
    provider: "claude",
    tokens: {
      input: data.usage?.input_tokens || 0,
      output: data.usage?.output_tokens || 0,
    },
  };
}

async function callOpenAI(
  model: string,
  messages: { role: string; content: string }[],
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI error: ${response.statusText}`);
  const data = await response.json();

  return {
    content: data.choices?.[0]?.message?.content || "",
    model,
    provider: "openai",
    tokens: {
      input: data.usage?.prompt_tokens || 0,
      output: data.usage?.completion_tokens || 0,
    },
  };
}

async function callDeepSeek(
  model: string,
  messages: { role: string; content: string }[],
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY not configured");

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) throw new Error(`DeepSeek error: ${response.statusText}`);
  const data = await response.json();

  return {
    content: data.choices?.[0]?.message?.content || "",
    model,
    provider: "deepseek",
    tokens: {
      input: data.usage?.prompt_tokens || 0,
      output: data.usage?.completion_tokens || 0,
    },
  };
}

function handleStream(
  provider: string,
  model: string,
  messages: { role: string; content: string }[],
  temperature: number,
  maxTokens: number
) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // For streaming, we use SSE format
        const response = await callModel(provider, model, messages, temperature, maxTokens);
        
        // Simulate streaming by chunking the response
        const words = response.content.split(" ");
        for (const word of words) {
          const data = JSON.stringify({ token: word + " ", done: false });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          await new Promise((r) => setTimeout(r, 30));
        }

        // Send completion signal
        const doneData = JSON.stringify({
          done: true,
          tokens: response.tokens,
          model: response.model,
          provider: response.provider,
        });
        controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
        controller.close();
      } catch (error: any) {
        const errorData = JSON.stringify({ error: error.message });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
