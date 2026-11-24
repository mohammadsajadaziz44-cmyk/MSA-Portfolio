/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          red: "#d8a8c1",
          blue: "#8d82b8",
        },
      },
      boxShadow: {
        glow: "0 0 70px rgba(216,168,193,.18)",
      },
    },
  },
  plugins: [],
};
