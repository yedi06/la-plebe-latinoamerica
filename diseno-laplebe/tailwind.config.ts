import type { Config } from 'tailwindcss';

/**
 * Tokens extraídos de "kit media plebe.pdf" + paleta entregada por el cliente.
 *   ink      #0A0A0A  negro de marca (poleras del equipo, titulares)
 *   navy     #10233C  azul profundo de las píldoras de contacto del kit
 *   turquesa #3FA79C  color de acento principal (títulos y badges del kit)
 *   lima     #8BC53F  brochazo bajo el claim "Donde otros no llegan, nosotros sí."
 *   crema    #F2EFE9  fondo papel texturado de todas las láminas
 */
const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0A0A',
          soft: '#161616',
          900: '#070809',
        },
        navy: {
          DEFAULT: '#10233C',
          soft: '#1A3252',
          deep: '#0A1626',
        },
        turq: {
          DEFAULT: '#3FA79C',
          light: '#5EC8BC',
          bright: '#6FE0D2',
          deep: '#15665E', // variante accesible para texto sobre crema (AA)
          ink: '#0C3B36',
        },
        lime: {
          DEFAULT: '#8BC53F',
          light: '#A8DD5E',
          deep: '#4E7A16', // variante accesible para texto sobre crema (AA)
        },
        cream: {
          DEFAULT: '#F2EFE9',
          warm: '#FBF9F5',
          dim: '#E5E0D6',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        marker: ['var(--font-marker)', 'cursive'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(63,167,156,.35), 0 12px 40px -12px rgba(63,167,156,.55)',
        'glow-lime': '0 0 0 1px rgba(139,197,63,.35), 0 12px 40px -12px rgba(139,197,63,.55)',
        lift: '0 24px 60px -24px rgba(10,10,10,.45)',
        card: '0 1px 2px rgba(10,10,10,.06), 0 12px 32px -16px rgba(10,10,10,.28)',
      },
      keyframes: {
        'blob-a': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(6%,-8%,0) scale(1.12)' },
          '66%': { transform: 'translate3d(-5%,6%,0) scale(.94)' },
        },
        'blob-b': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1.05)' },
          '33%': { transform: 'translate3d(-8%,5%,0) scale(.92)' },
          '66%': { transform: 'translate3d(7%,7%,0) scale(1.15)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(63,167,156,.55)' },
          '70%': { boxShadow: '0 0 0 18px rgba(63,167,156,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(63,167,156,0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-160% 0' },
          '100%': { backgroundPosition: '260% 0' },
        },
        'gradient-pan': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'blob-a': 'blob-a 22s ease-in-out infinite',
        'blob-b': 'blob-b 28s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(.4,0,.6,1) infinite',
        marquee: 'marquee 38s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        'gradient-pan': 'gradient-pan 14s ease infinite',
      },
    },
  },
  plugins: [],
};

export default config;
