"use client";

import { useState } from "react";
import { cn, formatCurrency, formatNumber, getModelColor } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Zap,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

// Mock analytics data
const modelComparison = [
  { model: "Gemini 2.0 Flash", provider: "gemini", requests: 4520, avgTime: 820, cost: 0.45, successRate: 99.2 },
  { model: "Claude 3.5 Sonnet", provider: "claude", requests: 2890, avgTime: 1480, cost: 12.34, successRate: 98.8 },
  { model: "GPT-4o", provider: "openai", requests: 3150, avgTime: 1750, cost: 8.92, successRate: 97.5 },
  { model: "DeepSeek Chat", provider: "deepseek", requests: 1870, avgTime: 1150, cost: 0.52, successRate: 96.9 },
  { model: "GPT-4o Mini", provider: "openai", requests: 5200, avgTime: 870, cost: 1.23, successRate: 99.5 },
  { model: "Gemini 1.5 Pro", provider: "gemini", requests: 980, avgTime: 2350, cost: 3.45, successRate: 98.1 },
];

const dailyCosts = [
  { day: "May 10", cost: 3.45 },
  { day: "May 11", cost: 2.89 },
  { day: "May 12", cost: 4.12 },
  { day: "May 13", cost: 3.78 },
  { day: "May 14", cost: 5.23 },
  { day: "May 15", cost: 4.67 },
  { day: "May 16", cost: 2.34 },
];

const qualityMetrics = [
  { category: "Accuracy", score: 94.5, trend: 2.3 },
  { category: "Relevance", score: 96.8, trend: 1.1 },
  { category: "Helpfulness", score: 92.3, trend: -0.5 },
  { category: "Safety", score: 99.7, trend: 0.2 },
];

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">("7d");

  const totalCost = dailyCosts.reduce((sum, d) => sum + d.cost, 0);
  const totalRequests = modelComparison.reduce((sum, m) => sum + m.requests, 0);
  const avgResponseTime = Math.round(
    modelComparison.reduce((sum, m) => sum + m.avgTime * m.requests, 0) / totalRequests
  );

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-title font-semibold">Performance Analytics</h3>
          <p className="text-body-sm text-muted-foreground">Comprehensive model performance insights</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl">
          {(["24h", "7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-body-sm font-medium transition-all duration-200",
                timeRange === range
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard
          icon={BarChart3}
          label="Total Requests"
          value={formatNumber(totalRequests)}
          trend={12.5}
        />
        <SummaryCard
          icon={Clock}
          label="Avg Response Time"
          value={`${avgResponseTime}ms`}
          trend={-8.2}
          trendPositive
        />
        <SummaryCard
          icon={DollarSign}
          label="Total Cost"
          value={formatCurrency(totalCost)}
          trend={3.1}
        />
        <SummaryCard
          icon={Zap}
          label="Avg Success Rate"
          value="98.3%"
          trend={0.5}
          trendPositive
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Cost Chart */}
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-body-sm font-semibold">Daily Cost Breakdown</h4>
            <Badge variant="outline" size="sm">{formatCurrency(totalCost)} total</Badge>
          </div>
          <CostBarChart data={dailyCosts} />
        </Card>

        {/* Quality Metrics */}
        <Card className="p-5">
          <h4 className="text-body-sm font-semibold mb-4">Response Quality</h4>
          <div className="space-y-4">
            {qualityMetrics.map((metric) => (
              <div key={metric.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-body-sm text-foreground">{metric.category}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-body-sm font-semibold text-foreground">{metric.score}%</span>
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        metric.trend >= 0 ? "text-success" : "text-destructive"
                      )}
                    >
                      {metric.trend >= 0 ? "+" : ""}{metric.trend}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-foreground transition-all duration-700"
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Model Comparison Table */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-body-sm font-semibold">Model Performance Comparison</h4>
          <Button variant="outline" size="sm">Export</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-4 text-caption font-semibold text-muted-foreground uppercase tracking-wider">Model</th>
                <th className="text-right py-3 px-4 text-caption font-semibold text-muted-foreground uppercase tracking-wider">Requests</th>
                <th className="text-right py-3 px-4 text-caption font-semibold text-muted-foreground uppercase tracking-wider">Avg Time</th>
                <th className="text-right py-3 px-4 text-caption font-semibold text-muted-foreground uppercase tracking-wider">Cost</th>
                <th className="text-right py-3 px-4 text-caption font-semibold text-muted-foreground uppercase tracking-wider">Success Rate</th>
                <th className="text-right py-3 px-4 text-caption font-semibold text-muted-foreground uppercase tracking-wider">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {modelComparison.map((model) => {
                const efficiency = (model.successRate / (model.avgTime / 1000)).toFixed(1);
                return (
                  <tr key={model.model} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: getModelColor(model.provider) }}
                        />
                        <span className="text-body-sm font-medium text-foreground">{model.model}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-body-sm text-foreground">
                      {formatNumber(model.requests)}
                    </td>
                    <td className="py-3 px-4 text-right text-body-sm text-foreground">
                      {model.avgTime}ms
                    </td>
                    <td className="py-3 px-4 text-right text-body-sm text-foreground">
                      {formatCurrency(model.cost)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant={model.successRate > 98 ? "success" : "warning"} size="sm">
                        {model.successRate}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-body-sm font-medium text-foreground">
                      {efficiency}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  trend,
  trendPositive,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  trend: number;
  trendPositive?: boolean;
}) {
  const isPositive = trendPositive !== undefined ? trendPositive : trend > 0;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <p className="text-headline font-semibold text-foreground">{value}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-caption text-muted-foreground">{label}</p>
        <span
          className={cn(
            "text-[11px] font-medium flex items-center gap-0.5",
            (trend > 0 && isPositive) || (trend < 0 && !trendPositive)
              ? "text-success"
              : "text-destructive"
          )}
        >
          {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      </div>
    </Card>
  );
}

function CostBarChart({ data }: { data: { day: string; cost: number }[] }) {
  const maxCost = Math.max(...data.map((d) => d.cost));

  return (
    <div className="flex items-end justify-between gap-3 h-40">
      {data.map((item, i) => {
        const height = (item.cost / maxCost) * 100;
        return (
          <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[11px] font-medium text-foreground">${item.cost.toFixed(2)}</span>
            <div className="w-full flex justify-center h-28">
              <div
                className="w-8 rounded-t-lg bg-foreground/80 hover:bg-foreground transition-colors duration-200"
                style={{ height: `${height}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">{item.day.split(" ")[1]}</span>
          </div>
        );
      })}
    </div>
  );
}
