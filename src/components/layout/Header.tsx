"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Monitor your AI agents in real-time" },
  chat: { title: "Chat Workspace", subtitle: "Multi-model intelligent conversations" },
  agents: { title: "Agent Builder", subtitle: "Design and deploy AI agents" },
  analytics: { title: "Analytics", subtitle: "Performance insights and cost analysis" },
  settings: { title: "Settings", subtitle: "Configure your platform" },
};

export function Header() {
  const { activePage, sidebarOpen } = useAppStore();
  const pageInfo = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <header
      className={cn(
        "h-16 border-b border-border/30 bg-white/60 backdrop-blur-[20px]",
        "flex items-center justify-between px-8",
        "sticky top-0 z-30"
      )}
    >
      {/* Page Title */}
      <div>
        <h2 className="text-body font-semibold text-foreground">{pageInfo.title}</h2>
        <p className="text-caption text-muted-foreground">{pageInfo.subtitle}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 h-9 px-4 rounded-xl bg-secondary border border-transparent hover:border-border transition-colors">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-body-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-40"
          />
          <kbd className="text-[10px] text-muted-foreground bg-white px-1.5 py-0.5 rounded border border-border">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </Button>

        {/* Profile */}
        <Button variant="ghost" size="icon">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
        </Button>
      </div>
    </header>
  );
}
