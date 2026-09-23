/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        page: 'var(--page)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        muted: 'var(--muted)',
        hairline: 'var(--hairline)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        stock: 'var(--stock)',
        cost: 'var(--cost)',
        good: 'var(--good)',
        bad: 'var(--bad)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          'Inter',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
      },
      maxWidth: {
        page: '72rem',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        grow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        rise: 'rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        grow: 'grow 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
      },
    },
  },
  plugins: [],
};
