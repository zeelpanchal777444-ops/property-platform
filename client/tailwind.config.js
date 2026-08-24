/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#16233D",
          light: "#233657",
          dark: "#0D1626",
        },
        blueprint: "#3D5A80",
        amber: {
          DEFAULT: "#E8A33D",
          dark: "#C77F1E",
        },
        teal: {
          DEFAULT: "#2A9D8F",
          dark: "#1F7A6F",
        },
        paper: "#F3F5F6",
        clay: "#C1443B",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
    },
  },
  plugins: [],
};
