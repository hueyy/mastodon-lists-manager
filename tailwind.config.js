/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Fira Sans", "sans-serif"],
      heading: ["Fira Sans Condensed", "sans-serif"]
    }
  },
  plugins: [],
}
