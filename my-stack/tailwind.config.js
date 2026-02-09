/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        "panel": "#1A1A1A",
        "panel-hover": "#242424",
        "border": "#2A2A2A",
        "bg": "#0F0F0F",
        "text-secondary": "#888888",
        "accent": "#2563EB",
        "accent-secondary": "#06B6D4",
        "free": "#10B981",
        "danger": "#EF4444",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.3)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-out",
        fadeOut: "fadeOut 150ms ease-in",
      },
    },
  },
  plugins: [],
};
