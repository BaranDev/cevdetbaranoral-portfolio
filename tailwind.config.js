/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2f5d3a", // Forest Green
        secondary: "#1e3526", // Dark Forest
        accent: "#c08d2b", // Gold
        magical: "#9b59b6", // Purple
        background: "#0a0f0d", // Dark Void
        card: "#1a1f1d", // Dark Card
        text: "#f1f4f2", // Light Text
      },
    },
  },
  plugins: [],
};
