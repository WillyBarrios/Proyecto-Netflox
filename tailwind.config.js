/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'netflix-black': '#000000',
        'netflix-dark': '#141414',
        'netflix-gray': '#222222',
      },
      colors: {
        'netflix-red': '#E50914',
        'netflix-white': '#FFFFFF',
        'netflix-gray': '#B3B3B3',
      },
      backdropBlur: {
        'netflix': '8px',
      }
    },
  },
  plugins: [],
}
