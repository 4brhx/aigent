"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, alt, fallback, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-caption",
    md: "w-10 h-10 text-body-sm",
    lg: "w-12 h-12 text-body",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || fallback}
        className={cn(
          "rounded-full object-cover border border-border/50",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold",
        "bg-gradient-to-br from-secondary to-muted text-foreground border border-border/50",
        sizeClasses[size],
        className
      )}
    >
      {fallback.substring(0, 2).toUpperCase()}
    </div>
  );
}
