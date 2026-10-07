/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#000319',
        panel: '#070b24',
        purple: '#CBACF9',
      },
    },
  },
  plugins: [],
}
