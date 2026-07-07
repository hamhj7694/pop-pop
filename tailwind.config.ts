import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1f2933',
        bubble: '#d7f3ff',
        pop: '#ff7aa2',
        mint: '#55d6be',
        sunshine: '#ffd166',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Pretendard',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
