/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3F418D',
          dark: '#2E2F6B',
          light: '#6366C2',
        },
        secondary: '#F9EDEE',
        success: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
        main: '#1E1B2E',
        muted: '#6B6D9E',
        soft: '#E4E0EC',
      },
    },
  },
  plugins: [],
}