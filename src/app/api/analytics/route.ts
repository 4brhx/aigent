import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "7d";

  // In production, this would query Supabase/PostgreSQL
  const analytics = generateMockAnalytics(range);

  return NextResponse.json({ success: true, data: analytics });
}

function generateMockAnalytics(range: string) {
  const days = range === "24h" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : 90;

  const tokenUsage = Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 86400000).toISOString().split("T")[0],
    gemini: Math.floor(Math.random() * 50000) + 10000,
    claude: Math.floor(Math.random() * 40000) + 8000,
    openai: Math.floor(Math.random() * 45000) + 12000,
    deepseek: Math.floor(Math.random() * 30000) + 5000,
  }));

  const costBreakdown = tokenUsage.map((day) => ({
    date: day.date,
    gemini: (day.gemini / 1000) * 0.000075,
    claude: (day.claude / 1000) * 0.003,
    openai: (day.openai / 1000) * 0.0025,
    deepseek: (day.deepseek / 1000) * 0.00014,
  }));

  const modelPerformance = [
    { model: "gemini-2.0-flash", avgResponseTime: 820, successRate: 99.2, errorRate: 0.8, totalRequests: 4520 },
    { model: "claude-3.5-sonnet", avgResponseTime: 1480, successRate: 98.8, errorRate: 1.2, totalRequests: 2890 },
    { model: "gpt-4o", avgResponseTime: 1750, successRate: 97.5, errorRate: 2.5, totalRequests: 3150 },
    { model: "deepseek-chat", avgResponseTime: 1150, successRate: 96.9, errorRate: 3.1, totalRequests: 1870 },
  ];

  return {
    tokenUsage,
    costBreakdown,
    modelPerformance,
    summary: {
      totalTokens: tokenUsage.reduce((sum, d) => sum + d.gemini + d.claude + d.openai + d.deepseek, 0),
      totalCost: costBreakdown.reduce((sum, d) => sum + d.gemini + d.claude + d.openai + d.deepseek, 0),
      avgResponseTime: 1300,
      successRate: 98.1,
    },
  };
}
