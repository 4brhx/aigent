import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// In production, this would use Supabase/PostgreSQL
const agents: any[] = [];

export async function GET() {
  return NextResponse.json({ success: true, data: agents });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const agent = {
      id: `agent-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalInteractions: 0,
        avgResponseTime: 0,
        successRate: 100,
        totalTokensUsed: 0,
        totalCost: 0,
      },
    };

    agents.push(agent);

    return NextResponse.json({ success: true, data: agent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
