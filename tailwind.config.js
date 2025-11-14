/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Gifting Brand Colors - Warm and inviting
        brand: {
          main: {
            90: '#e6f3ee', // Light sage green background (from Figma)
            70: '#f5e6d3', // Soft beige footer
            50: '#d4a574', // Warm gold accent
            30: '#326755', // Medium green text (from Figma)
            20: '#224439', // Dark green primary text (from Figma)
          },
          accent: {
            rose: '#e8b4a0', // Soft rose for highlights
            gold: '#d4a574', // Gold for CTAs
            coral: '#f4a89c', // Coral for special elements
            green: '#e6f3ee', // Sage green for backgrounds
          },
        },
      },
      fontFamily: {
        karla: ['Karla', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      letterSpacing: {
        'brand-wide': '7.68px',
        'brand-medium': '2.56px',
        'brand-narrow': '10.24px',
      },
    },
  },
  plugins: [],
}

