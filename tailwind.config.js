/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './screens/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0F172A',
        'brand-slate': '#F8FAFC',
        'brand-sage': '#94A3B8',
        'brand-gold': '#CA8A04',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.75', letterSpacing: '0.015em' }],
        'lg': ['1.125rem', { lineHeight: '1.75', letterSpacing: '0.015em' }],
        'xl': ['1.25rem', { lineHeight: '1.75', letterSpacing: '0.015em' }],
        '2xl': ['1.5rem', { lineHeight: '1.65', letterSpacing: '0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        '4xl': ['2.25rem', { lineHeight: '1.45', letterSpacing: '0.005em' }],
        '5xl': ['3rem', { lineHeight: '1.35', letterSpacing: '0' }],
        '6xl': ['3.75rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        '7xl': ['4.5rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        '8xl': ['6rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        '9xl': ['8rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
