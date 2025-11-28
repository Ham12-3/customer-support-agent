import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // The "Obsidian" Palette - Deep, Rich, Expensive
        obsidian: {
          950: '#050507', // Main background
          900: '#0A0A0E', // Secondary background
          800: '#121218', // Card background
          700: '#1C1C26', // Hover state
          600: '#2A2A35', // Border color
        },
        // "Electric" Primary - Vivid but refined
        primary: {
          50: '#E0E7FF',
          100: '#C7D2FE',
          200: '#A5B4FC',
          300: '#818CF8',
          400: '#6366F1',
          500: '#4F46E5', // Indigo-ish
          600: '#4338CA',
          700: '#3730A3',
          800: '#312E81',
          900: '#1E1B4B',
          950: '#0F0E2A',
        },
        // "Gold" Accents - For premium indicators
        accent: {
          glow: '#FFD700',
          DEFAULT: '#EAB308',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px rgba(79, 70, 229, 0.3)',
        'glow-md': '0 0 40px -10px rgba(79, 70, 229, 0.4)',
        'glow-lg': '0 0 60px -15px rgba(79, 70, 229, 0.5)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'border-width': 'borderWidth 3s infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        borderWidth: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom right, #0A0A0E, #000000)',
        'gradient-glass': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-border': 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
        'conic-gradient': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;