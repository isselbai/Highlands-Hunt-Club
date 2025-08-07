import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#2E4B3D',
          gold:  '#C5A572',
          cream: '#FAF7F2',
          bark:  '#4B3A2E',
        }
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.05)',
        cardHover: '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.06)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config