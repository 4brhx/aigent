"use client";

import { useAppStore } from "@/lib/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardPage } from "@/app/dashboard/page-content";
import { ChatPage } from "@/app/chat/page-content";
import { AgentsPage } from "@/app/agents/page-content";
import { AnalyticsPage } from "@/app/analytics/page-content";
import { cn } from "@/lib/utils";

export default function AppShell() {
  const { activePage, sidebarOpen } = useAppStore();

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
