import type { Config } from "tailwindcss1";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F5F5F7",
          foreground: "#1D1D1F",
        },
        muted: {
          DEFAULT: "#F5F5F7",
          foreground: "#86868B",
        },
        accent: {
          DEFAULT: "#0071E3",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF3B30",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#34C759",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#FF9500",
          foreground: "#FFFFFF",
        },
        border: "#E5E5EA",
        input: "#E5E5EA",
        ring: "#0071E3",
        background: "#FFFFFF",
        foreground: "#1D1D1F",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1D1D1F",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "Fira Code",
          "Fira Mono",
          "Roboto Mono",
          "monospace",
        ],
      },
      fontSize: {
        "display-lg": ["96px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display": ["72px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-sm": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        "title": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.5", fontWeight: "400" }],
        "body": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "caption": ["12px", { lineHeight: "1.4", fontWeight: "400" }],
      },
      borderRadius: {
        "2xl": "20px",
        "xl": "16px",
        "lg": "12px",
        "md": "8px",
        "sm": "6px",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0, 0, 0, 0.04)",
        "glass-lg": "0 16px 48px rgba(0, 0, 0, 0.06)",
        "glass-xl": "0 24px 64px rgba(0, 0, 0, 0.08)",
        "card": "0 2px 8px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.08)",
        "button": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "button-hover": "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
      backdropBlur: {
        "glass": "20px",
        "glass-lg": "40px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-soft": "pulseSoft 2s infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
