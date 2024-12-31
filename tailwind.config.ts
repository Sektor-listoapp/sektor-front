import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
      },
      fontFamily: {
        "arial-rounded": [
          "Arial Rounded MT Bold",
          "Arial Rounded MT",
          "sans-serif",
        ],
        "century-gothic": ["Century Gothic", "sans-serif"],
      },
      colors: {
        blue: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#B7D9E2",
          300: "#7DD3FC",
          400: "#1F5372",
          500: "#182F48",
          600: "#162A42",
          700: "#0D1C2C",
          800: "#09161E",
          900: "#060F13",
        },
      },
      background: {
        "primary-gradient":
          "linear-gradient(250deg,rgba(255, 255, 255, 0.5) -20%,rgba(183, 217, 226, 0.7) -6%,#182f48 60%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
