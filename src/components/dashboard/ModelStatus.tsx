"use client";

import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getModelColor } from "@/lib/utils";

export function ModelStatus() {
  const { models } = useAppStore();

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-body font-semibold">Active Models</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {models.map((model) => (
          <div
            key={model.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            {/* Provider Color Dot */}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: getModelColor(model.provider) }}
            />

            {/* Model Info */}
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-foreground truncate">
                {model.name}
              </p>
              <p className="text-caption text-muted-foreground capitalize">
                {model.provider} &middot; {model.avgResponseTime}ms avg
              </p>
            </div>

            {/* Status */}
            <Badge
              variant={model.status === "active" ? "success" : "error"}
              size="sm"
            >
              {model.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
