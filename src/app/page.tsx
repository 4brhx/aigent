"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardPage } from "./dashboard/page-content";
import { ChatPage } from "./chat/page-content";
import { AgentsPage } from "./agents/page-content";
import { AnalyticsPage } from "./analytics/page-content";
import { cn } from "@/lib/utils";

export default function Home() {
  const { activePage, sidebarOpen } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;
      case "chat":
        return <ChatPage />;
      case "agents":
        return <AgentsPage />;
      case "analytics":
        return <AnalyticsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main
        className={cn(
          "transition-all duration-300 ease-out",
          sidebarOpen ? "ml-[260px]" : "ml-[72px]"
        )}
      >
        <Header />
        <div className="animate-fade-in">{renderPage()}</div>
      </main>
    </div>
  );
}
