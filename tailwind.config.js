/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  plugins: [],
  theme: {
    extend: {},
    fontFamily: {
      heading: [`Fira Sans Condensed`, `sans-serif`],
      sans: [`Fira Sans`, `sans-serif`],
    },
  },
}
