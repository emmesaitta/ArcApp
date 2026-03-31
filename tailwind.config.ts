/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#e1f5ee',
          100: '#9fe1cb',
          500: '#1d9e75',
          600: '#1d6b5a',
          700: '#0f6e56',
          800: '#085041',
          900: '#04342c',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
