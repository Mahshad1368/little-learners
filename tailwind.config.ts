import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        berry: "#ff5c8a",
        banana: "#ffd166",
        mint: "#5eead4",
        sky: "#60a5fa",
        plum: "#8b5cf6",
        leaf: "#34d399",
        ink: "#24304f"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(36, 48, 79, 0.14)",
        lift: "0 22px 55px rgba(36, 48, 79, 0.2)"
      },
      fontFamily: {
        display: ["ui-rounded", "Nunito", "Avenir Next", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
