import type { AIModel, ModelCapability, ModelId, ModelProvider } from "@/lib/types";
import { AI_MODELS, getModelById } from "./models";

// ============================================================
// Intelligent Model Router
// ============================================================

interface RouteConfig {
  task: string;
  requiredCapabilities?: ModelCapability[];
  preferredProvider?: ModelProvider;
  maxCostPer1k?: number;
  maxResponseTime?: number;
  contextLength?: number;
}

interface RouteResult {
  primary: AIModel;
  fallback: AIModel;
  reason: string;
}

export class ModelRouter {
  private models: AIModel[];
  private failedModels: Set<ModelId> = new Set();
  private modelLatency: Map<ModelId, number[]> = new Map();

  constructor() {
    this.models = AI_MODELS.filter((m) => m.status === "active");
  }

  /**
   * Route to the best model based on task requirements
   */
  route(config: RouteConfig): RouteResult {
    let candidates = this.getAvailableModels();

    // Filter by required capabilities
    if (config.requiredCapabilities) {
      candidates = candidates.filter((m) =>
        config.requiredCapabilities!.every((cap) => m.capabilities.includes(cap))
      );
    }

    // Filter by preferred provider
    if (config.preferredProvider) {
      const providerModels = candidates.filter(
        (m) => m.provider === config.preferredProvider
      );
      if (providerModels.length > 0) candidates = providerModels;
    }

    // Filter by max cost
    if (config.maxCostPer1k) {
      candidates = candidates.filter(
        (m) => m.costPer1kOutput <= config.maxCostPer1k!
      );
    }

    // Filter by max response time
    if (config.maxResponseTime) {
      candidates = candidates.filter(
        (m) => m.avgResponseTime <= config.maxResponseTime!
      );
    }

    // Filter by context length
    if (config.contextLength) {
      candidates = candidates.filter(
        (m) => m.contextWindow >= config.contextLength!
      );
    }

    // Score remaining candidates
    const scored = candidates.map((model) => ({
      model,
      score: this.scoreModel(model, config),
    }));

    scored.sort((a, b) => b.score - a.score);

    const primary = scored[0]?.model || AI_MODELS[0];
    const fallback = scored[1]?.model || scored[0]?.model || AI_MODELS[0];

    return {
      primary,
      fallback,
      reason: this.generateReason(primary, config),
    };
  }

  /**
   * Smart routing based on prompt analysis
   */
  analyzeAndRoute(prompt: string): RouteResult {
    const analysis = this.analyzePrompt(prompt);

    return this.route({
      task: analysis.primaryTask,
      requiredCapabilities: analysis.requiredCapabilities,
      contextLength: prompt.length > 10000 ? prompt.length * 4 : undefined,
    });
  }

  /**
   * Mark a model as failed for failover
   */
  markFailed(modelId: ModelId): void {
    this.failedModels.add(modelId);
    // Auto-recover after 5 minutes
    setTimeout(() => this.failedModels.delete(modelId), 5 * 60 * 1000);
  }

  /**
   * Record response latency for adaptive routing
   */
  recordLatency(modelId: ModelId, latency: number): void {
    const latencies = this.modelLatency.get(modelId) || [];
    latencies.push(latency);
    if (latencies.length > 20) latencies.shift();
    this.modelLatency.set(modelId, latencies);
  }

  /**
   * Get failover model when primary fails
   */
  getFailover(failedModel: ModelId): AIModel {
    this.markFailed(failedModel);
    const available = this.getAvailableModels().filter((m) => m.id !== failedModel);

    // Find model with same capabilities
    const failed = getModelById(failedModel);
    if (failed) {
      const sameCapability = available.filter((m) =>
        failed.capabilities.every((cap) => m.capabilities.includes(cap))
      );
      if (sameCapability.length > 0) return sameCapability[0];
    }

    return available[0] || AI_MODELS[0];
  }

  // Private helpers

  private getAvailableModels(): AIModel[] {
    return this.models.filter((m) => !this.failedModels.has(m.id));
  }

  private scoreModel(model: AIModel, config: RouteConfig): number {
    let score = 0;

    // Task-specific scoring
    const taskScores: Record<string, Record<string, number>> = {
      code: { "claude-3.5-sonnet": 95, "deepseek-coder": 90, "gpt-4o": 85, "gemini-2.0-flash": 80 },
      reasoning: { "gpt-4o": 95, "claude-3-opus": 92, "claude-3.5-sonnet": 88, "gemini-1.5-pro": 85 },
      creative: { "claude-3.5-sonnet": 95, "gpt-4o": 90, "claude-3-opus": 88 },
      fast: { "gemini-2.0-flash": 95, "gpt-4o-mini": 92, "deepseek-chat": 90 },
      cheap: { "deepseek-chat": 95, "deepseek-coder": 93, "gemini-2.0-flash": 90, "gpt-4o-mini": 88 },
    };

    if (config.task && taskScores[config.task]) {
      score += taskScores[config.task][model.id] || 50;
    }

    // Cost efficiency bonus
    const avgCost = (model.costPer1kInput + model.costPer1kOutput) / 2;
    score += Math.max(0, 20 - avgCost * 1000);

    // Speed bonus
    score += Math.max(0, 20 - model.avgResponseTime / 200);

    // Real latency adjustment
    const latencies = this.modelLatency.get(model.id);
    if (latencies && latencies.length > 0) {
      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      if (avgLatency < model.avgResponseTime) score += 5;
      if (avgLatency > model.avgResponseTime * 2) score -= 10;
    }

    return score;
  }

  private analyzePrompt(prompt: string): {
    primaryTask: string;
    requiredCapabilities: ModelCapability[];
  } {
    const lower = prompt.toLowerCase();
    const capabilities: ModelCapability[] = ["chat", "streaming"];

    let primaryTask = "chat";

    // Detect code-related tasks
    if (
      lower.includes("code") ||
      lower.includes("function") ||
      lower.includes("implement") ||
      lower.includes("debug") ||
      lower.includes("refactor") ||
      /```/.test(prompt)
    ) {
      primaryTask = "code";
      capabilities.push("code");
    }

    // Detect reasoning tasks
    if (
      lower.includes("analyze") ||
      lower.includes("explain") ||
      lower.includes("compare") ||
      lower.includes("why") ||
      lower.includes("research")
    ) {
      primaryTask = "reasoning";
      capabilities.push("reasoning");
    }

    // Detect vision tasks
    if (lower.includes("image") || lower.includes("picture") || lower.includes("screenshot")) {
      capabilities.push("vision");
    }

    // Detect function calling needs
    if (lower.includes("search") || lower.includes("fetch") || lower.includes("call")) {
      capabilities.push("function_calling");
    }

    return { primaryTask, requiredCapabilities: capabilities };
  }

  private generateReason(model: AIModel, config: RouteConfig): string {
    const reasons: string[] = [];

    if (config.task) reasons.push(`Best for ${config.task} tasks`);
    if (config.preferredProvider === model.provider) reasons.push(`Preferred provider`);
    if (model.avgResponseTime < 1000) reasons.push(`Fast response time`);
    if (model.costPer1kOutput < 0.001) reasons.push(`Cost efficient`);

    return reasons.join(" | ") || "Best overall match";
  }
}

export const modelRouter = new ModelRouter();
