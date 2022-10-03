/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require("daisyui")],
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
}
