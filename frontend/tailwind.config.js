/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ayur: {
          light: '#F5F7F4',
          dark: '#0A0F0C',
          primary: '#2E5A44', // Forest green
          secondary: '#487A60', // Sage green
          accent: '#C59B67', // Earthy Gold
          cream: '#FCFBF9',
          wood: '#1F2922',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
