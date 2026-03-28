import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts}"],
  safelist: [
    // Region badge colors
    "bg-violet-100", "text-violet-700",
    "bg-amber-100",  "text-amber-800",
    "bg-blue-100",   "text-blue-700",
    "bg-red-100",    "text-red-700",
    "bg-green-100",  "text-green-700",
    "bg-yellow-100", "text-yellow-800",
    "bg-teal-100",   "text-teal-700",
    "bg-indigo-100", "text-indigo-700",
    "bg-pink-100",   "text-pink-700",
    "bg-sky-100",    "text-sky-700",
    "bg-emerald-100","text-emerald-700",
    "bg-gray-100",   "text-gray-600",
    // Category badge colors
    "bg-orange-100", "text-orange-700",
    "bg-rose-100",   "text-rose-700",
    "bg-purple-100", "text-purple-700",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: "#FF5C5C",
          dark: "#E03E3E",
          soft: "#FFF0F0",
        },
        navy: {
          DEFAULT: "#0F1B2D",
          mid: "#1E3050",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
