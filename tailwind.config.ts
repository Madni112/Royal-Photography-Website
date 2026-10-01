import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#FFFFFF",
        luxury: {
          void: "#000000",
          charcoal: "#0A0A0A",
          surface: "#121212",
          elevated: "#181818",
          border: "#262626",
          muted: "#888888",
          accent: "#FFFFFF",
          platinum: {
            DEFAULT: "#FFFFFF",
            light: "#F5F5F7",
            dark: "#D1D5DB",
            glow: "rgba(255, 255, 255, 0.45)",
            dim: "rgba(255, 255, 255, 0.1)",
          },
          silver: "#CCCCCC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        "white-glow": "0 0 35px -5px rgba(255, 255, 255, 0.45)",
        "white-intense": "0 0 60px 10px rgba(255, 255, 255, 0.35)",
        "luxury-card": "0 20px 40px -15px rgba(0, 0, 0, 0.9), 0 0 1px 1px rgba(255, 255, 255, 0.1)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-reverse": "floatReverse 9s ease-in-out infinite",
        "glow-breathe": "glowBreathe 5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(1.5deg)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(15px) rotate(-1.5deg)" },
        },
        glowBreathe: {
          "0%, 100%": { opacity: "0.25", filter: "blur(40px)" },
          "50%": { opacity: "0.6", filter: "blur(60px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
