"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn, getStatusColor, formatDate } from "@/lib/utils";
import { Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const statusIcons = {
  running: Loader2,
  completed: CheckCircle2,
  failed: AlertCircle,
  queued: Clock,
};

export function LiveTasks() {
  const { liveTasks } = useAppStore();

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-body font-semibold">Live Tasks</CardTitle>
          <Badge variant="info" size="md">
            {liveTasks.filter((t) => t.status === "running").length} active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {liveTasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          const statusVariant =
            task.status === "completed" ? "success" :
            task.status === "failed" ? "error" :
            task.status === "running" ? "info" : "warning";

          return (
            <div key={task.id} className="p-3 rounded-xl border border-border/30 hover:border-border/60 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusIcon
                    className={cn(
                      "w-4 h-4",
                      task.status === "running" && "animate-spin"
                    )}
                    style={{ color: getStatusColor(task.status) }}
                  />
                  <span className="text-body-sm font-medium text-foreground">{task.name}</span>
                </div>
                <Badge variant={statusVariant} size="sm">{task.status}</Badge>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-caption text-muted-foreground">{task.agent}</span>
                <span className="text-caption text-muted-foreground">&middot;</span>
                <span className="text-caption text-muted-foreground">{task.model}</span>
              </div>

              {task.status !== "completed" && (
                <div className="flex items-center gap-3">
                  <Progress value={task.progress} size="sm" className="flex-1" />
                  <span className="text-caption text-muted-foreground font-medium">
                    {task.progress}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
