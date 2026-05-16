"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  BarChart3,
  Settings,
  Zap,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "agents", label: "Agent Builder", icon: Bot },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const bottomNav = [
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-40 flex flex-col",
        "bg-white/80 backdrop-blur-[40px] border-r border-border/50",
        "transition-all duration-300 ease-out",
        sidebarOpen ? "w-[260px]" : "w-[72px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border/30">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        {sidebarOpen && (
          <div className="animate-fade-in">
            <h1 className="text-body font-bold tracking-tight text-foreground">AIgent</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Multi-Model Platform</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "ml-auto w-7 h-7 rounded-lg flex items-center justify-center",
            "text-muted-foreground hover:text-foreground hover:bg-secondary",
            "transition-all duration-200",
            !sidebarOpen && "rotate-180"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "text-body-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary-foreground")} />
              {sidebarOpen && (
                <span className="animate-fade-in truncate">{item.label}</span>
              )}
              {isActive && sidebarOpen && (
                <Zap className="w-3.5 h-3.5 ml-auto animate-pulse-soft" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-border/30 space-y-1">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "text-body-sm font-medium text-muted-foreground",
                "hover:text-foreground hover:bg-secondary transition-all duration-200"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="animate-fade-in">{item.label}</span>}
            </button>
          );
        })}

        {/* Model Status Indicator */}
        {sidebarOpen && (
          <div className="mt-3 mx-1 p-3 rounded-xl bg-secondary/50 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
              <span className="text-caption font-medium text-foreground">6 Models Active</span>
            </div>
            <p className="text-[11px] text-muted-foreground">All systems operational</p>
          </div>
        )}
      </div>
    </aside>
  );
}
