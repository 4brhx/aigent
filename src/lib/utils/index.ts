import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60_000).toFixed(1)}m`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getModelColor(provider: string): string {
  const colors: Record<string, string> = {
    gemini: "#4285F4",
    claude: "#D97706",
    openai: "#10A37F",
    deepseek: "#6366F1",
  };
  return colors[provider] || "#6B7280";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "#34C759",
    running: "#34C759",
    completed: "#34C759",
    inactive: "#86868B",
    paused: "#FF9500",
    queued: "#FF9500",
    error: "#FF3B30",
    failed: "#FF3B30",
    draft: "#6B7280",
  };
  return colors[status] || "#6B7280";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  costPer1kInput: number,
  costPer1kOutput: number
): number {
  return (inputTokens / 1000) * costPer1kInput + (outputTokens / 1000) * costPer1kOutput;
}
