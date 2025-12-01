import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './shop/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'text-brand-cream',
    'bg-brand-green',
    'hover:bg-brand-grey-green',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-tenorsans)', 'sans-serif'],
        cocogothic: ['var(--font-cocogothic)', 'sans-serif'],
      },
      fontSize: {
        // Semantic heading sizes using TenorSans
        'h1': ['3rem', { lineHeight: '1.2', fontWeight: '400' }],      // 48px
        'h2': ['2.0625rem', { lineHeight: '1.3', fontWeight: '400' }],   // 33px
        'h3': ['1.4rem', { lineHeight: '1.4', fontWeight: '400' }],  // 22.4px
        'h4': ['1.5rem', { lineHeight: '1.5', fontWeight: '400' }],    // 24px
        'h5': ['1.25rem', { lineHeight: '1.5', fontWeight: '400' }],   // 20px
        'h6': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],  // 18px
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],    // 16px
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // Custom brand colors
        'brand-cream': '#f9f7f4',
        'brand-light-green': '#d0d9c5',
        'brand-green': '#74966d',
        'brand-gold': '#9f832f',
        'brand-light-gold': '#c1a060',
        'brand-grey-green': '#656f60',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
