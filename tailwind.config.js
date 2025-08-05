/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#e50914',
          'red-hover': '#f40612',
          black: '#141414',
          'gray-dark': '#181818',
          'gray-medium': '#333333',
          'gray-light': 'rgba(255, 255, 255, 0.8)',
        }
      },
      fontFamily: {
        'netflix': ['Arial', 'sans-serif'],
      },
      zIndex: {
        '100': '100',
        '1000': '1000',
        '1001': '1001',
        '10000': '10000',
        '10001': '10001',
      },
      width: {
        '15': '3.75rem',
      },
      height: {
        '15': '3.75rem',
        '75': '18.75rem',
      },
      spacing: {
        '2.5': '0.625rem',
      }
    },
  },
  plugins: [],
}
