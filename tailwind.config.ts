import type { Config } from "tailwindcss";

// Webnode Brand Hub tokens (https://webnode-design.github.io/webnode_brand/)
// Dark Teal is primary; Accent Lime is reserved for highlights/CTAs only.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-teal": "#1E3C47",
        teal: "#265564",
        lime: "#B7EF87",
        sand: "#F3F1EA",
        // white is already a Tailwind default
      },
      fontFamily: {
        // Graphik is the brand typeface (Regular/Medium/Bold) but its files
        // are licensed and not fetchable here. Once available, drop the
        // .woff2 files in /public/fonts, wire them up with @font-face in
        // globals.css, and swap this stack to ["Graphik", ...fallback].
        // This system stack is a neutral geometric-ish stand-in until then.
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(30, 60, 71, 0.06), 0 4px 16px rgba(30, 60, 71, 0.06)",
      },
      animation: {
        "pulse-ring": "pulse-ring 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(183, 239, 135, 0.55)" },
          "50%": { boxShadow: "0 0 0 6px rgba(183, 239, 135, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
