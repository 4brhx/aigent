"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock performance data for the chart
const performanceData = [
  { day: "Mon", gemini: 85, claude: 92, openai: 88, deepseek: 78 },
  { day: "Tue", gemini: 88, claude: 90, openai: 91, deepseek: 82 },
  { day: "Wed", gemini: 92, claude: 95, openai: 87, deepseek: 85 },
  { day: "Thu", gemini: 87, claude: 93, openai: 90, deepseek: 80 },
  { day: "Fri", gemini: 91, claude: 94, openai: 92, deepseek: 86 },
  { day: "Sat", gemini: 89, claude: 91, openai: 89, deepseek: 83 },
  { day: "Sun", gemini: 93, claude: 96, openai: 93, deepseek: 88 },
];

const providers = [
  { key: "gemini", label: "Gemini", color: "#4285F4" },
  { key: "claude", label: "Claude", color: "#D97706" },
  { key: "openai", label: "OpenAI", color: "#10A37F" },
  { key: "deepseek", label: "DeepSeek", color: "#6366F1" },
];

export function PerformanceChart() {
  const maxValue = 100;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-body font-semibold">Performance Overview</CardTitle>
          <div className="flex items-center gap-4">
            {providers.map((p) => (
              <div key={p.key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-caption text-muted-foreground">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Simple bar chart visualization */}
        <div className="flex items-end justify-between gap-3 h-48 mt-4">
          {performanceData.map((data, i) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center gap-0.5 h-40">
                {providers.map((p) => {
                  const value = data[p.key as keyof typeof data] as number;
                  const height = (value / maxValue) * 100;
                  return (
                    <div
                      key={p.key}
                      className="w-2.5 rounded-t-sm transition-all duration-500 ease-out hover:opacity-80"
                      style={{
                        height: `${height}%`,
                        backgroundColor: p.color,
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                  );
                })}
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">{data.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
