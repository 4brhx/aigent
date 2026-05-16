import type { Message, ModelId, ModelProvider } from "@/lib/types";
import { getModelById } from "./models";
import { modelRouter } from "./router";

// ============================================================
// Multi-Model AI Service
// ============================================================

interface ChatOptions {
  model: ModelId;
  messages: { role: string; content: string }[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: Record<string, unknown>[];
}

interface ChatResponse {
  content: string;
  model: ModelId;
  provider: ModelProvider;
  tokens: { input: number; output: number };
  responseTime: number;
  cost: number;
}

interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (response: ChatResponse) => void;
  onError: (error: Error) => void;
}

class AIService {
  private apiKeys: Record<ModelProvider, string> = {
    gemini: process.env.GEMINI_API_KEY || "",
    claude: process.env.ANTHROPIC_API_KEY || "",
    openai: process.env.OPENAI_API_KEY || "",
    deepseek: process.env.DEEPSEEK_API_KEY || "",
  };

  /**
   * Send a chat completion request with automatic routing
   */
  async chat(options: ChatOptions): Promise<ChatResponse> {
    const model = getModelById(options.model);
    if (!model) throw new Error(`Model ${options.model} not found`);

    const startTime = Date.now();

    try {
      const response = await this.callProvider(model.provider, options);
      const responseTime = Date.now() - startTime;

      modelRouter.recordLatency(options.model, responseTime);

      const cost =
        (response.tokens.input / 1000) * model.costPer1kInput +
        (response.tokens.output / 1000) * model.costPer1kOutput;

      return {
        ...response,
        model: options.model,
        provider: model.provider,
        responseTime,
        cost,
      };
    } catch (error) {
      // Automatic failover
      const fallback = modelRouter.getFailover(options.model);
      console.warn(`Failover from ${options.model} to ${fallback.id}:`, error);

      const response = await this.callProvider(fallback.provider, {
        ...options,
        model: fallback.id,
      });
      const responseTime = Date.now() - startTime;

      const cost =
        (response.tokens.input / 1000) * fallback.costPer1kInput +
        (response.tokens.output / 1000) * fallback.costPer1kOutput;

      return {
        ...response,
        model: fallback.id,
        provider: fallback.provider,
        responseTime,
        cost,
      };
    }
  }

  /**
   * Stream a chat completion with callbacks
   */
  async stream(options: ChatOptions, callbacks: StreamCallbacks): Promise<void> {
    const model = getModelById(options.model);
    if (!model) throw new Error(`Model ${options.model} not found`);

    const startTime = Date.now();

    try {
      await this.streamFromProvider(model.provider, options, callbacks, startTime);
    } catch (error) {
      const fallback = modelRouter.getFailover(options.model);
      console.warn(`Stream failover from ${options.model} to ${fallback.id}`);

      try {
        await this.streamFromProvider(
          fallback.provider,
          { ...options, model: fallback.id },
          callbacks,
          startTime
        );
      } catch (fallbackError) {
        callbacks.onError(fallbackError as Error);
      }
    }
  }

  /**
   * Compare responses from multiple models
   */
  async compare(
    models: ModelId[],
    messages: { role: string; content: string }[],
    options?: Partial<ChatOptions>
  ): Promise<ChatResponse[]> {
    const promises = models.map((modelId) =>
      this.chat({
        model: modelId,
        messages,
        temperature: options?.temperature,
        maxTokens: options?.maxTokens,
      }).catch((error) => ({
        content: `Error: ${error.message}`,
        model: modelId,
        provider: getModelById(modelId)?.provider || "openai",
        tokens: { input: 0, output: 0 },
        responseTime: 0,
        cost: 0,
      }))
    );

    return Promise.all(promises) as Promise<ChatResponse[]>;
  }

  // Provider-specific implementations

  private async callProvider(
    provider: ModelProvider,
    options: ChatOptions
  ): Promise<Omit<ChatResponse, "model" | "provider" | "responseTime" | "cost">> {
    switch (provider) {
      case "gemini":
        return this.callGemini(options);
      case "claude":
        return this.callClaude(options);
      case "openai":
        return this.callOpenAI(options);
      case "deepseek":
        return this.callDeepSeek(options);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private async callGemini(options: ChatOptions) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent?key=${this.apiKeys.gemini}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: options.messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 4096,
          },
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`);
    const data = await response.json();

    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
      tokens: {
        input: data.usageMetadata?.promptTokenCount || 0,
        output: data.usageMetadata?.candidatesTokenCount || 0,
      },
    };
  }

  private async callClaude(options: ChatOptions) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKeys.claude,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: options.model,
        max_tokens: options.maxTokens || 4096,
        temperature: options.temperature || 0.7,
        messages: options.messages.filter((m) => m.role !== "system"),
        system: options.messages.find((m) => m.role === "system")?.content,
      }),
    });

    if (!response.ok) throw new Error(`Claude API error: ${response.statusText}`);
    const data = await response.json();

    return {
      content: data.content?.[0]?.text || "",
      tokens: {
        input: data.usage?.input_tokens || 0,
        output: data.usage?.output_tokens || 0,
      },
    };
  }

  private async callOpenAI(options: ChatOptions) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKeys.openai}`,
      },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4096,
      }),
    });

    if (!response.ok) throw new Error(`OpenAI API error: ${response.statusText}`);
    const data = await response.json();

    return {
      content: data.choices?.[0]?.message?.content || "",
      tokens: {
        input: data.usage?.prompt_tokens || 0,
        output: data.usage?.completion_tokens || 0,
      },
    };
  }

  private async callDeepSeek(options: ChatOptions) {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKeys.deepseek}`,
      },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4096,
      }),
    });

    if (!response.ok) throw new Error(`DeepSeek API error: ${response.statusText}`);
    const data = await response.json();

    return {
      content: data.choices?.[0]?.message?.content || "",
      tokens: {
        input: data.usage?.prompt_tokens || 0,
        output: data.usage?.completion_tokens || 0,
      },
    };
  }

  private async streamFromProvider(
    provider: ModelProvider,
    options: ChatOptions,
    callbacks: StreamCallbacks,
    startTime: number
  ): Promise<void> {
    const model = getModelById(options.model);
    if (!model) throw new Error("Model not found");

    // Simplified streaming implementation
    // In production, each provider has its own SSE format
    const response = await this.callProvider(provider, options);

    // Simulate streaming by splitting content
    const words = response.content.split(" ");
    let accumulated = "";

    for (const word of words) {
      accumulated += (accumulated ? " " : "") + word;
      callbacks.onToken(word + " ");
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    const responseTime = Date.now() - startTime;
    const cost =
      (response.tokens.input / 1000) * model.costPer1kInput +
      (response.tokens.output / 1000) * model.costPer1kOutput;

    callbacks.onComplete({
      content: accumulated,
      model: options.model,
      provider,
      tokens: response.tokens,
      responseTime,
      cost,
    });
  }
}

export const aiService = new AIService();
