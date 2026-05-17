/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFAF5",
          100: "#FBF8F2",
          200: "#F5EFE1",
          300: "#EDE3CE",
        },
        gold: {
          400: "#D4A843",
          500: "#BFA054",
          600: "#A08840",
        },
        charcoal: {
          900: "#2F2F2F",
          700: "#4A4A4A",
          500: "#6B6B6B",
        },
        muted: "#858585",
      },
      fontFamily: {
        serif: ["DMSerifDisplay_400Regular"],
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
