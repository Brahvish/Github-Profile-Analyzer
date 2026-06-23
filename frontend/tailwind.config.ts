/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        heading: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#080A0F',
          1: 'rgba(255, 255, 255, 0.02)',
          2: 'rgba(255, 255, 255, 0.03)',
          3: 'rgba(255, 255, 255, 0.04)',
          4: 'rgba(255, 255, 255, 0.06)',
        },
        ink: {
          DEFAULT: '#F1F5F9',
          muted: '#94A3B8',
          faint: '#64748B',
        },
        accent: {
          DEFAULT: '#6C63FF',
          hover: '#7B73FF',
          muted: 'rgba(108,99,255,0.12)',
          border: 'rgba(108,99,255,0.3)',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
        },
        rose: {
          400: '#FB7185',
          500: '#F43F5E',
        },
        sky: {
          400: '#38BDF8',
          500: '#0EA5E9',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(108,99,255,0.15)',
        'glow': '0 0 20px rgba(108,99,255,0.2)',
        'glow-sm': '0 0 10px rgba(108,99,255,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
    },
  },
  plugins: [],
};
