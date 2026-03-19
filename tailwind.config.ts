import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        apple: {
          gray: "var(--apple-gray)",
          blue: "var(--apple-blue)",
          dark: "var(--apple-dark)",
          light: "var(--apple-light-text)",
        }
      },
    },
  },
  plugins: [],
};
export default config;
