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
          light: '#FAF6EF',
          dark: '#111813',
          primary: '#1B4332', // Deep Forest Green (#1B4332)
          secondary: '#2D6A4F', // Sage / Emerald Green
          accent: '#D4A373', // Saffron / Gold Accent (#D4A373)
          gold: '#E9C46A',
          cream: '#FAF6EF', // Warm Cream (#FAF6EF)
          sand: '#E9E5D9',
          charcoal: '#1D241E',
          warmGray: '#526055',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
