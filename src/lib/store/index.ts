import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  AIModel,
  Agent,
  Conversation,
  DashboardMetrics,
  LiveTask,
  Message,
  ModelId,
  ModelProvider,
} from "@/lib/types";
import { generateId } from "@/lib/utils";
import { AI_MODELS } from "@/lib/ai/models";

// ============================================================
// Mock Data (must be defined before store creation)
// ============================================================

const MOCK_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Code Assistant",
    description: "Multi-model code generation and review agent",
    models: ["gemini-2.0-flash", "claude-3.5-sonnet", "gpt-4o"],
    primaryModel: "claude-3.5-sonnet",
    tools: [
      { id: "t1", name: "Code Execution", description: "Run code snippets", type: "function", config: {}, enabled: true },
      { id: "t2", name: "File System", description: "Read/write files", type: "function", config: {}, enabled: true },
    ],
    memory: { type: "conversation", maxMessages: 50, contextWindow: 128000, enabled: true },
    systemPrompt: "You are an expert code assistant...",
    temperature: 0.3,
    maxTokens: 4096,
    status: "active",
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-15"),
    stats: { totalInteractions: 1247, avgResponseTime: 1200, successRate: 98.5, totalTokensUsed: 2450000, totalCost: 12.45 },
  },
  {
    id: "agent-2",
    name: "Research Agent",
    description: "Deep research and analysis with reasoning capabilities",
    models: ["gpt-4o", "claude-3-opus", "gemini-1.5-pro"],
    primaryModel: "gpt-4o",
    tools: [
      { id: "t3", name: "Web Search", description: "Search the internet", type: "api", config: {}, enabled: true },
      { id: "t4", name: "Document Parser", description: "Parse documents", type: "function", config: {}, enabled: true },
    ],
    memory: { type: "summary", maxMessages: 100, contextWindow: 200000, enabled: true },
    systemPrompt: "You are a research assistant...",
    temperature: 0.5,
    maxTokens: 8192,
    status: "active",
    createdAt: new Date("2024-10-20"),
    updatedAt: new Date("2024-11-14"),
    stats: { totalInteractions: 856, avgResponseTime: 3200, successRate: 96.2, totalTokensUsed: 5200000, totalCost: 34.78 },
  },
  {
    id: "agent-3",
    name: "Creative Writer",
    description: "Content creation and creative writing agent",
    models: ["claude-3.5-sonnet", "gpt-4o"],
    primaryModel: "claude-3.5-sonnet",
    tools: [],
    memory: { type: "conversation", maxMessages: 30, contextWindow: 100000, enabled: true },
    systemPrompt: "You are a creative writing assistant...",
    temperature: 0.8,
    maxTokens: 4096,
    status: "paused",
    createdAt: new Date("2024-11-05"),
    updatedAt: new Date("2024-11-10"),
    stats: { totalInteractions: 324, avgResponseTime: 2100, successRate: 99.1, totalTokensUsed: 890000, totalCost: 5.67 },
  },
];

const MOCK_METRICS: DashboardMetrics = {
  totalAgents: 3,
  activeModels: 6,
  totalTokensToday: 145200,
  totalCostToday: 2.34,
  avgResponseTime: 1850,
  successRate: 97.8,
  activeTasks: 4,
  completedTasks: 47,
};

const MOCK_TASKS: LiveTask[] = [
  { id: "task-1", name: "Code Review Analysis", agent: "Code Assistant", model: "claude-3.5-sonnet", status: "running", progress: 67, startedAt: new Date() },
  { id: "task-2", name: "Research Synthesis", agent: "Research Agent", model: "gpt-4o", status: "running", progress: 34, startedAt: new Date() },
  { id: "task-3", name: "API Documentation", agent: "Code Assistant", model: "gemini-2.0-flash", status: "queued", progress: 0, startedAt: new Date() },
  { id: "task-4", name: "Blog Post Draft", agent: "Creative Writer", model: "claude-3.5-sonnet", status: "completed", progress: 100, startedAt: new Date(), completedAt: new Date() },
];

// ============================================================
// App Store
// ============================================================

interface AppState {
  // Navigation
  activePage: string;
  sidebarOpen: boolean;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;

  // Models
  models: AIModel[];
  selectedModel: ModelId;
  setSelectedModel: (model: ModelId) => void;

  // Chat
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isStreaming: boolean;
  createConversation: () => void;
  setActiveConversation: (id: string) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setStreaming: (streaming: boolean) => void;

  // Agents
  agents: Agent[];
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;

  // Dashboard
  metrics: DashboardMetrics;
  liveTasks: LiveTask[];

  // Compare Mode
  compareMode: boolean;
  compareModels: ModelId[];
  toggleCompareMode: () => void;
  setCompareModels: (models: ModelId[]) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Navigation
      activePage: "dashboard",
      sidebarOpen: true,
      setActivePage: (page) => set({ activePage: page }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Models
      models: AI_MODELS,
      selectedModel: "gemini-2.0-flash",
      setSelectedModel: (model) => set({ selectedModel: model }),

      // Chat
      conversations: [],
      activeConversation: null,
      isStreaming: false,

      createConversation: () => {
        const newConversation: Conversation = {
          id: generateId(),
          title: "New Conversation",
          messages: [],
          model: get().selectedModel,
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            totalTokens: 0,
            totalCost: 0,
            messageCount: 0,
          },
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversation: newConversation,
        }));
      },

      setActiveConversation: (id) => {
        const conversation = get().conversations.find((c) => c.id === id);
        set({ activeConversation: conversation || null });
      },

      addMessage: (message) => {
        const fullMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        };
        set((state) => {
          const activeConv = state.activeConversation;
          if (!activeConv) return state;

          const updatedConv = {
            ...activeConv,
            messages: [...activeConv.messages, fullMessage],
            updatedAt: new Date(),
          };

          return {
            activeConversation: updatedConv,
            conversations: state.conversations.map((c) =>
              c.id === activeConv.id ? updatedConv : c
            ),
          };
        });
      },

      setStreaming: (streaming) => set({ isStreaming: streaming }),

      // Agents
      agents: MOCK_AGENTS,
      selectedAgent: null,
      setSelectedAgent: (agent) => set({ selectedAgent: agent }),

      // Dashboard
      metrics: MOCK_METRICS,
      liveTasks: MOCK_TASKS,

      // Compare Mode
      compareMode: false,
      compareModels: [],
      toggleCompareMode: () => set((state) => ({ compareMode: !state.compareMode })),
      setCompareModels: (models) => set({ compareModels: models }),
    }),
    { name: "aigent-store" }
  )
);
