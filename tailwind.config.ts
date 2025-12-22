import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#00d4ff',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom right, #0a0a0a, #1a1a2e)',
        'gradient-light': 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
      },
    },
  },
  plugins: [],
}
export default config


