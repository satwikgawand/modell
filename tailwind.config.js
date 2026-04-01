/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080810',
        surface: '#0f0f1a',
        'surface-2': '#16162a',
        border: '#1e1e35',
        accent: '#3b82f6',
        'accent-hover': '#2563eb',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
