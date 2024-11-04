import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F4ECDF",
          dark: "#E5D9C6",
        },
        coral: {
          DEFAULT: "#EDA33E",
          light: "#F4B661",
          dark: "#D88E2A",
        },
        lavender: {
          DEFAULT: "#BD70B9",
          light: "#CA89C6",
          dark: "#A55AA1",
        },
      },
      backgroundImage: {
        "gradient-custom": "linear-gradient(to right, #EDA33E, #BD70B9)",
      },
    },
  },
  plugins: [],
};

export default config;
