/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: '#e0e5ec',
          text: '#4a5568',
          dark: '#a3b1c6',
          light: '#ffffff',
        }
      },
      boxShadow: {
        'neo-out': '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
        'neo-in': 'inset 6px 6px 10px rgba(163,177,198, 0.7), inset -6px -6px 10px rgba(255,255,255, 0.8)',
        'neo-out-sm': '5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255, 0.5)',
        'neo-in-sm': 'inset 3px 3px 6px rgba(163,177,198, 0.7), inset -3px -3px 6px rgba(255,255,255, 0.8)',
      }
    },
  },
  plugins: [],
}
