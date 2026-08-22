import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // VentureBridge Design Tokens
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#EFF6FF",
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
        },
        surface: "#FFFFFF",
        background: "#F8F9FA",
        border: {
          DEFAULT: "#E5E7EB",
          light: "#F3F4F6",
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#F0FDF4",
          border: "#86EFAC",
        },
        warning: {
          DEFAULT: "#D97706",
          light: "#FFFBEB",
          border: "#FCD34D",
        },
        danger: {
          DEFAULT: "#DC2626",
          light: "#FEF2F2",
          border: "#FCA5A5",
        },
        // Sidebar (dark)
        sidebar: {
          bg: "#111827",
          hover: "#1F2937",
          active: "#2563EB",
          text: "#D1D5DB",
          "text-muted": "#9CA3AF",
          border: "#374151",
        },
        // Match indicator
        match: {
          high: "#2563EB",
          medium: "#D97706",
          low: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "xs": ["12px", { lineHeight: "16px" }],
        "sm": ["13px", { lineHeight: "20px" }],
        "base": ["14px", { lineHeight: "20px" }],
        "md": ["15px", { lineHeight: "22px" }],
        "lg": ["16px", { lineHeight: "24px" }],
        "xl": ["18px", { lineHeight: "28px" }],
        "2xl": ["20px", { lineHeight: "28px" }],
        "3xl": ["24px", { lineHeight: "32px" }],
        "4xl": ["30px", { lineHeight: "36px" }],
        "5xl": ["36px", { lineHeight: "44px" }],
        "6xl": ["48px", { lineHeight: "56px" }],
      },
      spacing: {
        "0.5": "2px",
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
        "2.5": "10px",
        "3": "12px",
        "3.5": "14px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "9": "36px",
        "10": "40px",
        "12": "48px",
        "14": "56px",
        "16": "64px",
        "18": "72px",
        "20": "80px",
        "24": "96px",
      },
      borderRadius: {
        "none": "0",
        "sm": "4px",
        "DEFAULT": "6px",
        "md": "8px",
        "lg": "10px",
        "xl": "12px",
        "2xl": "16px",
        "full": "9999px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 4px 12px rgba(0, 0, 0, 0.10)",
        "modal": "0 4px 24px rgba(0, 0, 0, 0.12)",
        "sidebar": "1px 0 0 #374151",
        "nav": "0 1px 0 #E5E7EB",
      },
      maxWidth: {
        "screen-xl": "1280px",
        "screen-2xl": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
