/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0a0a',
          surface: '#0f0f0f',
          pane: '#121212',
          green: '#33ff00',
          'green-glow': '#44ff11',
          'green-dim': '#1f521f',
          'green-dark': '#0a1a0a',
          amber: '#ffb000',
          'amber-dim': '#593c00',
          'amber-dark': '#1c1400',
          red: '#ff3333',
          'red-dim': '#4d1010',
          cyan: '#00d4ff',
          muted: '#4a7c4a',
          border: '#1f521f'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', '"VT323"', 'Consolas', 'Courier New', 'monospace'],
        sans: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
      },
      animation: {
        'blink': 'blink 1s step-start infinite',
        'flicker': 'flicker 0.15s infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        flicker: {
          '0%': { opacity: '0.98' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.99' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
