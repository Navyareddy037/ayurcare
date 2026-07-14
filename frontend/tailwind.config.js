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
          light: '#F7F3EC',
          dark: '#2B2B28',
          primary: '#1F4535', // Deep Green
          secondary: '#6B6963', // Warm Gray
          accent: '#C7833E', // Saffron Accent
          cream: '#F7F3EC', // Cream Background
          sand: '#EDE6D8', // Sand
          charcoal: '#2B2B28', // Charcoal Text
          warmGray: '#6B6963', // Warm Gray
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Lora', 'Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
