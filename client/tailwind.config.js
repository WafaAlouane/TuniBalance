/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Scans all JS, JSX, TS, and TSX files inside the `src` folder
    './public/index.html', // Includes public HTML files if you're using any
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
