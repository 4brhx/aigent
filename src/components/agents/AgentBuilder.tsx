"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn, getModelColor, formatNumber, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Bot,
  Cpu,
  Wrench,
  Brain,
  Zap,
  Settings,
  Play,
  Pause,
  MoreHorizontal,
  ArrowRight,
  Code,
  Globe,
  Database,
  FileText,
} from "lucide-react";
import type { Agent } from "@/lib/types";

export function AgentBuilder() {
  const { agents, selectedAgent, setSelectedAgent } = useAppStore();
  const [view, setView] = useState<"grid" | "detail">("grid");

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Agent List */}
      <div className={cn("border-r border-border/30 p-6 overflow-y-auto", selectedAgent ? "w-[360px]" : "w-full")}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-title font-semibold">Your Agents</h3>
            <p className="text-body-sm text-muted-foreground">{agents.length} agents configured</p>
          </div>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New Agent
          </Button>
        </div>

        <div className="space-y-3">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent?.id === agent.id}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>
      </div>

      {/* Agent Detail */}
      {selectedAgent && (
        <div className="flex-1 overflow-y-auto p-6 animate-slide-in-right">
          <AgentDetail agent={selectedAgent} />
        </div>
      )}
    </div>
  );
}

function AgentCard({
  agent,
  isSelected,
  onClick,
}: {
  agent: Agent;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer",
        isSelected && "ring-2 ring-primary/10 border-primary/20"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <Bot className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-body-sm font-semibold text-foreground truncate">{agent.name}</h4>
            <Badge
              variant={agent.status === "active" ? "success" : agent.status === "paused" ? "warning" : "outline"}
              size="sm"
            >
              {agent.status}
            </Badge>
          </div>
          <p className="text-caption text-muted-foreground mt-0.5 truncate">{agent.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{agent.models.length} models</span>
            </div>
            <div className="flex items-center gap-1">
              <Wrench className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{agent.tools.length} tools</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{formatNumber(agent.stats.totalInteractions)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AgentDetail({ agent }: { agent: Agent }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
            <Bot className="w-7 h-7 text-foreground" />
          </div>
          <div>
            <h2 className="text-headline font-semibold">{agent.name}</h2>
            <p className="text-body-sm text-muted-foreground">{agent.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {agent.status === "active" ? (
            <Button variant="outline" size="sm">
              <Pause className="w-4 h-4 mr-1.5" /> Pause
            </Button>
          ) : (
            <Button variant="primary" size="sm">
              <Play className="w-4 h-4 mr-1.5" /> Activate
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatBox label="Interactions" value={formatNumber(agent.stats.totalInteractions)} />
        <StatBox label="Avg Response" value={`${agent.stats.avgResponseTime}ms`} />
        <StatBox label="Success Rate" value={`${agent.stats.successRate}%`} />
        <StatBox label="Total Cost" value={formatCurrency(agent.stats.totalCost)} />
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-2 gap-4">
        {/* Models */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-body-sm font-semibold">Models</h4>
          </div>
          <div className="space-y-2">
            {agent.models.map((modelId) => (
              <div key={modelId} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getModelColor(modelId.split("-")[0]) }}
                />
                <span className="text-body-sm text-foreground">{modelId}</span>
                {modelId === agent.primaryModel && (
                  <Badge variant="info" size="sm" className="ml-auto">primary</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Tools */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-body-sm font-semibold">Tools</h4>
          </div>
          <div className="space-y-2">
            {agent.tools.length > 0 ? (
              agent.tools.map((tool) => (
                <div key={tool.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                  <ToolIcon type={tool.type} />
                  <div className="flex-1">
                    <span className="text-body-sm text-foreground">{tool.name}</span>
                    <p className="text-[11px] text-muted-foreground">{tool.description}</p>
                  </div>
                  <div className={cn("w-2 h-2 rounded-full", tool.enabled ? "bg-success" : "bg-muted-foreground/30")} />
                </div>
              ))
            ) : (
              <p className="text-body-sm text-muted-foreground text-center py-4">No tools configured</p>
            )}
          </div>
        </Card>

        {/* Memory */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-body-sm font-semibold">Memory</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-body-sm text-muted-foreground">Type</span>
              <span className="text-body-sm text-foreground capitalize">{agent.memory.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-sm text-muted-foreground">Max Messages</span>
              <span className="text-body-sm text-foreground">{agent.memory.maxMessages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-sm text-muted-foreground">Context Window</span>
              <span className="text-body-sm text-foreground">{formatNumber(agent.memory.contextWindow)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-sm text-muted-foreground">Status</span>
              <Badge variant={agent.memory.enabled ? "success" : "outline"} size="sm">
                {agent.memory.enabled ? "enabled" : "disabled"}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Configuration */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-body-sm font-semibold">Configuration</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-body-sm text-muted-foreground">Temperature</span>
              <span className="text-body-sm text-foreground">{agent.temperature}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-body-sm text-muted-foreground">Max Tokens</span>
              <span className="text-body-sm text-foreground">{formatNumber(agent.maxTokens)}</span>
            </div>
            <div>
              <span className="text-body-sm text-muted-foreground">System Prompt</span>
              <p className="text-[11px] text-foreground mt-1 p-2 bg-secondary/50 rounded-lg line-clamp-3">
                {agent.systemPrompt}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Workflow Visualization */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-body-sm font-semibold">Workflow Pipeline</h4>
          </div>
          <Button variant="outline" size="sm">Edit Workflow</Button>
        </div>
        <WorkflowPreview agent={agent} />
      </Card>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-secondary/50 border border-border/30">
      <p className="text-headline font-semibold text-foreground">{value}</p>
      <p className="text-caption text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function ToolIcon({ type }: { type: string }) {
  const icons: Record<string, typeof Code> = {
    function: Code,
    api: Globe,
    database: Database,
    webhook: Zap,
  };
  const Icon = icons[type] || FileText;
  return <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />;
}

function WorkflowPreview({ agent }: { agent: Agent }) {
  const steps = [
    { label: "Input", type: "trigger" },
    { label: "Route", type: "condition" },
    { label: agent.primaryModel, type: "model" },
    ...(agent.tools.length > 0 ? [{ label: "Tools", type: "tool" }] : []),
    { label: "Output", type: "output" },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-6">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-[11px] font-medium",
                step.type === "trigger" && "bg-accent/10 text-accent border border-accent/20",
                step.type === "condition" && "bg-warning/10 text-warning border border-warning/20",
                step.type === "model" && "bg-primary/5 text-foreground border border-border",
                step.type === "tool" && "bg-success/10 text-success border border-success/20",
                step.type === "output" && "bg-secondary text-foreground border border-border"
              )}
            >
              {step.type === "trigger" && <Zap className="w-5 h-5" />}
              {step.type === "condition" && "?"}
              {step.type === "model" && <Cpu className="w-5 h-5" />}
              {step.type === "tool" && <Wrench className="w-5 h-5" />}
              {step.type === "output" && <FileText className="w-5 h-5" />}
            </div>
            <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[80px]">
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="w-4 h-4 text-border flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}
