"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20",
          "disabled:pointer-events-none disabled:opacity-50",
          "active:scale-[0.97]",
          {
            // Variants
            "bg-primary text-primary-foreground shadow-button hover:shadow-button-hover hover:bg-primary/90":
              variant === "primary",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80":
              variant === "secondary",
            "hover:bg-secondary text-foreground": variant === "ghost",
            "border border-border bg-white text-foreground hover:bg-secondary":
              variant === "outline",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90":
              variant === "danger",
            // Sizes
            "h-8 px-3 text-body-sm rounded-lg": size === "sm",
            "h-10 px-5 text-body-sm rounded-xl": size === "md",
            "h-12 px-6 text-body rounded-xl": size === "lg",
            "h-9 w-9 rounded-xl": size === "icon",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
