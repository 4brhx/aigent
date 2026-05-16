"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn, getModelColor } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export function ModelSelector() {
  const { models, selectedModel, setSelectedModel } = useAppStore();
  const [open, setOpen] = useState(false);

  const currentModel = models.find((m) => m.id === selectedModel);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-xl",
          "border border-border/50 bg-white hover:bg-secondary/50",
          "text-body-sm font-medium transition-all duration-200",
          open && "border-ring shadow-sm"
        )}
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: getModelColor(currentModel?.provider || "") }}
        />
        <span className="text-foreground">{currentModel?.name || "Select Model"}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-72 z-50 bg-white border border-border/60 rounded-2xl shadow-glass-lg p-2 animate-scale-in">
            {/* Group by provider */}
            {["gemini", "claude", "openai", "deepseek"].map((provider) => {
              const providerModels = models.filter((m) => m.provider === provider);
              if (providerModels.length === 0) return null;

              return (
                <div key={provider} className="mb-2 last:mb-0">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1.5">
                    {provider}
                  </p>
                  {providerModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl",
                        "hover:bg-secondary transition-colors text-left",
                        model.id === selectedModel && "bg-secondary"
                      )}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getModelColor(model.provider) }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-medium text-foreground">{model.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {model.avgResponseTime}ms &middot; ${model.costPer1kOutput}/1K out
                        </p>
                      </div>
                      {model.id === selectedModel && (
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
