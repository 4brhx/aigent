"use client";

import { cn, formatDuration, getModelColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Message } from "@/lib/types";
import { Bot, User, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className={cn("max-w-[75%] space-y-2", isUser && "items-end")}>
        {/* Model Badge */}
        {!isUser && message.model && (
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getModelColor(message.provider || "") }}
            />
            <span className="text-caption text-muted-foreground font-medium">
              {message.model}
            </span>
            {message.responseTime && (
              <span className="text-caption text-muted-foreground">
                &middot; {formatDuration(message.responseTime)}
              </span>
            )}
            {isStreaming && (
              <span className="text-caption text-accent font-medium animate-pulse-soft">
                typing...
              </span>
            )}
          </div>
        )}

        {/* Message Body */}
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-body-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-md"
              : "bg-secondary/60 text-foreground rounded-tl-md border border-border/30"
          )}
        >
          {/* Simple markdown-like rendering */}
          <div className="prose prose-sm max-w-none">
            {renderContent(message.content)}
          </div>
        </div>

        {/* Actions */}
        {!isUser && !isStreaming && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground">
              <Copy className="w-3.5 h-3.5 mr-1" />
              <span className="text-[11px]">Copy</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground">
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              <span className="text-[11px]">Retry</span>
            </Button>
            {message.tokens && (
              <span className="text-[11px] text-muted-foreground ml-2">
                {message.tokens.input + message.tokens.output} tokens
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function renderContent(content: string) {
  // Basic markdown rendering
  const parts = content.split(/(```[\s\S]*?```|\*\*.*?\*\*|`.*?`|^>.*$|^- .*$|^\d+\. .*$)/gm);

  return parts.map((part, i) => {
    // Code blocks
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^\w+\n/, "");
      return (
        <pre key={i} className="my-2 p-3 rounded-xl bg-[#1D1D1F] text-[#F5F5F7] text-[13px] font-mono overflow-x-auto">
          <code>{code}</code>
        </pre>
      );
    }

    // Bold text
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }

    // Inline code
    if (part.startsWith("`") && part.endsWith("`") && !part.startsWith("```")) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-secondary text-[13px] font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Blockquotes
    if (part.startsWith(">")) {
      return (
        <blockquote key={i} className="border-l-2 border-border pl-3 my-2 text-muted-foreground italic">
          {part.slice(1).trim()}
        </blockquote>
      );
    }

    // Regular text
    return <span key={i}>{part}</span>;
  });
}
