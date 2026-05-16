"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelSelector } from "./ModelSelector";
import { MessageBubble } from "./MessageBubble";
import {
  Send,
  Paperclip,
  Mic,
  Code,
  Columns2,
  Sparkles,
  StopCircle,
} from "lucide-react";

export function ChatWorkspace() {
  const {
    activeConversation,
    selectedModel,
    isStreaming,
    addMessage,
    setStreaming,
    createConversation,
    compareMode,
    toggleCompareMode,
  } = useAppStore();

  const [input, setInput] = useState("");
  const [streamedContent, setStreamedContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, streamedContent]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    if (!activeConversation) {
      createConversation();
    }

    // Add user message
    addMessage({ role: "user", content: input.trim() });
    const userInput = input.trim();
    setInput("");
    setStreaming(true);

    // Simulate AI response
    await simulateResponse(userInput);
    setStreaming(false);
  };

  const simulateResponse = async (prompt: string) => {
    const response = `I've analyzed your request using **${selectedModel}**. Here's my response:\n\n${generateSampleResponse(prompt)}`;
    
    setStreamedContent("");
    const words = response.split(" ");
    let accumulated = "";

    for (const word of words) {
      accumulated += (accumulated ? " " : "") + word;
      setStreamedContent(accumulated);
      await new Promise((r) => setTimeout(r, 40));
    }

    addMessage({
      role: "assistant",
      content: accumulated,
      model: selectedModel,
      tokens: { input: Math.floor(prompt.length / 4), output: Math.floor(accumulated.length / 4) },
      responseTime: Math.floor(Math.random() * 2000) + 500,
    });
    setStreamedContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/30">
        <div className="flex items-center gap-3">
          <ModelSelector />
          <Badge variant="outline" size="md">
            {activeConversation?.messages.length || 0} messages
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={compareMode ? "primary" : "outline"}
            size="sm"
            onClick={toggleCompareMode}
          >
            <Columns2 className="w-4 h-4 mr-1.5" />
            Compare
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
        {!activeConversation?.messages.length && !streamedContent ? (
          <EmptyState />
        ) : (
          <>
            {activeConversation?.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {streamedContent && (
              <MessageBubble
                message={{
                  id: "streaming",
                  role: "assistant",
                  content: streamedContent,
                  model: selectedModel,
                  timestamp: new Date(),
                }}
                isStreaming
              />
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 pb-6 pt-3">
        <div className="relative flex items-end gap-2 p-3 rounded-2xl border border-border/60 bg-white shadow-card focus-within:shadow-card-hover focus-within:border-border transition-all duration-200">
          {/* Attachments */}
          <Button variant="ghost" size="icon" className="flex-shrink-0 mb-0.5">
            <Paperclip className="w-4.5 h-4.5 text-muted-foreground" />
          </Button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... Use Shift+Enter for new line"
            className="flex-1 resize-none bg-transparent text-body text-foreground placeholder:text-muted-foreground focus:outline-none max-h-[200px] py-2"
            rows={1}
          />

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 mb-0.5">
            <Button variant="ghost" size="icon">
              <Code className="w-4.5 h-4.5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mic className="w-4.5 h-4.5 text-muted-foreground" />
            </Button>
            
            {isStreaming ? (
              <Button
                variant="danger"
                size="icon"
                onClick={() => setStreaming(false)}
              >
                <StopCircle className="w-4.5 h-4.5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="icon"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-center text-[11px] text-muted-foreground mt-2">
          AIgent uses multiple AI models. Responses may vary by model.
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-foreground" />
      </div>
      <h3 className="text-title font-semibold text-foreground mb-2">
        Start a Conversation
      </h3>
      <p className="text-body-sm text-muted-foreground max-w-md mb-8">
        Choose a model and start chatting. AIgent will intelligently route your request 
        to the best model or let you compare responses side by side.
      </p>
      <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
        {[
          "Write a function to sort an array",
          "Explain quantum computing",
          "Debug this code snippet",
          "Compare React vs Vue",
        ].map((suggestion) => (
          <button
            key={suggestion}
            className="p-3 rounded-xl border border-border/50 text-body-sm text-left text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/30 transition-all duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function generateSampleResponse(prompt: string): string {
  const responses = [
    "Based on my analysis, here are the key points to consider:\n\n1. **Architecture**: The system should be designed with modularity in mind\n2. **Performance**: Consider caching strategies for optimal response times\n3. **Scalability**: Use horizontal scaling patterns\n\n```typescript\nconst example = {\n  optimize: true,\n  cache: 'redis',\n  scale: 'horizontal'\n};\n```\n\nLet me know if you'd like me to elaborate on any of these points.",
    "Here's a comprehensive breakdown:\n\n- The approach leverages modern design patterns\n- Error handling is built-in with automatic retries\n- The solution is type-safe and fully documented\n\nWould you like me to provide more implementation details or explore alternative approaches?",
    "I've processed your request and here's what I found:\n\n> The key insight is that combining multiple models provides better results than any single model alone.\n\nThe implementation follows clean architecture principles with proper separation of concerns. Each layer is independently testable and deployable.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
