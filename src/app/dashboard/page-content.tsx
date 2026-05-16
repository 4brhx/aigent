"use client";

import { useAppStore } from "@/lib/store";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ModelStatus } from "@/components/dashboard/ModelStatus";
import { LiveTasks } from "@/components/dashboard/LiveTasks";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { formatNumber, formatCurrency, formatDuration } from "@/lib/utils";
import {
  Bot,
  Cpu,
  Coins,
  Clock,
  CheckCircle2,
  TrendingUp,
  Zap,
  Activity,
} from "lucide-react";

export function DashboardPage() {
  const { metrics } = useAppStore();

  return (
    <div className="p-6 space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Agents"
          value={metrics.totalAgents.toString()}
          subtitle="3 running tasks"
          icon={Bot}
          trend={{ value: 12, positive: true }}
        />
        <MetricCard
          title="Active Models"
          value={metrics.activeModels.toString()}
          subtitle="All operational"
          icon={Cpu}
          trend={{ value: 0, positive: true }}
        />
        <MetricCard
          title="Tokens Today"
          value={formatNumber(metrics.totalTokensToday)}
          subtitle={`${formatCurrency(metrics.totalCostToday)} cost`}
          icon={Coins}
          trend={{ value: 8, positive: true }}
        />
        <MetricCard
          title="Avg Response"
          value={formatDuration(metrics.avgResponseTime)}
          subtitle={`${metrics.successRate}% success`}
          icon={Clock}
          trend={{ value: 5, positive: true }}
        />
      </div>

      {/* Performance Chart */}
      <PerformanceChart />

      {/* Models & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ModelStatus />
        <LiveTasks />
      </div>
    </div>
  );
}
