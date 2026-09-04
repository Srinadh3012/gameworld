/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#0a0a0c',
          darker: '#050506',
          panel: '#15151a',
          border: '#2a2a35',
          neon: '#00f0ff',
          neonHover: '#00c3ff',
          purple: '#8a2be2',
          purpleHover: '#9b4dff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #00f0ff 0deg, #8a2be2 180deg, #00f0ff 360deg)',
      }
    },
  },
  plugins: [],
}
