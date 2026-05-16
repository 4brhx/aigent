import type { AIModel } from "@/lib/types";

export const AI_MODELS: AIModel[] = [
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "gemini",
    maxTokens: 8192,
    contextWindow: 1048576,
    costPer1kInput: 0.000075,
    costPer1kOutput: 0.0003,
    capabilities: ["chat", "code", "reasoning", "vision", "function_calling", "streaming", "long_context"],
    status: "active",
    avgResponseTime: 800,
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "gemini",
    maxTokens: 8192,
    contextWindow: 2097152,
    costPer1kInput: 0.00125,
    costPer1kOutput: 0.005,
    capabilities: ["chat", "code", "reasoning", "vision", "function_calling", "streaming", "long_context"],
    status: "active",
    avgResponseTime: 2400,
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "claude",
    maxTokens: 8192,
    contextWindow: 200000,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    capabilities: ["chat", "code", "reasoning", "vision", "function_calling", "streaming"],
    status: "active",
    avgResponseTime: 1500,
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "claude",
    maxTokens: 4096,
    contextWindow: 200000,
    costPer1kInput: 0.015,
    costPer1kOutput: 0.075,
    capabilities: ["chat", "code", "reasoning", "vision", "streaming"],
    status: "active",
    avgResponseTime: 4500,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    maxTokens: 16384,
    contextWindow: 128000,
    costPer1kInput: 0.0025,
    costPer1kOutput: 0.01,
    capabilities: ["chat", "code", "reasoning", "vision", "function_calling", "streaming"],
    status: "active",
    avgResponseTime: 1800,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    maxTokens: 16384,
    contextWindow: 128000,
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.0006,
    capabilities: ["chat", "code", "reasoning", "function_calling", "streaming"],
    status: "active",
    avgResponseTime: 900,
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    provider: "deepseek",
    maxTokens: 8192,
    contextWindow: 128000,
    costPer1kInput: 0.00014,
    costPer1kOutput: 0.00028,
    capabilities: ["chat", "code", "reasoning", "function_calling", "streaming"],
    status: "active",
    avgResponseTime: 1200,
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek Coder",
    provider: "deepseek",
    maxTokens: 8192,
    contextWindow: 128000,
    costPer1kInput: 0.00014,
    costPer1kOutput: 0.00028,
    capabilities: ["code", "reasoning", "function_calling", "streaming"],
    status: "active",
    avgResponseTime: 1100,
  },
];

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

export function getModelsByProvider(provider: string): AIModel[] {
  return AI_MODELS.filter((m) => m.provider === provider);
}

export function getBestModelForTask(task: string): AIModel {
  const taskModelMap: Record<string, string> = {
    code: "claude-3.5-sonnet",
    reasoning: "gpt-4o",
    creative: "claude-3.5-sonnet",
    fast: "gemini-2.0-flash",
    cheap: "deepseek-chat",
    vision: "gpt-4o",
    long_context: "gemini-1.5-pro",
  };

  const modelId = taskModelMap[task] || "gemini-2.0-flash";
  return AI_MODELS.find((m) => m.id === modelId) || AI_MODELS[0];
}
