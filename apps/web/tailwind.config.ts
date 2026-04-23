import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "honey-void": "#0F0F0F",
        honey: {
          DEFAULT: "#F5C242",
          bright: "#FFCC33",
        },
        "amber-deep": "#D4A017",
        parchment: "#F8F1E9",
        "honey-panel": "#141414",
      },
    },
  },
  plugins: [],
};
export default config;
