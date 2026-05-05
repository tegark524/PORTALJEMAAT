/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Nanti warna dari desain.md masukin di sini
      colors: {
        'gereja-primary': '#800000',
      },
    },
  },
  plugins: [],
}
