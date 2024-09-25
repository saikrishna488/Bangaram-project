/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        coinDrop: {
          "0%": { top: "-10%" }, // Start above the viewport
          "100%": { top: "110vh" }, // End below the viewport
        },
        explode: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "coin-drop": "coinDrop linear forwards",
        explode: "explode 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
