"use client";

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        {
          "bg-secondary text-secondary-foreground": variant === "default",
          "bg-success/10 text-success": variant === "success",
          "bg-warning/10 text-warning": variant === "warning",
          "bg-destructive/10 text-destructive": variant === "error",
          "bg-accent/10 text-accent": variant === "info",
          "border border-border text-muted-foreground": variant === "outline",
          "px-2 py-0.5 text-[11px]": size === "sm",
          "px-3 py-1 text-caption": size === "md",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
