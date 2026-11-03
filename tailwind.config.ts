import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "#0284c7", // Sky 600
          foreground: "#ffffff",
          dark: "#0369a1",
          light: "#38bdf8",
        },
        emergency: {
          critical: "#dc2626", // Red
          catastrophic: "#7c3aed", // Violet/Purple
          high: "#ea580c", // Orange
          moderate: "#eab308", // Yellow
          low: "#16a34a", // Green
        },
        // Portal Theming Tokens (Civilian/NGO Light Peach vs Authority/Field Dark Navy)
        peach: {
          bg: "#FFF7F2",
          sub: "#FFF0E8",
          card: "#FFFFFF",
          surface: "#FFE3D5",
          primary: "#F2A789",
          accent: "#DB8064",
          text: "#352823",
          muted: "#79665F",
          border: "#F1DED4",
        },
        navy: {
          bg: "#0B1220",
          sub: "#111C2E",
          panel: "#17263B",
          elevated: "#21334B",
          text: "#F1F5F9",
          muted: "#A9B7CA",
          cyan: "#56C5E8",
          blue: "#438EED",
          border: "#2B3C52",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
