// ============================================================
// AI Model Types
// ============================================================

export type ModelProvider = "gemini" | "claude" | "openai" | "deepseek";

export type ModelId =
  | "gemini-2.0-flash"
  | "gemini-1.5-pro"
  | "claude-3.5-sonnet"
  | "claude-3-opus"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "deepseek-chat"
  | "deepseek-coder";

export interface AIModel {
  id: ModelId;
  name: string;
  provider: ModelProvider;
  maxTokens: number;
  contextWindow: number;
  costPer1kInput: number;
  costPer1kOutput: number;
  capabilities: ModelCapability[];
  status: "active" | "inactive" | "error";
  avgResponseTime: number; // ms
}

export type ModelCapability =
  | "chat"
  | "code"
  | "reasoning"
  | "vision"
  | "function_calling"
  | "streaming"
  | "long_context";

// ============================================================
// Chat Types
// ============================================================

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  model?: ModelId;
  provider?: ModelProvider;
  timestamp: Date;
  tokens?: {
    input: number;
    output: number;
  };
  cost?: number;
  responseTime?: number;
  attachments?: Attachment[];
  metadata?: Record<string, unknown>;
}

export interface Attachment {
  id: string;
  type: "file" | "image" | "code";
  name: string;
  content: string;
  mimeType?: string;
  size?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: ModelId;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    totalTokens: number;
    totalCost: number;
    messageCount: number;
  };
}

// ============================================================
// Agent Types
// ============================================================

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  models: ModelId[];
  primaryModel: ModelId;
  tools: AgentTool[];
  memory: AgentMemory;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  status: "active" | "paused" | "draft";
  createdAt: Date;
  updatedAt: Date;
  stats: AgentStats;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  type: "function" | "api" | "webhook" | "database";
  config: Record<string, unknown>;
  enabled: boolean;
}

export interface AgentMemory {
  type: "conversation" | "summary" | "vector";
  maxMessages: number;
  contextWindow: number;
  enabled: boolean;
}

export interface AgentStats {
  totalInteractions: number;
  avgResponseTime: number;
  successRate: number;
  totalTokensUsed: number;
  totalCost: number;
}

// ============================================================
// Analytics Types
// ============================================================

export interface AnalyticsData {
  tokenUsage: TokenUsageData[];
  costBreakdown: CostData[];
  modelPerformance: ModelPerformanceData[];
  responseQuality: QualityMetric[];
  dailyActivity: DailyActivity[];
}

export interface TokenUsageData {
  date: string;
  model: ModelId;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface CostData {
  date: string;
  model: ModelId;
  cost: number;
}

export interface ModelPerformanceData {
  model: ModelId;
  avgResponseTime: number;
  successRate: number;
  errorRate: number;
  totalRequests: number;
}

export interface QualityMetric {
  date: string;
  score: number;
  category: "accuracy" | "relevance" | "helpfulness" | "safety";
}

export interface DailyActivity {
  date: string;
  messages: number;
  tokens: number;
  cost: number;
  activeModels: number;
}

// ============================================================
// Dashboard Types
// ============================================================

export interface DashboardMetrics {
  totalAgents: number;
  activeModels: number;
  totalTokensToday: number;
  totalCostToday: number;
  avgResponseTime: number;
  successRate: number;
  activeTasks: number;
  completedTasks: number;
}

export interface LiveTask {
  id: string;
  name: string;
  agent: string;
  model: ModelId;
  status: "running" | "completed" | "failed" | "queued";
  progress: number;
  startedAt: Date;
  completedAt?: Date;
}

// ============================================================
// Workflow Types (Agent Builder)
// ============================================================

export interface WorkflowNode {
  id: string;
  type: "trigger" | "model" | "tool" | "condition" | "output";
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, unknown>;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: "active" | "draft" | "archived";
  createdAt: Date;
  updatedAt: Date;
}
